import { handleGetUserById } from "@/lib/actions/admin/user-action";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import Image from "next/image";

// Define the CartItem type to match your populated ICart structure
interface CartItem {
    _id: string;
    productId: {
        name: string;
        price: number;
        imageUrl?: string;
    };
    quantity: number;
    priceAtAdded: number;   // price at the time of adding
    totalPrice: number;     // quantity * priceAtAdded (already computed)
    status: "active" | "checkedout" | "cancelled";
}

export default async function UserDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const [userResult, cartResult] = await Promise.all([
        handleGetUserById(id),
        handleGetUserById(id),
    ]);

    if (!userResult.success) throw new Error(userResult.message);
    if (!userResult.data) notFound();

    const user = userResult.data;
    const cartItems: CartItem[] = cartResult.success ? cartResult.data : [];

    // Compute totals with explicit types
    const totalItems = cartItems.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
    const grandTotal = cartItems.reduce((sum: number, item: CartItem) => sum + item.totalPrice, 0);

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
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
                    <div className="relative h-16 w-16 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                        {user.imageUrl ? (
                            <Image
                                src={user.imageUrl}
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
                        <span
                            className={`text-xs font-medium px-2.5 py-1 rounded-full ${user.role === "admin"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-gray-100 text-gray-600"
                                }`}
                        >
                            {user.role}
                        </span>
                    </div>
                </div>
            </div>

            {/* Cart Items Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-8">
                <h2 className="text-xl font-semibold mb-6">Current Cart</h2>

                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                                Product
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                                Quantity
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                                Unit Price
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                                Total
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-8 text-center text-gray-500">
                                    Cart is empty
                                </td>
                            </tr>
                        ) : (
                            cartItems.map((item) => (
                                <tr key={item._id} className="border-b border-gray-50 hover:bg-gray-50">
                                    <td className="py-4 px-4 text-sm text-gray-800">
                                        {item.productId?.name || "Product"}
                                    </td>
                                    <td className="py-4 px-4 text-sm text-gray-500">{item.quantity}</td>
                                    <td className="py-4 px-4 text-sm text-gray-500">
                                        NPR {item.priceAtAdded.toFixed(2)}
                                    </td>
                                    <td className="py-4 px-4 text-sm text-gray-800">
                                        NPR {item.totalPrice.toFixed(2)}
                                    </td>
                                    <td className="py-4 px-4">
                                        <span
                                            className={`text-xs font-medium px-2.5 py-1 rounded-full ${item.status === "checkedout"
                                                ? "bg-green-100 text-green-700"
                                                : item.status === "cancelled"
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                                }`}
                                        >
                                            {item.status || "active"}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Cart summary */}
                {cartItems.length > 0 && (
                    <div className="mt-6 text-right border-t border-gray-100 pt-4">
                        <p className="text-sm text-gray-500">
                            Total Items: {totalItems}
                        </p>
                        <p className="text-lg font-semibold text-gray-900">
                            Grand Total: NPR {grandTotal.toFixed(2)}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}