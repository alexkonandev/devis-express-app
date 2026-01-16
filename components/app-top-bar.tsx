"use client";

import { CloudCheckIcon, BellIcon } from "@phosphor-icons/react";
import { AppBreadcrumb } from "@/components/layout/app-breadcrumb";
import { Logo } from "./ui/logo";

export function AppTopBar() {
  return (
    <header className="h-10 w-full border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0 select-none sticky top-0 z-40">
      {/* SECTION GAUCHE : CONTEXTE SYSTÈME */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <Logo variant="icon" className="h-5 w-5 grayscale contrast-125" />
          <div className="w-px h-4 bg-slate-200 mx-1" />
        </div>

        <div className="flex items-center">
          <AppBreadcrumb />
        </div>
      </div>

      {/* SECTION DROITE : STATUS & TELEMETRY */}
      <div className="flex items-center gap-8">
        {/* SYNC INDICATOR */}
        <div className="flex items-center gap-2 px-2 py-1 bg-emerald-50 border border-emerald-100">
          <CloudCheckIcon
            size={14}
            weight="bold"
            className="text-emerald-600"
          />
          <span className="text-[8px] text-emerald-700 font-black tracking-[0.2em] uppercase">
            Sync: Optimal
          </span>
        </div>

        {/* NOTIFICATIONS CHIRURGICALES */}
        <button className="relative p-1.5 text-slate-400 hover:text-slate-950 transition-none group">
          <BellIcon size={18} weight="bold" className="text-slate-950" />
          {/* Badge de notification : Carré Blueprint (Zéro arrondi) */}
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-indigo-600 border border-white" />
        </button>

        <div className="h-4 w-px bg-slate-200" />

        {/* LOG DE SESSION - Rigueur Nomad Digital */}
        <div className="hidden lg:flex flex-col items-end">
          <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none">
            Node: 01_Abidjan
          </span>
          <span className="text-[9px] font-mono text-slate-950 mt-0.5 tabular-nums">
            {new Date().toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    </header>
  );
}
