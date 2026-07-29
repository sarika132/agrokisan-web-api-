export default function Loading() {
    return (
        <div className="p-6">
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6" />
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
                    ))}
                </div>
            </div>
        </div>
    );
}