import { z } from "zod";
import { Request, Response } from "express";
import { ApiResponseHelper } from "../../utils/apihelper.util";
import { CreateCategoryDTO, UpdateCategoryDTO } from "../../dtos/category.dto";
import { CategoryService } from "../../services/category.service";

const categoryService = new CategoryService();

export class AdminCategoryController {
    // admin - get all categories
    async getAllCategories(req: Request, res: Response) {
        try {
            const categories = await categoryService.getAllCategories();
            return ApiResponseHelper.success(
                res,
                categories,
                "Categories fetched successfully",
            );
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500,
            );
        }
    }

    // admin - create a new category
    async createCategory(req: Request, res: Response) {
        try {
            const categoryData = CreateCategoryDTO.safeParse(req.body);
            if (!categoryData.success) {
                return ApiResponseHelper.error(
                    res,
                    z.prettifyError(categoryData.error),
                    400,
                );
            }
            const category = await categoryService.createCategory(
                categoryData.data,
            );
            return ApiResponseHelper.success(
                res,
                category,
                "Category created successfully",
            );
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500,
            );
        }
    }

    // admin - update category by ID
    async updateCategory(req: Request, res: Response) {
        try {
            const { id } = req.params as { id: string };
            const categoryData = UpdateCategoryDTO.safeParse(req.body);
            if (!categoryData.success) {
                return ApiResponseHelper.error(
                    res,
                    z.prettifyError(categoryData.error),
                    400,
                );
            }
            const category = await categoryService.updateCategory(
                id,
                categoryData.data,
            );
            return ApiResponseHelper.success(
                res,
                category,
                "Category updated successfully",
            );
        } catch (error: Error | any | unknown) {
            return ApiResponseHelper.error(
                res,
                error.message || "Internal Server Error",
                error.status || 500,
            );
        }
    }

    // admin - delete category by ID
    async deleteCategory(req: Request, res: Response) {
        try {
            const { id } = req.params as { id: string };
            await categoryService.deleteCategory(id);
            return ApiResponseHelper.success(
                res,
                null,
                "Category deleted successfully",
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