"use client";

import { useState } from "react";
import Image from "next/image";
import heroImage from "@/app/assets/hero_image.jpg"; // replace with your agriculture hero image
import { Button } from "@/components/UI_UX/button";
import { Calendar } from "@/components/UI_UX/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/UI_UX/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/UI_UX/select";
import { CalendarIcon, SearchIcon, ChevronDownIcon } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";

const categories = [
    "Seed Variety",
    "Fertilizers and Pesticides",
    "Agriculture Tools",
    "Agriculture Equipment",
];

export default function HeroSection() {
    const { user } = useAuth();

    const [fromDateOpen, setFromDateOpen] = useState(false);
    const [toDateOpen, setToDateOpen] = useState(false);
    const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
    const [toDate, setToDate] = useState<Date | undefined>(undefined);
    const [category, setCategory] = useState<string>("");

    const handleSearch = () => {
        // search logic will be wired once product listing page exists
        console.log({ fromDate, toDate, category });
    };

    return (
        <div className="relative h-120 w-full">
            {/* Background image */}
            <Image src={heroImage} alt="Agriculture" fill priority className="object-cover" />
            <div className="absolute inset-0 bg-black/30" />

            {/* Content */}
            <div className="relative z-10 flex h-full flex-col items-center justify-start pt-10 px-4 text-center text-white">
                <p className="text-2xl font-medium mb-2">
                    Welcome to AgroKisan <span className="font-medium text-green-300">{user?.fullName?.split(" ")[0]}</span>
                </p>
                <p className="text-green-100 mb-8">Choose from our wide selection of quality agricultural products for every farming need</p>

                {/* Search Card */}
                <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-end w-full max-w-3xl text-gray-900">
                    {/* From Date */}
                    <div className="flex-1 text-left">
                        <label className="text-sm font-medium block mb-1 text-gray-700">From Date</label>
                        <Popover open={fromDateOpen} onOpenChange={setFromDateOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-between font-normal border-gray-300 hover:border-green-400">
                                    <span className="flex items-center text-gray-500">
                                        <CalendarIcon className="mr-2 h-4 w-4 text-green-600" />
                                        {fromDate ? fromDate.toLocaleDateString() : "mm/dd/yy"}
                                    </span>
                                    <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={fromDate}
                                    onSelect={(date) => {
                                        setFromDate(date);
                                        setFromDateOpen(false);
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* To Date */}
                    <div className="flex-1 text-left">
                        <label className="text-sm font-medium block mb-1 text-gray-700">To Date</label>
                        <Popover open={toDateOpen} onOpenChange={setToDateOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-between font-normal border-gray-300 hover:border-green-400">
                                    <span className="flex items-center text-gray-500">
                                        <CalendarIcon className="mr-2 h-4 w-4 text-green-600" />
                                        {toDate ? toDate.toLocaleDateString() : "mm/dd/yy"}
                                    </span>
                                    <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={toDate}
                                    onSelect={(date) => {
                                        setToDate(date);
                                        setToDateOpen(false);
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Category */}
                    <div className="flex-1 text-left">
                        <label className="text-sm font-medium block mb-1 text-gray-700">Collection</label>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger className="w-full border-gray-300 focus:border-green-500 focus:ring-green-500">
                                <SelectValue placeholder="All collections" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat} value={cat}>
                                        {cat}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Search Button */}
                    <Button
                        onClick={handleSearch}
                        className="bg-green-700 hover:bg-green-800 h-9 px-6 flex items-center gap-2"
                    >
                        <SearchIcon className="h-4 w-4" />
                        Search
                    </Button>
                </div>
            </div>
        </div>
    );
}