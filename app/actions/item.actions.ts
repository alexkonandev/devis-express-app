// Fichier: app/(app)/items/actions.ts

"use server";

import db from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma/client";
import { getClerkUserId } from "@/lib/auth"; // Pour l'authentification
import { revalidatePath } from "next/cache";

// Type pour les données entrantes (doit correspondre au modèle ServiceItem)
export type ItemInput = {
  title: string;
  description?: string;
  unitPriceEuros: number;
  defaultQuantity: number;
  isTaxable: boolean;
  category?: string;
};

const ITEM_LIMIT_FREE_PLAN = 1000;

// ==========================================
// 1. RÉCUPÉRER LES ITEMS (READ)
// ==========================================
export async function getItemsAction() {
  try {
    const userId = await getClerkUserId();
    if (!userId) return { success: false, error: "Non authentifié" };

    const items = await db.serviceItem.findMany({
      where: { userId },
      orderBy: { title: "asc" }, // Trié par ordre alphabétique pour l'efficacité UX
    });

    return { success: true, data: items };
  } catch (error) {
    console.error("Erreur getItemsAction:", error);
    return { success: false, error: "Impossible de charger le catalogue." };
  }
}

// --------------------------------------------------------------------------------
// NOUVELLE ACTION: RÉCUPÉRER L'ONTOLOGIE GLOBALE (ServiceTemplate)
// --------------------------------------------------------------------------------
/**
 * Récupère tous les modèles de service (ServiceTemplate) qui servent de librairie de base.
 * @returns Liste complète des ServiceTemplates.
 */
export async function getTemplatesAction() {
  try {
    // Aucune vérification de l'utilisateur n'est nécessaire car ce catalogue est global.
    const templates = await db.serviceTemplate.findMany({
      orderBy: [{ category: "asc" }, { subcategory: "asc" }],
      // Nous ne récupérons pas le JSON complet du pricing et technicalScope pour l'aperçu,
      // mais les champs principaux pour le tri et l'affichage.
      select: {
        id: true,
        category: true,
        subcategory: true,
        title: true,
        salesCopy: true,
      },
    });

    return { success: true, data: templates };
  } catch (error) {
    console.error("Erreur getTemplatesAction:", error);
    return {
      success: false,
      error: "Impossible de charger la librairie de modèles.",
    };
  }
}

// ==========================================
// 2. CRÉER OU MODIFIER (UPSERT)
// ==========================================
export async function upsertItemAction(data: ItemInput, itemId?: string) {
  try {
    const userId = await getClerkUserId();
    if (!userId) return { success: false, error: "Non authentifié" };

    // --- A. MODE CRÉATION (Nouveau Item) ---
    if (!itemId) {
      // LOGIQUE FREEMIUM : Vérification du quota (Monétisation)
      const currentCount = await db.serviceItem.count({ where: { userId } });

      // TODO: Remplacer 'false' par une vraie vérification (ex: user.plan === 'PRO')
      const isPremium = false;

      if (!isPremium && currentCount >= ITEM_LIMIT_FREE_PLAN) {
        return {
          success: false,
          error: "LIMIT_REACHED",
          message: `Limite de ${ITEM_LIMIT_FREE_PLAN} items atteinte sur le plan Gratuit.`,
        };
      }

      await db.serviceItem.create({
        data: {
          userId,
          title: data.title,
          description: data.description,
          unitPriceEuros: data.unitPriceEuros,
          defaultQuantity: data.defaultQuantity,
          isTaxable: data.isTaxable,
          category: data.category,
        },
      });
    } else {
      // --- B. MODE ÉDITION (Modifier Item existant) ---
      await db.serviceItem.update({
        where: { id: itemId, userId },
        data: {
          title: data.title,
          description: data.description,
          unitPriceEuros: data.unitPriceEuros,
          defaultQuantity: data.defaultQuantity,
          isTaxable: data.isTaxable,
          category: data.category,
        },
      });
    }

    revalidatePath("/items");
    return { success: true };
  } catch (error) {
    console.error("Erreur upsertItemAction:", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { success: false, error: "Un service avec ce titre existe déjà." };
    }

    return {
      success: false,
      error: "Erreur lors de la sauvegarde du service.",
    };
  }
}

// ==========================================
// 3. SUPPRIMER UN ITEM (DELETE)
// ==========================================
export async function deleteItemAction(itemId: string) {
  try {
    const userId = await getClerkUserId();
    if (!userId) return { success: false, error: "Non authentifié" };

    await db.serviceItem.delete({
      where: { id: itemId, userId }, // Sécurité: ne supprime que si l'item appartient à l'utilisateur
    });

    revalidatePath("/items");
    return { success: true };
  } catch (error) {
    console.error("Erreur deleteItemAction:", error);
    return { success: false, error: "Impossible de supprimer ce service." };
  }
}
