import { Router } from "express";
import { AdminCategoryController } from "../../controllers/admin/category.collection";
import { adminMiddleware, authorizedMiddleware } from "../../middlewares/authorized.middleware";

const adminCategoryRoute = Router();
const categoryController = new AdminCategoryController();

// All routes require admin authentication
adminCategoryRoute.use(authorizedMiddleware, adminMiddleware);

// GET /api/admin/category – (optional, not tested)
adminCategoryRoute.get("/", categoryController.getAllCategories);

// POST /api/admin/category/create – create
adminCategoryRoute.post("/create", categoryController.createCategory);

// PUT /api/admin/category/update/:id – update
adminCategoryRoute.put("/update/:id", categoryController.updateCategory);

// DELETE /api/admin/category/delete/:id – delete
adminCategoryRoute.delete("/delete/:id", categoryController.deleteCategory);

export default adminCategoryRoute;