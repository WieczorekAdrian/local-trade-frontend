import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../auth/auth.service";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await registerUser({ name, email, password });
            alert("Konto stworzone! Możesz się zalogować.");
            navigate("/login");
        } catch (error) {
            console.error("Błąd rejestracji", error);
            alert("Coś poszło nie tak. Spróbuj ponownie.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight text-center">
            Dołącz do Local Trade
    </CardTitle>
    <CardDescription className="text-center">
        Stwórz darmowe konto i zacznij handlować lokalnie
    </CardDescription>
    </CardHeader>
    <CardContent>
    <form onSubmit={handleRegister} className="grid gap-4">
    <div className="grid gap-2">
    <Label htmlFor="name">Imię</Label>
        <Input
    id="name"
    placeholder="Jan"
    value={name}
    onChange={(e) => setName(e.target.value)}
    required
    />
    </div>
    <div className="grid gap-2">
    <Label htmlFor="email">Email</Label>
        <Input
    id="email"
    type="email"
    placeholder="jan@example.com"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
    />
    </div>
    <div className="grid gap-2">
    <Label htmlFor="password">Hasło</Label>
        <Input
    id="password"
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
    />
    </div>
    <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Tworzenie konta..." : "Zarejestruj się"}
        </Button>
        </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 border-t p-6">
    <div className="text-sm text-center text-muted-foreground">
        Masz już konto?{" "}
        <Link to="/login" className="font-semibold text-primary hover:underline">
        Zaloguj się
    </Link>
    </div>
    </CardFooter>
    </Card>
    </div>
);
}