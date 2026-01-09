"use client";

import { AdvancedDashboardData } from "@/types/dashboard";
import { TrendingUp, Clock, CheckCircle } from "lucide-react";
import { KPICard } from "../kpi-card";

interface KpiGridProps {
  data: AdvancedDashboardData;
}

export function KpiGrid({ data }: KpiGridProps) {
  // Déstructuration sécurisée pour éviter le undefined
  const { kpis } = data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <KPICard
        label="Chiffre d'Affaires"
        amount={kpis.totalRevenue}
        count={
          data.activity.filter(
            (a) => a.status === "ACCEPTED" || a.status === "PAID"
          ).length
        }
        icon={TrendingUp}
        intent="positive"
        trend="+12%" // À dynamiser plus tard pour le profit
      />

      <KPICard
        label="Encaissement en attente"
        amount={kpis.pendingRevenue}
        count={kpis.activeQuotes}
        icon={Clock}
        intent="warning"
      />

      <div className="flex flex-col p-5 rounded-xl border border-zinc-200 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="p-2.5 rounded-lg text-indigo-600 bg-indigo-50">
            <CheckCircle className="w-4 h-4" strokeWidth={2.5} />
          </div>
          <span className="text-[10px] font-black text-indigo-700 bg-indigo-100/50 px-2 py-0.5 rounded-full tracking-tighter">
            SCORE
          </span>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] uppercase font-black text-zinc-400 tracking-[0.15em]">
            Taux de Conversion
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-mono font-bold text-zinc-900 tracking-tighter">
              {kpis.conversionRate.toFixed(1)}%
            </span>
          </div>
          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tight">
            Objectif : 30%
          </p>
        </div>
      </div>
    </div>
  );
}
