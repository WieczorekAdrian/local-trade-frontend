import { useEffect, useState } from "react";
import { getAllAds } from "@/feature/advertisement/ad.service";
import { AdCard } from "@/feature/advertisement/AdCard";
import type { Advertisement } from "@/feature/advertisement/advertisement.types";
import { HeroSearch } from "@/feature/advertisement/components/hero-search";

export default function HomePage() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLatestAds = async () => {
      try {
        const data = await getAllAds();
        setAds(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLatestAds();
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20">
      <HeroSearch />

      <main className="container mx-auto px-4">
        <header className="mb-8 pt-12">
          <h2 className="text-3xl font-bold tracking-tight">Najnowsze okazje</h2>
          <p className="text-muted-foreground mt-1">Przeglądaj ogłoszenia w Twojej okolicy</p>
        </header>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {ads.map((ad) => (
              <AdCard key={ad.advertisementId} {...ad} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
