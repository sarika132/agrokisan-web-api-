import { UserController } from "../controllers/user.controller";
import { Router } from "express";
import { authorizedMiddleware } from "../middlewares/authorized.middleware";
import { uploads } from "../middlewares/upload.middleware";
import { authRateLimiter } from "../middlewares/rate-limit.middleware";

const userRouter = Router();
const userController = new UserController();

userRouter.post("/register", authRateLimiter, userController.registerUser);
userRouter.post("/login", authRateLimiter, userController.loginUser);

userRouter.get("/whoami",
    authorizedMiddleware,
    userController.whoami
);
userRouter.post(
    "/request-password-reset",
    userController.sendResetPasswordEmail,
);

userRouter.put("/update",
    authorizedMiddleware, // authentication 
    uploads.single("profileImage"), // profile image upload
    userController.updateUser
);

userRouter.post("/reset-password/:token", userController.resetPassword);

export default userRouter;

