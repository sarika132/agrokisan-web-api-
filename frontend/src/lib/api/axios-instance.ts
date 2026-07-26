import axios from "axios";
import { getTokenCookie } from "../cookies";

const BASE_URL =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8000";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Automatically attach JWT token to every request
axiosInstance.interceptors.request.use(
    async (config) => {
        const token = await getTokenCookie();
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

export default axiosInstance; 