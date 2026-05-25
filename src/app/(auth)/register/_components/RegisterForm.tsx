"use client";

import Image from "next/image";
import Link from "next/link";
import bg from "@/app/assets/bg.jpg";
import plantImg from "@/app/assets/plant.jpg";
import { Eye, Lock, MailIcon, Phone, User } from "lucide-react";
import { useForm } from "react-hook-form";

type FormData = {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export default function RegisterPage() {

    const {
        register,
        handleSubmit,
        formState: { isSubmitting }
    } = useForm<FormData>();

    const onSubmit = (data: FormData) => {
        console.log("REGISTER DATA:", data);
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

                    {/* FORM */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                        {/* FIRST NAME */}
                        <div>
                            <label className="text-sm">First Name</label>

                            <div className="flex items-center bg-white rounded px-3 py-2 mt-1 text-black">
                                <User size={18} className="text-gray-500 mr-2" />
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    className="w-full outline-none"
                                    {...register("firstName")}
                                />
                            </div>

                        </div>

                        {/* LAST NAME */}
                        <div>
                            <label className="text-sm">Last Name</label>

                            <div className="flex items-center bg-white rounded px-3 py-2 mt-1 text-black">
                                <User size={18} className="text-gray-500 mr-2" />
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    className="w-full outline-none"
                                    {...register("lastName")}
                                />
                            </div>

                        </div>

                        {/* PHONE */}
                        <div>
                            <label className="text-sm">Phone Number</label>

                            <div className="flex items-center bg-white rounded px-3 py-2 mt-1 text-black">
                                <Phone size={18} className="text-gray-500 mr-2" />
                                <input
                                    type="text"
                                    placeholder="Phone Number"
                                    className="w-full outline-none"
                                    {...register("phone")}
                                />
                            </div>

                        </div>

                        {/* EMAIL */}
                        <div>
                            <label className="text-sm">Email</label>

                            <div className="flex items-center bg-white rounded px-3 py-2 mt-1 text-black">
                                <MailIcon size={18} className="text-gray-500 mr-2" />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full outline-none"
                                    {...register("email")}
                                />
                            </div>

                        </div>

                        {/* PASSWORD */}
                        <div>
                            <label className="text-sm">Password</label>

                            <div className="flex items-center bg-white rounded px-3 py-2 mt-1 text-black">
                                <Lock size={18} className="text-gray-500 mr-2" />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="w-full outline-none"
                                    {...register("password")}
                                />
                                <Eye size={18} className="text-gray-500 cursor-pointer" />
                            </div>

                        </div>

                        {/* CONFIRM PASSWORD */}
                        <div>
                            <label className="text-sm">Confirm Password</label>

                            <div className="flex items-center bg-white rounded px-3 py-2 mt-1 text-black">
                                <Lock size={18} className="text-gray-500 mr-2" />
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    className="w-full outline-none"
                                    {...register("confirmPassword")}
                                />
                                <Eye size={18} className="text-gray-500 cursor-pointer" />
                            </div>

                        </div>

                        {/* TERMS CHECKBOX */}
                        <div className="flex items-start gap-2 text-sm mt-2">
                            <input type="checkbox" className="mt-1" />
                            <p className="text-white/90">
                                I agree to AgroKisan Terms and conditions and privacy Policy.
                            </p>
                        </div>

                        {/* BUTTON */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-white text-[#5f7f5a] font-semibold py-2 rounded hover:bg-gray-200 transition"
                        >
                            {isSubmitting ? "Registering..." : "Register"}
                        </button>

                    </form>

                    {/* LOGIN LINK */}
                    <p className="text-center mt-4 text-sm">
                        Already have an account?{" "}
                        <Link href="/login" className="text-white font-bold underline">
                            Login
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    );
}