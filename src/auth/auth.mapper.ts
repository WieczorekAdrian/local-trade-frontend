import type { UserResponse, User } from "./auth.types";

export const mapUserApiToDomain = (dto: UserResponse): User => {
    return {
        id: dto.userId,
        email: dto.email,
        name: dto.name,
        role: dto.role,

        isAdmin: dto.role === "ADMIN",

        stats: {
            rating: dto.averageRating,
            count: dto.ratingCount
        }
    };
};