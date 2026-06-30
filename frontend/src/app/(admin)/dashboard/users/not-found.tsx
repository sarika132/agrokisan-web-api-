export default function NotFound() {
    return (
        <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] gap-2">
            <h2 className="text-lg font-semibold text-gray-800">User not found</h2>
            <p className="text-sm text-gray-500">
                The user you are looking for does not exist.
            </p>
        </div>
    );
}