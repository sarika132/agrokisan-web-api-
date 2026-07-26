import mongoose from "mongoose";
import { CategoryService } from "../../../services/category.service";
import { CategoryModel } from "../../../models/category.model";

// Unit tests for CategoryService
describe("Unit: CategoryService", () => {
    const categoryService = new CategoryService();
    let categoryId: string;

    beforeAll(async () => {
        await CategoryModel.deleteMany({ name: "Seed Variety" });
    });

    afterAll(async () => {
        await CategoryModel.deleteMany({ name: "Seed Variety" });
    });

    test("should create a category", async () => {
        const category = await categoryService.createCategory({
            name: "Seed Variety",
            description: "test category for service tests",
        } as any);
        expect(category).toBeDefined();
        expect(category.name).toBe("Seed Variety");
        categoryId = category._id.toString();
    });

    test("should throw error when creating a duplicate category name", async () => {
        await expect(
            categoryService.createCategory({
                name: "Seed Variety",
                description: "duplicate attempt",
            } as any),
        ).rejects.toThrow('Category "Seed Variety" already exists');
    });

    test("should get all categories", async () => {
        const categories = await categoryService.getAllCategories();
        expect(Array.isArray(categories)).toBe(true);
        expect(categories.length).toBeGreaterThan(0);
    });

    test("should update a category", async () => {
        const updated = await categoryService.updateCategory(categoryId, {
            description: "updated description",
        } as any);
        expect(updated.description).toBe("updated description");
    });

    test("should throw 404 when updating non-existing category", async () => {
        const fakeId = new mongoose.Types.ObjectId().toString();
        await expect(
            categoryService.updateCategory(fakeId, { description: "x" } as any),
        ).rejects.toThrow("Category not found");
    });

    test("should delete a category", async () => {
        const deleted = await categoryService.deleteCategory(categoryId);
        expect(deleted).toBe(true);
    });

    test("should throw 404 when deleting non-existing category", async () => {
        await expect(categoryService.deleteCategory(categoryId)).rejects.toThrow(
            "Category not found",
        );
    });
});