"use client";

import { useEffect } from "react";
import { Button } from "@/components/UI_UX/button";

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
        <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <h2 className="text-lg font-semibold text-gray-800">Something went wrong!</h2>
            <p className="text-sm text-gray-500">{error.message}</p>
            <Button onClick={reset} className="bg-cyan-500 hover:bg-cyan-600">
                Try again
            </Button>
        </div>
    );
}