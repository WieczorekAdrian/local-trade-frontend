import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getCategories } from "../../category/category.service";
import type { Category } from "../../category/category.types";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  selectedCategoryId: number | null;
  onSelectCategory: (id: number | null) => void;
}

export const CategoryFilter = ({ selectedCategoryId, onSelectCategory }: CategoryFilterProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        toast.error("Nie udało się pobrać kategorii");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    void fetchCategories();
  }, []);

  if (loading) {
    return <div className="h-10 bg-muted animate-pulse rounded-md w-full mb-6" />;
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide mask-fade-sides">
      <button
        onClick={() => onSelectCategory(null)}
        className={cn(
          "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border",
          selectedCategoryId === null
            ? "bg-primary text-primary-foreground border-primary shadow-sm hover:bg-primary/90" // Aktywny (Globalny styl)
            : "bg-background text-muted-foreground border-border hover:bg-muted hover:text-foreground", // Nieaktywny
        )}
      >
        Wszystkie
      </button>

      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border",
            selectedCategoryId === category.id
              ? "bg-primary text-primary-foreground border-primary shadow-sm hover:bg-primary/90" // Aktywny
              : "bg-background text-muted-foreground border-border hover:bg-muted hover:text-foreground", // Nieaktywny
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};
