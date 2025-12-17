import {type ReactNode, useCallback, useEffect, useMemo, useState} from "react";
import {getCurrentUser, loginUser, logoutUser} from "@/auth/auth.service";
import type {LoginRequest, User, UserResponse} from "@/auth/auth.types";
import { AuthContext } from "./auth.context";
import {useNavigate} from "react-router-dom";
import {mapUserApiToDomain} from "@/auth/auth.mapper";

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const handleUserInit = useCallback((dto: UserResponse) => {
        const userDomain = mapUserApiToDomain(dto);
        setUser(userDomain);
    }, []);

    const navigate = useNavigate();

    const checkSession = useCallback(async () => {
        try {
            const userDto = await getCurrentUser();
            handleUserInit(userDto);
        } catch (error) {
            console.error("Błąd weryfikacji sesji:", error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, [handleUserInit]);

    const login = useCallback(async (credentials: LoginRequest) => {
        try {
            await loginUser(credentials);
            await checkSession();
            navigate("/dashboard");
        } catch (err) {
            console.error("Błąd logowania", err);
            throw err;
        }
    }, [checkSession, navigate]);

    const logout = useCallback(async () => {
        try {
            await logoutUser();
        } catch (error) {
            console.error("Błąd podczas wylogowywania:", error);
        } finally {
            setUser(null);
            navigate("/login");
        }
    }, [navigate]);

    useEffect(() => {
        checkSession();
    }, [checkSession]);

    const contextValue = useMemo(() => ({
        user,
        isLoading,
        checkSession,
        logout,
        login,
    }), [user, isLoading, checkSession, logout, login]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}