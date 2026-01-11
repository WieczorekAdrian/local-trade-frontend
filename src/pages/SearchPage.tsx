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

const CATEGORIES = [
  { id: "1", name: "Motoryzacja" },
  { id: "2", name: "Nieruchomości" },
  { id: "3", name: "Elektronika" },
  { id: "4", name: "Dom i Ogród" },
  { id: "5", name: "Moda" },
];

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [title, setTitle] = useState(searchParams.get("title") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [categoryId, setCategoryId] = useState(searchParams.get("categoryId") || "");

  // Aktualizacja ogłoszeń, gdy zmieni się URL
  useEffect(() => {
    const fetchAds = async () => {
      setIsLoading(true);
      try {
        const params = {
          title: searchParams.get("title") || undefined,
          location: searchParams.get("location") || undefined,
          minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
          maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
          categoryId: searchParams.get("categoryId") ? Number(searchParams.get("categoryId")) : undefined,
        };
        const data = await getAllAds(params);
        setAds(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAds();
  }, [searchParams]);

  // Funkcja zatwierdzająca filtry (wrzuca stan do URL)
  const handleApplyFilters = () => {
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
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Cena */}
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

        {/* 3. PRAWA KOLUMNA (WYNIKI) */}
        <main className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">
              Wyniki wyszukiwania
              <span className="ml-2 text-sm font-normal text-muted-foreground">({ads.length} ogłoszeń)</span>
            </h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {ads.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ads.map((ad) => (
                    <AdCard key={ad.advertisementId} {...ad} />
                  ))}
                </div>
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
