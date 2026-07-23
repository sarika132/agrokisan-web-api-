import { z } from "zod";
import { Request, Response } from "express";
import { ApiResponseHelper } from "../../utils/apihelper.util";
import { CreateProductDTO, UpdateProductDTO } from "../../dtos/product.dto";
import { ProductService } from "../../services/product.service";

const productService = new ProductService();

export class AdminProductController {
    // admin - get all products with pagination and search
    async getAllProductsPaginated(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = req.query.search as string | undefined;

            const result = await productService.getAllProductsPaginated(
                page,
                limit,
                search,
            );

            return ApiResponseHelper.success(
                res,
                {
                    data: result.data,
                    pagination: {
                        total: result.total,
                        page,
                        limit,
                        totalPages: Math.ceil(result.total / limit),
                    },
                },
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

    // admin - get single product by id
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

    // admin only - create product with optional image upload
    async createProduct(req: Request, res: Response) {
        try {
            const productData = CreateProductDTO.safeParse({
                ...req.body,
                // convert string values from form-data to correct types
                price: parseFloat(req.body.price),
                stock: parseInt(req.body.stock),
                isAvailable: req.body.isAvailable === "true",
            });

            if (!productData.success) {
                return ApiResponseHelper.error(
                    res,
                    z.prettifyError(productData.error),
                    400,
                );
            }

            // get image filename from multer if image was uploaded
            const imageUrl = req.file?.filename
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

    // admin only - update product details or image
    async updateProduct(req: Request, res: Response) {
        try {
            const { id } = req.params as { id: string };

            const productData = UpdateProductDTO.safeParse({
                ...req.body,
                // convert string values from form-data to correct types if present
                ...(req.body.price && { price: parseFloat(req.body.price) }),
                ...(req.body.stock && { stock: parseInt(req.body.stock) }),
                ...(req.body.isAvailable !== undefined && {
                    isAvailable: req.body.isAvailable === "true",
                }),
            });

            if (!productData.success) {
                return ApiResponseHelper.error(
                    res,
                    z.prettifyError(productData.error),
                    400,
                );
            }

            const imageUrl = req.file?.filename
                ? "/uploads/" + req.file.filename
                : undefined;

            const product = await productService.updateProduct(
                id,
                productData.data,
                imageUrl,
            );
            return ApiResponseHelper.success(
                res,
                product,
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

    // admin only - delete product by id
    async deleteProduct(req: Request, res: Response) {
        try {
            const { id } = req.params as { id: string };
            await productService.deleteProduct(id);
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
}