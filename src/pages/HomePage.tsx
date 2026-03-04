import { useEffect, useState } from "react";
import { getAllAds } from "@/feature/advertisement/ad.service";
import { AdCard } from "@/feature/advertisement/components/AdCard";
import { AdCardSkeleton } from "@/feature/advertisement/components/AdCardSkeleton"; // <-- Nowy import
import type { Advertisement } from "@/feature/advertisement/advertisement.types";
import { HeroSearch } from "@/components/common/HeroSearch";
import { CategoryFilter } from "@/feature/category/components/CategoryFilter";
import { toast } from "sonner";
import { HowItWorksCollapsible } from "@/components/common/HowItWorks.tsx";
import { Footer } from "@/components/common/Footer.tsx";
import { CookieBanner } from "@/components/common/CookieBanner.tsx";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function HomePage() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const [sortOrder, setSortOrder] = useState<string>("createdAt,DESC");
  const [page, setPage] = useState<number>(0);
  const [isLastPage, setIsLastPage] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  useEffect(() => {
    const fetchAds = async () => {
      if (page === 0) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      try {
        const responsePage = await getAllAds({
          categoryId: selectedCategoryId ?? undefined,
          sort: sortOrder,
          page: page,
          size: 8,
        });

        const newAds = responsePage.content;

        if (page === 0) {
          setAds(newAds);
        } else {
          setAds((prev) => [...prev, ...newAds]);
        }

        setIsLastPage(responsePage.last);
      } catch (e) {
        toast.error("Wystąpił błąd podczas pobierania ogłoszeń.");
        throw e;
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    };

    void fetchAds();
  }, [selectedCategoryId, sortOrder, page]);

  const handleCategoryChange = (id: number | null) => {
    setSelectedCategoryId(id);
    setPage(0);
  };

  const handleSortChange = (value: string) => {
    setSortOrder(value);
    setPage(0);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow">
        <HeroSearch />

        <main className="container mx-auto px-4">
          <div className="py-4">
            <HowItWorksCollapsible />
          </div>

          <header className="mb-8 pt-12 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Przeglądaj ogłoszenia</h2>
                <p className="text-muted-foreground mt-1">Znajdź najlepsze okazje w Twojej okolicy.</p>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-muted-foreground whitespace-nowrap">Sortuj:</label>
                <Select value={sortOrder} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Wybierz sortowanie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt,DESC">Od najnowszych</SelectItem>
                    <SelectItem value="price,ASC">Cena: od najtańszych</SelectItem>
                    <SelectItem value="price,DESC">Cena: od najdroższych</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="pt-2">
              <CategoryFilter selectedCategoryId={selectedCategoryId} onSelectCategory={handleCategoryChange} />
            </div>
          </header>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <AdCardSkeleton key={i} />
              ))}
            </div>
          ) : ads.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-in fade-in duration-500">
                {ads.map((ad) => (
                  <AdCard key={ad.advertisementId} {...ad} />
                ))}
              </div>

              {!isLastPage && (
                <div className="mt-12 mb-8 flex justify-center">
                  <button
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={isLoadingMore}
                    className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-5 bg-white border border-primary/30 text-primary font-semibold hover:bg-slate-50 hover:border-primary/60 hover:shadow-md transition-all duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoadingMore ? (
                      <>
                        {/* Zmieniłem border-current na border-primary, żeby kółko było zielone */}
                        <span className="h-5 w-5 animate-spin rounded-full border-b-2 border-primary"></span>
                        Ładowanie...
                      </>
                    ) : (
                      "Załaduj więcej"
                    )}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold">Brak ogłoszeń w tej kategorii</h3>
              <p className="text-muted-foreground">Spróbuj wybrać inną kategorię lub wyczyść filtry.</p>
              <button
                onClick={() => handleCategoryChange(null)}
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
