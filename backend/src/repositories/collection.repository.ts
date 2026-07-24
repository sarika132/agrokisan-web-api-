import { CollectionModel, ICollection } from "../models/collection.model";

export class CollectionMongoRepository {
    // get all collections
    async getAll(): Promise<ICollection[]> {
        return CollectionModel.find()
            .lean() as unknown as ICollection[];
    }

    // get single collection by id
    async getCollectionById(id: string): Promise<ICollection | null> {
        return CollectionModel.findById(id)
            .lean() as unknown as ICollection | null;
    }

    // get single collection by name (used for duplicate check)
    async getCollectionByName(name: string): Promise<ICollection | null> {
        return CollectionModel.findOne({ name: name as any })
            .lean() as unknown as ICollection | null;
    }

    // create a new collection
    async createCollection(data: Partial<ICollection>): Promise<ICollection> {
        const collection = new CollectionModel(data);
        return await collection.save();
    }

    // update a collection by id
    async update(
        id: string,
        data: Partial<ICollection>,
    ): Promise<ICollection | null> {
        return CollectionModel.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        }).lean() as unknown as ICollection | null;
    }

    // delete a collection by id
    async delete(id: string): Promise<boolean> {
        const result = await CollectionModel.findByIdAndDelete(id);
        return !!result;
    }
}