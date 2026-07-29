import { handleGetAllReviews } from "@/lib/actions/admin/review-action";
import ReviewTable from "./_components/reviewTable";

export const dynamic = "force-dynamic";

export default async function ReviewsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; limit?: string }>;
}) {
    const { page: pageParam, limit: limitParam } = await searchParams;

    const page = pageParam ? parseInt(pageParam) : 1;
    const limit = limitParam ? parseInt(limitParam) : 10;

    const result = await handleGetAllReviews({ page, limit });

    if (!result.success) {
        throw new Error(result.message);
    }

    return (
        <div className="p-6">
            <h1 className="text-xl text-slate-600 font-medium mb-6">
                Review Management
            </h1>
            <ReviewTable
                reviews={result.data}
                pagination={result.pagination}
            />
        </div>
    );
}