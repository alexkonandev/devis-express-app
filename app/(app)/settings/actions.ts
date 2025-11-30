"use server";

import db from "@/lib/prisma";
import { getClerkUserId } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// Type aligné avec le Schema
export type SettingsPayload = {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  companySiret: string;
  companyWebsite: string;
  quotePrefix: string;
  nextQuoteNumber: number;
  defaultVatRate: number;
  defaultTerms: string;
};

export async function updateSettingsAction(payload: SettingsPayload) {
  const userId = await getClerkUserId();
  if (!userId) return { success: false, error: "Non autorisé" };

  try {
    await db.user.update({
      where: { id: userId },
      data: {
        companyName: payload.companyName,
        companyEmail: payload.companyEmail,
        companyPhone: payload.companyPhone,
        companyAddress: payload.companyAddress,
        companySiret: payload.companySiret,
        companyWebsite: payload.companyWebsite,
        quotePrefix: payload.quotePrefix,
        nextQuoteNumber: payload.nextQuoteNumber,
        defaultVatRate: payload.defaultVatRate,
        defaultTerms: payload.defaultTerms,
      },
    });

    revalidatePath("/settings");
    revalidatePath("/devis/new"); // Pour que le prochain devis prenne les nouveaux réglages
    return { success: true, message: "Paramètres mis à jour." };
  } catch (error) {
    console.error("Erreur Settings:", error);
    return { success: false, error: "Erreur lors de la sauvegarde." };
  }
}
