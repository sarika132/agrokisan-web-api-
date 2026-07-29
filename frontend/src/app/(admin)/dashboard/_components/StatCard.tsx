"use client";

import { ReactNode } from "react";

interface StatCardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    iconBgColor: string;
    badge?: string;
    badgeColor?: string;
}

export default function StatCard({
    title,
    value,
    icon,
    iconBgColor,
    badge,
    badgeColor,
}: StatCardProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
                {/* icon with colored background */}
                <div className={`h-10 w-10 rounded-lg ${iconBgColor} flex items-center justify-center`}>
                    {icon}
                </div>
                {/* optional badge e.g. "5 available" */}
                {badge && (
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${badgeColor}`}>
                        {badge}
                    </span>
                )}
            </div>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            <p className="text-sm text-gray-500 mt-1">{title}</p>
        </div>
    );
}