import { Router } from "express";
import { AdminUserController } from "../../controllers/admin/user.controller";
import { adminMiddleware, authorizedMiddleware, } from "../../middlewares/authorized.middleware";
import { uploads } from "../../middlewares/upload.middleware";

const adminUserRoute = Router();
const adminUserController = new AdminUserController();


// apply middleware to all routes in this file
adminUserRoute.use(authorizedMiddleware, adminMiddleware);
adminUserRoute.get("/", adminUserController.getAllUserPaginated);
adminUserRoute.get("/:id", adminUserController.getUserById);
adminUserRoute.post("/", adminUserController.createUser);
adminUserRoute.put(
    "/:id",
    uploads.single("profileImage"),
    adminUserController.updateUser,
);
adminUserRoute.put("/:id/password", adminUserController.updatePassword);
adminUserRoute.delete("/:id", adminUserController.deleteUser);

export default adminUserRoute;