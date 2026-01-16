"use client";

import { format } from "date-fns";
import {
  MoreHorizontal,
  Filter,
  Target,
  ArrowUpRight,
  Zap,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/features/dashboard/status-badge";
import {
  AdvancedDashboardData,
  Profession,
  BusinessModel,
} from "@/types/dashboard";

import { KpiGrid } from "./widgets/kpi-grid";
import { ClientRanking } from "./widgets/client-ranking";
import { DraftsWidget } from "./widgets/drafts-widget";
import { SuggestedServices } from "./widgets/suggested-services";
import { QuoteStatus } from "@/app/generated/prisma/enums";
import { cn } from "@/lib/utils";

interface DashboardViewProps {
  data: AdvancedDashboardData;
  profile: {
    profession: Profession | null;
    businessModel: BusinessModel | null;
  };
}

const StudioValue = ({
  value,
  className,
}: {
  value: number;
  className?: string;
}) => (
  <span
    className={cn(
      "font-mono font-medium text-[14px] text-slate-950 tabular-nums tracking-tighter",
      className
    )}
  >
    {new Intl.NumberFormat("fr-CI", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(value)}
  </span>
);

const StudioLabel = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span
    className={cn(
      "text-[10px] font-black uppercase tracking-[0.3em] text-slate-500",
      className
    )}
  >
    {children}
  </span>
);

export function DashboardView({ data, profile }: DashboardViewProps) {
  return (
    <div className="min-h-screen w-full bg-white p-8 font-sans selection:bg-indigo-600 selection:text-white">
      <div className="max-w-[87.5rem] mx-auto flex flex-col gap-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-600 fill-indigo-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">
                Poste de Pilotage
              </span>
            </div>
            <h1 className="text-[36px] font-extrabold tracking-tight text-slate-950 leading-none uppercase">
              Tableau de bord
            </h1>
          </div>

          {/* Profil : Pure Tailwind bg-slate-50 & rounded-none */}
          <div className="flex items-center gap-4 px-6 py-4 bg-slate-50 border border-slate-200 rounded-none">
            <div className="flex items-center gap-3">
              <Target className="w-4 h-4 text-indigo-600" />
              <div className="flex flex-col">
                <StudioLabel>Secteur</StudioLabel>
                <span className="text-[12px] font-black text-slate-950 uppercase leading-none">
                  {profile.profession || "N/A"}
                </span>
              </div>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div className="flex flex-col">
              <StudioLabel>Modèle</StudioLabel>
              <span className="text-[12px] font-black text-slate-950 uppercase leading-none">
                {profile.businessModel || "N/A"}
              </span>
            </div>
          </div>
        </div>

        <SuggestedServices services={data.suggestedServices} />
        <KpiGrid data={data} />

        <div className="grid grid-cols-12 gap-8 pb-12">
          {/* TABLE D'ACTIVITÉ */}
          <Card className="col-span-12 lg:col-span-9 border-slate-200 rounded-none shadow-none bg-white">
            <CardHeader className="p-0 border-b border-slate-200">
              <div className="flex items-center justify-between p-6 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-indigo-600" />
                  <CardTitle className="text-[18px] font-extrabold tracking-tight text-slate-950 uppercase">
                    Flux récents
                  </CardTitle>
                </div>
                <Button
                  variant="outline"
                  className="h-[40px] px-5 text-[10px] font-black uppercase tracking-widest border-slate-200 rounded-none hover:bg-white"
                >
                  <Filter className="w-3.5 h-3.5 mr-2" /> Filtrer
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-6">
                      <StudioLabel>Montant</StudioLabel>
                    </th>
                    <th className="p-6">
                      <StudioLabel>Statut</StudioLabel>
                    </th>
                    <th className="p-6">
                      <StudioLabel>Client</StudioLabel>
                    </th>
                    <th className="p-6">
                      <StudioLabel>Date</StudioLabel>
                    </th>
                    <th className="p-6"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {data.activity.map((item) => (
                    <tr
                      key={item.id}
                      className="group hover:bg-indigo-50/50 transition-colors"
                    >
                      <td className="p-6">
                        <StudioValue
                          value={item.amount}
                          className="text-[16px] font-bold"
                        />
                      </td>
                      <td className="p-6">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="p-6">
                        <div className="flex flex-col">
                          <span className="text-[14px] font-bold text-slate-950 uppercase tracking-tight">
                            {item.clientName}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400 font-bold uppercase">
                            {item.quoteNumber}
                          </span>
                        </div>
                      </td>
                      <td className="p-6 text-[12px] font-mono font-medium text-slate-400">
                        {format(new Date(item.date), "dd.MM.yy")}
                      </td>
                      <td className="p-6 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-none hover:bg-slate-950 hover:text-white transition-all"
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* SIDEBAR */}
          <div className="col-span-12 lg:col-span-3 flex flex-col gap-8">
            <DraftsWidget
              drafts={data.activity.filter(
                (a) => a.status === QuoteStatus.DRAFT
              )}
            />

            {/* BLOC DE TENSION : Slate-950 / Indigo-600 */}
            <Card className="bg-slate-950 border-none rounded-none shadow-none relative overflow-hidden group min-h-[320px] flex flex-col justify-center">
              <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />
              <CardContent className="p-6 flex flex-col gap-8 relative z-10">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-white/10 border border-white/20">
                    <Target className="w-5 h-5 text-indigo-400" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-white/40 group-hover:text-indigo-400 transition-all" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">
                    Objectif de Croissance
                  </span>
                  <div className="flex items-baseline gap-1 mt-2">
                    <p className="text-[48px] font-mono font-black text-white tracking-tighter leading-none">
                      85
                    </p>
                    <span className="text-[24px] font-mono font-black text-indigo-500">
                      %
                    </span>
                  </div>
                </div>
                <div className="space-y-5">
                  <div className="flex justify-between text-[10px] font-bold text-white/30 uppercase tracking-widest">
                    <span>Progression</span>
                    <span className="text-white">85 / 100</span>
                  </div>
                  <div className="w-full h-1 bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 transition-all duration-1000"
                      style={{ width: "85%" }}
                    />
                  </div>
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-none font-black uppercase text-[11px] tracking-[0.2em] h-12 border-none">
                    Propulser le CA
                  </Button>
                </div>
              </CardContent>
            </Card>

            <ClientRanking clients={data.topClients} />
          </div>
        </div>
      </div>
    </div>
  );
}
