"use server";

import db from "@/lib/prisma";
import { getClerkUserId } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import {
  CatalogOfferInput,
  CatalogActionResponse,
  CatalogListItem,
} from "@/types/catalog";

export async function getCatalogOffers(): Promise<CatalogListItem[]> {
  try {
    const userId = await getClerkUserId();
    if (!userId) return [];

    return await db.catalogOffer.findMany({
      where: { userId }, // userId est le champ dans CatalogOffer lié à User.id
      orderBy: { title: "asc" },
    });
  } catch (err) {
    console.error("[GET_CATALOG_ERROR]:", err);
    return [];
  }
}

export async function upsertCatalogOffer(
  data: CatalogOfferInput
): Promise<CatalogActionResponse> {
  try {
    const userId = await getClerkUserId();
    if (!userId) return { success: false, error: "Non autorisé" };

    const offerData = {
      title: data.title,
      subtitle: data.subtitle || "", // Correction : subtitle au lieu de description
      unitPriceEuros: data.unitPriceEuros,
      category: data.category,
      isPremium: data.isPremium ?? false,
      userId: userId, // On lie directement à l'ID de l'user
    };

    const offer = data.id
      ? await db.catalogOffer.update({
          where: { id: data.id, userId }, // Sécurité: l'offre doit appartenir à l'user
          data: offerData,
        })
      : await db.catalogOffer.create({
          data: offerData,
        });

    revalidatePath("/dashboard/catalog");
    return { success: true, data: offer };
  } catch (err) {
    console.error("[CATALOG_UPSERT_ERROR]:", err);
    return { success: false, error: "Erreur technique" };
  }
}
