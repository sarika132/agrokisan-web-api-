export const API = {
    AUTH: {
        REGISTER: "/api/auth/register",
        LOGIN: "/api/auth/login",
        WHOAMI: "/api/auth/whoami",
        UPDATE: "/api/auth/update",
        CHANGE_PASSWORD: "/api/auth/change-password",
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
        // CATEGORIES – corrected to admin routes
        CATEGORIES: {
            GET_ALL: "/api/admin/category",                 // GET all (admin list)
            CREATE: "/api/admin/category/create",           // POST create
            UPDATE: (id: string) => `/api/admin/category/update/${id}`, // PUT update
            DELETE: (id: string) => `/api/admin/category/delete/${id}`, // DELETE delete
        },
        // PRODUCTS
        PRODUCTS: {
            GET_ALL: "/api/admin/product",                // admin paginated list (GET)
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
            GET_BY_CUSTOMER: (customerId: string) => `/api/admin/cart/customer/${customerId}`,
            UPDATE_STATUS: (id: string) => `/api/admin/cart/${id}/status`,
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
    public: {
        COLLECTIONS: "/api/collections",    // plural public GET
        COLLECTION_BY_ID: (id: string) => `/api/collections/${id}`,
        CATEGORIES: "/api/categories",      // plural public GET
        PRODUCTS: "/api/products",          // plural public GET
        PRODUCT_BY_ID: (id: string) => `/api/products/${id}`,
        PRODUCTS_SEARCH: "/api/products/search",
        PRODUCTS_BY_CATEGORY: "/api/products/category",
        PRODUCTS_BY_COLLECTION: "/api/products/collection",
        REVIEWS_BY_PRODUCT: (productId: string) => `/api/reviews/product/${productId}`,
        FEATURED_REVIEWS: "/api/reviews/featured",
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
            CREATE: "/api/reviews",
            GET_BY_PRODUCT: (productId: string) => `/api/reviews/product/${productId}`,
            UPDATE: (id: string) => `/api/reviews/${id}`,
            DELETE: (id: string) => `/api/reviews/${id}`,
        },
    },
};