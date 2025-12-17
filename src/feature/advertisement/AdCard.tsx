import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

interface AdCardProps {
    advertisementId: string;
    title: string;
    price: number;
    location: string;
    image: string | null; // Główne zdjęcie
}

export function AdCard({ title, price, location, image }: AdCardProps) {
    const formattedPrice = new Intl.NumberFormat("pl-PL", {
        style: "currency",
        currency: "PLN",
    }).format(price);

    return (
        <Card className="group overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md">
            <div className="aspect-[4/3] w-full bg-secondary flex items-center justify-center overflow-hidden group-hover:bg-secondary/80 transition-colors">
                {image ? (
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <span className="text-muted-foreground font-medium text-sm">Brak zdjęcia</span>
                )}
            </div>

            <CardHeader className="p-4 space-y-0">
                <CardTitle className="text-base font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                    {title}
                </CardTitle>
            </CardHeader>

            <CardContent className="p-4 pt-0">
                <div className="flex items-center text-muted-foreground text-xs mb-2">
                    <MapPin className="w-3 h-3 mr-1" />
                    {location}
                </div>
                <p className="text-xl font-bold text-foreground">
                    {formattedPrice}
                </p>
            </CardContent>

            <CardFooter className="p-4 pt-0">
                <Button className="w-full font-medium active:scale-95 transition-transform">
                    Sprawdź ofertę
                </Button>
            </CardFooter>
        </Card>
    );
}