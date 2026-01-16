"use client";

import { cn } from "@/lib/utils";
import {
  FileText,
  Send,
  XCircle,
  CreditCard,
  HelpCircle,
  ArrowUpRight,
} from "lucide-react";
import { QuoteStatus } from "@/types/dashboard";
import { ElementType } from "react";

/**
 * @description StatusBadge v3.0 - Industrial Blueprint
 * Règle #2 : rounded-none (Obligatoire)
 * Règle #1 : Pure Tailwind (Indigo-600, Slate-950, Rose-600)
 */
export function StatusBadge({ status }: { status: QuoteStatus }) {
  const config: Record<
    QuoteStatus,
    { style: string; label: string; icon: ElementType }
  > = {
    DRAFT: {
      style: "bg-slate-50 text-slate-500 border-slate-200",
      label: "Brouillon",
      icon: FileText,
    },
    SENT: {
      style: "bg-white text-slate-950 border-slate-950",
      label: "En attente",
      icon: Send,
    },
    ACCEPTED: {
      style: "bg-indigo-50 text-indigo-600 border-indigo-200",
      label: "Signé",
      icon: ArrowUpRight,
    },
    REJECTED: {
      style: "bg-rose-50 text-rose-600 border-rose-200",
      label: "Refusé",
      icon: XCircle,
    },
    PAID: {
      style: "bg-slate-950 text-white border-transparent shadow-none",
      label: "Payé",
      icon: CreditCard,
    },
  };

  const active = config[status] || {
    style: "bg-slate-100 text-slate-400 border-slate-200",
    label: "Inconnu",
    icon: HelpCircle,
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-none text-[9px] font-black uppercase tracking-[0.15em] border transition-all duration-200 font-sans",
        active.style
      )}
    >
      <active.icon className="w-3 h-3" strokeWidth={3} />
      {active.label}
    </span>
  );
}
