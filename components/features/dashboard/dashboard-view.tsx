"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { MoreHorizontal, Filter, Target } from "lucide-react";
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

interface DashboardViewProps {
  data: AdvancedDashboardData;
  profile: {
    profession: Profession | null;
    businessModel: BusinessModel | null;
  };
}

const StudioValue = ({ value }: { value: number }) => (
  <span className="font-mono font-bold text-zinc-900">
    {new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value)}
  </span>
);

export function DashboardView({ data, profile }: DashboardViewProps) {
  return (
    <div className="w-full flex flex-col gap-8 p-6">
      {/* BARRE DE STATUT : Alignement métier */}
      <div className="flex items-center gap-6 px-4 py-3 bg-white border border-zinc-200 rounded-lg shadow-sm">
        <div className="flex items-center gap-2">
          <Target className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            Secteur:
          </span>
          <span className="text-[10px] font-black text-zinc-900 uppercase italic">
            {profile.profession || "Non défini"}
          </span>
        </div>
        <div className="w-px h-4 bg-zinc-200" />
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            Modèle:
          </span>
          <span className="text-[10px] font-black text-zinc-900 uppercase italic">
            {profile.businessModel || "Non défini"}
          </span>
        </div>
      </div>

      <SuggestedServices services={data.suggestedServices} />

      <KpiGrid data={data} />

      <div className="grid grid-cols-12 gap-6 pb-10">
        <div className="col-span-12 lg:col-span-9 bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm h-fit">
          <div className="px-5 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
              Activité Récente
            </span>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-[10px] font-bold border-zinc-200 uppercase tracking-wider"
            >
              <Filter className="w-3 h-3 mr-2" /> Filtrer
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/50 border-b border-zinc-100">
                  <th className="py-3 px-5 text-[9px] font-black uppercase tracking-widest text-zinc-400">
                    Montant
                  </th>
                  <th className="py-3 px-5 text-[9px] font-black uppercase tracking-widest text-zinc-400">
                    Statut
                  </th>
                  <th className="py-3 px-5 text-[9px] font-black uppercase tracking-widest text-zinc-400">
                    Client & Projet
                  </th>
                  <th className="py-3 px-5 text-[9px] font-black uppercase tracking-widest text-zinc-400">
                    Date
                  </th>
                  <th className="py-3 px-5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {data.activity.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-16 text-center text-[10px] font-bold text-zinc-300 uppercase tracking-[0.3em]"
                    >
                      Aucun mouvement détecté
                    </td>
                  </tr>
                ) : (
                  data.activity.map((item) => (
                    <tr
                      key={item.id}
                      className="group hover:bg-zinc-50/80 transition-colors"
                    >
                      <td className="py-4 px-5">
                        <StudioValue value={item.amount} />
                      </td>
                      <td className="py-4 px-5">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-zinc-900">
                            {item.clientName}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-400">
                            {item.quoteNumber}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-[10px] font-bold text-zinc-500">
                        {format(new Date(item.date), "dd MMM yyyy", {
                          locale: fr,
                        })}
                      </td>
                      <td className="py-4 px-5 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-zinc-400 hover:text-zinc-900"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
          <DraftsWidget
            drafts={data.activity.filter((a) => a.status === QuoteStatus.DRAFT)}
          />
          <ClientRanking clients={data.topClients} />
        </div>
      </div>
    </div>
  );
}
