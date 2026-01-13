import { z } from "zod";

const priceRegex = /^\d+(\.\d{1,2})?$/;

export const addAdvertisementSchema = z.object({
  title: z.string().min(5, { message: "Tytuł musi mieć co najmniej 5 znaków" }),
  description: z.string().min(20, { message: "Opis musi mieć co najmniej 20 znaków" }),
  location: z.string().min(2, { message: "Podaj poprawną lokalizację" }),

  price: z
    .string()
    .min(1, { message: "Cena jest wymagana" })
    .regex(priceRegex, { message: "Podaj poprawną cenę (np. 99.99)" })
    .refine((val) => parseFloat(val) > 0, { message: "Cena musi być większa od 0" }),

  // Kategoria też jako string (bo Select HTML zwraca value="1")
  categoryId: z.string().min(1, { message: "Wybierz kategorię" }),
});

export type AddAdvertisementFormValues = z.infer<typeof addAdvertisementSchema>;
