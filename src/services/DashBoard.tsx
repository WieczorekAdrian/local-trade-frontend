import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getAllAds, type Advertisement } from "@/services/ad.service";
import { AdCard } from "@/components/AdCard";
import { toast } from "sonner";
import { useAuth } from "@/auth/auth.context";

export default function DashboardPage() {
    const [ads, setAds] = useState<Advertisement[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const { user, logout } = useAuth();

    const handleLogoutButton = async () => {
        toast.info("Wylogowywanie...");
        logout();
    };

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
            <nav className="border-b bg-card px-6 py-4 mb-8 sticky top-0 z-10 shadow-sm">
                <div className="container mx-auto flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold text-primary tracking-tighter">
                        Local Trade
                    </Link>

                    <div className="flex gap-4 items-center">
                        {user ? (
                            <>
                                <div className="hidden md:flex flex-col items-end mr-2">
                                    <span className="text-sm font-medium leading-none">
                                        {user.email}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        Ocena: {user.averageRating ? user.averageRating.toFixed(1) : "Brak"} ({user.ratingCount})
                                    </span>
                                </div>
                                <Button variant="ghost" size="sm">Mój profil</Button>
                                <Button variant="outline" size="sm" onClick={handleLogoutButton}>
                                    Wyloguj
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button variant="ghost">Zaloguj się</Button>
                                </Link>
                                <Link to="/signup">
                                    <Button>Załóż konto</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-4">
                <header className="mb-8">
                    <h2 className="text-3xl font-bold tracking-tight">Najnowsze okazje</h2>
                    <p className="text-muted-foreground mt-1">
                        Przeglądaj ogłoszenia w Twojej okolicy
                    </p>
                </header>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {ads.length > 0 ? (
                            ads.map((ad) => (
                                <AdCard key={ad.advertisementId} {...ad} />
                            ))
                        ) : (
                            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
                                <p className="text-lg text-muted-foreground mb-4">
                                    Jeszcze nikt nic nie dodał.
                                </p>
                                {user && (
                                    <Button onClick={() => toast.info("Funkcja dodawania wkrótce!")}>
                                        Dodaj pierwsze ogłoszenie
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}