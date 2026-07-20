import { Router } from "express";
import { CollectionController } from "../controllers/collection.controller";
import {
    authorizedMiddleware,
    adminMiddleware,
} from "../middlewares/authorized.middleware";

const collectionRoute = Router();
const collectionController = new CollectionController();

// GET /api/collections       → all collections
collectionRoute.get("/", (req, res) =>
    collectionController.getAllCollections(req, res),
);

// POST /api/collections      → create collection
collectionRoute.post(
    "/",
    authorizedMiddleware,
    adminMiddleware,
    (req, res) => collectionController.createCollection(req, res),
);

// PUT /api/collections/:id   → update collection
collectionRoute.put(
    "/:id",
    authorizedMiddleware,
    adminMiddleware,
    (req, res) => collectionController.updateCollection(req, res),
);

// DELETE /api/collections/:id → delete collection
collectionRoute.delete(
    "/:id",
    authorizedMiddleware,
    adminMiddleware,
    (req, res) => collectionController.deleteCollection(req, res),
);

export default collectionRoute;