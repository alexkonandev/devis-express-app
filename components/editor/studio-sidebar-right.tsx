"use client";

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

// --- MICRO-COMPOSANTS BLUEPRINT V3.1 ---

const SectionHeader = ({ title, icon: Icon }: { title: string; icon: Icon }) => (
  <div className="h-9 bg-slate-50 border-y border-slate-200 flex items-center px-3 shrink-0">
    <div className="flex items-center gap-2">
      <Icon size={12} weight="bold" className="text-slate-900" />
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">
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
    <div className="flex flex-col h-full bg-white border-l border-slate-200 w-[280px] overflow-hidden rounded-none shadow-none">
      {/* EN-TÊTE : MOTEUR DE STYLE */}
      <div className="h-12 shrink-0 flex items-center px-4 border-b border-slate-200 bg-white">
        <span className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-900">
          MOTEUR_DE_STYLE
        </span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-none">
        <SectionHeader title="IDENTITE_VISUELLE" icon={PaletteIcon} />

        <div className="p-4 space-y-3">
          <label className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.15em] pl-1">
            Thèmes_Disponibles
          </label>
          <div className="grid grid-cols-1 gap-1.5">
            {availableThemes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setTheme(theme.id)}
                className={cn(
                  "group flex items-center justify-between p-3 border transition-none relative overflow-hidden rounded-none",
                  currentTheme === theme.id
                    ? "border-slate-900 bg-white shadow-[3px_3px_0_0_rgba(15,23,42,1)]"
                    : "border-slate-100 hover:border-slate-300 bg-slate-50/50"
                )}
              >
                <div className="flex items-center gap-3 z-10">
                  <div
                    className="w-4 h-4 rounded-none border border-slate-950/10 shadow-sm"
                    style={{ backgroundColor: theme.color }}
                  />
                  <span
                    className={cn(
                      "text-[11px] font-black uppercase tracking-tight",
                      currentTheme === theme.id
                        ? "text-slate-900"
                        : "text-slate-400"
                    )}
                  >
                    {theme.name}
                  </span>
                </div>

                {currentTheme === theme.id && (
                  <CheckIcon
                    size={14}
                    weight="bold"
                    className="text-slate-900 z-10"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* INFO RENDU */}
        <div className="px-4 py-2">
          <div className="p-3 bg-slate-50 border-l-2 border-indigo-600">
            <p className="text-[10px] leading-relaxed text-slate-600 font-bold uppercase tracking-tight">
              L&apos;application du thème synchronise la typographie et les
              composants du PDF final.
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER : TERMINAL DE PROFIT (ROI MAXIMAL) */}
      <div className="shrink-0 bg-white border-t border-slate-200 p-0">
        {/* SOUS-TOTAL */}
        <div className="px-4 py-3 flex justify-between items-center bg-white">
          <span className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">
            Sous_Total_HT
          </span>
          <span className="font-mono text-[13px] font-black text-slate-900">
            {totals.subTotal.toLocaleString("fr-FR")} €
          </span>
        </div>

        {/* TOTAL FINAL (ACTION ZONE) */}
        <div className="bg-slate-950 p-6 space-y-1 relative overflow-hidden">
          {/* Ligne de force discrète en haut du bloc noir */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-indigo-600" />

          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <span className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em]">
                Montant_Total_TTC
              </span>
              <span className="text-[8px] text-indigo-500/50 font-black uppercase">
                Prêt_pour_envoi
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-mono text-[22px] font-black text-indigo-400 leading-none tracking-tighter">
                {totals.totalTTC.toLocaleString("fr-FR")} €
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
