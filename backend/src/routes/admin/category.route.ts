import { Router } from "express";
import { AdminCategoryController } from "../../controllers/admin/category.collection";
import {
    adminMiddleware,
    authorizedMiddleware,
} from "../../middlewares/authorized.middleware";

const adminCategoryRoute = Router();
const categoryController = new AdminCategoryController();

// admin only - get all categories
adminCategoryRoute.get(
    "/",
    authorizedMiddleware,
    adminMiddleware,
    categoryController.getAllCategories,
);

// admin only - create category
adminCategoryRoute.post(
    "/create",
    authorizedMiddleware,
    adminMiddleware,
    categoryController.createCategory,
);

// admin only - update category
adminCategoryRoute.put(
    "/update/:id",
    authorizedMiddleware,
    adminMiddleware,
    categoryController.updateCategory,
);

// admin only - delete category
adminCategoryRoute.delete(
    "/delete/:id",
    authorizedMiddleware,
    adminMiddleware,
    categoryController.deleteCategory,
);

export default adminCategoryRoute;