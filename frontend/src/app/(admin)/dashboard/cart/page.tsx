import { handleGetAllCarts } from "@/lib/actions/admin/cart-action";
import CartTable from "./_components/CartTable";

export const dynamic = "force-dynamic";

export default async function CartsPage({
    searchParams,
}: {
    searchParams: Promise<{
        page?: string;
        limit?: string;
        search?: string;
        status?: string;
    }>;
}) {
    const {
        page: pageParam,
        limit: limitParam,
        search: searchParam,
        status: statusParam,
    } = await searchParams;

    const page = pageParam ? parseInt(pageParam) : 1;
    const limit = limitParam ? parseInt(limitParam) : 10;
    const search = searchParam || "";
    const status = statusParam || "all";

    const result = await handleGetAllCarts({ page, limit, search, status });

    if (!result.success) {
        throw new Error(result.message);
    }

    const pagination = result.pagination ?? {
        page,
        limit,
        total: 0,
        totalPages: 0,
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">Cart Management</h1>
                <p className="text-sm text-gray-500 mt-1">Manage customer shopping carts</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <CartTable
                    carts={result.data || []}
                    pagination={pagination}
                    search={search}
                    currentStatus={status}
                />
            </div>
        </div>
    );
}