"use server";

import db from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma/client";
import { getClerkUserId } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// --- TYPES PARTAGÉS (Catalogue + Éditeur) ---
export type CatalogItem = {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  isStandard: boolean;
  richData?: any; // Pour transporter le pricing JSON complet
};

// ============================================================================
// SECTION 1 : CATALOGUE MANAGER (Pour la page /items)
// ============================================================================

export async function getUnifiedCatalogAction() {
  try {
    const userId = await getClerkUserId();
    if (!userId) return { success: false, error: "Non autorisé" };

    // 1. MES ITEMS
    const userItems = await db.serviceItem.findMany({
      where: { userId },
      orderBy: { title: "asc" },
    });

    // 2. TEMPLATES (Bibliothèque)
    const templates = await db.serviceTemplate.findMany({
      orderBy: [{ category: "asc" }, { subcategory: "asc" }],
    });

    // 3. MAPPING
    const unifiedItems: CatalogItem[] = [
      ...userItems.map((item) => {
        let price = item.unitPriceEuros;
        const rawPricing = item.pricing as any;
        if (price === 0 && rawPricing?.tiers?.senior?.avg) {
          price = rawPricing.tiers.senior.avg;
        }
        return {
          id: item.id,
          name: item.title,
          description: item.description || "",
          price: price,
          category: item.category || "Général",
          isStandard: false,
          richData: {
            pricing: rawPricing,
            technicalScope: item.technicalScope,
            salesCopy: item.salesCopy,
            marketContext: item.marketContext,
          },
        };
      }),
      ...templates.map((t) => {
        const rawPricing = t.pricing as any;
        return {
          id: t.id,
          name: t.title,
          description: (t.salesCopy as any)?.description || "",
          price: rawPricing?.tiers?.senior?.avg || 0,
          category: t.category || "Standard",
          isStandard: true,
          richData: {
            pricing: rawPricing,
            technicalScope: t.technicalScope,
            salesCopy: t.salesCopy,
            marketContext: t.marketContext,
          },
        };
      }),
    ];

    return { success: true, data: unifiedItems };
  } catch (error) {
    console.error("Erreur getUnifiedCatalogAction:", error);
    return { success: false, error: "Erreur chargement catalogue" };
  }
}

export async function quickUpdateItemAction(
  id: string,
  field: string,
  value: any
) {
  const userId = await getClerkUserId();
  if (!userId) return { success: false };

  try {
    const updateData: any = { [field]: value };

    // Auto-Sync du JSON Pricing si on change le prix simple
    if (field === "unitPriceEuros" || field === "price") {
      const newPrice = Number(value);
      updateData.unitPriceEuros = newPrice;
      const currentItem = await db.serviceItem.findUnique({ where: { id } });
      if (currentItem) {
        const richPricing = (currentItem.pricing as any) || {};
        if (!richPricing.tiers) richPricing.tiers = {};
        ["junior", "senior", "expert"].forEach((tier) => {
          if (!richPricing.tiers[tier]) richPricing.tiers[tier] = {};
          richPricing.tiers[tier].avg = newPrice;
          richPricing.tiers[tier].min = newPrice;
          richPricing.tiers[tier].max = newPrice;
        });
        updateData.pricing = richPricing;
      }
    } else if (field === "name") {
      updateData.title = value;
    }

    await db.serviceItem.updateMany({
      where: { id, userId },
      data: updateData,
    });
    revalidatePath("/items");
    return { success: true };
  } catch (e) {
    return { success: false };
  }
}

export async function copyLibraryItemAction(item: CatalogItem) {
  const userId = await getClerkUserId();
  if (!userId) return { success: false };

  try {
    await db.serviceItem.create({
      data: {
        userId,
        title: item.name,
        description: item.description,
        category: item.category,
        unitPriceEuros: item.price,
        pricing: item.richData?.pricing ?? undefined,
        technicalScope: item.richData?.technicalScope ?? undefined,
        salesCopy: item.richData?.salesCopy ?? undefined,
        marketContext: item.richData?.marketContext ?? undefined,
        isTaxable: true,
        defaultQuantity: 1,
      },
    });
    revalidatePath("/items");
    return { success: true };
  } catch (e) {
    return { success: false };
  }
}

export async function deleteItemAction(id: string) {
  const userId = await getClerkUserId();
  if (!userId) return { success: false };
  try {
    await db.serviceItem.deleteMany({ where: { id, userId } });
    revalidatePath("/items");
    return { success: true };
  } catch (e) {
    return { success: false };
  }
}

// ============================================================================
// SECTION 2 : EDITOR HELPERS (RESTAURÉS POUR L'ÉDITEUR)
// ============================================================================

/**
 * RESTAURÉ : Utilisé par l'éditeur pour afficher les choix de templates au démarrage
 */
export async function getTemplatesAction() {
  try {
    const templates = await db.serviceTemplate.findMany({
      orderBy: [{ category: "asc" }, { subcategory: "asc" }],
    });

    // Mapping pour l'éditeur (format attendu par le composant AddItemSheet ou Selector)
    const mapped = templates.map((t) => ({
      id: t.id,
      title: t.title,
      category: t.category,
      subcategory: t.subcategory,
      description: (t.salesCopy as any)?.description || "",
      defaultPrice: (t.pricing as any)?.tiers?.senior?.avg || 0,
      pricing: t.pricing,
      // Champs techniques
      userId: "system",
      unitPriceEuros: (t.pricing as any)?.tiers?.senior?.avg || 0,
      defaultQuantity: 1,
      isTaxable: true,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }));

    return { success: true, data: mapped };
  } catch (error) {
    console.error("Erreur getTemplatesAction:", error);
    return { success: false, error: "Erreur templates" };
  }
}

/**
 * RESTAURÉ : Utilisé par l'éditeur pour l'autocomplete "Rechercher un service"
 */
export async function searchCatalogItemsAction(query: string) {
  try {
    const userId = await getClerkUserId();
    if (!userId) return [];

    const items = await db.serviceItem.findMany({
      where: {
        userId,
        title: { contains: query, mode: "insensitive" },
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
