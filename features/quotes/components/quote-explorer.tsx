// @/features/quotes/components/quote-explorer.tsx
"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Clock,
  FileCheck,
  PenTool,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { QuoteListItem, QuoteStatus } from "@/types/quote";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

interface QuoteExplorerProps {
  items: QuoteListItem[];
  activeId?: string | null;
  onSelect: (id: string) => void;
}

type TensionFilter = "all" | QuoteStatus;

export function QuoteExplorer({
  items,
  activeId,
  onSelect,
}: QuoteExplorerProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<TensionFilter>("all");

  const filteredItems = useMemo(() => {
    return items.filter((q) => {
      const matchesSearch =
        q.clientName.toLowerCase().includes(search.toLowerCase()) ||
        q.number.toLowerCase().includes(search.toLowerCase());

      if (!matchesSearch) return false;
      if (filter === "all") return true;
      return q.status === filter;
    });
  }, [items, search, filter]);

  return (
    <div className="flex flex-col h-full bg-slate-50/20">
      <div className="p-4 bg-white border-b border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-950">
            Flux_Radar
          </span>
          <Button
            size="sm"
            className="h-7 rounded-none bg-indigo-600 hover:bg-indigo-700 text-[9px] font-black uppercase tracking-widest px-3"
          >
            <Plus size={12} className="mr-1" /> Nouveau
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="RECHERCHE_DOSSIER..."
            className="w-full pl-10 pr-4 h-9 bg-slate-100 border-none text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-1 ring-indigo-600 transition-all"
          />
        </div>

        {/* FILTRES BASÉS SUR TON ENUM PRISMA */}
        <div className="flex flex-wrap gap-1">
          <TensionTab
            active={filter === "all"}
            onClick={() => setFilter("all")}
            label="Tous"
          />
          <TensionTab
            active={filter === "DRAFT"}
            onClick={() => setFilter("DRAFT")}
            label="Brouillon"
            icon={PenTool}
          />
          <TensionTab
            active={filter === "SENT"}
            onClick={() => setFilter("SENT")}
            label="Envoyé"
            icon={Clock}
            color="text-amber-500"
          />
          <TensionTab
            active={filter === "ACCEPTED"}
            onClick={() => setFilter("ACCEPTED")}
            label="Accepté"
            icon={FileCheck}
            color="text-emerald-500"
          />
          <TensionTab
            active={filter === "PAID"}
            onClick={() => setFilter("PAID")}
            label="Payé"
            icon={CheckCircle2}
            color="text-indigo-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-slate-100">
        {filteredItems.map((quote) => (
          <QuoteCard
            key={quote.id}
            quote={quote}
            isActive={activeId === quote.id}
            onClick={() => onSelect(quote.id)}
          />
        ))}
      </div>
    </div>
  );
}

// --- SOUS-COMPOSANTS ---

function TensionTab({
  active,
  onClick,
  label,
  icon: Icon,
  color,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon?: React.ElementType;
  color?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 min-w-[65px] h-7 flex items-center justify-center gap-1 px-2 border transition-none",
        active
          ? "bg-slate-950 border-slate-950 text-white"
          : "bg-white border-slate-200 text-slate-400 hover:border-slate-400"
      )}
    >
      {Icon && (
        <Icon size={10} className={active ? "text-indigo-400" : color} />
      )}
      <span className="text-[8px] font-black uppercase tracking-tighter whitespace-nowrap">
        {label}
      </span>
    </button>
  );
}

function QuoteCard({
  quote,
  isActive,
  onClick,
}: {
  quote: QuoteListItem;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-4 flex flex-col items-start gap-1 transition-none relative group overflow-hidden",
        isActive ? "bg-white" : "hover:bg-slate-100/50"
      )}
    >
      <div
        className={cn(
          "absolute bottom-0 left-0 h-[2px] transition-all",
          isActive ? "w-full" : "w-0 group-hover:w-full",
          quote.status === "PAID" || quote.status === "ACCEPTED"
            ? "bg-emerald-500"
            : quote.status === "SENT"
            ? "bg-amber-500"
            : quote.status === "REJECTED"
            ? "bg-rose-500"
            : "bg-slate-300"
        )}
      />

      <div className="flex justify-between w-full items-center mb-0.5">
        <span className="text-[9px] font-mono font-bold text-slate-400 tracking-tighter uppercase">
          {quote.number}
        </span>
        <span className="text-[9px] font-bold text-slate-400">
          {format(new Date(quote.updatedAt), "dd.MM.yy")}
        </span>
      </div>

      <h3
        className={cn(
          "text-[12px] font-black uppercase tracking-tight truncate w-full text-left",
          isActive ? "text-slate-950" : "text-slate-600"
        )}
      >
        {quote.clientName}
      </h3>

      <p className="text-[14px] font-mono font-black text-slate-950 tabular-nums">
        {new Intl.NumberFormat("fr-CI").format(quote.totalAmount)}{" "}
        <span className="text-[10px] font-bold">CFA</span>
      </p>
    </button>
  );
}
