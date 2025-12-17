import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,  
    headers: {
        "Content-Type": "application/json",
    },
});


api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                await api.post("/auth/refreshToken");

                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem("user");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);