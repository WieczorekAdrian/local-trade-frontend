import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useNavigate, createSearchParams } from "react-router-dom";
import { RotatingText } from "@/components/common/RotatingText";
import { CityAutocomplete } from "@/components/common/CityAutocomplete";
import * as React from "react";

export function HeroSearch() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = {
      ...(title && { title }),
      ...(location && { location }),
    };

    navigate({
      pathname: "/search",
      search: `?${createSearchParams(params)}`,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="bg-muted/30 py-16 border-b">
      <div className="container mx-auto px-4 flex flex-col items-center text-center space-y-6">
        {/* Nagłówek */}
        <div className="space-y-2 flex flex-col items-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground flex flex-col md:flex-row gap-0 md:gap-2 items-center justify-center">
            <span>Kupuj i sprzedawaj</span>
            <RotatingText />
          </h1>
          <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto pt-2">
            Znajdź najlepsze okazje w Twojej okolicy.
          </p>
        </div>

        {/* Pasek wyszukiwania */}
        <div className="w-full max-w-3xl bg-background p-2 rounded-xl shadow-lg border flex flex-col sm:flex-row gap-2 items-center relative z-20">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Czego szukasz?"
              className="pl-10 border-0 shadow-none focus-visible:ring-0 text-md h-12"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="hidden sm:block h-8 w-[1px] bg-border mx-2"></div>

          {/* --- NAPRAWA TUTAJ --- */}
          <CityAutocomplete
            value={location}
            onChange={setLocation}
            onKeyDown={handleKeyDown}
            className="flex-1 w-full sm:w-[30%]"
            inputClassName="border-0 shadow-none focus-visible:ring-0 text-md h-12 bg-transparent"
          />

          <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-md font-bold rounded-lg" onClick={handleSearch}>
            Szukaj
          </Button>
        </div>
      </div>
    </div>
  );
}
