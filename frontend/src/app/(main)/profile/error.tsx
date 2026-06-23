"use client";
import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <h2 className="text-lg font-semibold">Something went wrong!</h2>
            <button
                onClick={reset}
                className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
            >
                Try again
            </button>
        </div>
    );
}