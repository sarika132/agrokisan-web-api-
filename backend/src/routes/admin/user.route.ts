import { Router } from "express";
import { AdminUserController } from "../../controllers/admin/user.controller";
// import {
//     adminMiddleware,
//     authorizedMiddleware,
// } from "../../middlewares/authorized.middlewares";

const adminUserRoute = Router();
const adminUserController = new AdminUserController();

// adminUserRoute.post(
//     "/create",
//     authorizedMiddleware,
//     adminMiddleware,
//     adminUserController.createUser,
// );

export default adminUserRoute;