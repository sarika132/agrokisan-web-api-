import { ProductMongoRepository } from "../repositories/product.repository";
import { CreateProductDTO, UpdateProductDTO } from "../dtos/product.dto";
import { IProduct } from "../models/product.model";
import { HttpException } from "../exceptions/http-exception";

const productRepository = new ProductMongoRepository();

export class ProductService {
    // get all available products for the public listing page
    async getAllProducts(): Promise<IProduct[]> {
        const products = await productRepository.getAll();
        return products;
    }

    // get a single product by id for the detail page
    async getProductById(id: string): Promise<IProduct> {
        const product = await productRepository.getProductById(id);
        if (!product) {
            throw new HttpException(404, "Product not found");
        }
        return product;
    }

    // admin creates a new product
    async createProduct(
        data: CreateProductDTO,
        imageUrl?: string,
    ): Promise<IProduct> {
        const product = await productRepository.createProduct(
            { ...data, imageUrl } as unknown as Partial<IProduct>,
        );
        return product;
    }

    // admin updates an existing product
    async updateProduct(
        id: string,
        data: UpdateProductDTO,
        imageUrl?: string,
    ): Promise<IProduct> {
        const existing = await productRepository.getProductById(id);
        if (!existing) {
            throw new HttpException(404, "Product not found");
        }
        // only update imageUrl if a new image was uploaded
        const updateData = imageUrl ? { ...data, imageUrl } : data;
        const updated = await productRepository.update(
            id,
            updateData as unknown as Partial<IProduct>,
        );
        return updated!;
    }

    // admin deletes a product
    async deleteProduct(id: string): Promise<boolean> {
        const existing = await productRepository.getProductById(id);
        if (!existing) {
            throw new HttpException(404, "Product not found");
        }
        return await productRepository.delete(id);
    }

    // get paginated products with optional search for admin dashboard
    async getAllProductsPaginated(
        page: number,
        limit: number,
        search?: string,
    ): Promise<{ data: IProduct[]; total: number }> {
        return await productRepository.getAllPaginated(page, limit, search);
    }
}