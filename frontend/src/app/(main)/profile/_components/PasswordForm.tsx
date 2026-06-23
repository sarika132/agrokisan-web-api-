"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/UI_UX/button";
import { Input } from "@/components/UI_UX/input";
import { Label } from "@/components/UI_UX/label";
import { changePasswordSchema, ChangePasswordFormData } from "../_schema/schema";
import { handleUpdateProfile } from "@/lib/actions/auth-action";

export default function PasswordForm() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ChangePasswordFormData>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const onSubmit = async (data: ChangePasswordFormData) => {
        const formData = new FormData();
        // ✅ FIXED: Backend expects "currentpassword" (all lowercase)
        formData.append("currentpassword", data.currentPassword);
        formData.append("password", data.newPassword);

        const result = await handleUpdateProfile(formData);
        if (result.success) {
            toast.success("Password updated successfully!", { duration: 1500 });
            reset();
        } else {
            toast.error(result.message || "Password update failed", { duration: 1500 });
        }
    };

    return (
        <div className="bg-white rounded-xl border border-green-100 p-8 shadow-sm">
            <h3 className="text-sm font-bold text-green-700 uppercase tracking-wide mb-6">
                Change Password
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-5">
                <div>
                    <Label htmlFor="currentPassword" className="text-gray-700">
                        Current Password
                    </Label>
                    <Input
                        id="currentPassword"
                        type="password"
                        {...register("currentPassword")}
                        className="mt-1.5 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                    {errors.currentPassword && (
                        <p className="text-sm text-red-600 mt-1">{errors.currentPassword.message}</p>
                    )}
                </div>

                <div>
                    <Label htmlFor="newPassword" className="text-gray-700">
                        New Password
                    </Label>
                    <Input
                        id="newPassword"
                        type="password"
                        {...register("newPassword")}
                        className="mt-1.5 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                    {errors.newPassword && (
                        <p className="text-sm text-red-600 mt-1">{errors.newPassword.message}</p>
                    )}
                </div>

                <div>
                    <Label htmlFor="confirmPassword" className="text-gray-700">
                        Confirm New Password
                    </Label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        {...register("confirmPassword")}
                        className="mt-1.5 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                    {errors.confirmPassword && (
                        <p className="text-sm text-red-600 mt-1">{errors.confirmPassword.message}</p>
                    )}
                </div>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-green-700 hover:bg-green-800 text-white"
                >
                    {isSubmitting ? "Updating..." : "Update Password"}
                </Button>
            </form>
        </div>
    );
}