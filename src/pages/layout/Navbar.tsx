import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/auth/auth.context";
import { Plus, Heart, User, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useAdvertisement } from "@/feature/advertisement/hooks/advertisement.hooks";

export function Navbar() {
  const { user, logout } = useAuth();
  const { favoriteIds } = useAdvertisement();

  const handleLogoutButton = async () => {
    toast.info("Wylogowywanie...");
    await logout();
  };

  return (
    <nav className="border-b bg-card px-6 py-4 mb-8 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        {/* LOGO */}
        <Link to="/" className="text-2xl font-bold text-primary tracking-tighter">
          Local Trade
        </Link>

        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <Link
                to="/favorites"
                className="flex items-center gap-2 px-3 py-2 hover:bg-muted rounded-lg transition-all group"
              >
                <div className="relative">
                  <Heart
                    className={`h-5 w-5 transition-colors ${
                      favoriteIds.size > 0
                        ? "fill-red-500 text-red-500"
                        : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  />
                  {favoriteIds.size > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[9px] font-bold rounded-full h-3.5 w-3.5 flex items-center justify-center ring-2 ring-background">
                      {favoriteIds.size}
                    </span>
                  )}
                </div>
                <span
                  className={`text-sm font-semibold ${favoriteIds.size > 0 ? "text-primary" : "text-muted-foreground"}`}
                >
                  Obserwowane
                </span>
              </Link>

              <Link to="/add-offer">
                <Button className="gap-2 font-bold" variant="default">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Dodaj ogłoszenie</span>
                </Button>
              </Link>

              <div className="hidden lg:flex flex-col items-end mr-2">
                <span className="text-sm font-medium leading-none">{user.email}</span>
                <span className="text-xs text-muted-foreground">
                  Ocena: {user.stats.rating ? user.stats.rating.toFixed(1) : "Brak"} ({user.stats.count})
                </span>
              </div>

              <Button variant="ghost" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden xl:inline">Mój profil</span>
              </Button>

              <Button variant="outline" size="sm" onClick={handleLogoutButton} className="gap-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden xl:inline">Wyloguj</span>
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
  );
}
