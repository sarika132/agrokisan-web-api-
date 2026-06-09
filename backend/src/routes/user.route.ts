import { UserController } from "../controllers/user.controller";
import { Router } from "express";

const userRouter = Router();
const userController = new UserController();

userRouter.post("/register", (req, res, next) => {
    console.log("Register route hit");
    next();
}, userController.registerUser);

userRouter.post("/login", userController.loginUser);

export default userRouter;