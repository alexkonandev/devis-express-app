"use server";

import db from "@/lib/prisma";
import { getClerkUserId } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { CatalogItem, ActionResponse, CatalogFilters } from "@/types/catalog";

/**
 * RÉCUPÉRATION UNIFIÉE DES ACTIFS
 * Fusionne UserService (Perso) et CatalogOffer (Premium/Library)
 */
export async function getCatalogItemsAction(
  filters: CatalogFilters
): Promise<CatalogItem[]> {
  try {
    const userId = await getClerkUserId();
    if (!userId) return [];

    // 1. Récupération des services personnels (UserService)
    const personalServices = await db.userService.findMany({
      where: {
        userId,
        ...(filters.search
          ? {
              title: { contains: filters.search, mode: "insensitive" },
            }
          : {}),
      },
      orderBy: { title: "asc" },
    });

    // 2. Récupération des offres catalogue (CatalogOffer)
    const libraryOffers = await db.catalogOffer.findMany({
      where: {
        // Si type 'personal', on ne prend que ce qui appartient à l'user
        // Si type 'library', on pourrait prendre tout le catalogue premium
        userId: filters.type === "personal" ? userId : undefined,
        ...(filters.search
          ? {
              OR: [
                { title: { contains: filters.search, mode: "insensitive" } },
                { category: { contains: filters.search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { category: "asc" },
    });

    // 3. Unification des données pour le frontend
    // On mappe UserService pour qu'il ait la même structure que CatalogOffer (category par défaut)
    const unifiedPersonal = personalServices.map((s) => ({
      ...s,
      category: "SERVICE PERSO",
      isPremium: false,
    }));

    return filters.type === "personal"
      ? [
          ...unifiedPersonal,
          ...libraryOffers.filter((o) => o.userId === userId),
        ]
      : libraryOffers;
  } catch (err) {
    console.error("[GET_CATALOG_ERROR]:", err);
    return [];
  }
}

/**
 * UPSERT CHIRURGICAL
 * Gère la création et mise à jour avec revalidation de cache
 */
export async function upsertCatalogOfferAction(
  data: Partial<CatalogItem> & {
    title: string;
    unitPrice: number;
    category: string;
  }
): Promise<ActionResponse<CatalogItem>> {
  try {
    const userId = await getClerkUserId();
    if (!userId) return { success: false, error: "NON_AUTORISE" };

    const payload = {
      title: data.title,
      subtitle: data.subtitle || "",
      unitPrice: data.unitPrice,
      category: data.category,
      isPremium: data.isPremium ?? false,
      userId: userId,
    };

    const offer = data.id
      ? await db.catalogOffer.update({
          where: { id: data.id, userId },
          data: payload,
        })
      : await db.catalogOffer.create({
          data: payload,
        });

    revalidatePath("/catalog");
    return { success: true, data: offer as CatalogItem };
  } catch (err) {
    console.error("[CATALOG_UPSERT_ERROR]:", err);
    return { success: false, error: "ERREUR_TECHNIQUE_DATABASE" };
  }
}
