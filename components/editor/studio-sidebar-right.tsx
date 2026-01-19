"use client";

import React from "react";
import { PaletteIcon, CheckIcon, Icon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { EditorActiveQuote, EditorTheme } from "@/types/editor";

interface StudioSidebarRightProps {
  activeQuote: EditorActiveQuote;
  availableThemes: EditorTheme[];
  currentTheme: string;
  setTheme: (theme: string) => void;
  totals: { totalTTC: number; subTotal: number };
}

// --- STRUCTURES ATOMIQUES ---

const SectionHeader = ({ title, icon: Icon }: { title: string; icon: Icon }) => (
  <div className="h-10 bg-slate-50 border-y border-slate-200 flex items-center px-3 shrink-0">
    <div className="flex items-center gap-2">
      <Icon size={14} weight="bold" className="text-slate-400" />
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
        {title}
      </span>
    </div>
  </div>
);

export const StudioSidebarRight = ({
  availableThemes,
  currentTheme,
  setTheme,
  totals,
}: StudioSidebarRightProps) => {
  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-200 w-[280px] overflow-hidden">
      {/* HEADER : STYLE ENGINE */}
      <div className="h-12 shrink-0 flex items-center px-4 border-b border-slate-200 bg-white">
        <span className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-900">
          Style_Engine
        </span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-none">
        <SectionHeader title="Visual_Identity" icon={PaletteIcon} />

        <div className="p-3 space-y-2">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-1">
            Active_Themes
          </span>
          <div className="grid grid-cols-1 gap-1">
            {availableThemes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setTheme(theme.id)}
                className={cn(
                  "group flex items-center justify-between p-3 border transition-none relative overflow-hidden",
                  currentTheme === theme.id
                    ? "border-slate-950 bg-white shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
                    : "border-slate-100 hover:border-slate-300 bg-slate-50/30"
                )}
              >
                <div className="flex items-center gap-3 z-10">
                  <div
                    className="w-4 h-4 rounded-none border border-black/10 shadow-sm"
                    style={{ backgroundColor: theme.color }}
                  />
                  <span
                    className={cn(
                      "text-[11px] font-black uppercase tracking-tight",
                      currentTheme === theme.id
                        ? "text-slate-900"
                        : "text-slate-500"
                    )}
                  >
                    {theme.name}
                  </span>
                </div>

                {currentTheme === theme.id && (
                  <CheckIcon
                    size={14}
                    weight="bold"
                    className="text-slate-950 z-10"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ZONE DE RENDER INFO (OPTIONNEL) */}
        <div className="p-4 mt-4 border-t border-slate-50">
          <div className="p-3 bg-indigo-50/50 border border-indigo-100/50">
            <p className="text-[10px] leading-relaxed text-indigo-900/60 font-medium italic">
              L&apos;application du thème modifie la typographie, les
              espacements et les accents de couleur du PDF final.
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER : CALCULATEUR DE PROFIT */}
      <div className="shrink-0 bg-white border-t border-slate-200 p-0">
        <div className="px-4 py-3 space-y-1">
          <div className="flex justify-between items-center text-slate-400 text-[9px] font-black uppercase tracking-tighter">
            <span>Net_Subtotal</span>
            <span className="font-mono text-slate-900 tracking-normal">
              {totals.subTotal.toLocaleString("fr-FR")} €
            </span>
          </div>
        </div>

        <div className="bg-slate-950 p-5 space-y-1">
          <div className="flex justify-between items-end">
            <span className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em]">
              Final_Amount
            </span>
            <span className="font-mono text-[18px] font-black text-indigo-400 leading-none">
              {totals.totalTTC.toLocaleString("fr-FR")} €
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
