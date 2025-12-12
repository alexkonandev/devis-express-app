"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  ArrowLeft,
  Code2,
  PenTool,
  Megaphone,
  Briefcase,
  Box,
  FolderOpen,
  PieChart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UIDomain } from "@/types/explorer";

const IconMap: Record<string, React.ElementType> = {
  Code: Code2,
  Design: PenTool,
  Marketing: Megaphone,
  Business: Briefcase,
  Default: Box,
};

interface ExplorerSidebarProps {
  domains: UIDomain[];
  activeDomainId: string | null;
  onSelectDomain: (id: string) => void;
}

export const ExplorerSidebar = ({
  domains,
  activeDomainId,
  onSelectDomain,
}: ExplorerSidebarProps) => {
  const router = useRouter();

  // --- LOGIQUE ROBUSTE : ANALYSE DU CATALOGUE ---
  // Calcul mémorisé pour éviter de recompter à chaque render
  const catalogMetrics = useMemo(() => {
    const totalItems = domains.reduce(
      (acc, d) =>
        acc + d.categories.reduce((cAcc, c) => cAcc + c.items.length, 0),
      0
    );

    return domains.map((domain) => {
      const itemCount = domain.categories.reduce(
        (acc, cat) => acc + cat.items.length,
        0
      );
      const density =
        totalItems > 0 ? Math.round((itemCount / totalItems) * 100) : 0;
      return {
        id: domain.id,
        count: itemCount,
        density,
      };
    });
  }, [domains]);

  return (
    <aside className="w-64 shrink-0 border-r border-zinc-200 bg-zinc-50/50 flex flex-col h-full select-none">
      <div className="p-4 pt-6 pb-2">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors mb-6 px-2 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="font-medium">Retour</span>
        </button>

        <h2 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 px-3 mb-2 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <FolderOpen className="w-3 h-3" /> Bibliothèques
          </span>
          <PieChart className="w-3 h-3 opacity-50" />
        </h2>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
        {domains.map((domain) => {
          const IconComponent = IconMap[domain.iconName] || IconMap.Default;
          const isActive = activeDomainId === domain.id;
          const metrics = catalogMetrics.find((m) => m.id === domain.id);

          return (
            <button
              key={domain.id}
              onClick={() => onSelectDomain(domain.id)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg transition-all duration-200 group relative overflow-hidden",
                isActive
                  ? "bg-white text-zinc-900 font-medium shadow-sm ring-1 ring-zinc-200"
                  : "text-zinc-500 hover:bg-zinc-200/50 hover:text-zinc-700"
              )}
            >
              <div className="flex items-center gap-3 relative z-10">
                <div
                  className={cn(
                    "p-1.5 rounded-md transition-colors",
                    isActive
                      ? "bg-zinc-100 text-indigo-600"
                      : "bg-transparent text-zinc-400 group-hover:text-zinc-500"
                  )}
                >
                  <IconComponent className="w-4 h-4" />
                </div>
                <div className="flex flex-col items-start">
                  <span>{domain.label}</span>
                  {/* Indicateur de densité discret */}
                  <span className="text-[9px] text-zinc-400 font-normal">
                    {metrics?.count} services ({metrics?.density}%)
                  </span>
                </div>
              </div>

              {isActive && (
                <ChevronRight className="w-4 h-4 text-zinc-400 animate-in slide-in-from-left-2 duration-300" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-200 bg-zinc-100/50">
        <p className="text-xs text-zinc-400 text-center leading-relaxed">
          Base de données mise à jour.
          <br />
          Glissez pour sélectionner.
        </p>
      </div>
    </aside>
  );
};
