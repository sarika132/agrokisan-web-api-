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
import { handleCreateCollection, handleUpdateCollection } from "@/lib/actions/admin/collection-action";

// Predefined collection names – customize as needed
const COLLECTION_NAMES = [
    "Spring Collection",
    "Summer Collection",
    "Autumn Collection",
    "Winter Collection",
    "Festival Special",
    "Organic Series",
    "Heritage",
] as const;

type CollectionName = typeof COLLECTION_NAMES[number];

const collectionFormSchema = z.object({
    name: z.enum(COLLECTION_NAMES, {
        message: "Please select a valid collection",
    }),
    description: z.string().optional(),
});

type CollectionFormData = z.infer<typeof collectionFormSchema>;

interface Collection {
    _id: string;
    name: string;
    description?: string;
}

interface CollectionFormDialogProps {
    open: boolean;
    onClose: () => void;
    collection?: Collection | null;
}

export default function CollectionFormDialog({ open, onClose, collection }: CollectionFormDialogProps) {
    const router = useRouter();
    const isEdit = !!collection;

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CollectionFormData>({
        resolver: zodResolver(collectionFormSchema),
        defaultValues: {
            name: undefined,
            description: "",
        },
    });

    useEffect(() => {
        if (collection) {
            reset({
                name: collection.name as CollectionName,
                description: collection.description || "",
            });
        } else {
            reset({
                name: undefined,
                description: "",
            });
        }
    }, [collection, reset]);

    const onSubmit = async (data: CollectionFormData) => {
        const formData = new FormData();
        formData.append("name", data.name);
        if (data.description) formData.append("description", data.description);

        const result = isEdit
            ? await handleUpdateCollection(collection!._id, formData)
            : await handleCreateCollection(formData);

        if (result.success) {
            toast.success(
                isEdit ? "Collection updated successfully!" : "Collection created successfully!",
                { duration: 1500 }
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
                    <DialogTitle>{isEdit ? "Edit Collection" : "Add New Collection"}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
                    {/* Collection Name - select */}
                    <div>
                        <Label>Collection Name</Label>
                        <Select
                            onValueChange={(value) =>
                                setValue("name", value as CollectionName, {
                                    shouldValidate: true,
                                })
                            }
                            defaultValue={collection?.name}
                        >
                            <SelectTrigger className="mt-1.5">
                                <SelectValue placeholder="Select collection" />
                            </SelectTrigger>
                            <SelectContent>
                                {COLLECTION_NAMES.map((name) => (
                                    <SelectItem key={name} value={name}>
                                        {name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.name && (
                            <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            {...register("description")}
                            className="mt-1.5"
                            placeholder="Enter collection description"
                        />
                        {errors.description && (
                            <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
                        )}
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-cyan-500 hover:bg-cyan-600 flex-1"
                        >
                            {isSubmitting
                                ? isEdit ? "Updating..." : "Creating..."
                                : isEdit ? "Update Collection" : "Create Collection"}
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