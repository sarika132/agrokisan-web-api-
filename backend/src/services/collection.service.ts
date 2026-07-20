import { CollectionMongoRepository } from "../repositories/collection.repository";
import { CreateCollectionDTO, UpdateCollectionDTO } from "../dtos/collection.dto";
import { ICollection } from "../models/collection.model";
import { HttpException } from "../exceptions/http-exception";

const collectionRepository = new CollectionMongoRepository();

export class CollectionService {
    // Get all collections
    async getAllCollections(): Promise<ICollection[]> {
        const collections = await collectionRepository.getAll();
        return collections;
    }

    // Create a new collection (check for duplicate name)
    async createCollection(data: CreateCollectionDTO): Promise<ICollection> {
        const existing = await collectionRepository.getCollectionByName(data.name);
        if (existing) {
            throw new HttpException(
                400,
                `Collection "${data.name}" already exists`,
            );
        }
        const collection = await collectionRepository.createCollection(data);
        return collection;
    }

    // Update collection by ID
    async updateCollection(
        id: string,
        data: UpdateCollectionDTO,
    ): Promise<ICollection> {
        const existing = await collectionRepository.getCollectionById(id);
        if (!existing) {
            throw new HttpException(404, "Collection not found");
        }
        const updated = await collectionRepository.update(id, data);
        return updated!;
    }

    // Delete collection by ID
    async deleteCollection(id: string): Promise<boolean> {
        const existing = await collectionRepository.getCollectionById(id);
        if (!existing) {
            throw new HttpException(404, "Collection not found");
        }
        return await collectionRepository.delete(id);
    }
}