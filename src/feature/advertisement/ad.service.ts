import { api } from "@/auth/axiosConfig";
import type {
  CreateAdvertisementRequest,
  AdvertisementResponse,
  Advertisement,
  AdSearchParams,
} from "./advertisement.types";

export const getAllAds = async (params?: AdSearchParams) => {
  const response = await api.get("/advertisements/search", { params });
  return response.data.content;
};

export const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "Brak daty";
  return new Date(dateString).toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const getAdById = async (id: string) => {
  const response = await api.get<Advertisement>(`/advertisements/get/${id}`);
  return response.data;
};

export const createAdvertisement = async (
  data: CreateAdvertisementRequest,
  files: File[],
): Promise<AdvertisementResponse> => {
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

  if (files && files.length > 0) {
    files.forEach((file) => {
      formData.append("files", file);
    });
  }

  const response = await api.post<AdvertisementResponse>("/advertisements/new", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const getMyFavorites = async () => {
  const response = await api.get("/favorite/me");
  return response.data;
};

export const addToFavorite = (id: string) => api.post(`/favorite/${id}`);

export const removeFromFavorite = (id: string) => api.delete(`/favorite/${id}`);
