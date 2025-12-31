import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, ImageOff } from "lucide-react";
import { formatDate } from "./ad.service";
import type { Advertisement } from "@/feature/advertisement/advertisement.types";

const fixDockerUrl = (url: string | null | undefined) => {
  if (!url) return null;
  return url.replace("http://minio:9000", "http://localhost:9000");
};

export function AdCard(props: Advertisement) {
  const { advertisementId, title, price, location, thumbnailUrls, imageUrls, createdAt } = props;

  const rawImage = thumbnailUrls?.[0] || imageUrls?.[0];
  const displayImage = fixDockerUrl(rawImage);

  return (
    <Link to={`/advertisement/${advertisementId}`}>
      <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
        <div className="aspect-[4/3] w-full bg-muted relative overflow-hidden flex items-center justify-center">
          {displayImage ? (
            <img
              src={displayImage}
              alt={title}
              className="object-cover w-full h-full transition-transform hover:scale-105"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.nextElementSibling?.classList.remove("hidden");
              }}
            />
          ) : null}

          <div
            className={`flex flex-col items-center justify-center text-muted-foreground ${displayImage ? "hidden" : ""}`}
          >
            <ImageOff className="h-10 w-10 mb-2" />
            <span className="text-xs">Brak zdjęcia</span>
          </div>

          <Badge variant="secondary" className="absolute top-2 right-2 backdrop-blur-md bg-white/80">
            {props.active ? "Aktywne" : "Zakończone"}
          </Badge>
        </div>

        {/* Treść */}
        <CardHeader className="p-4 pb-2">
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary">{title}</h3>
          <p className="text-xl font-bold text-primary">
            {price.toLocaleString("pl-PL", { style: "currency", currency: "PLN" })}
          </p>
        </CardHeader>

        <CardContent className="p-4 pt-0 flex-grow">
          <div className="flex items-center text-sm text-muted-foreground mt-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="truncate">{location}</span>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 text-xs text-muted-foreground border-t bg-muted/20 mt-auto">
          {formatDate(createdAt)}
        </CardFooter>
      </Card>
    </Link>
  );
}
