import { NextRequest, NextResponse } from "next/server";
import { getTokenCookie, getUserData } from "@/lib/cookies";

const publicRoutes = ["/login", "/register"];
const adminRoutes = ["/admin"];

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = await getTokenCookie();
    const user = await getUserData();
    const isPublicRoute = publicRoutes.some((route) =>
        pathname.startsWith(route),
    );

    // redirect to login
    if (!token && !isPublicRoute) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Check admin routes only for /admin
    const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
    if (token && user) {
        if (isAdminRoute && user.role !== "admin") {
            return NextResponse.redirect(new URL("/unauthorized", request.url));
        }
    }

    // if already logged in restrict login/register redirect to dashboard
    if (token && isPublicRoute) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard",
        "/register",
        "/login",
        "/admin/:path*",
        "/profile",
        "/change-password",
    ],
};