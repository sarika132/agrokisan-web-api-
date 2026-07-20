import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";
import {
    authorizedMiddleware,
    adminMiddleware,
} from "../middlewares/authorized.middleware";

const categoryRoute = Router();
const categoryController = new CategoryController();

// GET /api/categories        → all categories
categoryRoute.get("/", (req, res) =>
    categoryController.getAllCategories(req, res),
);

// POST /api/categories       → create category
categoryRoute.post(
    "/",
    authorizedMiddleware,
    adminMiddleware,
    (req, res) => categoryController.createCategory(req, res),
);

// PUT /api/categories/:id    → update category
categoryRoute.put(
    "/:id",
    authorizedMiddleware,
    adminMiddleware,
    (req, res) => categoryController.updateCategory(req, res),
);

// DELETE /api/categories/:id → delete category
categoryRoute.delete(
    "/:id",
    authorizedMiddleware,
    adminMiddleware,
    (req, res) => categoryController.deleteCategory(req, res),
);

export default categoryRoute;