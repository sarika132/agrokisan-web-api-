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

        // COLLECTIONS
        COLLECTIONS: {
            GET_ALL: "/api/admin/collection",
            CREATE: "/api/admin/collection/create",
            UPDATE: (id: string) => `/api/admin/collection/update/${id}`,
            DELETE: (id: string) => `/api/admin/collection/delete/${id}`,
        },
        // CATEGORIES 
        CATEGORIES: {
            GET_ALL: "/api/admin/category",
            CREATE: "/api/admin/category/create",
            UPDATE: (id: string) => `/api/admin/category/update/${id}`,
            DELETE: (id: string) => `/api/admin/category/delete/${id}`,
        },
        // PRODUCTS
        PRODUCTS: {
            GET_ALL: "/api/admin/product",
            GET_BY_ID: (id: string) => `/api/admin/product/${id}`,
            CREATE: "/api/admin/product/create",
            UPDATE: (id: string) => `/api/admin/product/update/${id}`,
            UPDATE_AVAILABILITY: (id: string) => `/api/admin/product/update/${id}`,
            DELETE: (id: string) => `/api/admin/product/delete/${id}`,
        },
        // CART
        CART: {
            GET_ALL: "/api/admin/cart",
            GET_BY_ID: (id: string) => `/api/admin/cart/${id}`,
            CANCEL: (id: string) => `/api/admin/cart/cancel/${id}`,
            DELETE: (id: string) => `/api/admin/cart/delete/${id}`,
        },
        //REVIEWS 
        REVIEWS: {
            GET_ALL: "/api/admin/review",
            DELETE: (id: string) => `/api/admin/review/delete/${id}`,
        },
        // DASHBOARD 
        DASHBOARD: {
            STATS: "/api/admin/dashboard/stats",
        },
    },
    // 
    landing: {
        COLLECTIONS: "/api/collection",
        COLLECTION_BY_ID: (id: string) => `/api/collection/${id}`,
        CATEGORIES: "/api/category",
        PRODUCTS: "/api/product",
        PRODUCT_BY_ID: (id: string) => `/api/product/${id}`,
        PRODUCTS_SEARCH: "/api/product/search",
        PRODUCTS_BY_CATEGORY: "/api/product/category",
        PRODUCTS_BY_COLLECTION: "/api/product/collection",
        REVIEWS_BY_PRODUCT: (productId: string) => `/api/review/product/${productId}`,
        FEATURED_REVIEWS: "/api/review/featured",
    },
    //  USER endpoints
    USER: {
        // CART
        CART: {
            CREATE: "/api/cart",
            GET_MY_CART: "/api/cart/my",
            GET_BY_ID: (id: string) => `/api/cart/${id}`,
            UPDATE: (id: string) => `/api/cart/${id}`,
            CANCEL: (id: string) => `/api/cart/${id}/cancel`,
            DELETE: (id: string) => `/api/cart/${id}`,
        },
        // REVIEWS 
        REVIEWS: {
            CREATE: "/api/review",
            GET_BY_PRODUCT: (productId: string) => `/api/review/product/${productId}`, // ✅ GET_BY_VEHICLE → GET_BY_PRODUCT
            UPDATE: (id: string) => `/api/review/${id}`,
            DELETE: (id: string) => `/api/review/${id}`,
        },
    },
};