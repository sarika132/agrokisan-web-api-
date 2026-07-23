import { z } from "zod";
import { Request, Response } from "express";
import { ApiResponseHelper } from "../../utils/apihelper.util";
import { CreateCollectionDTO, UpdateCollectionDTO } from "../../dtos/collection.dto";
import { CollectionService } from "../../services/collection.service";

const collectionService = new CollectionService();

export class AdminCollectionController {
    // admin - get all collections
    async getAllCollections(req: Request, res: Response) {
        try {
            const collections = await collectionService.getAllCollections();
            return ApiResponseHelper.success(
                res,
                collections,
                "Collections fetched successfully",
            );
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500,
            );
        }
    }

    // admin - create a new collection
    async createCollection(req: Request, res: Response) {
        try {
            const collectionData = CreateCollectionDTO.safeParse(req.body);
            if (!collectionData.success) {
                return ApiResponseHelper.error(
                    res,
                    z.prettifyError(collectionData.error),
                    400,
                );
            }
            const collection = await collectionService.createCollection(
                collectionData.data,
            );
            return ApiResponseHelper.success(
                res,
                collection,
                "Collection created successfully",
            );
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500,
            );
        }
    }

    // admin - update collection by ID
    async updateCollection(req: Request, res: Response) {
        try {
            const { id } = req.params as { id: string };
            const collectionData = UpdateCollectionDTO.safeParse(req.body);
            if (!collectionData.success) {
                return ApiResponseHelper.error(
                    res,
                    z.prettifyError(collectionData.error),
                    400,
                );
            }
            const collection = await collectionService.updateCollection(
                id,
                collectionData.data,
            );
            return ApiResponseHelper.success(
                res,
                collection,
                "Collection updated successfully",
            );
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500,
            );
        }
    }

    // admin - delete collection by ID
    async deleteCollection(req: Request, res: Response) {
        try {
            const { id } = req.params as { id: string };
            await collectionService.deleteCollection(id);
            return ApiResponseHelper.success(
                res,
                null,
                "Collection deleted successfully",
            );
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500,
            );
        }
    }
}