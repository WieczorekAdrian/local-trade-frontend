import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Mail, User, Star, Shield } from "lucide-react";
import { getLoggedInUser } from "@/feature/user/user.service";
import { type UserDashboardDto } from "@/feature/user/user.types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const [user, setUser] = useState<UserDashboardDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getLoggedInUser();
        setUser(data);
      } catch (error) {
        console.error(error);
        toast.error("Nie udało się pobrać danych profilu.");
      } finally {
        setLoading(false);
      }
    };

    void fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <div className="text-center py-10">Brak danych użytkownika.</div>;
  }

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        {/* LEWA KOLUMNA: WIZYTÓWKA */}
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 relative">
              <Avatar className="h-24 w-24 border-2 border-primary/10">
                {/* Generujemy avatar na podstawie imienia lub maila */}
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name || user.email}`} />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>

            {/* Wyświetlamy IMIĘ z backendu */}
            <CardTitle className="text-xl">{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>

            <div className="mt-2 flex justify-center">
              <Badge variant="secondary" className="uppercase text-xs">
                {user.role.replace("ROLE_", "")}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-2">
            <div className="flex items-center space-x-3 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="truncate" title={user.userId}>
                ID: {user.userId}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* PRAWA KOLUMNA: STATYSTYKI */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Statystyki konta</CardTitle>
              <CardDescription>Twoja reputacja w serwisie.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {/* Karta Oceny */}
                <div className="flex flex-col space-y-1 p-4 border rounded-md bg-card/50">
                  <span className="flex items-center text-sm font-medium text-muted-foreground mb-2">
                    <Star className="mr-2 h-4 w-4 text-yellow-500" /> Średnia ocena
                  </span>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold">{user.averageRating.toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground mb-1">/ 5.0</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Na podstawie {user.ratingCount} opinii</span>
                </div>

                {/* Karta Roli / Statusu */}
                <div className="flex flex-col space-y-1 p-4 border rounded-md bg-card/50">
                  <span className="flex items-center text-sm font-medium text-muted-foreground mb-2">
                    <Shield className="mr-2 h-4 w-4 text-primary" /> Status konta
                  </span>
                  <span className="text-2xl font-bold capitalize">
                    {user.role === "ROLE_ADMIN" ? "Administrator" : "Użytkownik"}
                  </span>
                  <span className="text-xs text-muted-foreground">Konto aktywne</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
