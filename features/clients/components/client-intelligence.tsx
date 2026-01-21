// @/features/clients/components/client-intelligence.tsx
"use client";

import React from "react";
import { TrendingUp, FileText, MessageSquare, Layers, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { ClientListItem } from "@/types/client";

interface ClientIntelligenceProps {
  client?: ClientListItem;
}

export function ClientIntelligence({ client }: ClientIntelligenceProps) {
  if (!client) return <IntelligencePlaceholder />;

  return (
    <div className="flex flex-col h-full bg-slate-50/50 p-6 space-y-8 overflow-y-auto custom-scrollbar">
      {/* 1. MODULE LTV (PROFIT TRACKER) */}
      <section className="space-y-4">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          Analyse_Rentabilité
        </span>
        <div className="bg-slate-950 p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp size={40} className="text-white" />
          </div>
          <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-1">
            Lifetime_Value (LTV)
          </p>
          <p className="font-mono text-white text-[20px] font-black tracking-tighter leading-none mb-4">
            {new Intl.NumberFormat("fr-CI").format(client.totalSpent)} CFA
          </p>
          <div className="flex items-center gap-2">
            <div className="h-1 flex-1 bg-white/10">
              <div className="h-full bg-indigo-500 w-[65%]" />
            </div>
            <span className="text-[9px] font-mono font-bold text-indigo-400">
              65%
            </span>
          </div>
        </div>
      </section>

      {/* 2. ACTIONS CHEATÉES */}
      <section className="space-y-3">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          Actions_Stratégiques
        </span>
        <div className="grid grid-cols-1 gap-2">
          <IntelligenceButton
            icon={FileText}
            label="Générer Rapport PDF"
            sub="Synthèse des transactions"
          />
          <IntelligenceButton
            icon={Zap}
            label="Relance IA"
            sub="Message contextuel prêt"
            variant="indigo"
          />
          <IntelligenceButton
            icon={MessageSquare}
            label="Ouvrir WhatsApp"
            sub="Contact direct"
          />
        </div>
      </section>

      {/* 3. RÉPERTOIRE DOCUMENTS */}
      <section className="space-y-4 flex-1">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          Documents_Actifs
        </span>
        <div className="space-y-2">
          <DocumentItem label="Contrat_Cadre_2026.pdf" size="1.2 MB" />
          <DocumentItem label="RIB_Societe_Valide.pdf" size="450 KB" />
          {client.quoteCount === 0 && (
            <div className="border border-dashed border-slate-200 p-4 text-center">
              <p className="text-[9px] font-bold text-slate-400 uppercase">
                Aucun document lié
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

// --- SOUS-COMPOSANTS TYPÉS ---

interface IntelligenceButtonProps {
  icon: React.ElementType;
  label: string;
  sub: string;
  variant?: "default" | "indigo";
  onClick?: () => void;
}

function IntelligenceButton({
  icon: Icon,
  label,
  sub,
  variant = "default",
  onClick,
}: IntelligenceButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-4 flex items-center gap-4 border transition-none text-left group",
        variant === "indigo"
          ? "bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-700"
          : "bg-white border-slate-200 text-slate-950 hover:border-slate-950"
      )}
    >
      <Icon
        size={18}
        className={variant === "indigo" ? "text-white" : "text-indigo-600"}
      />
      <div className="flex flex-col">
        <span className="text-[10px] font-black uppercase tracking-widest">
          {label}
        </span>
        <span
          className={cn(
            "text-[8px] font-bold uppercase opacity-60",
            variant === "indigo" ? "text-indigo-100" : "text-slate-500"
          )}
        >
          {sub}
        </span>
      </div>
    </button>
  );
}

function DocumentItem({ label, size }: { label: string; size: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-white border border-slate-100 hover:border-slate-300 transition-none cursor-pointer group">
      <div className="flex items-center gap-3 truncate">
        <Layers
          size={14}
          className="text-slate-400 group-hover:text-indigo-600"
        />
        <span className="text-[10px] font-bold text-slate-700 truncate">
          {label}
        </span>
      </div>
      <span className="text-[8px] font-mono text-slate-400 whitespace-nowrap">
        {size}
      </span>
    </div>
  );
}

function IntelligencePlaceholder() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center opacity-20">
      <Zap size={32} className="mb-4 text-slate-950" />
      <p className="text-[10px] font-black uppercase tracking-[0.4em]">
        Intelligence_Offline
      </p>
    </div>
  );
}
