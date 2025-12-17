import { z } from "zod";

export const addAdvertisementSchema = z.object({
    title: z.string().min(5, "Tytuł musi mieć min. 5 znaków").max(100),

    description: z.string().min(20, "Opis musi mieć min. 20 znaków"),

    price: z.coerce.number().min(0.01, "Cena musi być dodatnia"),

    categoryId: z.coerce.number().min(1, "Wybierz kategorię"),

    location: z.string().min(2, "Podaj miasto"),
});

export type AddAdvertisementFormValues = z.infer<typeof addAdvertisementSchema>;