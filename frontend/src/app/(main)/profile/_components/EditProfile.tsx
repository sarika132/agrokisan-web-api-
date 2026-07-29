"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { Button } from "@/components/UI_UX/button";
import { Input } from "@/components/UI_UX/input";
import { Label } from "@/components/UI_UX/label";
import { toast } from "sonner";
import { handleUpdateProfile } from "@/lib/actions/auth-action";
import { CameraIcon } from "lucide-react";

export default function EditProfile() {
    const router = useRouter();
    const { user, loading, checkAuth } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [role, setRole] = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (user) {
            setFullName(user.fullName || "");
            setEmail(user.email || "");
            setContactNumber(user.contactNumber || "");
            setRole(user.role || "user");
            if (user.imageUrl) {
                setImagePreview(`${process.env.NEXT_PUBLIC_BASE_URL || ""}${user.imageUrl}`);
            } else {
                setImagePreview(null);
            }
        }
    }, [user]);

    if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="text-lg text-gray-500">Loading...</div></div>;
    if (!user) { router.push("/login"); return null; }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fullName.trim() || !email.trim()) {
            toast.error("Full name and email are required");
            return;
        }
        setUpdating(true);
        try {
            const formData = new FormData();
            formData.append("fullName", fullName);
            formData.append("email", email);
            formData.append("contactNumber", contactNumber);
            if (imageFile) formData.append("profileImage", imageFile);

            const result = await handleUpdateProfile(formData);
            if (result.success) {
                toast.success("Profile updated!");
                await checkAuth();
                window.location.reload();
            } else {
                toast.error(result.message || "Update failed");
            }
        } catch (error: any) {
            toast.error(error.message || "An error occurred");
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold text-green-800 mb-2">Edit Profile</h1>
            <p className="text-gray-500 mb-8">Update your personal information</p>

            <div className="bg-white rounded-xl shadow-md border border-green-100 p-6 md:p-8">
                {/* Avatar */}
                <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
                    <div className="relative">
                        <div className="h-24 w-24 rounded-full overflow-hidden bg-green-100 border-2 border-green-200">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Profile" className="h-full w-full object-cover" />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-green-600 font-semibold text-3xl">
                                    {fullName?.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 bg-green-700 hover:bg-green-800 text-white rounded-full p-1.5 border-2 border-white shadow-sm"
                        >
                            <CameraIcon className="h-4 w-4" />
                        </button>
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">{fullName || "User"}</h2>
                        <p className="text-sm text-gray-500">{email}</p>
                    </div>
                </div>

                <form onSubmit={onSubmit} className="mt-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <Label htmlFor="fullName" className="text-gray-700 font-medium">Full Name</Label>
                            <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1.5 border-gray-300 focus:border-green-500 focus:ring-green-500" required />
                        </div>
                        <div>
                            <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 border-gray-300 focus:border-green-500 focus:ring-green-500" required />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="contactNumber" className="text-gray-700 font-medium">Phone Number</Label>
                        <Input id="contactNumber" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} className="mt-1.5 border-gray-300 focus:border-green-500 focus:ring-green-500" placeholder="e.g., 9800000000" />
                    </div>
                    <div>
                        <Label className="text-gray-700 font-medium">Role</Label>
                        <div className="mt-1.5 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-gray-700 text-sm">
                            {role === "admin" ? "Admin" : "Customer"}
                        </div>
                    </div>
                    <Button type="submit" disabled={updating} className="bg-green-700 hover:bg-green-800 text-white font-medium py-2.5 px-6">
                        {updating ? "Updating..." : "Update Profile"}
                    </Button>
                </form>
            </div>
        </div>
    );
}