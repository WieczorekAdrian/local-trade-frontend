import { useContext } from "react";
import { AdvertisementContext } from "@/feature/advertisement/AdvertisementContext";

export const useAdvertisement = () => {
  const context = useContext(AdvertisementContext);
  if (!context) {
    throw new Error("useAdvertisement musi być użyty wewnątrz AdvertisementProvider");
  }
  return context;
};
