import { handleGetProductById } from "@/lib/actions/admin/product-action";
import { handleGetPublicCategories } from "@/lib/actions/public/category-action";
import ProductForm from "../_components/ProductForm";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const [productResult, categoriesResult] = await Promise.all([
        handleGetProductById(id),
        handleGetPublicCategories(),
    ]);

    if (!productResult.success) throw new Error(productResult.message);
    if (!productResult.data) notFound();
    if (!categoriesResult.success) throw new Error("Failed to load categories");

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <Link href="/dashboard/products" className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700">
                <ArrowLeftIcon className="h-4 w-4" />
                Back to Products
            </Link>
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">Edit Product</h1>
                <p className="text-sm text-gray-500 mt-1">Update product details</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-8">
                <ProductForm categories={categoriesResult.data} product={productResult.data} />
            </div>
        </div>
    );
}