import { createContext, useState, useEffect, type ReactNode } from "react";
import type { Advertisement, FavoriteAdvertisementDto } from "@/feature/advertisement/advertisement.types";
import {
  getAllAds,
  getMyFavorites, // Nowa funkcja (pobiera Set/Tablicę z /favorite/me)
  addToFavorite, // Nowa funkcja (POST /favorite/{id})
  removeFromFavorite, // Nowa funkcja (DELETE /favorite/{id})
} from "@/feature/advertisement/ad.service";
import { useAuth } from "@/auth/auth.context"; // Zakładam, że tu masz info o userze

interface AdvertisementContextType {
  ads: Advertisement[];
  favoriteIds: Set<string>; // Trzymamy same ID polubionych
  toggleFavorite: (id: string) => Promise<void>;
  loading: boolean;
  refreshAds: () => void;
}

export const AdvertisementContext = createContext<AdvertisementContextType | undefined>(undefined);

export const AdvertisementProvider = ({ children }: { children: ReactNode }) => {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchAds = async () => {
    setLoading(true);
    try {
      const data = await getAllAds();
      setAds(data);
    } catch (error) {
      console.error("Błąd pobierania ogłoszeń:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    if (!user) {
      setFavoriteIds(new Set());
      return;
    }
    try {
      const data: FavoriteAdvertisementDto[] = await getMyFavorites();
      const ids = new Set(data.map((f) => f.advertisementId));
      setFavoriteIds(ids);
    } catch (error) {
      console.error("Błąd pobierania ulubionych:", error);
    }
  };

  useEffect(() => {
    fetchAds();
    fetchFavorites();
  }, [user]);

  const toggleFavorite = async (id: string) => {
    if (!user) {
      alert("Zaloguj się!");
      return;
    }

    const isCurrentlyFavorite = favoriteIds.has(id);

    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (isCurrentlyFavorite) next.delete(id);
      else next.add(id);
      return next;
    });

    try {
      if (isCurrentlyFavorite) {
        await removeFromFavorite(id); // Wywołuje DELETE /favorite/{id}
      } else {
        await addToFavorite(id); // Wywołuje POST /favorite/{id}
      }
    } catch (error) {
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (isCurrentlyFavorite) next.add(id);
        else next.delete(id);
        return next;
      });
      console.error("Błąd API ulubionych:", error);
    }
  };

  return (
    <AdvertisementContext.Provider
      value={{
        ads,
        favoriteIds, // Udostępniamy Set do sprawdzania stanu
        toggleFavorite,
        loading,
        refreshAds: fetchAds,
      }}
    >
      {children}
    </AdvertisementContext.Provider>
  );
};
