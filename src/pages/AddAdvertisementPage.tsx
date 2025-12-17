import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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

const CATEGORIES = [
  { id: "1", name: "Elektronika" },
  { id: "2", name: "Moda" },
  { id: "3", name: "Motoryzacja" },
  { id: "4", name: "Dom i Ogród" },
  { id: "5", name: "Sport" },
];

export default function AddAdvertisementPage() {
  const navigate = useNavigate();

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
      await createAdvertisement({
        ...data,
        active: true,
        image: null,
      });
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
                    <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz kategorię" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Opublikuj ogłoszenie
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
