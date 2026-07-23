import { Request, Response } from "express";
import { ApiResponseHelper } from "../../utils/apihelper.util";
import { UserModel } from "../../models/user.model";
import { ProductModel } from "../../models/product.model";
import { CartModel } from "../../models/cart.model";
import { ReviewModel } from "../../models/review.model";
import { CollectionModel } from "../../models/collection.model";

export class AdminDashboardController {
    // admin - get all dashboard stats in one request
    async getStats(req: Request, res: Response) {
        try {
            // run all count queries in parallel for better performance
            const [
                totalProducts,
                availableProducts,
                totalCustomers,
                totalCartItems,
                activeCartItems,
                checkedoutCartItems,
                cancelledCartItems,
                totalReviews,
                totalCollections,
                recentCartItems,
                recentCustomers,
                revenueResult,
            ] = await Promise.all([
                // product stats
                ProductModel.countDocuments(),
                ProductModel.countDocuments({ isAvailable: true }),

                // customer stats - only count users with role "user"
                UserModel.countDocuments({ role: "user" }),

                // cart stats by status
                CartModel.countDocuments(),
                CartModel.countDocuments({ status: "active" }),
                CartModel.countDocuments({ status: "checkedout" }),
                CartModel.countDocuments({ status: "cancelled" }),

                // review and collection stats
                ReviewModel.countDocuments(),
                CollectionModel.countDocuments(),

                // recent 5 cart items with customer and product details
                CartModel.find()
                    .populate("customerId", "-password")
                    .populate("productId")
                    .sort({ createdAt: -1 })
                    .limit(5),

                // recent 5 customers
                UserModel.find({ role: "user" })
                    .sort({ createdAt: -1 })
                    .limit(5),

                // total revenue from checkedout cart items only
                CartModel.aggregate([
                    { $match: { status: "checkedout" } },
                    { $group: { _id: null, total: { $sum: "$totalPrice" } } },
                ]),
            ]);

            // extract total revenue from aggregate result
            const totalRevenue = revenueResult[0]?.total || 0;

            return ApiResponseHelper.success(
                res,
                {
                    totalProducts,
                    availableProducts,
                    totalCustomers,
                    totalCartItems,
                    activeCartItems,
                    checkedoutCartItems,
                    cancelledCartItems,
                    totalRevenue,
                    totalReviews,
                    totalCollections,
                    recentCartItems,
                    recentCustomers,
                },
                "Dashboard stats fetched successfully",
            );
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500,
            );
        }
    }
}