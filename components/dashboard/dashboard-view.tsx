"use client";

import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { MoreHorizontal, ArrowUpRight, Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AdvancedDashboardData } from "@/app/actions/dashboard.actions";
import { StatusBadge } from "@/components/dashboard/status-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

// IMPORT DES WIDGETS
import { DashboardHeader } from "./widgets/dashboard-header";
import { KpiGrid } from "./widgets/kpi-grid";
import { ClientRanking } from "./widgets/client-ranking";
import { DraftsWidget } from "./widgets/drafts-widget";

const StudioValue = ({ value, size = "md" }: any) => {
  /* ... Copier le style si besoin ou exporter */
  return (
    <span className="font-mono font-bold text-zinc-900">
      {new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
      }).format(value)}
    </span>
  );
};

export function DashboardView({ data }: { data: AdvancedDashboardData }) {
  const transactions = data.activity;

  return (
    <div className="h-[calc(100vh-40px)] w-full bg-zinc-50/50 font-sans text-zinc-900 flex flex-col overflow-hidden">
      {/* 1. HEADER */}
      <DashboardHeader />

      <main className="flex-1 p-6 flex flex-col gap-4 overflow-hidden">
        {/* 2. KPI SECTION (Fixe en haut) */}
        <KpiGrid data={data} />

        {/* 3. LOWER SECTION (Grid Layout qui remplit le reste) */}
        <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">
          {/* COLONNE GAUCHE (8/12) : TABLEAU PRINCIPAL */}
          <div className="col-span-12 lg:col-span-9 bg-white border border-zinc-200 rounded-sm flex flex-col h-full">
            {/* Table Header */}
            <div className="px-4 py-3 border-b border-zinc-100 shrink-0 bg-zinc-50/30 flex justify-between items-center">
              <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                Activité Récente
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-6 text-[10px] font-bold uppercase tracking-wide border-zinc-200 text-zinc-500 hover:text-zinc-900"
              >
                <Filter className="w-3 h-3 mr-1.5" /> Filtrer
              </Button>
            </div>

            {/* Table Content (Scrollable) */}
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-zinc-50 border-b border-zinc-100 sticky top-0 z-10">
                  <tr>
                    <th className="py-2.5 px-4 w-[15%] text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                      Montant
                    </th>
                    <th className="py-2.5 px-4 w-[15%] text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                      Statut
                    </th>
                    <th className="py-2.5 px-4 w-[35%] text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                      Client & Projet
                    </th>
                    <th className="py-2.5 px-4 w-[20%] text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                      Date
                    </th>
                    <th className="py-2.5 px-4 w-[15%] text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {transactions.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-12 text-center text-xs text-zinc-400 font-medium"
                      >
                        Aucune donnée à afficher.
                      </td>
                    </tr>
                  ) : (
                    transactions.map((t) => (
                      <tr
                        key={t.id}
                        className="group hover:bg-zinc-50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <StudioValue value={t.amount} size="sm" />
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge
                            status={
                              t.type === "SIGNED"
                                ? "accepted"
                                : t.type === "SENT"
                                ? "sent"
                                : "draft"
                            }
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-zinc-900">
                              {t.clientName}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] font-mono text-zinc-400 bg-zinc-100 px-1 rounded-sm">
                                {t.quoteNumber}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-xs font-medium text-zinc-500">
                            {format(new Date(t.date), "d MMM yyyy", {
                              locale: fr,
                            })}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-zinc-300 hover:text-zinc-900 hover:bg-zinc-100 rounded-sm"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="rounded-sm border-zinc-200"
                            >
                              <DropdownMenuLabel className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                                Actions
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <Link href={`/devis/${t.id}`}>
                                <DropdownMenuItem className="cursor-pointer text-xs font-medium">
                                  <ArrowUpRight className="w-3.5 h-3.5 mr-2 text-zinc-400" />{" "}
                                  Ouvrir
                                </DropdownMenuItem>
                              </Link>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* Footer Table */}
            <div className="px-4 py-2 border-t border-zinc-100 bg-zinc-50/30 flex justify-between items-center shrink-0">
              <span className="text-[9px] text-zinc-400 font-medium">
                Affichage des 10 derniers mouvements
              </span>
              <Link
                href="/devis"
                className="text-[9px] font-bold text-zinc-900 hover:underline"
              >
                Voir l'historique complet
              </Link>
            </div>
          </div>

          {/* COLONNE DROITE (4/12) : WIDGETS UTILES */}
          <div className="col-span-12 lg:col-span-3 flex flex-col gap-4 h-full min-h-0">
            {/* 50% Hauteur : Brouillons */}
            <div className="flex-1 min-h-0">
              <DraftsWidget drafts={data.activity} />
            </div>
            {/* 50% Hauteur : Top Clients */}
            <div className="flex-1 min-h-0">
              <ClientRanking clients={data.topClients} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
