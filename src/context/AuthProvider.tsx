import {type ReactNode, useEffect, useMemo, useState} from "react";
import {getCurrentUser, loginUser, logoutUser} from "@/api/auth.service";
import type {LoginRequest, UserResponse} from "@/auth/auth.types";
import { AuthContext } from "./auth.context";
import {useNavigate} from "react-router-dom";

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);


    const navigate = useNavigate();

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

    const login = async (credentials:LoginRequest) => {
        try {
            await loginUser(credentials);
            await checkSession();
            navigate("/dashboard");
        }catch(err) {
            console.error("Bład podczas logowania",err);
            throw err;
        }
    }

    const logout = async () => {
        try {
            await logoutUser();
        } catch (error) {
            console.error("Błąd podczas wylogowywania:", error);
        } finally {
            setUser(null);
            navigate("/login");
        }
    };

    useEffect(() => {
        checkSession();
    }, []);

    const contextValue = useMemo(() => ({
        user,
        isLoading,
        checkSession,
        logout,
        login,
    }), [user, isLoading]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}