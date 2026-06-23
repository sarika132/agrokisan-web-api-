"use client";

import Image from "next/image";
import Link from "next/link";
import bg from "@/app/assets/bg.jpg";
import plantImg from "@/app/assets/plant.jpg";
import { Eye, Lock, MailIcon, Phone, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { handleRegisterUser } from "@/lib/actions/auth-action";
import {
    RegisterFormData,
    registerSchema,
} from "../../_schema/schema";

export default function RegisterPage() {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState("");
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = (data: RegisterFormData) => {
        setError("");

        startTransition(async () => {
            try {
                const result = await handleRegisterUser(data);

                if (result.success) {
                    router.push("/login");
                } else {
                    setError(result.message || "Registration failed");
                }
            } catch (error: any) {
                setError(error?.message || "Registration failed");
            }
        });
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center px-4 py-10">
            {/* BACKGROUND IMAGE */}
            <Image
                src={bg}
                alt="background"
                fill
                className="object-cover -z-10 opacity-40"
            />

            {/* MAIN CONTAINER */}
            <div className="flex w-full max-w-5xl shadow-2xl rounded-xl overflow-hidden">
                {/* LEFT SIDE IMAGE */}
                <div className="hidden md:block w-1/2 relative">
                    <Image
                        src={plantImg}
                        alt="plant"
                        fill
                        className="object-cover"
                    />

                    <div className="absolute inset-0 bg-black/20"></div>

                    <div className="absolute top-10 left-10 w-16 h-16 border border-white rounded-full"></div>

                    <div className="absolute bottom-10 right-10 w-20 h-20 border border-white rounded-full"></div>
                </div>

                {/* RIGHT SIDE FORM */}
                <div className="w-full md:w-1/2 bg-[#5f7f5a] text-white p-10">
                    {/* HEADING */}
                    <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold">
                            Create Your Account Here.
                        </h3>

                        <p className="text-sm text-white/80 mt-1">
                            Fill your details to register
                        </p>
                    </div>

                    {/* GLOBAL ERROR */}
                    {error && (
                        <div className="mb-4 text-red-300 border border-red-300 p-2 rounded text-sm">
                            {error}
                        </div>
                    )}

                    {/* FORM */}
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        {/* FULL NAME */}
                        <div>
                            <label className="text-sm">Full Name</label>

                            <div className="flex items-center bg-white rounded px-3 py-2 mt-1 text-black">
                                <User
                                    size={18}
                                    className="text-gray-500 mr-2"
                                />

                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    className="w-full outline-none"
                                    {...register("fullName")}
                                />
                            </div>

                            {errors.fullName && (
                                <p className="text-red-300 text-sm mt-1">
                                    {errors.fullName.message}
                                </p>
                            )}
                        </div>

                        {/* CONTACT NUMBER */}
                        <div>
                            <label className="text-sm">
                                Contact Number
                            </label>

                            <div className="flex items-center bg-white rounded px-3 py-2 mt-1 text-black">
                                <Phone
                                    size={18}
                                    className="text-gray-500 mr-2"
                                />

                                <input
                                    type="text"
                                    placeholder="Contact Number"
                                    className="w-full outline-none"
                                    {...register("contactNumber")}
                                />
                            </div>

                            {errors.contactNumber && (
                                <p className="text-red-300 text-sm mt-1">
                                    {errors.contactNumber.message}
                                </p>
                            )}
                        </div>

                        {/* EMAIL */}
                        <div>
                            <label className="text-sm">Email</label>

                            <div className="flex items-center bg-white rounded px-3 py-2 mt-1 text-black">
                                <MailIcon
                                    size={18}
                                    className="text-gray-500 mr-2"
                                />

                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full outline-none"
                                    {...register("email")}
                                />
                            </div>

                            {errors.email && (
                                <p className="text-red-300 text-sm mt-1">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* PASSWORD */}
                        <div>
                            <label className="text-sm">Password</label>

                            <div className="flex items-center bg-white rounded px-3 py-2 mt-1 text-black">
                                <Lock
                                    size={18}
                                    className="text-gray-500 mr-2"
                                />

                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="w-full outline-none"
                                    {...register("password")}
                                />

                                <Eye
                                    size={18}
                                    className="text-gray-500 cursor-pointer"
                                />
                            </div>

                            {errors.password && (
                                <p className="text-red-300 text-sm mt-1">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* CONFIRM PASSWORD */}
                        <div>
                            <label className="text-sm">
                                Confirm Password
                            </label>

                            <div className="flex items-center bg-white rounded px-3 py-2 mt-1 text-black">
                                <Lock
                                    size={18}
                                    className="text-gray-500 mr-2"
                                />

                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    className="w-full outline-none"
                                    {...register("confirmPassword")}
                                />

                                <Eye
                                    size={18}
                                    className="text-gray-500 cursor-pointer"
                                />
                            </div>

                            {errors.confirmPassword && (
                                <p className="text-red-300 text-sm mt-1">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        {/* TERMS */}
                        <div className="flex items-start gap-2 text-sm mt-2">
                            <input
                                type="checkbox"
                                className="mt-1"
                            />

                            <p className="text-white/90">
                                I agree to AgroKisan Terms and
                                Conditions and Privacy Policy.
                            </p>
                        </div>

                        {/* BUTTON */}
                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full bg-white text-[#5f7f5a] font-semibold py-2 rounded hover:bg-gray-200 transition disabled:opacity-50"
                        >
                            {isPending
                                ? "Registering..."
                                : "Register"}
                        </button>
                    </form>

                    {/* LOGIN */}
                    <p className="text-center mt-4 text-sm">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="text-white font-bold underline"
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
