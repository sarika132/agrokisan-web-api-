// src/app/profile/page.tsx
"use client";

import { useAuth } from "@/lib/context/AuthContext";
import ProfileForm from "./_components/ProfileForm";

export default function ProfilePage() {
    const { user } = useAuth();

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold text-green-800 mb-6">Profile</h1>
            {user ? <ProfileForm user={user} /> : <p>Loading...</p>}
        </div>
    );
}