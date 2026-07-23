import { Router } from "express";
import { AdminCartController } from "../../controllers/admin/cart.controller";
import {
    authorizedMiddleware,
    adminMiddleware,
} from "../../middlewares/authorized.middleware";

const adminCartRoute = Router();
const adminCartController = new AdminCartController();

// admin only - get all cart items with pagination, search and status filter
adminCartRoute.get(
    "/",
    authorizedMiddleware,
    adminMiddleware,
    adminCartController.getAllCartsPaginated,
);

// admin only - get single cart item by id
adminCartRoute.get(
    "/:id",
    authorizedMiddleware,
    adminMiddleware,
    adminCartController.getCartItemById,
);

// admin only - cancel a cart item
adminCartRoute.put(
    "/cancel/:id",
    authorizedMiddleware,
    adminMiddleware,
    adminCartController.cancelCartItem,
);

// admin only - delete a cart item permanently
adminCartRoute.delete(
    "/delete/:id",
    authorizedMiddleware,
    adminMiddleware,
    adminCartController.deleteCartItem,
);

export default adminCartRoute;