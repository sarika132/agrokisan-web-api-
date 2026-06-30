import { handleGetUserById } from "@/lib/actions/admin/user-action";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import Image from "next/image";


// dummy System
const dummyBookings = [
    {
        id: "BK001",
        vehicle: "Tesla Model 3",
        pickupDate: "2026-05-10",
        dropoffDate: "2026-05-15",
        totalPrice: "$445",
        status: "Confirmed",
    },
    {
        id: "BK002",
        vehicle: "Honda CBR 650R",
        pickupDate: "2026-05-20",
        dropoffDate: "2026-05-22",
        totalPrice: "$90",
        status: "Pending",
    },
];

export default async function UserDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const result = await handleGetUserById(id);

    if (!result.success) {
        throw new Error(result.message); // triggers error.tsx
    }

    if (!result.data) {
        notFound(); // triggers not-found.tsx
    }

    const user = result.data;

    return (
        <div className="p-6 max-w-4xl">
            {/* Back link */}
            <Link
                href="/dashboard/users"
                className="flex items-center gap-2 text-sm text-cyan-600 hover:text-cyan-700 mb-6"
            >
                <ArrowLeftIcon className="h-4 w-4" />
                Back to Customers
            </Link>

            {/* Customer Profile Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
                <h2 className="text-xl font-semibold mb-6">Customer Profile</h2>
                {/* Avatar + name header */}
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
                    <div className="relative h-16 w-16 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                        {user.imageUrl ? (
                            <Image
                                src={`${process.env.NEXT_PUBLIC_BASE_URL}${user.imageUrl}`}
                                alt={user.fullName}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center bg-cyan-50 text-cyan-600 font-semibold text-lg">
                                {user.fullName?.slice(0, 1).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">{user.fullName}</h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <p className="text-sm text-cyan-600 font-medium mb-1">Full Name</p>
                        <p className="text-gray-800 font-medium">{user.fullName}</p>
                    </div>
                    <div>
                        <p className="text-sm text-cyan-600 font-medium mb-1">Email</p>
                        <p className="text-gray-800">{user.email}</p>
                    </div>
                    <div>
                        <p className="text-sm text-cyan-600 font-medium mb-1">Phone Number</p>
                        <p className="text-gray-800">{user.contactNumber}</p>
                    </div>
                    <div>
                        <p className="text-sm text-cyan-600 font-medium mb-1">Joined Date</p>
                        <p className="text-gray-800">
                            {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-cyan-600 font-medium mb-1">Gender</p>
                        <p className="text-gray-800 capitalize">{user.gender}</p>
                    </div>
                    <div>
                        <p className="text-sm text-cyan-600 font-medium mb-1">Role</p>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${user.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-gray-100 text-gray-600"
                            }`}>
                            {user.role}
                        </span>
                    </div>
                </div>
            </div>

            {/* Booking History - static for now */}
            <div className="bg-white rounded-xl border border-gray-200 p-8">
                <h2 className="text-xl font-semibold mb-6">Booking History</h2>

                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Booking ID</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Vehicle</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Pick-up</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Drop-off</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Total Price</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dummyBookings.map((booking) => (
                            <tr key={booking.id} className="border-b border-gray-50 hover:bg-gray-50">
                                <td className="py-4 px-4 text-sm text-cyan-600 font-medium">{booking.id}</td>
                                <td className="py-4 px-4 text-sm text-gray-800">{booking.vehicle}</td>
                                <td className="py-4 px-4 text-sm text-gray-500">{booking.pickupDate}</td>
                                <td className="py-4 px-4 text-sm text-gray-500">{booking.dropoffDate}</td>
                                <td className="py-4 px-4 text-sm text-gray-800">{booking.totalPrice}</td>
                                <td className="py-4 px-4">
                                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${booking.status === "Confirmed"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-yellow-100 text-yellow-700"
                                        }`}>
                                        {booking.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}