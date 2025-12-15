// Fichier: app/(app)/items/actions.ts

"use server";

import db from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma/client";
import { getClerkUserId } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { ServiceItem, ItemInput } from "@/lib/types"; // Nos types unifiés

// ==========================================
// 1. GET ITEMS (CATALOGUE PERSO)
// ==========================================
export async function getItemsAction() {
  try {
    const userId = await getClerkUserId();
    if (!userId) return { success: false, error: "Session expirée." };

    const items = await db.serviceItem.findMany({
      where: { userId },
      orderBy: { title: "asc" },
    });

    const uiItems: ServiceItem[] = items.map((item) => {
      // SÉCURITÉ "0 EUROS" : Si unitPriceEuros est 0, on essaie de récupérer le prix Senior du JSON
      let price = item.unitPriceEuros;
      const rawPricing = item.pricing as any;

      if (price === 0 && rawPricing?.tiers?.senior?.avg) {
        price = rawPricing.tiers.senior.avg;
      }

      // Reconstitution des objets par défaut pour éviter les crashs UI
      const pricingVal = rawPricing || {
        suggested_model: "flat_fee",
        currency: "EUR",
        unit_label: "Mission",
        tiers: {
          junior: { min: price, max: price, avg: price },
          senior: { min: price, max: price, avg: price },
          expert: { min: price, max: price, avg: price },
        },
      };

      return {
        id: item.id,
        title: item.title,
        category: item.category || "Uncategorized",
        subcategory: "Perso",
        description: item.description || "",
        defaultPrice: price, // Pour l'UI Explorer
        iconName: "Box",

        // Données Riches
        pricing: pricingVal,
        technicalScope: (item.technicalScope as any) || {
          included: [],
          excluded: [],
        },
        salesCopy: (item.salesCopy as any) || {},
        marketContext: item.marketContext as any,

        // Données DB
        userId: item.userId,
        unitPriceEuros: price, // Le vrai prix affiché
        defaultQuantity: item.defaultQuantity,
        isTaxable: item.isTaxable,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    });

    return { success: true, data: uiItems };
  } catch (error) {
    console.error("Erreur getItemsAction:", error);
    return { success: false, error: "Impossible de charger votre catalogue." };
  }
}

// ==========================================
// 2. GET TEMPLATES (ONTOLOGIE) - RESTAURÉ
// ==========================================
export async function getTemplatesAction() {
  try {
    // Note: Pas besoin de userId ici car les templates sont publics pour tous les users
    const templates = await db.serviceTemplate.findMany({
      orderBy: [{ category: "asc" }, { subcategory: "asc" }],
    });

    // Mapping vers UIItem/ServiceItem
    const mappedTemplates: ServiceItem[] = templates.map((t) => ({
      id: t.id,
      title: t.title,
      category: t.category,
      subcategory: t.subcategory,
      description: (t.salesCopy as any)?.description || "",

      // Calcul du prix par défaut (Senior Avg)
      defaultPrice: (t.pricing as any)?.tiers?.senior?.avg || 0,
      iconName: "LayoutTemplate",

      // Injection des données riches
      salesCopy: t.salesCopy as any,
      technicalScope: t.technicalScope as any,
      pricing: t.pricing as any,
      marketContext: t.marketContext as any,

      // Champs factices pour compatibilité ServiceItem
      userId: "system",
      unitPriceEuros: (t.pricing as any)?.tiers?.senior?.avg || 0,
      defaultQuantity: 1,
      isTaxable: true,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }));

    return { success: true, data: mappedTemplates };
  } catch (error) {
    console.error("Erreur getTemplatesAction:", error);
    return { success: false, error: "Erreur chargement ontologie." };
  }
}

// ==========================================
// 3. UPSERT (INTELLIGENT)
// ==========================================
export async function upsertItemAction(data: ItemInput, itemId?: string) {
  try {
    const userId = await getClerkUserId();
    if (!userId) return { success: false, error: "Non autorisé." };

    // AUTO-SYNC : Si on sauvegarde un prix simple, on met à jour le Pricing JSON minimal
    // pour garder la cohérence si on réouvre l'item dans l'éditeur complexe.
    let richPricing = data.pricing;

    // Si pas de pricing complexe mais qu'on a un prix simple > 0
    if (!richPricing && data.unitPriceEuros > 0) {
      richPricing = {
        suggested_model: "flat_fee",
        tiers: {
          junior: {
            avg: data.unitPriceEuros,
            min: data.unitPriceEuros,
            max: data.unitPriceEuros,
          },
          senior: {
            avg: data.unitPriceEuros,
            min: data.unitPriceEuros,
            max: data.unitPriceEuros,
          },
          expert: {
            avg: data.unitPriceEuros,
            min: data.unitPriceEuros,
            max: data.unitPriceEuros,
          },
        },
      };
    }

    const itemPayload: Prisma.ServiceItemUncheckedCreateInput = {
      userId,
      title: data.title,
      description: data.description,
      category: data.category,

      // C'EST ICI LA VÉRITÉ : Le prix vitrine
      unitPriceEuros: data.unitPriceEuros,
      defaultQuantity: data.defaultQuantity,
      isTaxable: data.isTaxable,

      // C'EST ICI LE MOTEUR : Le pricing complexe
      pricing: richPricing ?? undefined,
      technicalScope: data.technicalScope ?? undefined,
      salesCopy: data.salesCopy ?? undefined,
      marketContext: data.marketContext ?? undefined,
    };

    if (!itemId) {
      // CREATE
      const newItem = await db.serviceItem.create({ data: itemPayload });
      return { success: true, data: newItem };
    } else {
      // UPDATE
      const { userId: _, ...updateData } = itemPayload;
      await db.serviceItem.updateMany({
        where: { id: itemId, userId },
        data: updateData as any,
      });
      return { success: true };
    }
  } catch (error) {
    console.error("Erreur upsertItemAction:", error);
    return { success: false, error: "Erreur sauvegarde." };
  }
}

// ==========================================
// 4. DELETE
// ==========================================
export async function deleteItemAction(itemId: string) {
  try {
    const userId = await getClerkUserId();
    if (!userId) return { success: false, error: "Non autorisé" };
    await db.serviceItem.deleteMany({ where: { id: itemId, userId } });
    revalidatePath("/items");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erreur serveur." };
  }
}

// ==========================================
// 5. RECHERCHE CATALOGUE (AUTOCOMPLETE)
// ==========================================
export async function searchCatalogItemsAction(query: string) {
  try {
    const userId = await getClerkUserId();
    if (!userId) return [];

    // Si la requête est vide, on renvoie les 10 premiers (ou récents)
    // Sinon on filtre
    const items = await db.serviceItem.findMany({
      where: {
        userId,
        title: { contains: query, mode: "insensitive" },
      },
      select: {
        id: true,
        title: true,
        description: true,
        unitPriceEuros: true,
        defaultQuantity: true,
        // On récupère aussi les données riches pour les injecter
        technicalScope: true,
        pricing: true,
        salesCopy: true,
      },
      take: 20,
      orderBy: { title: "asc" },
    });

    return items;
  } catch (error) {
    console.error("Erreur searchCatalogItemsAction:", error);
    return [];
  }
}