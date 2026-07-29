"use client";

import { ShoppingCartIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from "lucide-react";

interface CartStatusProps {
    activeCarts: number;        // items in active cart
    checkedOutCarts: number;    // items checked out
    cancelledCarts: number;     // items cancelled
}

export default function CartStatus({
    activeCarts,
    checkedOutCarts,
    cancelledCarts,
}: CartStatusProps) {
    return (
        <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cart Status</h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <StatusItem
                    label="Active"
                    value={activeCarts}
                    icon={<ShoppingCartIcon className="h-5 w-5 text-yellow-500" />}
                    bgColor="bg-yellow-50"
                    borderColor="border-yellow-200"
                    textColor="text-yellow-700"
                />
                <StatusItem
                    label="Checked Out"
                    value={checkedOutCarts}
                    icon={<CheckCircleIcon className="h-5 w-5 text-green-500" />}
                    bgColor="bg-green-50"
                    borderColor="border-green-200"
                    textColor="text-green-700"
                />
                <StatusItem
                    label="Cancelled"
                    value={cancelledCarts}
                    icon={<XCircleIcon className="h-5 w-5 text-red-400" />}
                    bgColor="bg-red-50"
                    borderColor="border-red-200"
                    textColor="text-red-600"
                />
            </div>
        </div>
    );
}

function StatusItem({
    label,
    value,
    icon,
    bgColor,
    borderColor,
    textColor,
}: {
    label: string;
    value: number;
    icon: React.ReactNode;
    bgColor: string;
    borderColor: string;
    textColor: string;
}) {
    return (
        <div className={`${bgColor} border ${borderColor} rounded-xl p-4 flex items-center gap-3`}>
            <div className="shrink-0">{icon}</div>
            <div>
                <p className={`text-xl font-bold ${textColor}`}>{value}</p>
                <p className={`text-xs ${textColor}`}>{label}</p>
            </div>
        </div>
    );
}