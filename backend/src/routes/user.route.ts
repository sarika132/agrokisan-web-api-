import { UserController } from "../controllers/user.controller";
import { Router } from "express";
import { authorizedMiddleware } from "../middlewares/authorized.middleware";
import { uploads } from "../middlewares/upload.middleware";

const userRouter = Router();
const userController = new UserController();

userRouter.post("/register", userController.registerUser);
userRouter.post("/login", userController.loginUser);

userRouter.get("/whoami",
    authorizedMiddleware,
    userController.whoami
);

userRouter.put("/update",
    authorizedMiddleware, // authentication 
    uploads.single("profileImage"), // profile image upload
    userController.updateUser
);

export default userRouter;