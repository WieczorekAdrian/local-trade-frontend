import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getAllAds } from "@/feature/advertisement/ad.service";
import { AdCard } from "@/feature/advertisement/AdCard";
import { useAuth } from "@/auth/auth.context";
import { Plus } from "lucide-react";
import type { Advertisement } from "@/feature/advertisement/advertisement.types";

export default function HomePage() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const data = await getAllAds();
        setAds(data);
      } catch (e) {
        console.error("Błąd pobierania ogłoszeń:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAds();
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Navbar został usunięty stąd i przeniesiony do App.tsx */}
      <main className="container mx-auto px-4">
        <header className="mb-8 pt-8">
          <h2 className="text-3xl font-bold tracking-tight">Najnowsze okazje</h2>
          <p className="text-muted-foreground mt-1">Przeglądaj ogłoszenia w Twojej okolicy</p>
        </header>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {ads.length > 0 ? (
              ads.map((ad) => <AdCard key={ad.advertisementId} {...ad} />)
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                <p className="text-lg text-muted-foreground mb-4">Jeszcze nikt nic nie dodał.</p>
                {user && (
                  <Link to="/add-offer">
                    <Button size="lg" className="gap-2">
                      <Plus className="h-5 w-5" /> Dodaj pierwsze ogłoszenie
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
