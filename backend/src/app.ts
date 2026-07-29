// src/app.ts
import express, { Application, NextFunction, Request, Response } from "express";
import { HttpException } from "./exceptions/http-exception";
import { ApiResponseHelper } from "./utils/apihelper.util";
import cors from "cors";
import path from "path";

import userRoutes from "./routes/user.route";
import adminUserRoutes from "./routes/admin/user.route";
import collectionRoutes from "./routes/collection.route";
import admincollectionRoutes from "./routes/admin/collection.route";
import categoryRoutes from "./routes/category.route";
import adminCategoryRoutes from "./routes/admin/category.route";
import productRoutes from "./routes/product.route";
import adminProductRoutes from "./routes/admin/product.route";
import cartRoutes from "./routes/cart.route";
import adminCartRoutes from "./routes/admin/cart.route";
import reviewRoutes from "./routes/review.route";
import adminReviewRoutes from "./routes/admin/review.route";
import adminDashboardRoutes from "./routes/admin/dashboard.route";

const app: Application = express();

const corsOptions = {
  origin: ["*"],
  successStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Auth
app.use("/api/auth", userRoutes);

// Admin
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/collection", admincollectionRoutes);
app.use("/api/admin/category", adminCategoryRoutes);
app.use("/api/admin/product", adminProductRoutes);
app.use("/api/admin/products", adminProductRoutes); // for GET paginated list
app.use("/api/admin/cart", adminCartRoutes);
app.use("/api/admin/review", adminReviewRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);

// Public (plural mounts)
app.use("/api/collections", collectionRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/review", reviewRoutes);

// 404 handler – must be last
app.use((req: Request, res: Response) => {
  return res.status(404).json({ message: "API not found" });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);
  if (err instanceof HttpException) {
    return ApiResponseHelper.error(res, err.message, err.status);
  }
  return ApiResponseHelper.error(res, "Internal Server Error", 500);
});

export default app;