"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock } from "lucide-react";
import { toast } from "sonner";
import {
    ResetPasswordFormData,
    resetPasswordSchema,
} from "../../_schema/schema";
import { handleResetPassword } from "@/lib/actions/auth-action";

export default function ResetPasswordForm({ token }: { token: string }) {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { password: "", confirmPassword: "" },
    });

    const onSubmit = async (data: ResetPasswordFormData) => {
        if (!token) {
            toast.error("Reset link is invalid or missing a token.", {
                duration: 2000,
            });
            return;
        }

        const result = await handleResetPassword(token, data.password);
        if (result.success) {
            toast.success("Password reset successfully!", { duration: 1500 });
            setTimeout(() => router.push("/login"), 1500);
        } else {
            toast.error(result.message, { duration: 2000 });
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg">
                <div className="text-center mb-6">
                    <h3>Reset Password</h3>
                    <p className="text-gray-500 mt-1">Enter your new password below</p>
                </div>

                {!token ? (
                    <div className="text-center">
                        <p className="text-red-500 mb-4">
                            This reset link is invalid or has expired.
                        </p>
                        <Link href="/forgot-password">
                            <span className="text-cyan-500 font-medium hover:underline cursor-pointer">
                                Request a new reset link
                            </span>
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div>
                            <label className="block mb-2 font-medium">New Password</label>
                            <div className="flex items-center border rounded-lg px-3 py-3 border-gray-400 focus-within:border-cyan-500">
                                <Lock className="text-gray-400 mr-2" size={20} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    className="w-full outline-none"
                                    {...register("password")}
                                />
                                <div onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? (
                                        <EyeOff className="text-gray-400 cursor-pointer" size={20} />
                                    ) : (
                                        <Eye className="text-gray-400 cursor-pointer" size={20} />
                                    )}
                                </div>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">
                                Confirm New Password
                            </label>
                            <div className="flex items-center border rounded-lg px-3 py-3 border-gray-400 focus-within:border-cyan-500">
                                <Lock className="text-gray-400 mr-2" size={20} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Confirm new password"
                                    className="w-full outline-none"
                                    {...register("confirmPassword")}
                                />
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                    </form>
                )}
            </div>
        </div>
    );
}