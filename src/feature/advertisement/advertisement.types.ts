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
