import { useAdvertisement } from "@/feature/advertisement/hooks/advertisement.hooks";
import { AdCard } from "@/feature/advertisement/components/AdCard";
import { HeartOff } from "lucide-react";

export function FavoritesPage() {
  const { ads, favoriteIds, loading } = useAdvertisement();

  const favoriteAds = ads.filter((ad) => favoriteIds.has(ad.advertisementId));

  return (
    <div className="min-h-screen bg-background pb-20">
      <main className="container mx-auto px-4">
        <header className="mb-8 pt-8">
          <h2 className="text-3xl font-bold tracking-tight">Moje Ulubione</h2>
          <p className="text-muted-foreground mt-1">Lista ogłoszeń, które Cię zainteresowały</p>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {favoriteAds.length > 0 ? (
              favoriteAds.map((ad) => <AdCard key={ad.advertisementId} {...ad} />)
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-xl">
                <HeartOff className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg text-muted-foreground">Twoja lista ulubionych jest pusta.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
