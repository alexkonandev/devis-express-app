"use client";

import { ElementType } from "react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  label: string;
  amount: number;
  count: number;
  icon: ElementType;
  trend?: string;
  intent?: "neutral" | "positive" | "warning";
}

/**
 * @description KPICard v3.0 - Industrial Blueprint
 * Application stricte du Design System : 0px radius, Slate-950/Indigo-600 focus.
 */
export function KPICard({
  label,
  amount,
  count,
  icon: Icon,
  trend,
  intent = "neutral",
}: KPICardProps) {
  // Règle #1 : Stratégie de Couleurs Tailwind natives
  const variants = {
    neutral: {
      card: "bg-white border-slate-200 hover:border-slate-400",
      icon: "text-slate-400 bg-slate-50 border-slate-200",
      trend: "bg-slate-100 text-slate-600",
    },
    positive: {
      card: "bg-white border-slate-200 hover:border-indigo-600",
      icon: "text-indigo-600 bg-indigo-50 border-indigo-100",
      trend: "bg-indigo-600 text-white",
    },
    warning: {
      card: "bg-white border-slate-200 hover:border-slate-950",
      icon: "text-slate-950 bg-slate-50 border-slate-200",
      trend: "bg-slate-950 text-white",
    },
  };

  return (
    <div
      className={cn(
        "flex flex-col p-6 rounded-none border shadow-none transition-all duration-300 font-sans group relative overflow-hidden",
        variants[intent].card
      )}
    >
      {/* HEADER : Règle #2 (rounded-none) */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div
          className={cn(
            "p-3 rounded-none border transition-colors",
            variants[intent].icon
          )}
        >
          <Icon className="w-5 h-5" strokeWidth={2.5} />
        </div>

        {trend && (
          <div
            className={cn(
              "px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-none",
              variants[intent].trend
            )}
          >
            {trend}
          </div>
        )}
      </div>

      {/* CONTENT : Règle #3 (Typography) */}
      <div className="space-y-2 relative z-10">
        <p className="text-[10px] uppercase font-black text-slate-400 tracking-[0.3em]">
          {label}
        </p>

        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-mono font-black text-slate-950 tracking-tighter tabular-nums leading-none">
            {new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: "EUR",
              maximumFractionDigits: 0,
            }).format(amount)}
          </span>
        </div>

        {/* FOOTER : Rythme 8px */}
        <div className="flex items-center gap-3 pt-2">
          <div className="w-1.5 h-1.5 bg-slate-200 rounded-none group-hover:bg-indigo-600 transition-colors" />
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.1em]">
            {count} Document{count > 1 ? "s" : ""} traité{count > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Filigrane discret pour le look Blueprint */}
      <div className="absolute top-0 right-0 p-1 opacity-[0.02] font-mono text-[40px] font-black pointer-events-none select-none">
        KPI
      </div>
    </div>
  );
}
