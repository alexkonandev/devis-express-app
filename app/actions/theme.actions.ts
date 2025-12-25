// Fichier: app/(app)/themes/actions.ts

"use server";

import db from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma/client";
import { getClerkUserId } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// Type local pour l'entrée (similaire à ItemInput dans votre exemple)
export interface ThemeInput {
  name: string;
  description?: string;
  color: string;
  baseLayout: string;
  config: any; // Le JSON de configuration (couleurs, typos, etc.)
  isSystem?: boolean;
}

// ==========================================
// 1. GET USER THEMES (MES THÈMES PERSO)
// ==========================================
export async function getUserThemesAction() {
  try {
    const userId = await getClerkUserId();
    if (!userId) return { success: false, error: "Session expirée." };

    const themes = await db.theme.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    // Mapping pour sécuriser le retour UI
    const uiThemes = themes.map((theme) => {
      return {
        id: theme.id,
        name: theme.name,
        description: theme.description || "",
        color: theme.color,
        baseLayout: theme.baseLayout,
        isSystem: theme.isSystem,

        // Données de Configuration (JSON)
        config: (theme.config as any) || {
          colors: {},
          typography: {},
          borderRadius: "0px",
        },

        // Méta-données
        userId: theme.userId,
        createdAt: theme.createdAt,
        updatedAt: theme.updatedAt,
      };
    });

    return { success: true, data: uiThemes };
  } catch (error) {
    console.error("Erreur getUserThemesAction:", error);
    return { success: false, error: "Impossible de charger vos thèmes." };
  }
}

// ==========================================
// 2. GET SYSTEM THEMES (OFFICIELS)
// ==========================================
export async function getSystemThemesAction() {
  try {
    // Note: Pas besoin de userId ici car les thèmes système sont publics
    const themes = await db.theme.findMany({
      where: { isSystem: true },
      orderBy: { name: "asc" },
    });

    const mappedThemes = themes.map((t) => ({
      id: t.id,
      name: t.name,
      description: t.description || "",
      color: t.color,
      baseLayout: t.baseLayout,
      isSystem: true,

      // Configuration (JSON)
      config: t.config as any,

      // Champs système
      userId: "system",
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }));

    return { success: true, data: mappedThemes };
  } catch (error) {
    console.error("Erreur getSystemThemesAction:", error);
    return { success: false, error: "Erreur chargement des thèmes système." };
  }
}

// ==========================================
// 3. UPSERT THEME (CRÉATION / ÉDITION)
// ==========================================
export async function upsertThemeAction(data: ThemeInput, themeId?: string) {
  try {
    const userId = await getClerkUserId();
    if (!userId) return { success: false, error: "Non autorisé." };

    // Préparation du payload Prisma
    const themePayload: Prisma.ThemeUncheckedCreateInput = {
      userId,
      name: data.name,
      description: data.description,
      color: data.color, // La pastille visuelle (Hex)
      baseLayout: data.baseLayout, // "swiss", "tech", "corporate"

      // Le cœur du moteur : La config JSON
      config: data.config ?? {},

      // Par défaut, un user ne crée pas de thème système
      isSystem: false,
    };

    if (!themeId) {
      // CREATE
      const newTheme = await db.theme.create({ data: themePayload });
      revalidatePath("/studio"); // On rafraîchit le studio
      return { success: true, data: newTheme };
    } else {
      // UPDATE
      // On retire userId du payload pour éviter de le modifier accidentellement
      const { userId: _, ...updateData } = themePayload;

      await db.theme.updateMany({
        where: { id: themeId, userId }, // Sécurité: on ne modifie que SES thèmes
        data: updateData as any,
      });

      revalidatePath("/studio");
      return { success: true };
    }
  } catch (error) {
    console.error("Erreur upsertThemeAction:", error);
    return { success: false, error: "Erreur sauvegarde du thème." };
  }
}

// ==========================================
// 4. DELETE THEME
// ==========================================
export async function deleteThemeAction(themeId: string) {
  try {
    const userId = await getClerkUserId();
    if (!userId) return { success: false, error: "Non autorisé" };

    // Suppression sécurisée : ID + UserID
    await db.theme.deleteMany({ where: { id: themeId, userId } });

    revalidatePath("/studio");
    return { success: true };
  } catch (error) {
    console.error("Erreur deleteThemeAction:", error);
    return { success: false, error: "Erreur serveur lors de la suppression." };
  }
}

// ==========================================
// 5. RECHERCHE THÈMES (AUTOCOMPLETE)
// ==========================================
export async function searchThemesAction(query: string) {
  try {
    const userId = await getClerkUserId();
    // Pour la recherche, on veut voir : Mes thèmes + Les thèmes système
    // Mais pour simplifier ici, on suit la logique "Catalog" de l'exemple (Mes items)
    if (!userId) return [];

    const themes = await db.theme.findMany({
      where: {
        OR: [
          { userId }, // Mes thèmes
          { isSystem: true }, // Thèmes système
        ],
        name: { contains: query, mode: "insensitive" },
      },
      select: {
        id: true,
        name: true,
        description: true,
        color: true,
        baseLayout: true,
        config: true,
      },
      take: 20,
      orderBy: { name: "asc" },
    });

    return themes;
  } catch (error) {
    console.error("Erreur searchThemesAction:", error);
    return [];
  }
}
