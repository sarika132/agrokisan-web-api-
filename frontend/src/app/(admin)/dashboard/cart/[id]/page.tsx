import { getCartById } from "@/lib/actions/admin/cart-action";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeftIcon } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CartDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const result = await getCartById(id);

    if (!result.success) {
        throw new Error(result.message);
    }

    if (!result.data) {
        notFound();
    }

    const cart = result.data;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Back link */}
            <Link
                href="/dashboard/carts"
                className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700 mb-6"
            >
                <ArrowLeftIcon className="h-4 w-4" />
                Back to Carts
            </Link>

            {/* Single card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                {/* Cart Header */}
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-800">Cart Details</h1>
                        <p className="text-sm text-green-600 mt-1">
                            Cart ID: <span className="font-medium">{cart.cartId || cart._id}</span>
                        </p>
                    </div>
                    <span
                        className={`text-sm font-medium px-3 py-1.5 rounded-full capitalize ${cart.status === "checkedout"
                                ? "bg-green-100 text-green-700"
                                : cart.status === "cancelled"
                                    ? "bg-red-100 text-red-600"
                                    : "bg-yellow-100 text-yellow-700"
                            }`}
                    >
                        {cart.status}
                    </span>
                </div>

                {/* Customer Information */}
                <div className="mb-6 pb-6 border-b border-gray-100">
                    <h2 className="text-base font-semibold text-gray-800 mb-4">
                        Customer Information
                    </h2>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="relative h-10 w-10 rounded-full overflow-hidden bg-green-100 shrink-0">
                            {cart.customerId?.imageUrl ? (
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_BASE_URL}${cart.customerId.imageUrl}`}
                                    alt={cart.customerId.fullName}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-green-600 font-semibold text-sm">
                                    {cart.customerId?.fullName?.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-800">
                                {cart.customerId?.fullName}
                            </p>
                            <p className="text-xs text-gray-400">{cart.customerId?.email}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-green-600 font-medium mb-1">Name</p>
                            <p className="text-gray-800">{cart.customerId?.fullName || "—"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-green-600 font-medium mb-1">Email</p>
                            <p className="text-gray-800">{cart.customerId?.email || "—"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-green-600 font-medium mb-1">Phone</p>
                            <p className="text-gray-800">{cart.customerId?.contactNumber || "—"}</p>
                        </div>
                    </div>
                </div>

                {/* Product Details */}
                <div className="mb-6 pb-6 border-b border-gray-100">
                    <h2 className="text-base font-semibold text-gray-800 mb-4">
                        Product Details
                    </h2>
                    <div className="flex items-start gap-4">
                        <div className="relative h-28 w-40 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                            {cart.productId?.imageUrl ? (
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_BASE_URL}${cart.productId.imageUrl}`}
                                    alt={cart.productId.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center bg-green-50 text-green-600 font-semibold text-xl">
                                    {cart.productId?.name?.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                            <div>
                                <p className="text-sm text-green-600 font-medium mb-1">Product</p>
                                <p className="text-gray-800">{cart.productId?.name || "—"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-green-600 font-medium mb-1">Category</p>
                                <p className="text-gray-800">{cart.productId?.categoryId?.name || "—"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-green-600 font-medium mb-1">Unit Price</p>
                                <p className="text-gray-800">NPR {cart.priceAtAdded?.toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-green-600 font-medium mb-1">Quantity</p>
                                <p className="text-gray-800">{cart.quantity}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Summary */}
                <div>
                    <h2 className="text-base font-semibold text-gray-800 mb-4">
                        Payment Summary
                    </h2>
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <p className="text-sm text-gray-600">Unit Price</p>
                        <p className="text-sm text-gray-800">NPR {cart.priceAtAdded?.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <p className="text-sm text-gray-600">Quantity</p>
                        <p className="text-sm text-gray-800">{cart.quantity}</p>
                    </div>
                    <div className="flex items-center justify-between py-3">
                        <p className="text-sm font-semibold text-gray-800">Total</p>
                        <p className="text-sm font-semibold text-green-600">
                            NPR {cart.totalPrice?.toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}