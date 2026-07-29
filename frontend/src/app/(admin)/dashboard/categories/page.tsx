import { handleGetAllCategories } from "@/lib/actions/admin/category-action";
import CategoryTable from "./_components/CategoryTable";

export const dynamic = "force-dynamic";

export default async function CategoriesPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; limit?: string; search?: string }>;
}) {
    const { page: pageParam, limit: limitParam, search: searchParam } = await searchParams;

    const page = pageParam ? parseInt(pageParam) : 1;
    const limit = limitParam ? parseInt(limitParam) : 10;
    const search = searchParam || "";

    const result = await handleGetAllCategories({ page, limit, search });

    if (!result.success) {
        throw new Error(result.message);
    }

    const pagination = result.pagination ?? { page, limit, total: 0, totalPages: 0 };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">Category Management</h1>
                <p className="text-sm text-gray-500 mt-1">Manage your product categories</p>
            </div>

            {/* Table wrapper card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <CategoryTable
                    categories={result.data || []}
                    pagination={pagination}
                    search={search}
                />
            </div>
        </div>
    );
}