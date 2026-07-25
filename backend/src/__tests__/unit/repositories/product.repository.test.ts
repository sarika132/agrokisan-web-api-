import mongoose from "mongoose";
import { ProductMongoRepository } from "../../../repositories/product.repository";
import { ProductModel } from "../../../models/product.model";

// Unit tests for ProductMongoRepository
describe("Unit: ProductMongoRepository", () => {
    const productRepository = new ProductMongoRepository();
    let productId: string;

    beforeAll(async () => {
        await ProductModel.deleteMany({ name: { $in: ["Repo Test Product 2", "Repo Test Product 2 Updated"] } });
    });

    afterAll(async () => {
        await ProductModel.deleteMany({ name: { $in: ["Repo Test Product 2", "Repo Test Product 2 Updated"] } });
    });

    test("should create a product", async () => {
        const product = await productRepository.createProduct({
            name: "Repo Test Product 2",
            description: "test product for repo tests",
            price: 900,
            unit: "kg" as const,
            stock: 50,
            isAvailable: true,
        } as any);
        expect(product).toBeDefined();
        expect(product.name).toBe("Repo Test Product 2");
        productId = product._id.toString();
    });

    test("should find product by id", async () => {
        const found = await productRepository.getProductById(productId);
        expect(found).toBeDefined();
        expect(found?.name).toBe("Repo Test Product 2");
    });

    test("should return null for non-existing product id", async () => {
        const fakeId = new mongoose.Types.ObjectId().toString();
        const found = await productRepository.getProductById(fakeId);
        expect(found).toBeNull();
    });

    test("should get all available products", async () => {
        const products = await productRepository.getAll();
        expect(Array.isArray(products)).toBe(true);
        expect(products.length).toBeGreaterThan(0);
    });

    test("should update a product", async () => {
        const updated = await productRepository.update(productId, {
            name: "Repo Test Product 2 Updated",
        } as any);
        expect(updated?.name).toBe("Repo Test Product 2 Updated");
    });

    test("should get paginated products with search filter", async () => {
        const result = await productRepository.getAllPaginated(1, 10, "Updated");
        expect(result.data.length).toBeGreaterThan(0);
        expect(result.total).toBeGreaterThan(0);
    });

    test("should delete a product", async () => {
        const deleted = await productRepository.delete(productId);
        expect(deleted).toBe(true);
    });
});