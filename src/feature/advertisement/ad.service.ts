import { api } from "@/auth/axiosConfig";
import type { CreateAdvertisementRequest, AdvertisementResponse } from "./advertisement.types";

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

export const createAdvertisement = async (data: CreateAdvertisementRequest): Promise<AdvertisementResponse> => {
  const formData = new FormData();

  const dto = {
    title: data.title,
    description: data.description,
    price: data.price,
    categoryId: data.categoryId,
    location: data.location,
    active: data.active,
  };

  const jsonBlob = new Blob([JSON.stringify(dto)], {
    type: "application/json",
  });

  formData.append("advertisementDto", jsonBlob);

  const emptyFile = new Blob([], { type: "application/octet-stream" });
  formData.append("files", emptyFile, "placeholder.txt");

  const response = await api.post<AdvertisementResponse>("/advertisements/new", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
