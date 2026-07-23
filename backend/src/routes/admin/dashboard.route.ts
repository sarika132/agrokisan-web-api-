import { Router } from "express";
import {
    authorizedMiddleware,
    adminMiddleware,
} from "../../middlewares/authorized.middleware";
import { AdminDashboardController } from "../../controllers/admin/dashboard.controller";

const adminDashboardRoute = Router();
const dashboardController = new AdminDashboardController();

// admin only - get all dashboard stats
adminDashboardRoute.get(
    "/stats",
    authorizedMiddleware,
    adminMiddleware,
    dashboardController.getStats,
);

export default adminDashboardRoute;