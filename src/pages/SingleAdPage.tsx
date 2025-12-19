import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { getAdById, type Advertisement, formatDate } from "@/feature/advertisement/ad.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Calendar, User, MessageCircle, ArrowLeft, ImageOff } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/auth/auth.context";

const fixDockerUrl = (url: string | null | undefined) => {
  if (!url) return null;
  return url.replace("http://minio:9000", "http://localhost:9000");
};

export default function SingleAdPage() {
  const { id } = useParams<{ id: string }>();
  const [ad, setAd] = useState<Advertisement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const location = useLocation();
  useEffect(() => {
    if (!id) return;

    const fetchAd = async () => {
      try {
        const data = await getAdById(id);
        setAd(data);
      } catch (error) {
        console.error(error);
        toast.error("Nie udało się pobrać ogłoszenia");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAd();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!ad) {
    return <div className="container mx-auto py-10 text-center">Ogłoszenie nie istnieje.</div>;
  }

  const rawImage = ad.imageUrls?.[0] || ad.thumbnailUrls?.[0];
  const displayImage = fixDockerUrl(rawImage);
  const isOwner = user?.email === ad.sellerEmail;

  return (
    <div className="container mx-auto px-4 py-8 pb-20">
      <Link to="/">
        <Button variant="ghost" className="mb-6 gap-2 pl-0 hover:bg-transparent hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Wróć do listy
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEWA KOLUMNA - ZDJĘCIE */}
        <div className="space-y-4">
          <div className="aspect-[4/3] bg-muted rounded-xl overflow-hidden relative flex items-center justify-center border shadow-sm">
            {displayImage ? (
              <img
                src={displayImage}
                alt={ad.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling?.classList.remove("hidden");
                }}
              />
            ) : null}

            <div
              className={`flex flex-col items-center justify-center text-muted-foreground ${displayImage ? "hidden" : ""}`}
            >
              <ImageOff className="h-16 w-16 mb-2 opacity-50" />
              <span className="text-sm">Brak zdjęcia</span>
            </div>

            <Badge className="absolute top-4 left-4 text-sm px-3 py-1">{ad.active ? "Aktywne" : "Zakończone"}</Badge>
          </div>
        </div>

        {/* PRAWA KOLUMNA - SZCZEGÓŁY */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">{ad.title}</h1>
            <p className="text-4xl font-extrabold text-primary">
              {ad.price.toLocaleString("pl-PL", { style: "currency", currency: "PLN" })}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1 bg-muted/50 px-3 py-1 rounded-full">
              <MapPin className="h-4 w-4" /> {ad.location}
            </div>
            <div className="flex items-center gap-1 bg-muted/50 px-3 py-1 rounded-full">
              <Calendar className="h-4 w-4" />
              Dodano: {formatDate(ad.createdAt)}
            </div>
          </div>

          <Separator />

          <div className="prose prose-stone dark:prose-invert max-w-none">
            <h3 className="text-lg font-semibold mb-2">Opis</h3>
            <p className="whitespace-pre-line text-muted-foreground leading-relaxed">{ad.description}</p>
          </div>

          <Separator />

          {/* KARTA SPRZEDAWCY I AKCJE */}
          <Card className="bg-card/50 border-primary/20 shadow-sm mt-auto">
            <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-medium text-lg">Sprzedawca</p>
                  <p className="text-sm text-muted-foreground">{ad.sellerEmail || "Użytkownik"}</p>
                </div>
              </div>

              {/* LOGIKA PRZYCISKÓW */}
              {isOwner ? (
                <Button variant="outline" disabled className="w-full sm:w-auto">
                  To Twoje ogłoszenie
                </Button>
              ) : user ? (
                <Link to={`/chat?recipientId=${ad.sellerId}&adId=${ad.advertisementId}`}>
                  <Button size="lg" className="w-full sm:w-auto gap-2 font-bold shadow-lg shadow-primary/20">
                    <MessageCircle className="h-5 w-5" />
                    Napisz wiadomość
                  </Button>
                </Link>
              ) : (
                <Link to="/login" state={{ from: location }}>
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto gap-2">
                    Zaloguj się, aby napisać
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
