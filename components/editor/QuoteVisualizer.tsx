"use client";

import React from "react";
import PrintableQuote from "@/components/pdf/printable-quote";
import { MonitorIcon, FilePdfIcon, ArrowsOutIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

// --- TYPES STRICTS ---
import { EditorActiveQuote, EditorTheme } from "@/types/editor";

interface QuoteVisualizerProps {
  data: EditorActiveQuote | null; // Strict null handling
  theme: EditorTheme | undefined;
  printRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * COMPOSANT : QuoteVisualizer
 * MISSION : Environnement de contrôle pour le rendu final.
 * STRUCTURE : Blueprint v3.0 (Focus Mode)
 */
export const QuoteVisualizer = ({
  data,
  theme,
  printRef,
}: QuoteVisualizerProps) => {
  // 1. GESTION DES ÉTATS D'ATTENTE (Structure Blueprint)
  if (!data) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-slate-200 border-t-indigo-600 animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
            Initialisation_Systeme...
          </span>
        </div>
      </div>
    );
  }

  // Solution 1 : Le Cast propre (Direct et efficace)
  const effectiveTheme = (theme || {
    id: "default-fallback",
    name: "Design Standard",
    baseLayout: "swiss",
    color: "#4f46e5",
    config: {},
    // On ajoute les champs manquants avec des valeurs par défaut pour satisfaire le type
    createdAt: new Date(),
    updatedAt: new Date(),
    isPremium: false,
    description: null,
    isSystem: true,
  }) as EditorTheme;
  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100 overflow-hidden relative">
      {/* 2. BARRE D'ÉTAT DU VISUALISEUR (Metadata Look) */}
      <div className="h-10 shrink-0 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <MonitorIcon size={14} weight="bold" className="text-indigo-600" />
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-900">
              Studio_Preview
            </span>
          </div>
          <div className="h-4 w-[1px] bg-slate-200" />
          <div className="flex items-center gap-4">
            <span className="text-[9px] font-bold text-slate-400 uppercase">
              Zoom: Auto
            </span>
            <span className="text-[9px] font-bold text-slate-400 uppercase">
              Format: A4_Standard
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-1.5 text-slate-400 hover:text-indigo-600 transition-none">
            <ArrowsOutIcon size={16} />
          </button>
          <div className="h-4 w-[1px] bg-slate-200" />
          <div className="flex items-center gap-2 px-2 py-1 bg-slate-950 text-white select-none">
            <FilePdfIcon size={14} weight="duotone" />
            <span className="text-[9px] font-black uppercase tracking-tight">
              Render_Ready
            </span>
          </div>
        </div>
      </div>

      {/* 3. ZONE DE RENDU (Blueprint Workspace) */}
      <div className="flex-1 overflow-y-auto  scrollbar-none flex justify-center items-start">
        {/* Conteneur de la feuille avec ombre portée industrielle */}
        <div
          className={cn(
            "bg-white shadow-[20px_20px_60px_rgba(0,0,0,0.05)] border border-slate-200 rounded-none",
            "transition-all duration-300 ease-in-out",
            "print:shadow-none print:border-0 print:m-0"
          )}
        >
          <PrintableQuote ref={printRef} quote={data} theme={effectiveTheme} />
        </div>
      </div>

      {/* 4. INDICATEUR DE FOCUS (Ligne de force Indigo v3.0) */}
      <div className="absolute left-0 top-10 bottom-0 w-[1px] bg-indigo-500/30" />
    </div>
  );
};
