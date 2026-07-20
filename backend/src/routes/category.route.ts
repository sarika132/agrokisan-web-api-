import { CategoryModel, ICategory } from "../models/category.model";

export class CategoryMongoRepository {
    // get all categories
    async getAll(): Promise<ICategory[]> {
        return CategoryModel.find().lean() as unknown as ICategory[];
    }

    // get single category by id
    async getCategoryById(id: string): Promise<ICategory | null> {
        return CategoryModel.findById(id).lean() as unknown as ICategory | null;
    }

    // get single category by name (used for duplicate check)
    async getCategoryByName(name: string): Promise<ICategory | null> {
        return CategoryModel.findOne({ name }).lean() as unknown as ICategory | null;
    }

    // create a new category
    async createCategory(data: Partial<ICategory>): Promise<ICategory> {
        const category = new CategoryModel(data);
        return await category.save();
    }

    // update a category by id
    async update(id: string, data: Partial<ICategory>): Promise<ICategory | null> {
        return CategoryModel.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        }).lean() as unknown as ICategory | null;
    }

    // delete a category by id
    async delete(id: string): Promise<boolean> {
        const result = await CategoryModel.findByIdAndDelete(id);
        return !!result;
    }
}