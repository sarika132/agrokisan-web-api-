"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/UI_UX/button";
import { Input } from "@/components/UI_UX/input";
import { Label } from "@/components/UI_UX/label";
import { Switch } from "@/components/UI_UX/switch";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/UI_UX/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/UI_UX/select";
import {
    handleCreateProduct,
    handleUpdateProduct,
} from "@/lib/actions/admin/product-action";
import { handleGetPublicCategories } from "@/lib/actions/public/category-action";

const productFormSchema = z.object({
    name: z.string().min(1, "Product name is required"),
    categoryId: z.string().min(1, "Category is required"),
    description: z.string().min(1, "Description is required"),
    price: z.string().min(1, "Price is required"),
    unit: z.enum(["kg", "litre", "piece", "packet"], {
        message: "Please select a unit",
    }),
    stock: z.string().min(1, "Stock quantity is required"),
    isAvailable: z.boolean(),
});

type ProductFormData = z.infer<typeof productFormSchema>;

interface Category {
    _id: string;
    name: string;
}

interface Product {
    _id: string;
    name: string;
    categoryId: Category;
    description: string;
    price: number;
    unit: string;
    stock: number;
    isAvailable: boolean;
    imageUrl?: string;
}

interface ProductFormProps {
    open?: boolean;
    onClose?: () => void;
    product?: Product | null;
}

export default function ProductForm({ open, onClose, product }: ProductFormProps) {
    const router = useRouter();
    const isEdit = !!product;
    const isModal = open !== undefined;

    const [categories, setCategories] = useState<Category[]>([]);
    const [imagePreview, setImagePreview] = useState<string | null>(
        product?.imageUrl
            ? `${process.env.NEXT_PUBLIC_BASE_URL || ""}${product.imageUrl}`
            : null
    );
    const [imageFile, setImageFile] = useState<File | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ProductFormData>({
        resolver: zodResolver(productFormSchema),
        defaultValues: {
            name: "",
            categoryId: "",
            description: "",
            price: "",
            unit: undefined,
            stock: "",
            isAvailable: true,
        },
    });

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const result = await handleGetPublicCategories();
                if (result.success) {
                    setCategories(result.data || []);
                } else {
                    toast.error("Failed to load categories");
                }
            } catch (error) {
                console.error("Category load error:", error);
                toast.error("Could not load categories");
            }
        };
        loadCategories();
    }, []);

    useEffect(() => {
        if (product) {
            reset({
                name: product.name,
                categoryId: product.categoryId?._id || "",
                description: product.description,
                price: product.price.toString(),
                unit: product.unit as any,
                stock: product.stock.toString(),
                isAvailable: product.isAvailable,
            });
            setImagePreview(
                product.imageUrl
                    ? `${process.env.NEXT_PUBLIC_BASE_URL || ""}${product.imageUrl}`
                    : null
            );
        } else {
            reset({
                name: "",
                categoryId: "",
                description: "",
                price: "",
                unit: undefined,
                stock: "",
                isAvailable: true,
            });
            setImagePreview(null);
        }
        setImageFile(null);
    }, [product, reset]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data: ProductFormData) => {
        try {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("categoryId", data.categoryId);
            formData.append("description", data.description);
            formData.append("price", data.price);
            formData.append("unit", data.unit);
            formData.append("stock", data.stock);
            formData.append("isAvailable", String(data.isAvailable));

            if (imageFile) {
                formData.append("productImage", imageFile);
            }

            const result = isEdit
                ? await handleUpdateProduct(product!._id, formData)
                : await handleCreateProduct(formData);

            if (result.success) {
                toast.success(
                    isEdit ? "Product updated successfully!" : "Product created successfully!"
                );
                if (isModal && onClose) onClose();
                router.push("/dashboard/products");
                router.refresh();
            } else {
                toast.error(result.message || "Something went wrong");
                console.error("Product submit error:", result.message);
            }
        } catch (error) {
            console.error("Submit exception:", error);
            toast.error("An error occurred while saving");
        }
    };

    const content = (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" {...register("name")} className="mt-1.5" placeholder="e.g. Organic Fertilizer" />
                {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
            </div>

            {/* Category */}
            <div>
                <Label>Category</Label>
                <Select
                    onValueChange={(value) => setValue("categoryId", value, { shouldValidate: true })}
                    defaultValue={product?.categoryId?._id}
                >
                    <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((cat) => (
                            <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.categoryId && <p className="text-sm text-red-600 mt-1">{errors.categoryId.message}</p>}
            </div>

            {/* Description */}
            <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                    id="description"
                    {...register("description")}
                    rows={3}
                    placeholder="Enter product description"
                    className="mt-1.5 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
                {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>}
            </div>

            {/* Price, Unit, Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <Label htmlFor="price">Price (NPR)</Label>
                    <Input id="price" type="number" {...register("price")} className="mt-1.5" placeholder="e.g. 2500" />
                    {errors.price && <p className="text-sm text-red-600 mt-1">{errors.price.message}</p>}
                </div>
                <div>
                    <Label>Unit</Label>
                    <Select
                        onValueChange={(value) => setValue("unit", value as any, { shouldValidate: true })}
                        defaultValue={product?.unit}
                    >
                        <SelectTrigger className="mt-1.5">
                            <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="kg">kg</SelectItem>
                            <SelectItem value="litre">litre</SelectItem>
                            <SelectItem value="piece">piece</SelectItem>
                            <SelectItem value="packet">packet</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.unit && <p className="text-sm text-red-600 mt-1">{errors.unit.message}</p>}
                </div>
                <div>
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input id="stock" type="number" {...register("stock")} className="mt-1.5" placeholder="e.g. 50" />
                    {errors.stock && <p className="text-sm text-red-600 mt-1">{errors.stock.message}</p>}
                </div>
            </div>

            {/* Image */}
            <div>
                <Label htmlFor="productImage">{isEdit ? "Update Image (optional)" : "Product Image (optional)"}</Label>
                <Input id="productImage" type="file" accept="image/*" className="mt-1.5" onChange={handleImageChange} />
            </div>

            {imagePreview && (
                <div className="flex items-center gap-3">
                    <img src={imagePreview} alt="Preview" className="h-24 w-36 rounded-lg object-cover border border-gray-200" />
                    <p className="text-sm text-gray-500">Image preview</p>
                </div>
            )}

            {/* Availability – green toggle */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Switch
                    checked={watch("isAvailable")}
                    onCheckedChange={(checked) => setValue("isAvailable", checked)}
                    className="data-[state=checked]:bg-green-600"
                />
                <div>
                    <p className="text-sm font-medium text-gray-700">Available for sale</p>
                    <p className={`text-xs mt-0.5 ${watch("isAvailable") ? "text-green-600" : "text-red-500"}`}>
                        {watch("isAvailable") ? "This product is available" : "This product is not available"}
                    </p>
                </div>
            </div>

            {/* Buttons – green */}
            <div className="flex gap-3 pt-2">
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-green-700 hover:bg-green-800 text-white flex-1"
                >
                    {isSubmitting ? (isEdit ? "Updating..." : "Creating...") : (isEdit ? "Update Product" : "Save Product")}
                </Button>
                {isModal && (
                    <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                        Cancel
                    </Button>
                )}
            </div>
        </form>
    );

    if (isModal) {
        return (
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{isEdit ? "Edit Product" : "Add New Product"}</DialogTitle>
                        <DialogDescription>
                            {isEdit ? "Update the product details below." : "Fill in the details to create a new product."}
                        </DialogDescription>
                    </DialogHeader>
                    {content}
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-8">
            {content}
        </div>
    );
}