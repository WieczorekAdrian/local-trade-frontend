import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/auth/auth.context";
import { Plus, Heart, User, LogOut, MessageSquare, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { useAdvertisement } from "@/feature/advertisement/hooks/advertisement.hooks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
              {/* OBSERWOWANE */}
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
                  className={`hidden md:inline text-sm font-semibold ${favoriteIds.size > 0 ? "text-primary" : "text-muted-foreground"}`}
                >
                  Obserwowane
                </span>
              </Link>

              {/* DODAJ OGŁOSZENIE */}
              <Link to="/add-offer" className="mr-2">
                <Button className="gap-2 font-bold" variant="default">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Dodaj ogłoszenie</span>
                </Button>
              </Link>

              {/* USER DROPDOWN MENU */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-3">
                    <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex flex-col items-start text-left hidden md:flex">
                      <span className="text-sm font-semibold leading-none max-w-[150px] truncate">{user.email}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground opacity-50" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <Link to="/profile"></Link>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Moje konto</p>
                      <p className="text-xs leading-none text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer w-full flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Mój profil</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/chats" className="cursor-pointer w-full flex items-center">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      <span>Moje czaty</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={handleLogoutButton}
                    className="cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-950/20"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Wyloguj</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
