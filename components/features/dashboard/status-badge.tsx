"use client";

import { cn } from "@/lib/utils";
import {
  Check,
  FileText,
  Send,
  XCircle,
  CreditCard,
  HelpCircle,
} from "lucide-react";
import { QuoteStatus } from "@/types/dashboard"; // ✅ Import local (Safe pour le client)
import { ElementType } from "react";

export function StatusBadge({ status }: { status: QuoteStatus }) {
  const config: Record<
    QuoteStatus,
    { style: string; label: string; icon: ElementType }
  > = {
    DRAFT: {
      style: "bg-zinc-100 text-zinc-600 border-zinc-200",
      label: "Brouillon",
      icon: FileText,
    },
    SENT: {
      style: "bg-blue-50 text-blue-700 border-blue-200",
      label: "Envoyé",
      icon: Send,
    },
    ACCEPTED: {
      style: "bg-emerald-50 text-emerald-700 border-emerald-200",
      label: "Signé",
      icon: Check,
    },
    REJECTED: {
      style: "bg-red-50 text-red-700 border-red-200",
      label: "Refusé",
      icon: XCircle,
    },
    PAID: {
      style: "bg-indigo-50 text-indigo-700 border-indigo-200",
      label: "Payé",
      icon: CreditCard,
    },
  };

  const active = config[status] || {
    style: "bg-zinc-100 text-zinc-400 border-zinc-200",
    label: "Inconnu",
    icon: HelpCircle,
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-tight border shadow-sm",
        active.style
      )}
    >
      <active.icon className="w-3 h-3" strokeWidth={3} />
      {active.label}
    </span>
  );
}
