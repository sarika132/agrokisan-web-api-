"use client";
import Image from "next/image";
import Link from "next/link";
import logo from "@/app/assets/logo.png";
import { Eye, Mail, Lock, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { LoginFormData, loginSchema } from "../../_schema/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { handleLoginUser } from "@/lib/actions/auth-action";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/lib/context/AuthContext";


export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    // grab redirect url if user was sent here from a specific page 
    const redirectUrl = searchParams.get("redirect");

    const { checkAuth } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        }

    });

    const onSubmit = async (data: LoginFormData) => {
        const result = await handleLoginUser(data);
        if (result.success) {
            await checkAuth();
            toast.success("Login successful!", {
                duration: 1500,
                style: {
                    background: "#f0fdf4",
                    color: "#16a34a",
                    border: "1px solid #16a34a",
                },
            });
            // redirect based on role - admin goes to dashboard, regular user goes back to where they came from or home
            const role = result.data.user.role;
            if (role === "admin") {
                setTimeout(() => router.push("/dashboard"), 1500);
            } else {
                setTimeout(() => router.push(redirectUrl || "/"), 1500);
            }
        } else {
            toast.error(result.message, {
                duration: 1500,
                style: {
                    background: "#fef2f2",
                    color: "#dc2626",
                    border: "1px solid #dc2626",
                },
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

            <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg">

                {/* Logo */}
                <div className="flex justify-center mb-4">
                    <Image
                        src={logo}
                        alt="RentExpress Logo"
                        width={180}
                        height={100}
                    />
                </div>

                {/* Heading */}
                <div className="text-center mb-6">
                    <h3>Welcome Back!!!</h3>
                    <p className="text-gray-500 mt-1">
                        Login to your account
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                    {/* Email */}
                    <div>
                        <label className="block mb-2 font-medium">
                            Email Address
                        </label>

                        <div className="flex items-center border rounded-lg px-3 py-3  border-gray-400 focus-within:border-cyan-500">
                            <Mail className="text-gray-400 mr-2" size={20} />

                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full outline-none"
                                {...register("email")}
                            />
                        </div>
                        {errors.email &&
                            (
                                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                            )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block mb-2 font-medium">
                            Password
                        </label>

                        <div className="flex items-center border rounded-lg px-3 py-3 border-gray-400 focus-within:border-cyan-500">
                            <Lock className="text-gray-400 mr-2" size={20} />

                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                className="w-full outline-none"
                                {...register("password")}
                            />
                            <div onClick={() => setShowPassword(!showPassword)}>
                                {showPassword
                                    ? <EyeOff className="text-gray-400 cursor-pointer" size={20} />
                                    : <Eye className="text-gray-400 cursor-pointer" size={20} />
                                }
                            </div>
                        </div>
                        {errors.password &&
                            (
                                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                            )}
                    </div>
                    {/* forget password */}
                    <div className="text-right -mt-3">
                        <Link href="/forgot-password">
                            <span className="text-red-500 text-sm font-medium hover:underline cursor-pointer">
                                Forgot password?
                            </span>
                        </Link>
                    </div>
                    {/* Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
                    >
                        {isSubmitting ? "Logging in..." : "login"}
                    </button>
                </form>

                {/* Register */}
                <p className="text-center mt-6">
                    Don’t have an account?<Link href="/register"><span className="text-green-800 font-medium hover:underline cursor-pointer"> Register</span>
                    </Link>

                </p>

            </div>
        </div>
    );
}