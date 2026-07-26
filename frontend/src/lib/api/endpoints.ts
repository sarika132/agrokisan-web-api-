// centralized path definations for API endpoints
export const API = {
    AUTH: {
        REGISTER: "/api/auth/register",
        LOGIN: "/api/auth/login",
        WHOAMI: "/api/auth/whoami",
        UPDATE: "/api/auth/update",
        REQUEST_PASSWORD_RESET: "/api/auth/request-password-reset",
        RESET_PASSWORD: (token: string) => `/api/auth/reset-password/${token}`,
    },
    ADMIN: {
        USERS: {
            GET_ALL: "/api/admin/users",
            GET_BY_ID: (id: string) => `/api/admin/users/${id}`,
            CREATE: "/api/admin/users",
            UPDATE: (id: string) => `/api/admin/users/${id}`,
            UPDATE_PASSWORD: (id: string) => `/api/admin/users/${id}/password`,
            DELETE: (id: string) => `/api/admin/users/${id}`,
        },
        // brand endpoints
        BRANDS: {
            GET_ALL: "/api/admin/brand",
            CREATE: "/api/admin/brand/create",
            UPDATE: (id: string) => `/api/admin/brand/update/${id}`,
            DELETE: (id: string) => `/api/admin/brand/delete/${id}`,
        },
        // category endpoints
        CATEGORIES: {
            GET_ALL: "/api/admin/category",
            CREATE: "/api/admin/category/create",
            UPDATE: (id: string) => `/api/admin/category/update/${id}`,
            DELETE: (id: string) => `/api/admin/category/delete/${id}`,
        },
        // vehicle endpoints - admin manages vehicles
        VEHICLES: {
            GET_ALL: "/api/admin/vehicle",
            GET_BY_ID: (id: string) => `/api/admin/vehicle/${id}`,
            CREATE: "/api/admin/vehicle/create",
            UPDATE: (id: string) => `/api/admin/vehicle/update/${id}`,
            UPDATE_AVAILABILITY: (id: string) => `/api/admin/vehicle/update/${id}`,
            DELETE: (id: string) => `/api/admin/vehicle/delete/${id}`,
        },
        // booking endpoints - admin manages bookings
        BOOKINGS: {
            GET_ALL: "/api/admin/booking",
            GET_BY_ID: (id: string) => `/api/admin/booking/${id}`,
            CONFIRM: (id: string) => `/api/admin/booking/confirm/${id}`,
            COMPLETE: (id: string) => `/api/admin/booking/complete/${id}`,
            CANCEL: (id: string) => `/api/admin/booking/cancel/${id}`,
        },
        // review endpoints - admin can view and delete reviews
        REVIEWS: {
            GET_ALL: "/api/admin/review",
            DELETE: (id: string) => `/api/admin/review/delete/${id}`,
        },
        // dashboard endpoints - admin stats
        DASHBOARD: {
            STATS: "/api/admin/dashboard/stats",
        },
    },
    // public endpoints - no auth needed
    PUBLIC: {
        BRANDS: "/api/brand",
        CATEGORIES: "/api/category",
        VEHICLES: "/api/vehicle",
        VEHICLE_BY_ID: (id: string) => `/api/vehicle/${id}`,
        FEATURED_REVIEWS: "/api/review/featured",
    },
    // user booking endpoints - requires auth
    USER: {
        BOOKINGS: {
            CREATE: "/api/booking/create",
            GET_MY_BOOKINGS: "/api/booking/my-bookings",
            GET_BY_ID: (id: string) => `/api/booking/${id}`,
            CANCEL: (id: string) => `/api/booking/cancel/${id}`,
        },
        // review endpoints - user manages their own reviews
        REVIEWS: {
            CREATE: "/api/review/create",
            GET_BY_VEHICLE: (vehicleId: string) => `/api/review/vehicle/${vehicleId}`,
            UPDATE: (id: string) => `/api/review/update/${id}`,
            DELETE: (id: string) => `/api/review/delete/${id}`,
        },
        // favourite endpoints - user manages their own favourites
        FAVOURITES: {
            ADD: "/api/favourite/add",
            GET_MY_FAVOURITES: "/api/favourite/my-favourites",
            CHECK: (vehicleId: string) => `/api/favourite/check/${vehicleId}`,
            REMOVE: (vehicleId: string) => `/api/favourite/remove/${vehicleId}`,
        },
    },
};