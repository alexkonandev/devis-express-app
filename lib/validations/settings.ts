import * as z from "zod";

// On définit un schéma où tout est explicitement une string (même vide)
// pour matcher exactement avec les inputs HTML et éviter les conflits TS.
export const settingsSchema = z.object({
  companyName: z.string().min(2, "Le nom est requis"),
  companyEmail: z.string().email("Email invalide"),
  companyPhone: z.string(),
  companyAddress: z.string(),
  companySiret: z.string(),
  companyWebsite: z.string(),
  quotePrefix: z.string().min(1, "Préfixe requis"),
  nextQuoteNumber: z.number().min(1),
  defaultVatRate: z.number().min(0).max(100),
  defaultTerms: z.string(),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;
