"use server";

import db from "@/lib/prisma";
import { getClerkUserId } from "@/lib/auth";
import { revalidatePath } from "next/cache";

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
        ...payload,
        // On s'assure que nextQuoteNumber est bien un int
        nextQuoteNumber: Number(payload.nextQuoteNumber),
        defaultVatRate: Number(payload.defaultVatRate),
      },
    });

    // On revalide tout pour que l'éditeur reçoive les nouvelles infos instantanément
    revalidatePath("/settings");
    revalidatePath("/editor");

    return { success: true, message: "Configuration sauvegardée." };
  } catch (error) {
    console.error("Erreur Settings:", error);
    return { success: false, error: "Erreur technique lors de la sauvegarde." };
  }
}
