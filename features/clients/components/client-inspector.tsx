// @/features/clients/components/client-inspector.tsx
"use client";

import React from "react";
import {
  User,
  Mail,
  Building2,
  MapPin,
  History,
  ShieldCheck,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ClientListItem } from "@/types/client";
import { Button } from "@/components/ui/button";

interface ClientInspectorProps {
  client?: ClientListItem;
}

export function ClientInspector({ client }: ClientInspectorProps) {
  if (!client) return <EmptyState />;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* 1. HEADER IDENTITAIRE */}
      <div className="h-20 border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 bg-slate-950 flex items-center justify-center relative group">
            <User className="text-white w-6 h-6" />
            <div className="absolute -right-1 -bottom-1 w-4 h-4 bg-indigo-600 flex items-center justify-center border-2 border-white">
              <ShieldCheck className="text-white w-2.5 h-2.5" />
            </div>
          </div>
          <div className="flex flex-col">
            <h2 className="text-[18px] font-black text-slate-950 uppercase tracking-tighter leading-none mb-1">
              {client.name}
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-mono font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5">
                ACTIF_VALIDE
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                ID: {client.id.slice(0, 12)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="rounded-none border-slate-900 h-9 px-6 text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-none"
          >
            ÉDITER_DOSSIER
          </Button>
        </div>
      </div>

      {/* 2. BODY : DATA GRID & FLUX RÉCENTS */}
      <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
        {/* DATA GRID : METADONNÉES */}
        <div className="grid grid-cols-3 gap-px bg-slate-200 border border-slate-200">
          <InfoTile
            label="Email_Contact"
            value={client.email || "NON_RENSEIGNÉ"}
            icon={Mail}
          />
          <InfoTile
            label="Siret_Légal"
            value={client.siret || "---"}
            icon={Building2}
            isMono
          />
          <InfoTile
            label="Localisation"
            value={client.address || "ADRESSE_INCONNUE"}
            icon={MapPin}
          />
        </div>

        {/* REGISTRE DES FLUX (Inspiré du Dashboard) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-950 pb-2">
            <div className="flex items-center gap-2">
              <History size={14} className="text-indigo-600" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-950">
                Registre_Flux_Récents
              </span>
            </div>
          </div>

          <div className="border border-slate-200 divide-y divide-slate-100">
            {/* Simulation de flux - À connecter à la DB plus tard */}
            <ActivityRow
              label="Devis_Maintenance_S1"
              amount={450000}
              status="PAYÉ"
              date="12 JAN 2026"
            />
            <ActivityRow
              label="Licence_Software_Studio"
              amount={1250000}
              status="EN_ATTENTE"
              date="05 JAN 2026"
              isPending
            />
            <ActivityRow
              label="Consulting_Expert"
              amount={85000}
              status="REFUSÉ"
              date="28 DEC 2025"
              isError
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SOUS-COMPOSANTS DE STRUCTURE ---

interface InfoTileProps {
  label: string;
  value: string;
  icon: React.ElementType;
  isMono?: boolean;
}

function InfoTile({ label, value, icon: Icon, isMono }: InfoTileProps) {
  return (
    <div className="bg-white p-5 space-y-2">
      <div className="flex items-center gap-2">
        <Icon size={12} className="text-indigo-600" />
        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
          {label}
        </span>
      </div>
      <p
        className={cn(
          "text-[12px] font-bold text-slate-950 truncate uppercase",
          isMono && "font-mono tracking-tighter"
        )}
      >
        {value}
      </p>
    </div>
  );
}

interface ActivityRowProps {
  label: string;
  amount: number;
  status: string;
  date: string;
  isPending?: boolean;
  isError?: boolean;
}

function ActivityRow({
  label,
  amount,
  status,
  date,
  isPending,
  isError,
}: ActivityRowProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-none group">
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "w-1.5 h-1.5 rounded-full",
            isPending
              ? "bg-amber-500"
              : isError
              ? "bg-rose-500"
              : "bg-emerald-500"
          )}
        />
        <div className="flex flex-col">
          <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">
            {label}
          </span>
          <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">
            {date}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-8">
        <div className="text-right">
          <p className="text-[12px] font-mono font-black text-slate-950 leading-none">
            {new Intl.NumberFormat("fr-CI").format(amount)} CFA
          </p>
          <p
            className={cn(
              "text-[8px] font-black uppercase mt-1",
              isPending
                ? "text-amber-600"
                : isError
                ? "text-rose-600"
                : "text-emerald-600"
            )}
          >
            {status}
          </p>
        </div>
        <ArrowUpRight
          size={14}
          className="text-slate-300 group-hover:text-indigo-600 transition-colors"
        />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-20 text-center opacity-20">
      <div className="w-16 h-16 border-2 border-slate-950 flex items-center justify-center mb-6">
        <Clock size={32} className="text-slate-950" />
      </div>
      <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-950">
        En attente de sélection d&apos;actif
      </p>
    </div>
  );
}
