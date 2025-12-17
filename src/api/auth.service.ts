import { api } from "@/api/axiosConfig";
import type { LoginRequest,  RegisterRequest, UserResponse } from "@/auth/auth.types";

export const loginUser = async (data: LoginRequest): Promise<void> => {
    await api.post("/auth/login", data);

};

export const registerUser = async (data: RegisterRequest): Promise<void> => {
    await api.post("/auth/signup", data);
};

export const getCurrentUser = async (): Promise<UserResponse> => {
    const response = await api.get<UserResponse>("/users/me");
    return response.data;
};

export const logoutUser = async (): Promise<void> => {
    try {
        await api.post("/auth/logout");
    } catch (e) {
        console.error("Błąd wylogowania na serwerze", e);
    } finally {
        localStorage.removeItem("user");
    }
};