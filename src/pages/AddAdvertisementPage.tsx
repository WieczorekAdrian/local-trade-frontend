import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, Plus, X } from "lucide-react";

import { createAdvertisement } from "@/feature/advertisement/ad.service";
import {
  addAdvertisementSchema,
  type AddAdvertisementFormValues,
} from "@/feature/advertisement/add-advertisement.schema.ts";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { getCategories } from "@/feature/category/category.service";
import type { Category } from "@/feature/category/category.types";

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
        toast.error("Error getting categories.");
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
  const form = useForm({
    resolver: zodResolver(addAdvertisementSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      price: 0,
      categoryId: 0,
    },
  });

  const onSubmit = async (data: AddAdvertisementFormValues) => {
    try {
      const finalData = { ...data, active: true };
      await createAdvertisement(finalData, selectedFiles);

      toast.success("Ogłoszenie dodane pomyślnie!");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Wystąpił błąd podczas dodawania ogłoszenia.");
    }
  };

  return (
    <div className="container mx-auto py-10 flex justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Dodaj nowe ogłoszenie</CardTitle>
          <CardDescription>Wypełnij poniższe dane, aby wystawić przedmiot na sprzedaż.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tytuł ogłoszenia</FormLabel>
                    <FormControl>
                      <Input placeholder="np. Laptop Dell XPS" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cena (PLN)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          value={(field.value as number) || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lokalizacja</FormLabel>
                      <FormControl>
                        <Input placeholder="np. Kraków" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Kategoria (Shadcn Select) */}
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategoria</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value ? field.value.toString() : ""}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz kategorię" />
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
              {/* SEKCJA ZDJĘĆ */}
              <div className="space-y-4 py-4">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Zdjęcia (Pierwsze będzie głównym)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {previews.map((url, index) => (
                    <div key={url} className="relative aspect-square rounded-md overflow-hidden border">
                      <img src={url} className="object-cover w-full h-full" alt="Podgląd" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 rounded-full"
                        onClick={() => {
                          setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
                          setPreviews((prev) => prev.filter((_, i) => i !== index));
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}

                  {previews.length < 5 && (
                    <label className="border-2 border-dashed rounded-md aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-muted transition-colors">
                      <Plus className="h-8 w-8 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground mt-2">Dodaj zdjęcie</span>
                      <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                  )}
                </div>
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Opis przedmiotu</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Opisz stan, cechy i historię przedmiotu..."
                        className="resize-none"
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button type="button" variant="outline" className="w-full" onClick={() => navigate("/")}>
                  Anuluj
                </Button>
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Opublikuj ogłoszenie
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
