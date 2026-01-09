"use client";

import { Progress } from "@/components/ui/progress";
import { Zap, Infinity } from "lucide-react";

interface UsageMetricsProps {
  count: number;
  isPro: boolean;
}

export function UsageMetrics({ count, isPro }: UsageMetricsProps) {
  const MAX_FREE_QUOTES = 5;
  const percentage = isPro ? 0 : (count / MAX_FREE_QUOTES) * 100;

  return (
    <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
      <div className="bg-zinc-50/50 px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
          Utilisation des ressources
        </h3>
        <Zap
          className={`w-3.5 h-3.5 ${
            isPro ? "text-emerald-500" : "text-zinc-400"
          }`}
        />
      </div>

      <div className="p-6 space-y-6">
        {/* Metric : Devis Générés */}
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <p className="text-[10px] font-black uppercase text-zinc-400">
              Devis générés ce mois
            </p>
            <p className="text-sm font-mono font-bold text-zinc-900">
              {count} /{" "}
              {isPro ? (
                <Infinity className="inline w-4 h-4" />
              ) : (
                MAX_FREE_QUOTES
              )}
            </p>
          </div>

          {!isPro ? (
            <>
              <Progress value={percentage} className="h-1.5 bg-zinc-100" />
              <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-tight italic">
                {MAX_FREE_QUOTES - count} devis restants avant blocage.
              </p>
            </>
          ) : (
            <div className="h-1.5 w-full bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
          )}
        </div>

        {/* Info Box */}
        <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-100 space-y-2">
          <p className="text-[10px] font-black uppercase text-zinc-900">
            {isPro ? "Statut : Studio Pro" : "Statut : Limitation Free"}
          </p>
          <p className="text-[9px] text-zinc-500 font-medium leading-relaxed uppercase">
            {isPro
              ? "Toutes les limites sont levées. Ton infrastructure est prête pour le scaling."
              : "Le plan Free limite ton volume d'affaires. Passe au plan Pro pour ne jamais être freiné dans ta prospection."}
          </p>
        </div>
      </div>
    </div>
  );
}
