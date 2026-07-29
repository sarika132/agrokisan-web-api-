import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import ProductForm from "../_components/ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
    // ProductForm fetches categories itself – no need to pass them
    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <Link
                href="/dashboard/products"
                className="flex items-center gap-2 text-sm text-green-800 hover:text-green-700"
            >
                <ArrowLeftIcon className="h-4 w-4" />
                Back to Products
            </Link>
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">Add New Product</h1>
                <p className="text-sm text-gray-500 mt-1">Create a new product listing</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-8">
                <ProductForm />
            </div>
        </div>
    );
}