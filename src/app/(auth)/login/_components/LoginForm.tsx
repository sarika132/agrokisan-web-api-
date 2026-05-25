"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "@/app/assets/logo.png";
import farm from "@/app/assets/farm.jpg";
import { Eye, Mail, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { LoginFormData, loginSchema } from "../../_schema/schema";
import { zodResolver } from "@hookform/resolvers/zod";

export default function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const onSubmit = (data: LoginFormData) => {
        console.log(data);
    };

    return (
        <div className="min-h-screen flex">

            {/* LEFT SIDE IMAGE */}
            <div className="hidden md:flex w-1/2 relative bg-green-800 items-center justify-center">
                <div className="absolute inset-0">
                    <Image
                        src={farm}
                        alt="Farm"
                        fill
                        className="object-cover opacity-80"
                    />
                </div>
            </div>

            {/* RIGHT SIDE FORM */}
            <div className="w-full md:w-1/2 flex items-center justify-center bg-white px-8">

                <div className="w-full max-w-md">

                    {/* Title */}
                    <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold text-gray-800">
                            Welcome Back
                        </h3>
                        <p className="text-gray-500 mt-1">
                            Login to your account
                        </p>
                    </div>

                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <Image src={logo} alt="logo" width={120} height={60} />
                    </div>

                    {/* FORM */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                        {/* EMAIL */}
                        <div>
                            <label className="block mb-2 font-medium">
                                Phone Number / Email
                            </label>

                            <div className="flex items-center border rounded-lg px-3 py-3 border-gray-400 focus-within:border-green-700">
                                <Mail className="text-gray-400 mr-2" size={20} />
                                <input
                                    type="text"
                                    placeholder="Enter email or phone"
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

                        {/* PASSWORD */}
                        <div>
                            <label className="block mb-2 font-medium">
                                Password
                            </label>

                            <div className="flex items-center border rounded-lg px-3 py-3 border-gray-400 focus-within:border-green-700">
                                <Lock className="text-gray-400 mr-2" size={20} />
                                <input
                                    type="password"
                                    placeholder="Enter password"
                                    className="w-full outline-none"
                                    {...register("password")}
                                />
                                <Eye className="text-gray-400 cursor-pointer" size={20} />
                            </div>

                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* BUTTON */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
                        >
                            {isSubmitting ? "Logging in..." : "LOGIN"}
                        </button>
                    </form>

                    {/* REGISTER LINK */}
                    <p className="text-center mt-6">
                        Don’t have an account?{" "}
                        <Link href="/register">
                            <span className="text-red-500 font-semibold cursor-pointer hover:underline">
                                Register
                            </span>
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    );
}