"use client";

import { useState } from "react";
import {
  PlusCircle,
  ArrowRight,
  Target,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CatalogItem } from "@/types/catalog";
import { Button } from "@/components/ui/button";

interface CatalogIntelligenceProps {
  item: CatalogItem;
}

export function CatalogIntelligence({ item }: CatalogIntelligenceProps) {
  const [volume, setVolume] = useState(1);
  const projectedRevenue = item.unitPrice * volume;

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white border-l border-white/10 overflow-y-auto custom-scrollbar">
      {/* 1. CALCULATEUR DE RENDEMENT HT */}
      <section className="p-8 space-y-8 border-b border-white/5 bg-indigo-950/20">
        <div className="flex items-center gap-2 text-indigo-400">
          <Activity size={14} className="stroke-[3]" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">
            Analyse_Rendement_HT
          </span>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-bold text-slate-500 uppercase italic">
                Objectif_Volume
              </span>
              <span className="text-[24px] font-mono font-black text-white">
                {volume}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              value={volume}
              onChange={(e) => setVolume(parseInt(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded-none appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          <div className="bg-white/5 p-6 border-l-2 border-indigo-500">
            <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest block mb-1">
              Projection_Revenus_Bruts
            </span>
            <p className="text-[36px] font-mono font-black tracking-tighter tabular-nums text-white leading-none">
              {new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "EUR",
              }).format(projectedRevenue)}
            </p>
          </div>
        </div>
      </section>

      {/* 2. INJECTION FLUX DE VENTE */}
      <section className="p-8 space-y-6">
        <div className="flex items-center gap-2 text-emerald-400">
          <PlusCircle size={14} className="stroke-[3]" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">
            Flux_De_Vente
          </span>
        </div>

        <Button
          className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-none border-none flex items-center justify-between px-6 group transition-all"
          onClick={() => console.log(`ACTION: AJOUTER_DEVIS_${item.id}`)}
        >
          <span className="text-[11px] font-black uppercase tracking-widest">
            Injecter_au_Devis
          </span>
          <ArrowRight
            size={16}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Button>
      </section>

      {/* 3. PERFORMANCE DATA (MATRICE) */}
      <section className="p-8 space-y-6">
        <div className="flex items-center gap-2 text-slate-500">
          <Target size={14} />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">
            Matrice_Performance
          </span>
        </div>

        <div className="grid grid-cols-1 gap-px bg-white/10 border border-white/10">
          <StatRow
            label="Frequence_Usage"
            value="Haut"
            color="text-emerald-400"
          />
          <StatRow label="Marge_Estimee" value="65%" color="text-indigo-400" />
          <StatRow
            label="Type_Actif"
            value={item.isPremium ? "Premium" : "Standard"}
            color="text-white"
          />
        </div>
      </section>

      {/* 4. FOOTER STRATÉGIQUE */}
      <div className="mt-auto p-8 opacity-20 hover:opacity-100 transition-opacity">
        <div className="flex flex-col gap-1 border-t border-white/10 pt-4">
          <span className="text-[8px] font-black uppercase text-slate-500">
            Intelligence_Status
          </span>
          <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">
            Analyse_Temps_Réel_Active
          </p>
        </div>
      </div>
    </div>
  );
}

function StatRow({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="bg-slate-950 p-4 flex justify-between items-center">
      <span className="text-[9px] font-bold text-slate-500 uppercase">
        {label}
      </span>
      <span className={cn("text-[11px] font-black uppercase font-mono", color)}>
        {value}
      </span>
    </div>
  );
}
