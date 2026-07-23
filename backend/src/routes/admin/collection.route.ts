import { Router } from "express";
import { AdminCollectionController } from "../../controllers/admin/collection.controller";
import {
    adminMiddleware,
    authorizedMiddleware,
} from "../../middlewares/authorized.middleware";

const adminCollectionRoute = Router();
const collectionController = new AdminCollectionController();

// admin only - get all collections
adminCollectionRoute.get(
    "/",
    authorizedMiddleware,
    adminMiddleware,
    collectionController.getAllCollections,
);

// admin only - create collection
adminCollectionRoute.post(
    "/create",
    authorizedMiddleware,
    adminMiddleware,
    collectionController.createCollection,
);

// admin only - update collection
adminCollectionRoute.put(
    "/update/:id",
    authorizedMiddleware,
    adminMiddleware,
    collectionController.updateCollection,
);

// admin only - delete collection
adminCollectionRoute.delete(
    "/delete/:id",
    authorizedMiddleware,
    adminMiddleware,
    collectionController.deleteCollection,
);

export default adminCollectionRoute;