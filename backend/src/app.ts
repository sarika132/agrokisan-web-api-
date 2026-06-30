import express, { Application, NextFunction, Request, Response } from "express";
import { HttpException } from "./exceptions/http-exception";
import { ApiResponseHelper } from "./utils/apihelper.util";
import cors from "cors";
import morgan from "morgan";

// import routes
import userRoutes from "./routes/user.route";
import adminUserRoutes from "./routes/admin/user.route";
import path from "path";

const app: Application = express();

const corsOptions = {
  origin: ["*"], // allow all origins for now
  successStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined")); // log all requests

// auth routes
app.use("/uploads", express.static(path.join(__dirname, "../uploads"))); // serve static files from uploads folder
app.use("/api/auth", userRoutes);

// admin Route
app.use("/api/admin/users", adminUserRoutes);


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
