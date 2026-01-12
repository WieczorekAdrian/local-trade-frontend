import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, Plus, X, Image as ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { createAdvertisement } from "@/feature/advertisement/ad.service";
import {
  addAdvertisementSchema,
  type AddAdvertisementFormValues,
} from "@/feature/advertisement/add-advertisement.schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// Zamiast jednej wielkiej karty, użyjemy mniejszych paneli lub w ogóle czystego tła
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCategories } from "@/feature/category/category.service";
import type { Category } from "@/feature/category/category.types";
import { CityAutocomplete } from "@/components/common/CityAutocomplete";

export default function AddAdvertisementPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        toast.error("Błąd podczas pobierania kategorii.");
        throw error;
      }
    };
    void fetchCategories();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);

      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const form = useForm<AddAdvertisementFormValues>({
    resolver: zodResolver(addAdvertisementSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      price: "",
      categoryId: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: AddAdvertisementFormValues) => {
    try {
      const finalData = {
        ...data,
        price: parseFloat(data.price),
        categoryId: parseInt(data.categoryId),
        active: true,
      };

      await createAdvertisement(finalData, selectedFiles);

      toast.success("Ogłoszenie opublikowane!");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Wystąpił błąd podczas dodawania ogłoszenia.");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto py-10 px-4 md:px-6">
        {/* NAGŁÓWEK STRONY */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Nowe ogłoszenie</h1>
          <p className="text-muted-foreground mt-2">Wypełnij szczegóły, aby wystawić przedmiot na sprzedaż.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* GRID LAYOUT: Lewa kolumna szeroka (2/3), Prawa wąska (1/3) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* --- LEWA KOLUMNA (Główna treść) --- */}
              <div className="lg:col-span-2 space-y-8">
                {/* SEKCJA 1: Podstawowe informacje */}
                <Card>
                  <CardHeader>
                    <CardTitle>Co sprzedajesz?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tytuł ogłoszenia</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="np. iPhone 13 Pro 128GB - Jak nowy"
                              className="text-lg py-6"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>Użyj chwytliwego tytułu. Unikaj WIELKICH LITER.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Opis</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Podaj szczegóły: stan techniczny, rok zakupu, powód sprzedaży..."
                              className="min-h-[200px] resize-none text-base"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* SEKCJA 2: Zdjęcia */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5" />
                      Zdjęcia
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {previews.map((url, index) => (
                        <div
                          key={url}
                          className="relative aspect-square rounded-lg overflow-hidden border group bg-muted"
                        >
                          <img
                            src={url}
                            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                            alt="Podgląd"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
                              setPreviews((prev) => prev.filter((_, i) => i !== index));
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          {index === 0 && (
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] text-center py-1 uppercase font-bold">
                              Główne
                            </div>
                          )}
                        </div>
                      ))}

                      {previews.length < 8 && (
                        <label className="border-2 border-dashed rounded-lg aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 hover:border-primary transition-all duration-200 group">
                          <div className="bg-muted p-3 rounded-full mb-2 group-hover:bg-background transition-colors">
                            <Plus className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
                          </div>
                          <span className="text-sm font-medium text-muted-foreground group-hover:text-primary">
                            Dodaj zdjęcie
                          </span>
                          <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                        </label>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                      Możesz dodać do 8 zdjęć. Pierwsze zdjęcie będzie wyświetlane na liście wyszukiwania.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* --- PRAWA KOLUMNA (Panel boczny - Sticky) --- */}
              <div className="space-y-6">
                <Card className="lg:sticky lg:top-24">
                  <CardHeader>
                    <CardTitle>Szczegóły sprzedaży</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* CENA */}
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cena (PLN)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                className="pl-4 text-lg font-semibold"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* KATEGORIA */}
                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kategoria</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Wybierz..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id.toString()}>
                                  {cat.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* LOKALIZACJA */}
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Lokalizacja</FormLabel>
                          <FormControl>
                            <CityAutocomplete value={field.value} onChange={field.onChange} onBlur={field.onBlur} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="pt-4 border-t">
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full font-bold text-md"
                        disabled={form.formState.isSubmitting}
                      >
                        {form.formState.isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Publikowanie...
                          </>
                        ) : (
                          "Opublikuj ogłoszenie"
                        )}
                      </Button>
                      <Button type="button" variant="ghost" className="w-full mt-2" onClick={() => navigate("/")}>
                        Anuluj
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
