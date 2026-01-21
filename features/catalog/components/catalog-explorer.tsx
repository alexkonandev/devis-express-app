"use client";

import React, { useState, useMemo } from "react";
import { Search, Plus, Repeat, Zap, Layers, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { CatalogItem } from "@/types/catalog"; // On utilise uniquement ton type centralisé
import { Button } from "@/components/ui/button";

interface CatalogExplorerProps {
  items: CatalogItem[];
  activeId?: string | null;
  onSelect: (id: string) => void;
}

export function CatalogExplorer({
  items,
  activeId,
  onSelect,
}: CatalogExplorerProps) {
  const [search, setSearch] = useState("");

  // Utilisation de strings brutes pour éviter tout import de @prisma/client
  const [modelFilter, setModelFilter] = useState<string>("ALL");

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const title = item.title?.toLowerCase() || "";
      const matchesSearch = title.includes(search.toLowerCase());

      const hasBusinessModel = "businessModel" in item;
      const matchesModel =
        modelFilter === "ALL" ||
        (hasBusinessModel && item.businessModel === modelFilter);

      return matchesSearch && matchesModel;
    });
  }, [items, search, modelFilter]);

  return (
    <div className="flex flex-col h-full bg-slate-50/20">
      <div className="p-4 bg-white border-b border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-950">
            Radar_Inventaire
          </span>
          <Button
            size="sm"
            className="h-7 rounded-none bg-indigo-600 hover:bg-indigo-700 text-[9px] font-black uppercase tracking-widest px-3"
          >
            <Plus size={12} className="mr-1" /> Nouvel_Actif
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="RECHERCHE_RÉFÉRENCE..."
            className="w-full pl-10 pr-4 h-9 bg-slate-100 border-none text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-1 ring-indigo-600 transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="flex flex-wrap gap-1">
          <TensionTab
            active={modelFilter === "ALL"}
            onClick={() => setModelFilter("ALL")}
            label="Tous"
          />
          <TensionTab
            active={modelFilter === "RECURRING"}
            onClick={() => setModelFilter("RECURRING")}
            label="Récurrent"
            icon={Repeat}
            color="text-emerald-500"
          />
          <TensionTab
            active={modelFilter === "PROJECT"}
            onClick={() => setModelFilter("PROJECT")}
            label="Projets"
            icon={Zap}
            color="text-amber-500"
          />
          <TensionTab
            active={modelFilter === "UNIT"}
            onClick={() => setModelFilter("UNIT")}
            label="Unitaire"
            icon={Layers}
            color="text-indigo-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-slate-100">
        {filteredItems.map((item) => (
          <CatalogCard
            key={item.id}
            item={item}
            isActive={activeId === item.id}
            onClick={() => onSelect(item.id)}
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
          : "bg-white border-slate-200 text-slate-400 hover:border-slate-400 hover:text-slate-600"
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

function CatalogCard({
  item,
  isActive,
  onClick,
}: {
  item: CatalogItem;
  isActive: boolean;
  onClick: () => void;
}) {
  const isPremiumPrice = item.unitPrice >= 500;
  const businessModel =
    "businessModel" in item ? (item.businessModel as string) : null;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-4 flex flex-col items-start gap-1 transition-none relative group overflow-hidden text-left",
        isActive
          ? "bg-white shadow-[inset_4px_0_0_0_#4f46e5]"
          : "hover:bg-slate-100/50"
      )}
    >
      <div className="flex justify-between w-full items-center mb-0.5">
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[140px]">
          {item.category || "Sans_Catégorie"}
        </span>

        {isPremiumPrice ? (
          <div className="flex items-center gap-1 bg-indigo-50 px-1.5 py-0.5 border border-indigo-100">
            <ShieldCheck size={8} className="text-indigo-600" />
            <span className="text-[8px] font-black text-indigo-600 uppercase">
              Premium
            </span>
          </div>
        ) : (
          <span className="text-[8px] font-black text-slate-400 bg-slate-100 px-1.5 py-0.5 uppercase">
            Standard
          </span>
        )}
      </div>

      <h3
        className={cn(
          "text-[12px] font-black uppercase tracking-tight truncate w-full",
          isActive
            ? "text-slate-950"
            : "text-slate-600 group-hover:text-slate-950"
        )}
      >
        {item.title}
      </h3>

      <div className="flex justify-between items-end w-full mt-1">
        <p className="text-[14px] font-mono font-black text-slate-950 tabular-nums leading-none">
          {new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
          }).format(item.unitPrice)}
        </p>

        {businessModel && (
          <span className="text-[8px] font-bold text-slate-300 uppercase">
            {businessModel}
          </span>
        )}
      </div>
    </button>
  );
}
