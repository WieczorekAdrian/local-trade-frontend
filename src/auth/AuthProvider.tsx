import { type ReactNode, useEffect, useState } from "react";
import { getCurrentUser, logoutUser } from "./auth.service";
import type { UserResponse } from "@/auth/auth.types";
import { AuthContext } from "./auth.context";

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkSession = async () => {
        try {
            const userData = await getCurrentUser();
            setUser(userData);
        } catch (error) {
            console.error("Błąd weryfikacji sesji:", error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await logoutUser();
        } catch (error) {
            console.error("Błąd podczas wylogowywania:", error);
        } finally {
            setUser(null);
            window.location.href = "/login";
        }
    };

    useEffect(() => {
        checkSession();
    }, []);

    return (
        <AuthContext.Provider value={{ user, isLoading, checkSession, logout }}>
            {children}
        </AuthContext.Provider>
    );
}