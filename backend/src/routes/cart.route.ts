import { Router } from "express";
import { CartController } from "../controllers/cart.controller";
import { authorizedMiddleware, adminMiddleware } from "../middlewares/authorized.middleware";

const cartRoute = Router();
const cartController = new CartController();

// all cart routes require login
cartRoute.use(authorizedMiddleware);

// POST /api/cart              → add item to cart
cartRoute.post("/", (req, res) => cartController.addToCart(req, res));

// GET  /api/cart/my           → get my active cart
cartRoute.get("/my", (req, res) => cartController.getMyCart(req, res));

// GET  /api/cart/:id          → get single cart item
cartRoute.get("/:id", (req, res) => cartController.getCartItemById(req, res));

// PUT  /api/cart/:id          → update quantity
cartRoute.put("/:id", (req, res) => cartController.updateCartItem(req, res));

// PUT  /api/cart/:id/checkout → checkout
cartRoute.put("/:id/checkout", (req, res) => cartController.checkoutCartItem(req, res));

// PUT  /api/cart/:id/cancel   → cancel
cartRoute.put("/:id/cancel", (req, res) => cartController.cancelCartItem(req, res));

// DELETE /api/cart/:id        → remove from cart
cartRoute.delete("/:id", (req, res) => cartController.deleteCartItem(req, res));


// GET /api/cart/admin/all     → all cart items paginated
cartRoute.get("/admin/all", adminMiddleware, (req, res) =>
    cartController.getAllCartsPaginated(req, res),
);

export default cartRoute;