"use client";

import PasswordForm from "@/app/(main)/profile/_components/PasswordForm";

export default function ChangePasswordPage() {
    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold text-green-800 mb-6">Change Password</h1>
            <PasswordForm />
        </div>
    );
}