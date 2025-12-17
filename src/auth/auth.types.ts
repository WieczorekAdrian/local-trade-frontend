export interface LoginRequest {
    email: string;
    password: string;
}
export interface AuthContextType{
    isLoading: boolean;
    user: UserResponse | null;
    checkSession: () => Promise<void>;
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => Promise<void>;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface UserResponse {
    email: string;
    ratingCount: number;
    averageRating: number;
}
export interface User {
    id: string;
    email: string;
    name: string;
    roles: ('ROLE_USER' | 'ROLE_ADMIN')[];
}