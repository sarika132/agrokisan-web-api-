"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/UI_UX/button";
import { Input } from "@/components/UI_UX/input";
import { Label } from "@/components/UI_UX/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/UI_UX/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/UI_UX/select";

import { handleCreateUser, handleUpdateUser } from "@/lib/actions/admin/user-action";

// single schema - password optional, only required on create (handled in onSubmit)
const userFormSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email address"),
    contactNumber: z
        .string()
        .min(10, "Contact number must be at least 10 digits")
        .regex(/^[0-9]+$/, "Contact number must contain only digits"),
    password: z.string().optional(),
    role: z.enum(["user", "admin"]),
});

type UserFormData = z.infer<typeof userFormSchema>;

interface User {
    _id: string;
    fullName: string;
    email: string;
    contactNumber: string;
    role: string;
}

interface UserFormDialogProps {
    open: boolean;
    onClose: () => void;
    user?: User | null;
}

export default function UserFormDialog({ open, onClose, user }: UserFormDialogProps) {
    const router = useRouter();
    const isEdit = !!user;

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<UserFormData>({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            fullName: "",
            email: "",
            contactNumber: "",
            password: "",
            role: "user",
        },
    });

    // prefill form when editing, reset when creating
    useEffect(() => {
        if (user) {
            reset({
                fullName: user.fullName,
                email: user.email,
                contactNumber: user.contactNumber,
                role: user.role as "user" | "admin",
                password: "",
            });
        } else {
            reset({
                fullName: "",
                email: "",
                contactNumber: "",
                password: "",
                role: "user",
            });
        }
    }, [user, reset]);

    const onSubmit = async (data: UserFormData) => {
        const formData = new FormData();
        formData.append("fullName", data.fullName);
        formData.append("email", data.email);
        formData.append("contactNumber", data.contactNumber);
        formData.append("role", data.role);
        if (data.password) {
            formData.append("password", data.password);
        }

        const result = isEdit
            ? await handleUpdateUser(user!._id, formData)
            : await handleCreateUser(formData);

        if (result.success) {
            toast.success(
                isEdit ? "User updated successfully!" : "User created successfully!",
                { duration: 1500 },
            );
            onClose();
            router.refresh();
        } else {
            toast.error(result.message || "Something went wrong", { duration: 1500 });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Edit User" : "Add New User"}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
                    {/* Full Name */}
                    <div>
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input id="fullName" {...register("fullName")} className="mt-1.5" />
                        {errors.fullName && (
                            <p className="text-sm text-red-600 mt-1">{errors.fullName.message}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" {...register("email")} className="mt-1.5" />
                        {errors.email && (
                            <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Contact Number */}
                    <div>
                        <Label htmlFor="contactNumber">Contact Number</Label>
                        <Input id="contactNumber" {...register("contactNumber")} className="mt-1.5" />
                        {errors.contactNumber && (
                            <p className="text-sm text-red-600 mt-1">{errors.contactNumber.message}</p>
                        )}
                    </div>

                    {/* Role */}
                    <div>
                        <Label>Role</Label>
                        <Select
                            onValueChange={(value) =>
                                setValue("role", value as "user" | "admin", {
                                    shouldValidate: true,
                                })
                            }
                            defaultValue={user?.role || "user"}
                        >
                            <SelectTrigger className="mt-1.5">
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.role && (
                            <p className="text-sm text-red-600 mt-1">{errors.role.message}</p>
                        )}
                    </div>

                    {/* Password - only shown on create */}
                    {!isEdit && (
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                {...register("password")}
                                className="mt-1.5"
                            />
                            {errors.password && (
                                <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
                            )}
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-cyan-500 hover:bg-cyan-600 flex-1"
                        >
                            {isSubmitting
                                ? isEdit
                                    ? "Updating..."
                                    : "Creating..."
                                : isEdit
                                    ? "Update User"
                                    : "Create User"}
                        </Button>
                        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                            Cancel
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}