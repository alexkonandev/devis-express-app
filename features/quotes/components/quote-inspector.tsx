// @/features/quotes/components/quote-inspector.tsx
"use client";

import React from "react";
import {
  FileEdit,
  Calendar,
  User,
  Hash,
  ArrowRight,
  History,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { QuoteListItem, QuoteStatus } from "@/types/quote";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Icon } from "@phosphor-icons/react";

interface QuoteInspectorProps {
  quote?: QuoteListItem;
}

export function QuoteInspector({ quote }: QuoteInspectorProps) {
  const router = useRouter();

  if (!quote) return <InspectorPlaceholder />;

  // Simulation des calculs financiers (sera remplacé par les données réelles des lines)
  const amountHT = quote.totalAmount / 1.2;
  const vatAmount = quote.totalAmount - amountHT;

  return (
    <div className="flex flex-col h-full bg-white animate-in fade-in duration-300">
      {/* 1. HEADER IDENTITAIRE */}
      <header className="p-8 border-b border-slate-100 space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-600">
              <Hash size={14} className="stroke-[3]" />
              <span className="text-[11px] font-black uppercase tracking-widest">
                Dossier_{quote.number}
              </span>
            </div>
            <h2 className="text-[32px] font-black text-slate-950 uppercase tracking-tighter italic leading-none">
              {quote.clientName}
            </h2>
          </div>

          <Button
            onClick={() => router.push(`/quotes/editor/${quote.id}`)}
            className="bg-slate-950 hover:bg-indigo-600 text-white rounded-none h-12 px-6 text-[11px] font-black uppercase tracking-[0.2em] transition-all group"
          >
            <FileEdit size={16} className="mr-2" />
            Ouvrir_Studio
            <ArrowRight
              size={14}
              className="ml-2 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"
            />
          </Button>
        </div>

        <div className="flex gap-8">
          <MetaItem
            icon={Calendar}
            label="Émission"
            value={format(new Date(quote.createdAt), "dd MMMM yyyy", {
              locale: fr,
            })}
          />
          <MetaItem
            icon={User}
            label="Statut_Flux"
            value={quote.status}
            highlight
          />
          <MetaItem
            icon={Info}
            label="Dernière_Action"
            value={format(new Date(quote.updatedAt), "HH:mm", { locale: fr })}
          />
        </div>
      </header>

      {/* 2. RÉPARTITION ET FINANCES */}
      <div className="flex-1 p-8 grid grid-cols-12 gap-12 overflow-y-auto custom-scrollbar">
        {/* COLONNE GAUCHE : ANALYSE FINANCIÈRE */}
        <div className="col-span-7 space-y-10">
          <section className="space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">
              Récapitulatif_Financier
            </span>
            <div className="border border-slate-200 p-8 space-y-6">
              <div className="flex justify-between items-baseline">
                <span className="text-[12px] font-bold text-slate-500 uppercase">
                  Base_Hors_Taxe
                </span>
                <span className="text-[18px] font-mono font-bold text-slate-950">
                  {new Intl.NumberFormat("fr-CI").format(amountHT)}{" "}
                  <span className="text-[10px]">CFA</span>
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[12px] font-bold text-slate-500 uppercase">
                  TVA_Collectée (20%)
                </span>
                <span className="text-[18px] font-mono font-bold text-slate-950">
                  {new Intl.NumberFormat("fr-CI").format(vatAmount)}{" "}
                  <span className="text-[10px]">CFA</span>
                </span>
              </div>
              <div className="h-px bg-slate-100" />
              <div className="flex justify-between items-center">
                <span className="text-[14px] font-black text-indigo-600 uppercase tracking-widest">
                  Net_A_Payer
                </span>
                <span className="text-[32px] font-mono font-black text-slate-950 tracking-tighter tabular-nums">
                  {new Intl.NumberFormat("fr-CI").format(quote.totalAmount)}{" "}
                  <span className="text-[14px]">CFA</span>
                </span>
              </div>
            </div>
          </section>

          {/* 3. TIMELINE D'ÉVÉNEMENTS */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-400">
              <History size={14} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                Journal_Dossier
              </span>
            </div>
            <div className="space-y-4 pl-2">
              <TimelineEntry
                date={quote.createdAt}
                label="Initialisation du dossier (DRAFT)"
                active
              />
              <TimelineEntry
                date={quote.updatedAt}
                label="Mise à jour des lignes de prestations"
              />
            </div>
          </section>
        </div>

        {/* COLONNE DROITE : RÉPARTITION BADGES */}
        <div className="col-span-5 space-y-8">
          <section className="space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block">
              Répartition_Prestations
            </span>
            <div className="flex flex-wrap gap-2">
              <Badge label="Services_Tech" />
              <Badge label="Consulting" />
              <Badge label="Frais_Gestion" />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

// --- SOUS-COMPOSANTS ---

function MetaItem({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: Icon;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 text-slate-400">
        <Icon size={12} />
        <span className="text-[9px] font-black uppercase tracking-widest">
          {label}
        </span>
      </div>
      <p
        className={cn(
          "text-[12px] font-bold uppercase tracking-tight",
          highlight ? "text-indigo-600" : "text-slate-950"
        )}
      >
        {value}
      </p>
    </div>
  );
}

function TimelineEntry({
  date,
  label,
  active,
}: {
  date: Date;
  label: string;
  active?: boolean;
}) {
  return (
    <div className="flex gap-4 items-start relative pb-4">
      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-slate-200 shrink-0" />
      <div className="space-y-0.5">
        <p className="text-[10px] font-bold text-slate-950 uppercase">
          {label}
        </p>
        <p className="text-[9px] font-mono text-slate-400">
          {format(new Date(date), "dd/MM/yy - HH:mm")}
        </p>
      </div>
    </div>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <div className="px-3 py-1.5 bg-slate-100 border border-slate-200 text-[9px] font-black uppercase tracking-widest text-slate-600">
      {label}
    </div>
  );
}

function InspectorPlaceholder() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-20 text-center opacity-10">
      <Hash size={40} className="mb-4 text-slate-950" />
      <p className="text-[10px] font-black uppercase tracking-[0.5em]">
        Sélectionner_Flux_Actif
      </p>
    </div>
  );
}
