"use client";

import { Progress } from "@/components/ui/progress";
import { Zap, Infinity, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface UsageMetricsProps {
  count: number;
  isPro: boolean;
}

export function UsageMetrics({ count, isPro }: UsageMetricsProps) {
  const MAX_FREE_QUOTES = 5;
  const percentage = isPro ? 100 : (count / MAX_FREE_QUOTES) * 100;

  return (
    <div className="bg-white border border-slate-200 rounded-none overflow-hidden shadow-none">
      {/* HEADER DE SECTION : NOMENCLATURE SYSTÈME */}
      <div className="bg-slate-50 px-5 py-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-slate-950" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-950">
            Resource-Monitor / v1.0
          </h3>
        </div>
        {isPro && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-indigo-600 text-white text-[8px] font-black uppercase tracking-widest">
            <Zap className="w-2.5 h-2.5 fill-current" /> High-Performance
          </div>
        )}
      </div>

      <div className="p-6 space-y-8">
        {/* METRIC : UNITÉS DE GÉNÉRATION */}
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <div className="flex flex-col gap-1">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                Unités Devis / Mois
              </p>
              <div className="h-1 w-8 bg-indigo-600" />
            </div>
            <div className="text-right">
              <span className="text-[18px] font-mono font-black text-slate-950 tabular-nums">
                {count.toString().padStart(2, "0")}
              </span>
              <span className="text-[12px] font-mono font-bold text-slate-400 mx-2">
                /
              </span>
              <span className="text-[14px] font-mono font-black text-slate-950">
                {isPro ? "∞" : MAX_FREE_QUOTES.toString().padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* JAUGE INDUSTRIELLE */}
          <div className="relative h-4 w-full bg-slate-100 border border-slate-200 rounded-none p-[2px]">
            <div
              className={cn(
                "h-full transition-all duration-500 rounded-none",
                isPro
                  ? "bg-indigo-600"
                  : percentage > 80
                  ? "bg-rose-600"
                  : "bg-slate-950"
              )}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>

          {!isPro && (
            <div className="flex justify-between items-center">
              <p className="text-[9px] text-slate-500 font-black uppercase tracking-tighter">
                Quota disponible : {Math.max(0, MAX_FREE_QUOTES - count)} unités
              </p>
              {percentage >= 80 && (
                <span className="text-[9px] font-black text-rose-600 uppercase animate-pulse">
                  ! Seuil Critique
                </span>
              )}
            </div>
          )}
        </div>

        {/* LOG DE STATUS : VISION BUSINESS */}
        <div className="p-4 bg-slate-950 rounded-none border-l-4 border-indigo-600 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[9px] font-black uppercase text-indigo-400 tracking-[0.2em]">
              System-Status
            </p>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <p className="text-[11px] text-white font-bold leading-relaxed uppercase tracking-tight">
            {isPro
              ? "Accès Pro confirmé. Toutes les restrictions de volume ont été neutralisées."
              : "Mode Standard actif. La scalabilité est limitée par le quota de découverte."}
          </p>
          <div className="pt-2 border-t border-white/10">
            <p className="text-[8px] font-mono text-slate-500 uppercase">
              Uptime: 99.9% // Region: Global-Edge
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
