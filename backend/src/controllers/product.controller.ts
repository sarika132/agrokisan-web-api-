import { Request, Response } from "express";
import { z } from "zod";
import { ApiResponseHelper } from "../utils/apihelper.util";
import { ProductService } from "../services/product.service";
import { CreateProductDTO, UpdateProductDTO } from "../dtos/product.dto";

interface QueryParams {
    page?: string;
    limit?: string;
    search?: string;
}

const productService = new ProductService();

export class ProductController {
    // public - anyone can view all available products
    async getAllProducts(req: Request, res: Response) {
        try {
            const products = await productService.getAllProducts();
            return ApiResponseHelper.success(
                res,
                products,
                "Products fetched successfully",
            );
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500,
            );
        }
    }

    // public - anyone can view a single product detail
    async getProductById(req: Request, res: Response) {
        try {
            const { id } = req.params as { id: string };
            const product = await productService.getProductById(id);
            return ApiResponseHelper.success(
                res,
                product,
                "Product fetched successfully",
            );
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500,
            );
        }
    }

    // admin - create a new product (with optional image upload via multer)
    async createProduct(req: Request, res: Response) {
        try {
            const productData = CreateProductDTO.safeParse(req.body);
            if (!productData.success) {
                return ApiResponseHelper.error(
                    res,
                    z.prettifyError(productData.error),
                    400,
                );
            }
            // set imageUrl if file was uploaded via multer
            const imageUrl = req.file
                ? "/uploads/" + req.file.filename
                : undefined;
            const product = await productService.createProduct(
                productData.data,
                imageUrl,
            );
            return ApiResponseHelper.success(
                res,
                product,
                "Product created successfully",
            );
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500,
            );
        }
    }

    // admin - update an existing product (with optional image upload via multer)
    async updateProduct(req: Request, res: Response) {
        try {
            const { id } = req.params as { id: string };
            const productData = UpdateProductDTO.safeParse(req.body);
            if (!productData.success) {
                return ApiResponseHelper.error(
                    res,
                    z.prettifyError(productData.error),
                    400,
                );
            }
            // set imageUrl if a new file was uploaded via multer
            const imageUrl = req.file
                ? "/uploads/" + req.file.filename
                : undefined;
            const updated = await productService.updateProduct(
                id,
                productData.data,
                imageUrl,
            );
            return ApiResponseHelper.success(
                res,
                updated,
                "Product updated successfully",
            );
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500,
            );
        }
    }

    // admin - delete a product
    async deleteProduct(req: Request, res: Response) {
        try {
            const { id } = req.params as { id: string };
            const deleted = await productService.deleteProduct(id);
            if (!deleted) {
                return ApiResponseHelper.error(res, "Product not found", 404);
            }
            return ApiResponseHelper.success(
                res,
                null,
                "Product deleted successfully",
            );
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500,
            );
        }
    }

    // admin - get paginated products with optional search
    async getAllProductsPaginated(req: Request, res: Response) {
        try {
            const { page, limit, search }: QueryParams = req.query;
            const pageNum = parseInt(page || "1");
            const limitNum = parseInt(limit || "10");

            const { data, total } = await productService.getAllProductsPaginated(
                pageNum,
                limitNum,
                search,
            );

            const pagination = {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages: Math.ceil(total / limitNum) || 1,
            };

            return ApiResponseHelper.success(
                res,
                data,
                "Products fetched successfully",
                200,
                pagination,
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