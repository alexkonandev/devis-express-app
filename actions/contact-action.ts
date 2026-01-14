// actions/contact-action.ts
"use server";

import { contactSchema, ContactInput } from "@/lib/validations/contact";

/**
 * Action pour traiter le formulaire de contact.
 * Pas de type 'any' : validation stricte via Zod.
 */
export async function sendContactAction(data: ContactInput) {
  const result = contactSchema.safeParse(data);

  if (!result.success) {
    return { error: "Données de formulaire invalides." };
  }

  // Logique métier : Envoi d'email ou stockage en DB
  // Pour l'instant, simulation de succès pour le flux UI
  console.log("Contact Action - Message de :", result.data.email);

  return { success: true };
}
