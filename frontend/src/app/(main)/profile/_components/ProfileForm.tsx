"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useState, useRef } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { UserIcon } from "lucide-react";

import { Button } from "@/components/UI_UX/button";
import { Input } from "@/components/UI_UX/input";
import { Label } from "@/components/UI_UX/label";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/UI_UX/alert-dialog";
import { updateProfileSchema, UpdateProfileFormData } from "../_schema/schema";
import { handleUpdateProfile } from "@/lib/actions/auth-action";
import { useAuth } from "@/lib/context/AuthContext";

export default function ProfileForm({ user }: { user: any }) {
    const { checkAuth } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    // stores the validated form data temporarily while waiting for confirmation
    const [pendingData, setPendingData] = useState<UpdateProfileFormData | null>(null);

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<UpdateProfileFormData>({
        resolver: zodResolver(updateProfileSchema),
        values: {
            fullName: user?.fullName || "",
            contactNumber: user?.contactNumber || "",
        },
    });

    const handleImageChange = (
        file: File | undefined,
        onChange: (file: File | undefined) => void,
    ) => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
        }
        onChange(file);
    };

    const handleDismissImage = (onChange?: (file: File | undefined) => void) => {
        setPreviewImage(null);
        onChange?.(undefined);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleCancel = () => {
        handleDismissImage();
        reset({
            fullName: user?.fullName || "",
            contactNumber: user?.contactNumber || "",
        });
        setIsEditing(false);
    };

    // step 1 - form validates and stores data, dialog opens
    const onSubmit = (data: UpdateProfileFormData) => {
        setPendingData(data);
    };

    // step 2 - user confirms in dialog, actual API call happens
    const handleConfirmSave = async () => {
        if (!pendingData) return;

        const formData = new FormData();
        formData.append("fullName", pendingData.fullName);
        formData.append("contactNumber", pendingData.contactNumber);
        if (pendingData.image) {
            formData.append("profileImage", pendingData.image);
        }

        const result = await handleUpdateProfile(formData);
        if (result.success) {
            toast.success("Profile updated successfully!", { duration: 1500 });
            handleDismissImage();
            await checkAuth();
            setIsEditing(false);
            setPendingData(null);
        } else {
            toast.error(result.message || "Profile update failed", { duration: 1500 });
            setPendingData(null);
        }
    };

    const currentImageSrc =
        previewImage ||
        (user?.imageUrl ? process.env.NEXT_PUBLIC_BASE_URL + user.imageUrl : null);

    return (
        <div className="bg-white rounded-xl border border-green-100 p-8 mb-5 shadow-sm">
            {/* Avatar + name/email header */}
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-green-100">
                <div
                    onClick={() => isEditing && fileInputRef.current?.click()}
                    className={`relative h-20 w-20 rounded-full bg-green-100 flex items-center justify-center overflow-hidden ${isEditing ? "cursor-pointer ring-2 ring-green-500" : ""
                        }`}
                >
                    {currentImageSrc ? (
                        <Image src={currentImageSrc} alt="Profile" fill className="object-cover" />
                    ) : (
                        <UserIcon className="h-8 w-8 text-green-600" />
                    )}
                </div>
                <div>
                    <h4 className="font-bold text-gray-800">{user?.fullName}</h4>
                    <p className="text-gray-500 text-sm">{user?.email}</p>
                </div>

                <Controller
                    name="image"
                    control={control}
                    render={({ field: { onChange } }) => (
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".jpg,.jpeg,.png"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleImageChange(e.target.files?.[0], onChange)}
                            className="hidden"
                        />
                    )}
                />
            </div>
            {errors.image && (
                <p className="text-sm text-red-600 -mt-6 mb-4">{errors.image.message}</p>
            )}

            <h3 className="text-sm font-bold text-green-700 uppercase tracking-wide mb-5">
                Profile Details
            </h3>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Full Name */}
                    <div>
                        <Label htmlFor="fullName" className="text-gray-700">Full Name</Label>
                        <Input
                            id="fullName"
                            disabled={!isEditing}
                            {...register("fullName")}
                            className="mt-1.5 border-gray-300 focus:border-green-500 focus:ring-green-500"
                        />
                        {errors.fullName && (
                            <p className="text-sm text-red-600 mt-1">{errors.fullName.message}</p>
                        )}
                    </div>

                    {/* Email (read-only) */}
                    <div>
                        <Label htmlFor="email" className="text-gray-700">Email</Label>
                        <Input
                            id="email"
                            value={user?.email || ""}
                            disabled
                            className="mt-1.5 bg-gray-50"
                        />
                    </div>

                    {/* Phone Number */}
                    <div>
                        <Label htmlFor="contactNumber" className="text-gray-700">Phone Number</Label>
                        <Input
                            id="contactNumber"
                            disabled={!isEditing}
                            {...register("contactNumber")}
                            className="mt-1.5 border-gray-300 focus:border-green-500 focus:ring-green-500"
                        />
                        {errors.contactNumber && (
                            <p className="text-sm text-red-600 mt-1">{errors.contactNumber.message}</p>
                        )}
                    </div>

                </div>

                {isEditing && (
                    <div className="mt-8 flex gap-3">
                        {/* AlertDialog wraps Save Changes button */}
                        <AlertDialog open={!!pendingData} onOpenChange={(open) => !open && setPendingData(null)}>
                            <AlertDialogTrigger asChild>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-green-700 hover:bg-green-800"
                                >
                                    {isSubmitting ? "Saving..." : "Save Changes"}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-green-800">Save profile changes?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Your profile information will be updated with the new details.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleConfirmSave}
                                        className="bg-green-700 hover:bg-green-800 text-white"
                                    >
                                        Save
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <Button type="button" variant="outline" onClick={handleCancel}>
                            Cancel
                        </Button>
                    </div>
                )}
            </form>

            {!isEditing && (
                <div className="mt-8">
                    <Button
                        type="button"
                        className="bg-green-700 hover:bg-green-800"
                        onClick={() => setIsEditing(true)}
                    >
                        Edit Profile
                    </Button>
                </div>
            )}
        </div>
    );
}