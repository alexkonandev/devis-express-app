"use server";

import db from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma/client";
import { getClerkUserId } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export type QuoteListFilters = {
  search?: string;
  status?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  page?: number;
  pageSize?: number;
};

// 1. RÉCUPÉRATION AVEC FILTRES (OPTIMISÉE)
export async function getQuotesListAction(filters: QuoteListFilters) {
  try {
    const userId = await getClerkUserId();
    if (!userId) return { success: false, error: "Session expirée." };

    const {
      search = "",
      status = "all",
      sortBy = "updatedAt",
      sortDir = "desc",
      page = 1,
      pageSize = 20,
    } = filters;

    const where: Prisma.DevisWhereInput = { userId };

    if (status !== "all") {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { number: { contains: search, mode: "insensitive" } },
        { client: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    let orderBy: Prisma.DevisOrderByWithRelationInput = {};
    if (sortBy === "amount") orderBy = { totalTTC: sortDir };
    else if (sortBy === "client") orderBy = { client: { name: sortDir } };
    else if (sortBy === "number") orderBy = { number: sortDir };
    else orderBy = { updatedAt: sortDir };

    // FIX P2028 : Utilisation de Promise.all au lieu de $transaction
    // C'est plus léger pour le pool de connexions
    const [total, devis] = await Promise.all([
      db.devis.count({ where }),
      db.devis.findMany({
        where,
        orderBy,
        take: pageSize,
        skip: (page - 1) * pageSize,
        include: { client: true },
      }),
    ]);

    return {
      success: true,
      data: JSON.parse(JSON.stringify(devis)), // Sécurisation pour Client Components
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    console.error("Erreur getQuotesListAction:", error);
    return { success: false, error: "Erreur base de données." };
  }
}

// 2. SUPPRESSION GROUPÉE (BULK)
export async function deleteQuotesAction(ids: string[]) {
  try {
    const userId = await getClerkUserId();
    if (!userId) return { success: false, error: "Non autorisé." };

    await db.devis.deleteMany({
      where: {
        id: { in: ids },
        userId: userId, // Sécurité stricte
      },
    });

    revalidatePath("/devis");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Erreur deleteQuotesAction:", error);
    return { success: false, error: "Échec de la suppression." };
  }
}
