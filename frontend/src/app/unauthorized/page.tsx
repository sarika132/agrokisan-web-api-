import Link from "next/link";
import { ShieldAlertIcon } from "lucide-react";

export default function Page() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="bg-white border border-gray-100 rounded-2xl p-10 max-w-md w-full text-center shadow-sm">
                <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
                    <ShieldAlertIcon className="h-8 w-8 text-red-500" />
                </div>

                <h1 className="text-xl font-bold text-[#13303a] mb-2">
                    Access Restricted
                </h1>
                <p className="text-sm text-[#51636a] mb-8">
                    You don't have permission to view this page. This is
                    for administrators only.
                </p>

                <Link
                    href="/"
                    className="inline-block bg-[#0092B8] hover:bg-[#007a99] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
                >
                    Go to Home
                </Link>
            </div>
        </div>
    );
}