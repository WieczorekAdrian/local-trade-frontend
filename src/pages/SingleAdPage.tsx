import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { getAdById, formatDate } from "@/feature/advertisement/ad.service";
import { FavoriteButton } from "@/components/common/FavoriteButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Advertisement } from "@/feature/advertisement/advertisement.types";
import {
  MapPin,
  Calendar,
  User,
  MessageCircle,
  ArrowLeft,
  ImageOff,
  ChevronLeft,
  ChevronRight,
  Maximize2, // Dodany import ikony zamknięcia
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/auth/auth.context";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import { ChatWindow } from "@/feature/chat/components/ChatWindow";

const fixDockerUrl = (url: string | null | undefined) => {
  if (!url) return null;
  return url.replace("http://minio:9000", "http://localhost:9000");
};

export default function SingleAdPage() {
  const { id } = useParams<{ id: string }>();
  const [ad, setAd] = useState<Advertisement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false); // Stan otwarcia czatu
  const { user } = useAuth();
  const location = useLocation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const images = ad?.imageUrls?.map(fixDockerUrl) || [];

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

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

  if (isLoading) return <div className="flex justify-center items-center h-screen">...</div>;
  if (!ad) return <div className="container mx-auto py-10 text-center">Ogłoszenie nie istnieje.</div>;

  const isOwner = user?.email === ad.sellerEmail;

  return (
    <>
      <div className="container mx-auto px-4 py-8 pb-20">
        <Link to="/">
          <Button variant="ghost" className="mb-6 gap-2 pl-0 hover:bg-transparent hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> Wróć do listy
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div
              className="aspect-[4/3] bg-muted rounded-xl overflow-hidden relative flex items-center justify-center border shadow-sm group cursor-pointer"
              onClick={() => images.length > 0 && setIsLightboxOpen(true)}
            >
              {images.length > 0 ? (
                <>
                  <img
                    src={images[currentImageIndex]!}
                    alt={`${ad.title} - ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover transition-opacity duration-300"
                  />

                  <div className="absolute top-4 right-4 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-white z-10">
                    <Maximize2 className="h-5 w-5" />
                  </div>

                  <Badge className="absolute top-4 left-4 text-sm px-3 py-1 z-10">
                    {ad.active ? "Aktywne" : "Zakończone"}
                  </Badge>

                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>
                      <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded-md font-medium z-10">
                        {currentImageIndex + 1} / {images.length}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <ImageOff className="h-16 w-16 mb-2 opacity-50" />
                  <span className="text-sm">Brak zdjęcia</span>
                  <Badge className="absolute top-4 left-4 text-sm px-3 py-1">
                    {ad.active ? "Aktywne" : "Zakończone"}
                  </Badge>
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                      index === currentImageIndex ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img!} className="w-full h-full object-cover" alt={`Miniaturka ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold tracking-tight mb-2 leading-tight">{ad.title}</h1>
                <p className="text-4xl font-extrabold text-primary">
                  {ad.price.toLocaleString("pl-PL", {
                    style: "currency",
                    currency: "PLN",
                  })}
                </p>
              </div>

              <div className="flex-shrink-0">
                <FavoriteButton adId={ad.advertisementId} />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1 bg-secondary/50 px-3 py-1 rounded-full">
                <MapPin className="h-4 w-4" /> {ad.location}
              </div>

              <div className="flex items-center gap-1 bg-secondary/50 px-3 py-1 rounded-full">
                <Calendar className="h-4 w-4" />
                Dodano: {formatDate(ad.createdAt)}
              </div>
            </div>

            <Card className="bg-card/50 border-primary/20 shadow-sm">
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

                {isOwner ? (
                  <Button variant="outline" disabled className="w-full sm:w-auto">
                    To Twoje ogłoszenie
                  </Button>
                ) : user ? (
                  // Zmienione na przycisk otwierający czat zamiast Linku
                  <Button
                    size="lg"
                    onClick={() => setIsChatOpen(true)}
                    className="w-full sm:w-auto gap-2 font-bold shadow-lg shadow-primary/20"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Napisz wiadomość
                  </Button>
                ) : (
                  <Link to="/login" state={{ from: location }}>
                    <Button variant="secondary" size="lg" className="w-full sm:w-auto gap-2">
                      Zaloguj się, aby napisać
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>

            <Separator />

            <div className="prose prose-stone dark:prose-invert max-w-none">
              <h3 className="text-lg font-semibold mb-2">Opis</h3>
              <p className="whitespace-pre-line text-muted-foreground leading-relaxed">{ad.description}</p>
            </div>

            <Separator />
          </div>
        </div>
      </div>

      {images.length > 0 && (
        <Lightbox
          open={isLightboxOpen}
          close={() => setIsLightboxOpen(false)}
          index={currentImageIndex}
          slides={images.map((src) => ({ src: src! }))}
          on={{
            view: ({ index }) => setCurrentImageIndex(index),
          }}
          animation={{ fade: 300, swipe: 250 }}
          controller={{ closeOnBackdropClick: true }}
        />
      )}

      {isChatOpen && ad && (
        <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-bottom-10 duration-300">
          <ChatWindow
            recipientUsername={ad.sellerEmail || "Użytkownik"}
            variant="bubble" // <- To aktywuje tryb dymka
            onClose={() => setIsChatOpen(false)} // <- To podpina wewnętrzny przycisk "X"
          />
        </div>
      )}
    </>
  );
}
