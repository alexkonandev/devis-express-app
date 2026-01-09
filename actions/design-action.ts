"use server";

import db from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Prisma } from "@/app/generated/prisma/client";

interface CreateThemeInput {
  name: string;
  color: string;
  baseLayout: string;
  config: Prisma.InputJsonValue;
  isPremium: boolean;
}

export async function getAvailableThemes() {
  try {
    return await db.theme.findMany({
      orderBy: { isPremium: "asc" },
    });
  } catch {
    return [];
  }
}

export async function createSystemTheme(data: CreateThemeInput) {
  try {
    const theme = await db.theme.create({
      data: {
        name: data.name,
        color: data.color,
        baseLayout: data.baseLayout,
        config: data.config, 
        isSystem: true,
        isPremium: data.isPremium,
      },
    });

    revalidatePath("/editor");
    return { success: true, data: theme };
  } catch (err) {
    console.error("[CREATE_THEME_ERROR]:", err);
    return { success: false, error: "Erreur lors de la création du thème" };
  }
}
