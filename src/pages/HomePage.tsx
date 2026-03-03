import { useEffect, useState } from "react";
import { getAllAds } from "@/feature/advertisement/ad.service";
import { AdCard } from "@/feature/advertisement/components/AdCard";
import type { Advertisement } from "@/feature/advertisement/advertisement.types";
import { HeroSearch } from "@/components/common/HeroSearch";
import { CategoryFilter } from "@/feature/category/components/CategoryFilter";
import { toast } from "sonner";
import { HowItWorksCollapsible } from "@/components/common/HowItWorks.tsx";
import { Footer } from "@/components/common/Footer.tsx";
import { CookieBanner } from "@/components/common/CookieBanner.tsx";

export default function HomePage() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  useEffect(() => {
    const fetchLatestAds = async () => {
      setIsLoading(true);
      try {
        const data = await getAllAds({
          categoryId: selectedCategoryId ?? undefined,
        });
        setAds(data);
      } catch (e) {
        toast.error("An error occurred while fetching ads.");
        throw e;
      } finally {
        setIsLoading(false);
      }
    };

    void fetchLatestAds();
  }, [selectedCategoryId]);

  return (
    <div className="min-h-screen flex flex-col">
      {" "}
      {/* flex-col pomaga utrzymać stopkę na dole */}
      <div className="flex-grow">
        <HeroSearch />

        <main className="container mx-auto px-4">
          <div className="py-4">
            <HowItWorksCollapsible />
          </div>
          <header className="mb-8 pt-12 space-y-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Najnowsze okazje</h2>
              <p className="text-muted-foreground mt-1">Przeglądaj ogłoszenia w Twojej okolicy</p>
            </div>

            <div className="pt-2">
              <CategoryFilter selectedCategoryId={selectedCategoryId} onSelectCategory={setSelectedCategoryId} />
            </div>
          </header>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : ads.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-in fade-in duration-500">
              {ads.map((ad) => (
                <AdCard key={ad.advertisementId} {...ad} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold">Brak ogłoszeń w tej kategorii</h3>
              <p className="text-muted-foreground">Spróbuj wybrać inną kategorię lub wyczyść filtry.</p>
              <button
                onClick={() => setSelectedCategoryId(null)}
                className="mt-4 text-primary hover:underline font-medium"
              >
                Pokaż wszystkie ogłoszenia
              </button>
            </div>
          )}
        </main>
      </div>
      <Footer />
      <CookieBanner />
    </div>
  );
}
