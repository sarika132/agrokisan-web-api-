import { Router } from "express";
import { AdminProductController } from "../../controllers/admin/product.controller";
import {
    authorizedMiddleware,
    adminMiddleware,
} from "../../middlewares/authorized.middleware";
import { uploads } from "../../middlewares/upload.middleware";

const adminProductRoute = Router();
const productController = new AdminProductController();

// admin only - get all products with pagination and search
adminProductRoute.get(
    "/",
    authorizedMiddleware,
    adminMiddleware,
    productController.getAllProductsPaginated,
);

// admin only - get single product by id
adminProductRoute.get(
    "/:id",
    authorizedMiddleware,
    adminMiddleware,
    productController.getProductById,
);

// admin only - create product with optional image upload
adminProductRoute.post(
    "/create",
    authorizedMiddleware,
    adminMiddleware,
    uploads.single("productImage"),
    productController.createProduct,
);

// admin only - update product
adminProductRoute.put(
    "/update/:id",
    authorizedMiddleware,
    adminMiddleware,
    uploads.single("productImage"),
    productController.updateProduct,
);

// admin only - delete product
adminProductRoute.delete(
    "/delete/:id",
    authorizedMiddleware,
    adminMiddleware,
    productController.deleteProduct,
);

export default adminProductRoute;