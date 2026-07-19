import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import {
    authorizedMiddleware,
    adminMiddleware,
} from "../middlewares/authorized.middleware";
import { uploads } from "../middlewares/upload.middleware";

const productRoute = Router();
const productController = new ProductController();


// GET /api/products          → all available products
productRoute.get("/", (req, res) => productController.getAllProducts(req, res));

// GET /api/products/:id      → single product detail
productRoute.get("/:id", (req, res) => productController.getProductById(req, res));


// GET /api/products/admin/all   → paginated list for admin dashboard
productRoute.get(
    "/admin/all",
    authorizedMiddleware,
    adminMiddleware,
    (req, res) => productController.getAllProductsPaginated(req, res),
);

// POST /api/products         → create product (with optional image)
productRoute.post(
    "/",
    authorizedMiddleware,
    adminMiddleware,
    uploads.single("imageUrl"),
    (req, res) => productController.createProduct(req, res),
);

// PUT /api/products/:id      → update product (with optional image)
productRoute.put(
    "/:id",
    authorizedMiddleware,
    adminMiddleware,
    uploads.single("imageUrl"),
    (req, res) => productController.updateProduct(req, res),
);

// DELETE /api/products/:id   → delete product
productRoute.delete(
    "/:id",
    authorizedMiddleware,
    adminMiddleware,
    (req, res) => productController.deleteProduct(req, res),
);

export default productRoute;