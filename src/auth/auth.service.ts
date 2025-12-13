import { api } from "./axiosConfig";
import type {LoginRequest, LoginResponse, RegisterRequest, UserResponse} from "./auth.types";

export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/login", data);

    if (response.data.token) {
        localStorage.setItem("token", response.data.token);

    }

    return response.data;
};
export const registerUser = async (data: RegisterRequest): Promise<void> => {
    await api.post("/auth/signup", data);
};
export const getCurrentUser = async (): Promise<UserResponse> => {
    const response = await api.get<UserResponse>("/users/me");
    return response.data;
};

export const logoutUser = async () => {
    try {
        await api.post("/auth/logout");
    } catch (e) {
        console.error("Błąd wylogowania na serwerze", e);
    } finally {
        localStorage.removeItem("token");
    }

};