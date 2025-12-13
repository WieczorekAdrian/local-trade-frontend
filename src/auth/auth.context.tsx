import { createContext, useContext } from "react";
import type { UserResponse } from "@/auth/auth.types";

export interface AuthContextType {
    user: UserResponse | null;
    isLoading: boolean;
    checkSession: () => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};