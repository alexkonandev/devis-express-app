"use server";

import db from "@/lib/prisma";
import { getClerkUserId } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { Prisma, QuoteStatus as PrismaQuoteStatus, Quote } from "@/app/generated/prisma/client";

// ✅ Importation de la langue unique (Contrat Frontend/Backend)
import {
  ActiveQuote,
  QuoteFilters,
  PaginatedQuotes,
  QuoteListItem,
  ActionResponse,
} from "@/types/quote";

/**
 * 1. RECUPERATION FILTRÉE (POUR LA LISTE)
 * Optimisé pour ne récupérer que le nécessaire (Select chirurgical)
 */
export async function getQuotesListAction(
  filters: QuoteFilters
): Promise<PaginatedQuotes> {
  try {
    const authId = await getClerkUserId();
    if (!authId) throw new Error("Non autorisé");

    const { page, pageSize, search, status, sortBy, sortDir } = filters;
    const skip = (page - 1) * pageSize;

    const where: Prisma.QuoteWhereInput = {
      userId: authId,
      ...(status !== "all" ? { status } : {}),
      ...(search
        ? {
            OR: [
              { number: { contains: search, mode: "insensitive" } },
              { client: { name: { contains: search, mode: "insensitive" } } },
            ],
          }
        : {}),
    };

    const [totalCount, quotes] = await Promise.all([
      db.quote.count({ where }),
      db.quote.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { [sortBy]: sortDir },
        select: {
          id: true,
          number: true,
          status: true,
          updatedAt: true,
          createdAt: true, // ✅ FIX: On l'ajoute ici pour qu'il soit récupéré en DB
          lines: {
            select: {
              quantity: true,
              unitPrice: true,
            },
          },
          client: {
            select: { name: true },
          },
        },
      }),
    ]);

    const items: QuoteListItem[] = quotes.map((q) => {
      const subtotal = q.lines.reduce(
        (acc, line) => acc + line.quantity * line.unitPrice,
        0
      );

      return {
        id: q.id,
        number: q.number,
        title: `Devis ${q.number}`,
        status: q.status as PrismaQuoteStatus,
        totalAmount: subtotal,
        clientName: q.client.name,
        updatedAt: q.updatedAt,
        createdAt: q.createdAt, // ✅ Maintenant TypeScript est content car la donnée existe
      };
    });

    return {
      items,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    };
  } catch (err) {
    console.error("[GET_QUOTES_LIST_ERROR]:", err);
    return { items: [], totalCount: 0, totalPages: 0 };
  }
}

/**
 * 2. SAUVEGARDE / MISE À JOUR (POUR L'ÉDITEUR)
 */
export async function upsertQuoteAction(
  data: ActiveQuote,
  id: string | null
): Promise<ActionResponse<Quote>> {
  try {
    const authId = await getClerkUserId();
    if (!authId) return { success: false, error: "Non autorisé" };

    // Gestion du Client
    let client = await db.client.findFirst({
      where: { name: data.client.name, userId: authId },
    });

    if (!client) {
      client = await db.client.create({
        data: {
          name: data.client.name,
          email: data.client.email,
          address: data.client.address,
          siret: data.client.siret,
          userId: authId,
        },
      });
    }

    const linesData = data.items.map((item) => ({
      title: item.title,
      subtitle: item.subtitle,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    }));

    const quoteData = {
      number: data.quote.number,
      status: data.quote.status as PrismaQuoteStatus,
      vatRatePercent: data.financials.vatRatePercent,
      discountEuros: data.financials.discountAmountEuros,
      terms: data.quote.terms,
      clientId: client.id,
      userId: authId,
    };

    let quote;

    if (id) {
      quote = await db.quote.update({
        where: { id, userId: authId },
        data: {
          ...quoteData,
          lines: {
            deleteMany: {},
            create: linesData,
          },
        },
      });
    } else {
      quote = await db.quote.create({
        data: {
          ...quoteData,
          lines: {
            create: linesData,
          },
        },
      });
    }

    revalidatePath("/quotes");
    revalidatePath(`/quotes/${quote.id}`);

    return { success: true, data: quote };
  } catch (err) {
    console.error("[UPSERT_QUOTE_ERROR]:", err);
    return { success: false, error: "Erreur serveur lors de la sauvegarde" };
  }
}
