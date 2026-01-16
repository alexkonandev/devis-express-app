"use client";

import Link from "next/link";
import { ArrowUpRight, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

// Règle #4 : Utilisation des primitives Shadcn (import supposé conforme à ton arborescence)
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ClientRankingProps {
  clients: {
    id: string;
    name: string;
    totalSpent: number;
    quoteCount: number;
  }[];
}

/**
 * @description Refonte ClientRanking v3.0 - Industrial Strategy
 * Règle #2 : Zéro arrondi (rounded-none)
 * Règle #1 : Contrastes Slate-950 / Indigo-600
 */
export function ClientRanking({ clients }: ClientRankingProps) {
  return (
    <Card className="bg-white border-slate-200 rounded-none flex flex-col h-full shadow-none overflow-hidden font-sans">
      {/* HEADER : Règle #4 (bg-slate-50 + Ligne de force) */}
      <CardHeader className="p-0 border-b border-slate-200 shrink-0 bg-slate-50/80">
        <div className="px-5 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-4 bg-indigo-600" />{" "}
            {/* Ligne de force Accent */}
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
              Top Clients
            </span>
          </div>
          <Link
            href="/clients"
            className="group text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 transition-all"
          >
            Analyse{" "}
            <ArrowUpRight className="w-3 h-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </CardHeader>

      {/* BODY : Règle #5 (p-6) + Règle #3 (Data font-mono) */}
      <CardContent className="flex-1 overflow-auto p-0">
        {clients.length === 0 ? (
          <div className="h-40 flex flex-col items-center justify-center text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] gap-4">
            <div className="w-12 h-px bg-slate-200" />
            Vide
            <div className="w-12 h-px bg-slate-200" />
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {clients.map((client, i) => (
              <div
                key={client.id}
                className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  {/* Rang : Règle #2 (rounded-none) + Règle #1 (bg-slate-950 pour le #1) */}
                  <div
                    className={cn(
                      "w-8 h-8 rounded-none flex items-center justify-center text-[12px] font-mono font-black transition-all",
                      i === 0
                        ? "bg-slate-950 text-white"
                        : "bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600"
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[14px] font-bold text-slate-950 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">
                      {client.name}
                    </span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.1em]">
                      {client.quoteCount} Projets
                    </span>
                  </div>
                </div>

                {/* Valeur : Règle #3 (JetBrains Mono via font-mono) */}
                <span className="font-mono text-[14px] font-bold text-slate-950 tabular-nums">
                  {new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                    maximumFractionDigits: 0,
                  }).format(client.totalSpent)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* FOOTER : Profit-oriented & Industrial */}
      <div className="px-5 py-3 bg-slate-50/50 border-t border-slate-200">
        <div className="flex justify-between items-center">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
            Source: Volume Encaissé
          </p>
          <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse" />
        </div>
      </div>
    </Card>
  );
}
