// Fichier: lib/schemas.ts

import { z } from "zod";

export const serviceItemSchema = z.object({
  // --- Champs Simples (Éditables via UI Form) ---
  title: z.string().min(2, "Le titre est requis (min 2 car.)"),
  description: z.string().optional(),
  category: z.string().optional(),
  subcategory: z.string().optional(),

  unitPriceEuros: z.coerce.number().min(0, "Le prix ne peut pas être négatif"),
  defaultQuantity: z.coerce.number().min(1).default(1),
  isTaxable: z.boolean().default(true),

  // --- Champs Riches (Capsules JSON) ---
  // On utilise .any() .optional() pour créer un "Tunnel" sécurisé.
  // Les données complexes passent à travers le formulaire sans être validées strictment,
  // ce qui évite de les perdre lors d'un edit simple.
  pricing: z.any().optional(),
  technicalScope: z.any().optional(),
  salesCopy: z.any().optional(),
  marketContext: z.any().optional(),
});

export type ServiceItemSchema = z.infer<typeof serviceItemSchema>;
