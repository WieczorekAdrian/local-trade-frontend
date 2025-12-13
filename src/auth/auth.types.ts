export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    expiresIn: number;
    refreshToken: string;
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