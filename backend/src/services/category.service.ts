import { CategoryMongoRepository } from "../repositories/category.repository";
import { CreateCategoryDTO, UpdateCategoryDTO } from "../dtos/category.dto";
import { ICategory } from "../models/category.model";
import { HttpException } from "../exceptions/http-exception";

const categoryRepository = new CategoryMongoRepository();

export class CategoryService {
    // Get all categories
    async getAllCategories(): Promise<ICategory[]> {
        const categories = await categoryRepository.getAll();
        return categories;
    }

    // Create a new category (check for duplicate name)
    async createCategory(data: CreateCategoryDTO): Promise<ICategory> {
        const existing = await categoryRepository.getCategoryByName(data.name);
        if (existing) {
            throw new HttpException(400, `Category "${data.name}" already exists`);
        }
        const category = await categoryRepository.createCategory(data);
        return category;
    }

    // Update category by ID
    async updateCategory(id: string, data: UpdateCategoryDTO): Promise<ICategory> {
        const existing = await categoryRepository.getCategoryById(id);
        if (!existing) {
            throw new HttpException(404, "Category not found");
        }
        const updated = await categoryRepository.update(id, data);
        return updated!;
    }

    // Delete category by ID
    async deleteCategory(id: string): Promise<boolean> {
        const existing = await categoryRepository.getCategoryById(id);
        if (!existing) {
            throw new HttpException(404, "Category not found");
        }
        return await categoryRepository.delete(id);
    }
}