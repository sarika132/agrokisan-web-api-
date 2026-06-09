import express, { Application, NextFunction, Request, Response } from "express";
import { HttpException } from "./exceptions/http-exception";
import { ApiResponseHelper } from "./utils/apihelper.util";
import cors from "cors";

// routes
import userRoutes from "./routes/user.route";
// import adminUserRoutes from "./routes/admin/user.route";

const app: Application = express();

const corsOptions = {
  origin: "*", // allow all origins for now
  successStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// user Route
app.use("/api/auth", userRoutes);
// app.use("/api/admin", adminUserRoutes);

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