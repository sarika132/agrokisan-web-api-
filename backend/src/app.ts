import express, { Application, NextFunction, Request, Response } from "express";
import { HttpException } from "./exceptions/http-exception";
import { ApiResponseHelper } from "./utils/apihelper.util";
import cors from "cors";
import path from "path";

// import routes
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
  origin: ["*"], // allow all origins for now
  successStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// upload routes
app.use("/uploads", express.static(path.join(__dirname, "../uploads"))); // serve static files from uploads folder

// auth routes
app.use("/api/auth", userRoutes);

// admin Route
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/collection", admincollectionRoutes);
app.use("/api/admin/category", adminCategoryRoutes);
app.use("/api/admin/product", adminProductRoutes);
app.use("/api/admin/cart", adminCartRoutes);
app.use("/api/admin/review", adminReviewRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);


// user routes
app.use("/api/collection", collectionRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/review", reviewRoutes);

// global 404 handler (at bottom)
app.use((req: Request, res: Response) => {
  return res.status(404).json({ message: "API not found" });
});

// global error handler(at bottom)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);
  if (err instanceof HttpException) {
    return ApiResponseHelper.error(res, err.message, err.status);
  }
  return ApiResponseHelper.error(res, "Internal Server Error", 500);
});

export default app;
