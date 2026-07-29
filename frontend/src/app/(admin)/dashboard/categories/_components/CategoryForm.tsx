"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/UI_UX/button";
import { Label } from "@/components/UI_UX/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/UI_UX/dialog";
import {
    handleCreateCategory,
    handleUpdateCategory,
} from "@/lib/actions/admin/category-action";

// enum must match backend CategorySchema exactly
const CATEGORY_NAMES = [
    "Seed Variety",
    "Fertilizers and Pesticides",
    "Agriculture Tools",
    "Agriculture Equipment",
] as const;

const categoryFormSchema = z.object({
    name: z.enum(CATEGORY_NAMES, { error: "Please select a category" }),
    description: z.string().min(1, "Description is required"),
});

type CategoryFormData = z.infer<typeof categoryFormSchema>;

interface Category {
    _id: string;
    name: string;
    description?: string;
}

interface CategoryFormDialogProps {
    open: boolean;
    onClose: () => void;
    category?: Category | null;
}

export default function CategoryFormDialog({
    open,
    onClose,
    category,
}: CategoryFormDialogProps) {
    const router = useRouter();
    const isEdit = !!category;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CategoryFormData>({
        resolver: zodResolver(categoryFormSchema),
        defaultValues: {
            name: undefined,
            description: "",
        },
    });

    useEffect(() => {
        if (category) {
            reset({
                name: category.name as (typeof CATEGORY_NAMES)[number],
                description: category.description || "",
            });
        } else {
            reset({ name: undefined, description: "" });
        }
    }, [category, reset]);

    const onSubmit = async (data: CategoryFormData) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);

        const result = isEdit
            ? await handleUpdateCategory(category!._id, formData)
            : await handleCreateCategory(formData);

        if (result.success) {
            toast.success(
                isEdit ? "Category updated successfully!" : "Category created successfully!",
                { duration: 1500 }
            );
            onClose();
            router.refresh();
        } else {
            toast.error(result.message || "Something went wrong", { duration: 1500 });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? "Edit Category" : "Add New Category"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? "Update the category details below."
                            : "Fill in the details to create a new category."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
                    <div>
                        <Label htmlFor="name">Category Name</Label>
                        <select
                            id="name"
                            {...register("name")}
                            className="mt-1.5 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="">Select a category...</option>
                            {CATEGORY_NAMES.map((name) => (
                                <option key={name} value={name}>
                                    {name}
                                </option>
                            ))}
                        </select>
                        {errors.name && (
                            <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            {...register("description")}
                            rows={3}
                            placeholder="Describe this category..."
                            className="mt-1.5 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                        />
                        {errors.description && (
                            <p className="text-sm text-red-600 mt-1">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-green-700 hover:bg-green-800 flex-1 text-white"
                        >
                            {isSubmitting
                                ? isEdit
                                    ? "Updating..."
                                    : "Creating..."
                                : isEdit
                                    ? "Update Category"
                                    : "Create Category"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}