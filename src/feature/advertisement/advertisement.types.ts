export interface CreateAdvertisementRequest {
  title: string;
  description: string;
  price: number;
  categoryId: number;
  location: string;
  active?: boolean;
  image?: string | null;
}

export interface AdvertisementResponse {
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

export interface Advertisement {
  createdAt: string;
  advertisementId: string;
  sellerId: string;
  sellerEmail: string;
  categoryId: number;
  price: number;
  title: string;
  image: string | null;
  description: string;
  active?: boolean;
  location: string;
  imageUrls: string[];
  thumbnailUrls: string[];
  isFavorite?: boolean;
}

export interface FavoriteAdvertisementDto {
  advertisementId: string;
}
export interface AdSearchParams {
  title?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  categoryId?: number;
  active?: boolean;
}
