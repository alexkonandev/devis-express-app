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

export function KPICard({
  label,
  amount,
  count,
  icon: Icon,
  trend,
  intent = "neutral",
}: KPICardProps) {
  const variants = {
    neutral: {
      card: "bg-white border-zinc-200",
      icon: "text-zinc-500 bg-zinc-100",
    },
    positive: {
      card: "bg-white border-zinc-200 hover:border-emerald-200 transition-colors",
      icon: "text-emerald-600 bg-emerald-50",
    },
    warning: {
      card: "bg-white border-zinc-200 hover:border-amber-200 transition-colors",
      icon: "text-amber-600 bg-amber-50",
    },
  };

  return (
    <div
      className={cn(
        "flex flex-col p-5 rounded-xl border shadow-sm",
        variants[intent].card
      )}
    >
      <div className="flex items-center justify-between mb-6">
        <div className={cn("p-2.5 rounded-lg", variants[intent].icon)}>
          <Icon className="w-4 h-4" strokeWidth={2.5} />
        </div>
        {trend && (
          <span className="text-[10px] font-black text-emerald-700 bg-emerald-100/50 px-2 py-0.5 rounded-full tracking-tighter">
            {trend}
          </span>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-[10px] uppercase font-black text-zinc-400 tracking-[0.15em]">
          {label}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-mono font-bold text-zinc-900 tracking-tighter">
            {new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: "EUR",
              maximumFractionDigits: 0,
            }).format(amount)}
          </span>
        </div>
        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tight">
          {count} document{count > 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}
