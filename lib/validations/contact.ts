// lib/validations/contact.ts
import * as z from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  // On définit l'enum, et on gère l'erreur de sélection après
  subject: z
    .enum(["support", "facturation", "partenariat"])
    .refine((val) => val !== undefined, {
      message: "Veuillez choisir un sujet",
    }),
  message: z.string().min(10, "Le message doit faire au moins 10 caractères"),
});

export type ContactInput = z.infer<typeof contactSchema>;
