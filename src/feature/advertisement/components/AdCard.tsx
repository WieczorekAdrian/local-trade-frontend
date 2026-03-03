import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, ImageOff } from "lucide-react";
import { formatDate } from "../ad.service";
import type { Advertisement } from "@/feature/advertisement/advertisement.types";
import { FavoriteButton } from "@/components/common/FavoriteButton";

const fixDockerUrl = (url: string | null | undefined) => {
  if (!url) return null;
  return url.replace("http://minio:9000", "http://localhost:9000");
};

export function AdCard(props: Advertisement) {
  const { advertisementId, title, price, location, thumbnailUrls, imageUrls, createdAt, active } = props;

  const rawImage = thumbnailUrls?.[0] || imageUrls?.[0];
  const displayImage = fixDockerUrl(rawImage);

  return (
    <div className="relative group h-full">
      <div className="absolute top-3 left-3 z-30 transition-transform duration-300 group-hover:scale-110">
        <FavoriteButton adId={advertisementId} />
      </div>

      <Link to={`/advertisement/${advertisementId}`} className="block h-full">
        <Card className="h-full overflow-hidden border border-border/50 bg-card hover:border-primary/30 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col">
          <div className="aspect-[4/3] w-full bg-muted relative overflow-hidden flex items-center justify-center">
            {displayImage ? (
              <img
                src={displayImage}
                alt={title}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-muted-foreground/40 bg-muted/50 w-full h-full">
                <ImageOff className="h-12 w-12 mb-2 stroke-[1.5px]" />
                <span className="text-xs font-medium uppercase tracking-widest">Brak zdjęcia</span>
              </div>
            )}

            <Badge
              className={`absolute top-3 right-3 backdrop-blur-md font-semibold shadow-sm transition-colors ${
                active
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "bg-destructive text-white hover:bg-destructive/90"
              }`}
            >
              {active ? "Aktywne" : "Zakończone"}
            </Badge>
          </div>

          <CardHeader className="p-4 pb-0">
            <h3 className="font-bold text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors min-h-[2.5rem]">
              {title}
            </h3>
          </CardHeader>

          <CardContent className="p-4 pt-2 flex-grow flex flex-col justify-between">
            <p className="text-2xl font-black text-primary tracking-tight">
              {price.toLocaleString("pl-PL", { style: "currency", currency: "PLN", maximumFractionDigits: 0 })}
            </p>

            <div className="flex items-center text-xs text-muted-foreground mt-4 font-medium">
              <MapPin className="h-3.5 w-3.5 mr-1.5 text-primary/60 flex-shrink-0" />
              <span className="truncate">{location}</span>
            </div>
          </CardContent>

          <CardFooter className="px-4 py-3 text-[11px] font-medium uppercase tracking-tighter text-muted-foreground/70 border-t border-border/40 bg-muted/5 mt-auto">
            <div className="flex justify-between w-full">
              <span>Dodano</span>
              <span>{formatDate(createdAt)}</span>
            </div>
          </CardFooter>
        </Card>
      </Link>
    </div>
  );
}
