import { api } from "@/auth/axiosConfig";

export interface Advertisement {
    advertisementId: string;
    categoryId: number;
    price: number;
    title: string;
    image: string | null;
    description: string;
    active: boolean;
    location: string;
    imageUrls: string[];
    thumbnailUrls: string[];
}

export const getAllAds = async (): Promise<Advertisement[]> => {
    const response = await api.get<Advertisement[]>("/advertisements/search");
    return response.data;
};