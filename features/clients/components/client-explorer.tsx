"use client";

import React, { useState, useMemo } from "react";
import { Search, TrendingUp, Clock, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { ClientListItem } from "@/types/client";
// ✅ Importation du dialogue selon ton schéma mémorisé
import { CreateClientDialog } from "../create-client-dialog";

interface ClientExplorerProps {
  clients: ClientListItem[];
  activeId?: string;
  onSelect: (id: string) => void;
}

type TensionFilter = "ALL" | "LATENCY" | "HIGH_VALUE" | "INACTIVE";

export function ClientExplorer({
  clients,
  activeId,
  onSelect,
}: ClientExplorerProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<TensionFilter>("ALL");

  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
      if (!matchesSearch) return false;

      switch (filter) {
        case "LATENCY":
          return c.quoteCount > 0 && c.totalSpent < 100000;
        case "HIGH_VALUE":
          return c.totalSpent > 1000000;
        case "INACTIVE":
          return c.quoteCount === 0;
        default:
          return true;
      }
    });
  }, [clients, search, filter]);

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      <div className="p-4 bg-white border-b border-slate-200 space-y-3">
        {/* EN-TÊTE D'ACTION : RADAR + BOUTON CRÉATION */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-950">
            Radar_Clients
          </span>
          <CreateClientDialog />
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="SCANNER_CONTACTS..."
            className="w-full pl-10 pr-4 h-9 bg-slate-100 border-none text-[10px] font-black uppercase tracking-widest outline-none focus:ring-1 ring-indigo-600 transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="flex gap-1">
          <TensionButton
            active={filter === "ALL"}
            onClick={() => setFilter("ALL")}
            label="Tous"
          />
          <TensionButton
            active={filter === "LATENCY"}
            onClick={() => setFilter("LATENCY")}
            label="Retard"
            icon={Clock}
            variant="warning"
          />
          <TensionButton
            active={filter === "HIGH_VALUE"}
            onClick={() => setFilter("HIGH_VALUE")}
            label="VIP"
            icon={TrendingUp}
            variant="success"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filteredClients.length > 0 ? (
          filteredClients.map((client) => (
            <button
              key={client.id}
              onClick={() => onSelect(client.id)}
              className={cn(
                "w-full p-4 flex items-center justify-between border-b border-slate-200 transition-none group relative overflow-hidden",
                activeId === client.id ? "bg-white" : "hover:bg-slate-100/80"
              )}
            >
              {activeId === client.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600" />
              )}

              <div className="flex flex-col items-start gap-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-[11px] font-black uppercase tracking-tight truncate",
                      activeId === client.id
                        ? "text-slate-950"
                        : "text-slate-600"
                    )}
                  >
                    {client.name}
                  </span>
                  <FlashIndicator
                    status={client.totalSpent > 0 ? "STABLE" : "ZERO"}
                  />
                </div>
                <span className="text-[9px] font-mono font-bold text-slate-400 truncate leading-none">
                  LTV:{" "}
                  {new Intl.NumberFormat("fr-CI").format(client.totalSpent)} CFA
                </span>
              </div>
              <ChevronRightIcon active={activeId === client.id} />
            </button>
          ))
        ) : (
          <div className="p-10 text-center opacity-20">
            <span className="text-[10px] font-black uppercase tracking-widest">
              Aucun_Résultat
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// --- SOUS-COMPOSANTS TYPÉS (Gardés à l'identique pour ne pas casser la structure) ---

interface TensionButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  icon?: React.ElementType;
  variant?: "success" | "warning" | "neutral";
}

function TensionButton({
  active,
  onClick,
  label,
  icon: Icon,
  variant = "neutral",
}: TensionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 h-7 flex items-center justify-center gap-1.5 px-2 transition-none border",
        active
          ? "bg-slate-950 border-slate-950 text-white"
          : "bg-white border-slate-200 text-slate-400 hover:border-slate-400"
      )}
    >
      {Icon && (
        <Icon
          size={10}
          className={cn(
            active
              ? "text-indigo-400"
              : variant === "warning"
              ? "text-amber-500"
              : variant === "success"
              ? "text-emerald-500"
              : "text-slate-400"
          )}
        />
      )}
      <span className="text-[8px] font-black uppercase tracking-tighter">
        {label}
      </span>
    </button>
  );
}

function FlashIndicator({ status }: { status: "STABLE" | "ZERO" }) {
  return (
    <div
      className={cn(
        "w-1.5 h-1.5 rounded-full",
        status === "STABLE"
          ? "bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.5)]"
          : "bg-slate-300"
      )}
    />
  );
}

function ChevronRightIcon({ active }: { active: boolean }) {
  return (
    <div
      className={cn(
        "transition-all duration-200",
        active ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"
      )}
    >
      <div className="w-1 h-1 border-t border-r border-indigo-600 rotate-45" />
    </div>
  );
}
