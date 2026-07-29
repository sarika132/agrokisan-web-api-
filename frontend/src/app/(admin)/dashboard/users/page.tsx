import { handleGetAllUsers } from "@/lib/actions/admin/user-action";
import UserTable from "./_components/UserTable";

export const dynamic = "force-dynamic";

export default async function UsersPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; limit?: string; search?: string }>;
}) {
    const { page: pageParam, limit: limitParam, search: searchParam } = await searchParams;

    const page = pageParam ? parseInt(pageParam) : 1;
    const limit = limitParam ? parseInt(limitParam) : 10;
    const search = searchParam || "";

    const result = await handleGetAllUsers({ page, limit, search });

    if (!result.success) {
        throw new Error(result.message);
    }

    const customers = (result.data ?? []).filter(
        (user: any) => user.role === "user",
    );

    return (
        <div className="p-6">
            <h1 className="text-xl text-slate-600 font-medium mb-6">
                Customer Management
            </h1>
            <UserTable
                users={customers}
                pagination={result.pagination}
                search={search}
            />
        </div>
    );
}