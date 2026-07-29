"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import {
    ForgotPasswordFormData,
    forgotPasswordSchema,
} from "../../_schema/schema";
import { handleRequestPasswordReset } from "@/lib/actions/auth-action";

export default function ForgotPasswordForm() {
    const [submitted, setSubmitted] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: "" },
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        const result = await handleRequestPasswordReset(data.email);
        if (result.success) {
            toast.success("Reset link sent! Check your email.", { duration: 2000 });
            setSubmitted(true);
        } else {
            toast.error(result.message, { duration: 2000 });
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg">
                <div className="text-center mb-6">
                    <h3>Forgot Password?</h3>
                    <p className="text-gray-500 mt-1">
                        Enter your email and we'll send you a reset link
                    </p>
                </div>

                {submitted ? (
                    <div className="text-center">
                        <p className="text-gray-600 mb-6">
                            If an account exists for that email, a reset link has been sent.
                            Check your inbox (and spam folder).
                        </p>
                        <Link href="/login">
                            <span className="text-cyan-500 font-medium hover:underline cursor-pointer">
                                Back to Login
                            </span>
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div>
                            <label className="block mb-2 font-medium">Email Address</label>
                            <div className="flex items-center border rounded-lg px-3 py-3 border-gray-400 focus-within:border-cyan-500">
                                <Mail className="text-gray-400 mr-2" size={20} />
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full outline-none"
                                    {...register("email")}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition"
                        >
                            {isSubmitting ? "Sending..." : "Send Reset Link"}
                        </button>

                        <p className="text-center">
                            <Link href="/login">
                                <span className="text-green-500 font-medium hover:underline cursor-pointer">
                                    Back to Login
                                </span>
                            </Link>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
}