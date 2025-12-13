import axios from "axios";
import type {LoginRequest, LoginResponse} from "./auth.types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080"

export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
    try {
        const response = await axios.post<LoginResponse>(API_URL, data);

        if (response.data.token) {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("refreshToken", response.data.refreshToken);
        }

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
};