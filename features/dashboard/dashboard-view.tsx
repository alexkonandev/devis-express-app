"use client";

import React, { useMemo } from "react";
import { format, differenceInDays } from "date-fns";
import {
  TrendingUp,
  Clock,
  Target,
  ArrowUpRight,
  Zap,
  Filter,
  Users,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AdvancedDashboardData,
  Profession,
  BusinessModel,
} from "@/types/dashboard";
import { QuoteStatus } from "@/app/generated/prisma/enums";

// --- TYPES & INTERFACES ---
interface DashboardViewProps {
  data: AdvancedDashboardData;
  profile: {
    profession: Profession | null;
    businessModel: BusinessModel | null;
  };
}

// --- UTILS & HELPERS ---
const StudioLabel = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span
    className={cn(
      "text-[9px] font-black uppercase tracking-[0.2em] text-slate-500",
      className
    )}
  >
    {children}
  </span>
);

const StudioValue = ({
  value,
  currency = "XOF",
  className,
}: {
  value: number;
  currency?: string;
  className?: string;
}) => (
  <span
    className={cn(
      "font-mono font-black text-[20px] text-slate-950 tabular-nums tracking-[-0.05em] leading-none",
      className
    )}
  >
    {new Intl.NumberFormat("fr-CI", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0,
    }).format(value)}
  </span>
);

export function DashboardView({ data, profile }: DashboardViewProps) {
  const { kpis, activity, topClients } = data;

  // --- LOGIQUE STRATÉGIQUE (PREDICTIVE ENGINE) ---
  const strategy = useMemo(() => {
    const pendingQuotes = activity.filter((a) => a.status === QuoteStatus.SENT);
    const criticalRelances = pendingQuotes.filter(
      (q) => differenceInDays(new Date(), new Date(q.date)) > 3
    );

    // Projection : CA Actuel + (Devis envoyés * Taux de conversion)
    const projectedRevenue =
      kpis.totalRevenue + kpis.pendingRevenue * (kpis.conversionRate / 100);

    return {
      criticalRelances,
      projectedRevenue,
      needsAction: criticalRelances.length > 0,
    };
  }, [activity, kpis]);

  return (
    <div className="h-screen w-full bg-white flex flex-col overflow-hidden font-sans selection:bg-indigo-600 selection:text-white">
      {/* HEADER COMPACT */}
      <header className="h-14 shrink-0 border-b border-slate-200 flex items-center justify-between px-6 bg-white z-30">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 border-r border-slate-200 pr-6">
            <Zap className="w-4 h-4 text-indigo-600 fill-indigo-600" />
            <h1 className="text-[14px] font-black tracking-tighter text-slate-950 uppercase">
              POSTE_DE_CONTROLE
            </h1>
          </div>

          <div className="flex flex-col">
            <StudioLabel>Expertise_Status</StudioLabel>
            <span className="text-[11px] font-black text-slate-900 uppercase leading-none">
              {profile.profession || "NON_DEFINI"}
            </span>
          </div>
        </div>
      </header>

      {/* RADAR D'ALERTES (CASH-FLOW AT RISK) */}
      {strategy.needsAction && (
        <div className="bg-slate-950 px-6 py-2 flex items-center justify-between border-b border-white/10 animate-in fade-in duration-500">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">
              Alerte_Trésorerie : {strategy.criticalRelances.length} devis à
              relancer immédiatement (Risque d&apos;expiration)
            </span>
          </div>
          <Button
            variant="ghost"
            className="h-6 text-indigo-400 hover:text-white hover:bg-white/10 text-[9px] font-black uppercase transition-none"
          >
            VOIR_LE_RADAR <ArrowRight className="ml-2 w-3 h-3" />
          </Button>
        </div>
      )}

      <main className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none bg-slate-50/20">
        {/* KPI GRID V3.1 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiBox
            label="Profit_Actuel"
            val={kpis.totalRevenue}
            icon={TrendingUp}
            trend="+12.5%"
            intent="positive"
          />
          <KpiBox
            label="Encours_Tréso"
            val={kpis.pendingRevenue}
            icon={Clock}
            trend={`${
              activity.filter((a) => a.status === QuoteStatus.SENT).length
            } Envoyés`}
            intent="warning"
          />
          <KpiBox
            label="Taux_Succès"
            val={kpis.conversionRate}
            isPercent
            icon={Target}
            trend="Target 30%"
            intent="neutral"
          />

          <Card className="bg-slate-950 border-none rounded-none p-5 flex flex-col justify-between h-32 relative overflow-hidden shadow-[4px_4px_0_0_rgba(15,23,42,0.1)] group">
            {/* Background technique discret */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 2px 2px, #4f46e5 1px, transparent 0)",
                backgroundSize: "12px 12px",
              }}
            />

            <div className="relative z-10 flex justify-between items-start">
              <StudioLabel className="text-indigo-400 tracking-[0.3em]">
                Projection_Fin_Mois
              </StudioLabel>
              <ArrowUpRight className="w-4 h-4 text-indigo-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>

            <div className="relative z-10 flex flex-col">
              <StudioValue
                value={strategy.projectedRevenue}
                className="text-[28px] text-white"
              />
              <div className="flex items-center gap-2 mt-1">
                <div className="h-1 flex-1 bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 transition-all duration-1000"
                    style={{
                      width: `${Math.min(
                        (kpis.totalRevenue / (strategy.projectedRevenue || 1)) *
                          100,
                        100
                      )}%`,
                    }}
                  />
                </div>
                <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase">
                  Confidence_High
                </span>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-12 gap-4">
          {/* FLUX DE PRODUCTION (DENSE) */}
          <Card className="col-span-12 lg:col-span-9 border-slate-200 rounded-none shadow-none bg-white">
            <CardHeader className="h-10 px-4 py-0 flex flex-row items-center justify-between border-b border-slate-200 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-slate-900" />
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-900">
                  Registre_des_Operations
                </CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <StudioLabel className="mr-2">Trier_par : Statut</StudioLabel>
                <Filter size={12} className="text-slate-400" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/30 border-b border-slate-100">
                    <th className="px-4 py-2">
                      <StudioLabel>Flux_Financier</StudioLabel>
                    </th>
                    <th className="px-4 py-2">
                      <StudioLabel>Actif_Client</StudioLabel>
                    </th>
                    <th className="px-4 py-2">
                      <StudioLabel>Statut_Workflow</StudioLabel>
                    </th>
                    <th className="px-4 py-2 text-right">
                      <StudioLabel>Date_Entrée</StudioLabel>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activity.map((item) => {
                    const isLate =
                      differenceInDays(new Date(), new Date(item.date)) > 3 &&
                      item.status === QuoteStatus.SENT;
                    return (
                      <tr
                        key={item.id}
                        className={cn(
                          "hover:bg-slate-50 transition-none cursor-pointer group",
                          isLate && "bg-red-50/30"
                        )}
                      >
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            <StudioValue value={item.amount} />
                            {isLate && (
                              <div
                                className="w-1 h-1 bg-red-600 animate-ping"
                                title="Retard de relance"
                              />
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-2.5 font-black text-[11px] text-slate-900 uppercase">
                          {item.clientName}
                        </td>
                        <td className="px-4 py-2.5">
                          <StatusBadge status={item.status} />
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono text-[10px] text-slate-500 uppercase">
                          {format(new Date(item.date), "dd MMM yy")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* ASSETS RANKING (SIDEBAR) */}
          <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
            <Card className="border-slate-200 rounded-none shadow-none bg-white">
              <CardHeader className="h-10 px-4 py-0 flex flex-row items-center border-b border-slate-200 bg-slate-50/50">
                <StudioLabel className="text-slate-900">
                  Patrimoine_Clients
                </StudioLabel>
              </CardHeader>
              <CardContent className="p-0 divide-y divide-slate-100">
                {topClients.slice(0, 4).map((client, i) => (
                  <div
                    key={i}
                    className="p-4 hover:bg-slate-50 transition-none flex flex-col gap-1"
                  >
                    <div className="flex justify-between">
                      <span className="text-[11px] font-black text-slate-900 uppercase">
                        {client.name}
                      </span>
                      <span className="text-[9px] font-mono font-bold text-slate-400">
                        #0{i + 1}
                      </span>
                    </div>
                    <StudioValue
                      value={client.totalSpent}
                      className="text-indigo-600"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- INTERFACES DE COMPOSANTS ---
interface KpiBoxProps {
  label: string;
  val: number;
  isPercent?: boolean;
  icon: React.ElementType;
  trend: string;
  intent: "positive" | "warning" | "neutral";
}

interface QuickActionProps {
  label: string;
  icon: React.ElementType;
  count?: number;
}

const KpiBox = ({
  label,
  val,
  isPercent,
  icon: Icon,
  trend,
  intent,
}: KpiBoxProps) => (
  <Card className="border-slate-200 rounded-none shadow-none h-32 flex flex-col justify-between p-5 bg-white group hover:border-slate-950 transition-none">
    <div className="flex justify-between items-start">
      <StudioLabel className="text-[10px] tracking-[0.3em]">
        {label}
      </StudioLabel>
      <Icon
        size={16}
        className={intent === "positive" ? "text-indigo-600" : "text-slate-400"}
      />
    </div>

    <div className="flex flex-col gap-1">
      {isPercent ? (
        <span className="font-mono text-[32px] font-black text-slate-950 tracking-tighter leading-none">
          {val.toFixed(1)}%
        </span>
      ) : (
        <StudioValue value={val} className="text-[28px]" />
      )}
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "text-[10px] font-black uppercase tracking-widest",
            intent === "positive" ? "text-emerald-600" : "text-slate-500"
          )}
        >
          {trend}
        </span>
        <div className="h-px flex-1 bg-slate-100" />
      </div>
    </div>
  </Card>
);

const QuickAction = ({ label, icon: Icon, count }: QuickActionProps) => (
  <button className="w-full flex items-center justify-between px-3 py-2 bg-white/5 border border-white/10 hover:bg-white/10 transition-none text-left">
    <div className="flex items-center gap-2">
      <Icon size={12} className="text-white/60" />
      <span className="text-[10px] font-bold text-white/80 uppercase tracking-tight">
        {label}
      </span>
    </div>
    {count !== undefined && count > 0 && (
      <span className="text-[9px] font-black bg-indigo-600 text-white px-1.5">
        {count}
      </span>
    )}
  </button>
);

const StatusBadge = ({ status }: { status: QuoteStatus }) => {
  const map = {
    [QuoteStatus.SENT]: "border-blue-200 text-blue-700 bg-blue-50",
    [QuoteStatus.ACCEPTED]: "border-indigo-600 text-white bg-indigo-600",
    [QuoteStatus.PAID]: "border-emerald-200 text-emerald-700 bg-emerald-50",
    [QuoteStatus.DRAFT]: "border-slate-200 text-slate-500 bg-slate-50",
    [QuoteStatus.REJECTED]: "border-red-200 text-red-700 bg-red-50",
  };
  return (
    <span
      className={cn(
        "px-2 py-0.5 border text-[9px] font-black uppercase tracking-tighter",
        map[status]
      )}
    >
      {status}
    </span>
  );
};
