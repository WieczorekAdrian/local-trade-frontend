import { Heart } from "lucide-react";
import { useAdvertisement } from "@/feature/advertisement/hooks/advertisement.hooks";
import { useAuth } from "@/auth/auth.context";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const FavoriteButton = ({ adId }: { adId: string }) => {
  const { toggleFavorite, favoriteIds } = useAdvertisement();
  const { user } = useAuth();

  const isFavorite = favoriteIds.has(adId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.info("Zaloguj się, aby dodać do ulubionych", {
        description: "Tylko zalogowani użytkownicy mogą zapisywać ogłoszenia.",
        action: {
          label: "Zaloguj",
          onClick: () => (window.location.href = "/login"),
        },
      });
      return;
    }

    await toggleFavorite(adId);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex items-center justify-center rounded-full transition-all duration-200",
        "h-10 w-10 border shadow-sm bg-white hover:bg-gray-50 active:scale-90",
      )}
      aria-label="Ulubione"
    >
      <Heart
        size={22}
        className={cn(
          "transition-colors duration-300",
          // 4. Ikona reaguje na stan z Setu w Contextcie
          isFavorite ? "fill-red-500 stroke-red-500 scale-110" : "fill-transparent stroke-gray-400",
        )}
      />
    </button>
  );
};
