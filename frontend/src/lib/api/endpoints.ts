// centralized path definations for API endpoints
export const API = {
    AUTH: {
        REGISTER: "/api/auth/register",
        LOGIN: "/api/auth/login",
        WHOAMI: "/api/auth/whoami",
        UPDATE: "/api/auth/update",
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
    },
};