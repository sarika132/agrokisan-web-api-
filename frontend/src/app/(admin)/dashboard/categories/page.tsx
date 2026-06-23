"use client";

import { useState } from "react";
import { PlusIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/UI_UX/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/UI_UX/dialog";
import { Input } from "@/components/UI_UX/input";
import { Label } from "@/components/UI_UX/label";

const dummyCategories = [
    { _id: "1", name: "Seed Variety", description: "High-quality seeds for all types of crops" },
    { _id: "2", name: "Fertilizers and Pesticides", description: "Crop nutrition and protection products" },
    { _id: "3", name: "Agriculture Tools", description: "Hand tools and small implements for farming" },
    { _id: "4", name: "Agriculture Equipment", description: "Large machinery and farming equipment" },
];

export default function CategoriesPage() {
    const [categories] = useState(dummyCategories);
    const [open, setOpen] = useState(false);

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-green-800">Collections</h1>
                <Button
                    className="bg-green-700 hover:bg-green-800 flex items-center gap-2"
                    onClick={() => setOpen(true)}
                >
                    <PlusIcon className="h-4 w-4" />
                    Add Collection
                </Button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-green-100">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-green-100">
                            <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Name</th>
                            <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Description</th>
                            <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category._id} className="border-b border-green-50 last:border-0 hover:bg-green-50/50">
                                <td className="px-6 py-4 text-sm font-medium text-gray-800">{category.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{category.description}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <button className="text-green-600 hover:text-green-800">
                                            <PencilIcon className="h-4 w-4" />
                                        </button>
                                        <button className="text-red-500 hover:text-red-700">
                                            <Trash2Icon className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Category Dialog */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-green-800">Add Collection</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-2">
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-gray-700">Name</Label>
                            <Input
                                id="name"
                                placeholder="Enter collection name"
                                className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description" className="text-gray-700">Description</Label>
                            <textarea
                                id="description"
                                placeholder="Enter description"
                                className="border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 resize-none h-24"
                            />
                        </div>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button
                            className="bg-green-700 hover:bg-green-800 flex-1"
                            onClick={() => setOpen(false)}
                        >
                            Create
                        </Button>
                        <DialogClose asChild>
                            <Button variant="outline" className="flex-1">Cancel</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}