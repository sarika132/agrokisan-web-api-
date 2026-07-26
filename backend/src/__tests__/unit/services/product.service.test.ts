import mongoose from "mongoose";
import { ProductService } from "../../../services/product.service";
import { ProductModel } from "../../../models/product.model";

// Unit tests for ProductService
describe("Unit: ProductService", () => {
    const productService = new ProductService();
    let productId: string;

    beforeAll(async () => {
        await ProductModel.deleteMany({
            name: { $in: ["Service Test Product", "Service Test Product Updated"] },
        });
    });

    afterAll(async () => {
        await ProductModel.deleteMany({
            name: { $in: ["Service Test Product", "Service Test Product Updated"] },
        });
    });

    test("should create a product", async () => {
        const product = await productService.createProduct({
            name: "Service Test Product",
            description: "test product",
            price: 700,
            unit: "kg" as const,
            stock: 50,
            isAvailable: true,
            categoryId: new mongoose.Types.ObjectId() as any,
        } as any);
        expect(product).toBeDefined();
        expect(product.name).toBe("Service Test Product");
        productId = product._id.toString();
    });

    test("should get all products", async () => {
        const products = await productService.getAllProducts();
        expect(Array.isArray(products)).toBe(true);
        expect(products.length).toBeGreaterThan(0);
    });

    test("should get a product by id", async () => {
        const product = await productService.getProductById(productId);
        expect(product).toBeDefined();
        expect(product.name).toBe("Service Test Product");
    });

    test("should throw 404 for non-existing product id", async () => {
        const fakeId = new mongoose.Types.ObjectId().toString();
        await expect(productService.getProductById(fakeId)).rejects.toThrow("Product not found");
    });

    test("should update a product", async () => {
        const updated = await productService.updateProduct(productId, {
            name: "Service Test Product Updated",
        } as any);
        expect(updated.name).toBe("Service Test Product Updated");
    });

    test("should throw 404 when updating non-existing product", async () => {
        const fakeId = new mongoose.Types.ObjectId().toString();
        await expect(
            productService.updateProduct(fakeId, { name: "Doesn't Matter" } as any),
        ).rejects.toThrow("Product not found");
    });

    test("should get paginated products with search filter", async () => {
        const result = await productService.getAllProductsPaginated(1, 10, "Updated");
        expect(result.data.length).toBeGreaterThan(0);
        expect(result.data[0].name).toContain("Updated");
    });

    test("should delete a product", async () => {
        const deleted = await productService.deleteProduct(productId);
        expect(deleted).toBe(true);
    });

    test("should throw 404 when deleting non-existing product", async () => {
        await expect(productService.deleteProduct(productId)).rejects.toThrow("Product not found");
    });
});