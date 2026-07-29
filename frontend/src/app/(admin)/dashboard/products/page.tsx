import { handleGetAllProducts } from "@/lib/actions/admin/product-action";
import ProductTable from "./_components/ProductTable";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; limit?: string; search?: string }>;
}) {
    const { page, limit, search } = await searchParams;
    const currentPage = page ? parseInt(page) : 1;
    const currentLimit = limit ? parseInt(limit) : 10;
    const currentSearch = search || "";

    const result = await handleGetAllProducts({
        page: currentPage,
        limit: currentLimit,
        search: currentSearch,
    });

    if (!result.success) throw new Error(result.message);

    const pagination = result.pagination ?? {
        page: currentPage,
        limit: currentLimit,
        total: 0,
        totalPages: 0,
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">Product Management</h1>
                <p className="text-sm text-gray-500 mt-1">Manage your product inventory</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <ProductTable
                    products={result.data || []}
                    pagination={pagination}
                    search={currentSearch}
                />
            </div>
        </div>
    );
}