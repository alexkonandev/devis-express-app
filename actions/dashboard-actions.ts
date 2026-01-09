"use server";

import db from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { QuoteStatus as PrismaQuoteStatus } from "@/app/generated/prisma/client";
import { AdvancedDashboardData, QuoteStatus } from "@/types/dashboard";


export async function getAdvancedDashboardData(): Promise<AdvancedDashboardData> {
  const { userId } = await auth();
  if (!userId) throw new Error("Non autorisé");

  // Parallélisation des requêtes pour maximiser la vitesse d'exécution
  const [quotes, clients, catalogOffers] = await Promise.all([
    db.quote.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: {
        client: true,
        lines: true,
      },
    }),
    db.client.findMany({
      where: { userId },
      include: {
        _count: { select: { quotes: true } },
        quotes: { include: { lines: true } },
      },
    }),
    db.catalogOffer.findMany({
      where: { userId },
      take: 3,
    }),
  ]);

  // Helper pour calculer le montant total HT d'un devis basé sur les lignes
  const getQuoteTotal = (
    lines: { unitPriceEuros: number; quantity: number }[]
  ): number => {
    return lines.reduce(
      (acc: number, line) => acc + line.unitPriceEuros * line.quantity,
      0
    );
  };

  // KPI : Profit validé (ACCEPTED ou PAID)
  const totalRevenue = quotes
    .filter(
      (q) =>
        q.status === PrismaQuoteStatus.ACCEPTED ||
        q.status === PrismaQuoteStatus.PAID
    )
    .reduce((acc: number, q) => acc + getQuoteTotal(q.lines), 0);

  // KPI : Cash-flow sécurisable (SENT)
  const pendingRevenue = quotes
    .filter((q) => q.status === PrismaQuoteStatus.SENT)
    .reduce((acc: number, q) => acc + getQuoteTotal(q.lines), 0);

  // KPI : Efficacité commerciale (Taux de closing)
  const conversionRate =
    quotes.length > 0
      ? (quotes.filter(
          (q) =>
            q.status === PrismaQuoteStatus.ACCEPTED ||
            q.status === PrismaQuoteStatus.PAID
        ).length /
          quotes.length) *
        100
      : 0;

  // Formattage de l'activité avec mapping de l'Enum (Prisma -> Frontend)
  const activity = quotes.slice(0, 5).map((q) => ({
    id: q.id,
    amount: getQuoteTotal(q.lines),
    // Cast sécurisé pour satisfaire TypeScript sans importer Prisma côté client
    status: q.status as unknown as QuoteStatus,
    clientName: q.client.name,
    quoteNumber: q.number,
    date: q.updatedAt,
  }));

  // Loi de Pareto : Focus sur les clients à haute valeur marchande
  const topClients = clients
    .map((c) => ({
      id: c.id,
      name: c.name,
      totalSpent: c.quotes
        .filter(
          (q) =>
            q.status === PrismaQuoteStatus.ACCEPTED ||
            q.status === PrismaQuoteStatus.PAID
        )
        .reduce((acc: number, q) => acc + getQuoteTotal(q.lines), 0),
      quoteCount: c._count.quotes,
    }))
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5);

  return {
    kpis: {
      totalRevenue,
      pendingRevenue,
      conversionRate,
      activeQuotes: quotes.filter((q) => q.status === PrismaQuoteStatus.SENT)
        .length,
    },
    activity,
    topClients,
    suggestedServices: catalogOffers.map((o) => ({
      id: o.id,
      title: o.title,
      price: o.unitPriceEuros,
      category: o.category,
    })),
  };
}
