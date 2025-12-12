// lib/schemas.ts
import { z } from "zod";

export const serviceItemSchema = z.object({
  title: z
    .string()
    .min(3, "Le titre doit contenir au moins 3 caractères.")
    .max(100, "Le titre est trop long (max 100)."),
  description: z
    .string()
    .max(500, "La description ne doit pas dépasser 500 caractères.")
    .optional(),
  unitPriceEuros: z.coerce
    .number({ invalid_type_error: "Le prix doit être un nombre." })
    .min(0, "Le prix ne peut pas être négatif.")
    .max(100000, "Prix maximum dépassé."),
  defaultQuantity: z.coerce
    .number()
    .int()
    .min(1, "La quantité par défaut doit être au moins 1.")
    .optional(),
  category: z.string().min(1, "La catégorie est requise."),
  isTaxable: z.boolean().default(true),
});

export type ServiceItemSchema = z.infer<typeof serviceItemSchema>;
