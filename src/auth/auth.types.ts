export interface LoginRequest {
    email: string;
    password: string;
}
export interface AuthContextType{
    isLoading: boolean;
    user: User| null;
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
    role: string;
    userId: string;
    name: string;
}

export interface User {
    id: string;
    email: string;
    name: string;
    isAdmin: boolean;
    role: string;
    stats: {
        rating: number;
        count: number;
    };
}