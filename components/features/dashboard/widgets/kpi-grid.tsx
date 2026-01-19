"use client";

import { AdvancedDashboardData } from "@/types/dashboard";
import {
  TrendingUp,
  Clock,
  Target,
  ArrowUpRight,
} from "lucide-react";
import { KPICard } from "../kpi-card";
import { Card, CardContent } from "@/components/ui/card";

interface KpiGridProps {
  data: AdvancedDashboardData;
}

/**
 * @description KpiGrid v3.0 - Industrial Blueprint
 * Focus : Règle #2 (rounded-none), Règle #3 (font-mono pour les chiffres)
 */
export function KpiGrid({ data }: KpiGridProps) {
  const { kpis } = data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 font-sans">
      {/* KPI 1 : Chiffre d'Affaires - Accent Indigo */}
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
        trend="+12%"
      />

      {/* KPI 2 : Encaissement - Zonage Muted */}
      <KPICard
        label="Encaissement en attente"
        amount={kpis.pendingRevenue}
        count={kpis.activeQuotes}
        icon={Clock}
        intent="warning"
      />

      {/* KPI 3 : SCORE & CONVERSION - Refonte Blueprint */}
      <Card className="border-slate-200 rounded-none shadow-none bg-white group hover:border-indigo-600 transition-colors duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-4 bg-indigo-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                Score Conversion
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-950 text-white rounded-none">
              <Target className="w-3 h-3 text-indigo-400" />
              <span className="text-[9px] font-black uppercase tracking-widest">
                Target
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-1">
                <span className="text-[36px] font-mono font-black text-slate-950 tracking-tighter tabular-nums leading-none">
                  {kpis.conversionRate.toFixed(1)}
                </span>
                <span className="text-[18px] font-mono font-bold text-indigo-600">
                  %
                </span>
              </div>
              <div className="flex items-center gap-1 text-emerald-600">
                <ArrowUpRight className="w-4 h-4" />
                <span className="text-[12px] font-mono font-bold">+2.4%</span>
              </div>
            </div>

            {/* Barre de progression Industrial Style */}
            <div className="space-y-2.5">
              <div className="flex justify-between text-[9px] font-black uppercase tracking-[0.1em] text-slate-400">
                <span>Performance Réelle</span>
                <span className="text-slate-950">Objectif 30%</span>
              </div>
              <div className="w-full h-1 bg-slate-100 rounded-none overflow-hidden">
                <div
                  className="h-full bg-indigo-600 transition-all duration-1000 ease-out"
                  style={{
                    width: `${Math.min(
                      (kpis.conversionRate / 30) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
              {/* Règle #5 : Subtile légende de zonage */}
              <p className="text-[9px] font-bold text-slate-300 uppercase italic">
                Optimisation du tunnel de vente requise
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
