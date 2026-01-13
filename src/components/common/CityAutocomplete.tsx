import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import { polishCities } from "@/data/cities";
import { cn } from "@/lib/utils";

interface CityAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  onBlur?: () => void;
  className?: string;
  inputClassName?: string;
}

export function CityAutocomplete({
  value,
  onChange,
  onKeyDown,
  onBlur,
  className,
  inputClassName,
}: CityAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue);

    if (inputValue.length > 0) {
      const filtered = polishCities.filter((city) => city.toLowerCase().startsWith(inputValue.toLowerCase()));
      setFilteredCities(filtered);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleSelectCity = (city: string) => {
    onChange(city);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className={cn("relative w-full", className)}>
      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />

      <Input
        placeholder="Miasto"
        // Tu jest zmiana: usunąłem border-0. Teraz Input jest standardowy.
        // Jeśli chcemy go zmienić, przekazujemy inputClassName.
        className={cn("pl-10", inputClassName)}
        value={value}
        onChange={handleInputChange}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        onFocus={() => {
          if (value.length > 0) setIsOpen(true);
        }}
        autoComplete="off"
      />

      {isOpen && filteredCities.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-md z-50 max-h-[200px] overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
          <ul className="py-1">
            {filteredCities.map((city) => (
              <li
                key={city}
                onClick={() => handleSelectCity(city)}
                className="px-4 py-2 cursor-pointer text-sm hover:bg-muted transition-colors flex items-center gap-2"
              >
                <MapPin className="h-3 w-3 text-muted-foreground" />
                {city}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
