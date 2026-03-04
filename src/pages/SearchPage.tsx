import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllAds } from "@/feature/advertisement/ad.service";
import { AdCard } from "@/feature/advertisement/components/AdCard";
import type { Advertisement } from "@/feature/advertisement/advertisement.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Search, MapPin, Filter, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdCardSkeleton } from "@/feature/advertisement/components/AdCardSkeleton.tsx";
import type { Category } from "@/feature/category/category.types.ts";
import { getCategories } from "@/feature/category/category.service.ts";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<string>("createdAt,DESC");

  const [title, setTitle] = useState(searchParams.get("title") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [categoryId, setCategoryId] = useState(searchParams.get("categoryId") || "");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (e) {
        console.error("Nie udało się pobrać kategorii", e);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchAds = async () => {
      if (page === 0) setIsLoading(true);
      else setIsLoadingMore(true);

      try {
        const params = {
          // Pobieramy dane z URL
          title: searchParams.get("title") || undefined,
          location: searchParams.get("location") || undefined,
          minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
          maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
          categoryId: searchParams.get("categoryId") ? Number(searchParams.get("categoryId")) : undefined,

          // Paginacja i sortowanie dla Spring Pageable
          sort: sortOrder,
          page: page,
          size: 8,
        };

        const response = await getAllAds(params);

        if (page === 0) {
          setAds(response.content);
        } else {
          setAds((prev) => [...prev, ...response.content]);
        }

        setIsLastPage(response.last);
      } catch (error) {
        console.error("Błąd podczas pobierania ogłoszeń:", error);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    };

    fetchAds();
  }, [searchParams, page, sortOrder]);

  // Funkcja zatwierdzająca filtry (wrzuca stan do URL)
  const handleApplyFilters = () => {
    setPage(0);
    const params: Record<string, string> = {};
    if (title) params.title = title;
    if (location) params.location = location;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (categoryId) params.categoryId = categoryId;

    setSearchParams(params);
  };

  // Funkcja czyszcząca filtry
  const clearFilters = () => {
    setTitle("");
    setLocation("");
    setMinPrice("");
    setMaxPrice("");
    setCategoryId("");
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-background container mx-auto px-4 py-8">
      {/* 1. GÓRNY PASEK WYSZUKIWANIA (TYTUŁ + LOKALIZACJA) */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 bg-card p-4 rounded-lg border shadow-sm items-end">
        <div className="grid w-full items-center gap-1.5 flex-1">
          <Label htmlFor="search-title" className="font-semibold">
            Czego szukasz?
          </Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search-title"
              placeholder="np. iPhone 13, Rower"
              className="pl-9"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleApplyFilters()}
            />
          </div>
        </div>

        <div className="grid w-full items-center gap-1.5 flex-1">
          <Label htmlFor="search-location" className="font-semibold">
            Lokalizacja
          </Label>
          <div className="relative">
            <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search-location"
              placeholder="Miejscowość"
              className="pl-9"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleApplyFilters()}
            />
          </div>
        </div>

        <Button onClick={handleApplyFilters} className="w-full md:w-auto font-bold">
          Szukaj
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* 2. LEWY PANEL (FILTRY BOCZNE) */}
        <aside className="w-full lg:w-64 shrink-0 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Filter className="h-4 w-4" /> Filtry
              </h3>
              {(minPrice || maxPrice || categoryId) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-auto p-0 text-xs text-muted-foreground hover:text-red-500"
                >
                  <X className="h-3 w-3 mr-1" /> Wyczyść
                </Button>
              )}
            </div>
            <Separator />

            {/* Kategoria */}
            <div className="space-y-2">
              <Label>Kategoria</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz kategorię" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Sortowanie</Label>
              <Select
                value={sortOrder}
                onValueChange={(val) => {
                  setSortOrder(val);
                  setPage(0);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz kolejność" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt,DESC">Od najnowszych</SelectItem>
                  <SelectItem value="createdAt,ASC">Od najstarszych</SelectItem>
                  <SelectItem value="price,ASC">Cena: rosnąco</SelectItem>
                  <SelectItem value="price,DESC">Cena: malejąco</SelectItem>
                  <SelectItem value="title,ASC">Tytuł: A-Z</SelectItem>
                  <SelectItem value="title,DESC">Tytuł: Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Cena (zł)</Label>
              <div className="flex items-center gap-2">
                <Input placeholder="Od" type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                <span className="text-muted-foreground">-</span>
                <Input placeholder="Do" type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={handleApplyFilters}>
              Zastosuj filtry
            </Button>
          </div>
        </aside>

        <main className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">
              Wyniki wyszukiwania
              <span className="ml-2 text-sm font-normal text-muted-foreground">({ads.length} ogłoszeń)</span>
            </h2>
          </div>

          {isLoading && page === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <AdCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <>
              {ads.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ads.map((ad) => (
                      <AdCard key={ad.advertisementId} {...ad} />
                    ))}
                  </div>

                  {!isLastPage && (
                    <div className="mt-12 mb-8 flex justify-center">
                      <Button
                        variant="outline"
                        onClick={() => setPage((prev) => prev + 1)}
                        disabled={isLoadingMore}
                        className="rounded-full px-8 py-5 border-primary/30 text-primary font-semibold hover:bg-slate-50 shadow-sm transition-all"
                      >
                        {isLoadingMore ? (
                          <span className="flex items-center gap-2">
                            <span className="h-4 w-4 animate-spin rounded-full border-b-2 border-primary"></span>
                            Ładowanie...
                          </span>
                        ) : (
                          "Załaduj więcej"
                        )}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
                  <p className="text-lg font-medium">Brak wyników</p>
                  <p className="text-muted-foreground">Spróbuj zmienić kryteria wyszukiwania.</p>
                  <Button variant="link" onClick={clearFilters}>
                    Wyczyść filtry
                  </Button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
