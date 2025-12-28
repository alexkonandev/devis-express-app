"use server";

import db from "@/lib/prisma";
import { getClerkUserId } from "@/lib/auth";

// --- TYPES RICHES ---
export type DashboardKpi = {
  revenue: { total: number; growth: number };
  pipeline: { total: number; count: number };
  signed: { total: number; count: number }; // <--- AJOUTÉ ICI
  conversionRate: number;
  averageTicket: number;
};

export type RecentActivity = {
  id: string;
  type: "CREATED" | "SENT" | "SIGNED" | "UPDATED" | "DRAFT"; // Ajout de DRAFT
  clientName: string;
  amount: number;
  date: Date;
  quoteNumber: string;
};

export type TopClient = {
  id: string;
  name: string;
  totalSpent: number;
  projectsCount: number;
};

export type AdvancedDashboardData = {
  kpi: DashboardKpi;
  activity: RecentActivity[];
  topClients: TopClient[];
  chartData: { month: string; amount: number }[];
};

export async function getAdvancedDashboardData(): Promise<AdvancedDashboardData> {
  const userId = await getClerkUserId();
  if (!userId) {
    // Retour par défaut sécurisé en cas de non-auth (ou redirect)
    throw new Error("Unauthorized");
  }

  const now = new Date();
  const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  // 1. RÉCUPÉRATION GLOBALE
  const allQuotes = await db.devis.findMany({
    where: { userId },
    select: {
      id: true,
      totalTTC: true,
      status: true,
      updatedAt: true,
      createdAt: true,
      number: true,
      client: { select: { id: true, name: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  // 2. FILTRAGE
  const signedQuotes = allQuotes.filter((q) => q.status === "accepted");
  const pipelineQuotes = allQuotes.filter((q) => q.status === "sent");

  // 3. CALCULS FINANCIERS
  const currentMonthRevenue = signedQuotes
    .filter((q) => q.updatedAt >= firstDayCurrentMonth)
    .reduce((acc, q) => acc + q.totalTTC, 0);

  const lastMonthRevenue = signedQuotes
    .filter(
      (q) =>
        q.updatedAt >= firstDayLastMonth && q.updatedAt < firstDayCurrentMonth
    )
    .reduce((acc, q) => acc + q.totalTTC, 0);

  // Croissance
  const growth =
    lastMonthRevenue === 0
      ? currentMonthRevenue > 0
        ? 100
        : 0
      : Math.round(
          ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
        );

  const totalRevenue = signedQuotes.reduce((acc, q) => acc + q.totalTTC, 0);
  const averageTicket =
    signedQuotes.length > 0 ? totalRevenue / signedQuotes.length : 0;
  const pipelineTotal = pipelineQuotes.reduce((acc, q) => acc + q.totalTTC, 0);

  // Taux de conversion
  const closedQuotesCount = allQuotes.filter(
    (q) => q.status === "accepted" || q.status === "rejected"
  ).length;
  const conversionRate =
    closedQuotesCount > 0
      ? Math.round((signedQuotes.length / closedQuotesCount) * 100)
      : 0;

  // 4. TOP CLIENTS
  const clientMap = new Map<string, TopClient>();
  signedQuotes.forEach((q) => {
    const existing = clientMap.get(q.client.id) || {
      id: q.client.id,
      name: q.client.name,
      totalSpent: 0,
      projectsCount: 0,
    };
    existing.totalSpent += q.totalTTC;
    existing.projectsCount += 1;
    clientMap.set(q.client.id, existing);
  });

  const topClients = Array.from(clientMap.values())
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5);

  // 5. ACTIVITY FEED
  const activity: RecentActivity[] = allQuotes.slice(0, 10).map((q) => ({
    id: q.id,
    type:
      q.status === "accepted"
        ? "SIGNED"
        : q.status === "sent"
        ? "SENT"
        : "DRAFT",
    clientName: q.client.name,
    amount: q.totalTTC,
    date: q.updatedAt,
    quoteNumber: q.number,
  }));

  // 6. CHART DATA (Mocké intelligemment pour l'instant)
  // Idéalement à remplacer par un `groupBy` Prisma ultérieurement
  const chartData = [
    { month: "M-5", amount: Math.random() * (totalRevenue * 0.2) },
    { month: "M-4", amount: Math.random() * (totalRevenue * 0.3) },
    { month: "M-3", amount: Math.random() * (totalRevenue * 0.4) },
    { month: "M-2", amount: Math.random() * (totalRevenue * 0.5) },
    { month: "M-1", amount: lastMonthRevenue },
    { month: "M", amount: currentMonthRevenue },
  ];

  return {
    kpi: {
      revenue: { total: totalRevenue, growth },
      pipeline: { total: pipelineTotal, count: pipelineQuotes.length },
      signed: { total: totalRevenue, count: signedQuotes.length }, // <--- ON ENVOIE BIEN L'OBJET SIGNED
      conversionRate,
      averageTicket,
    },
    activity,
    topClients,
    chartData,
  };
}
