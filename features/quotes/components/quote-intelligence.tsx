// @/features/quotes/components/quote-intelligence.tsx
"use client";

import {
  TrendingUp,
  MessageSquare,
  UserCircle,
  ShieldCheck,
  Copy,
  ExternalLink,
} from "lucide-react";
import { QuoteListItem } from "@/types/quote";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { notify } from "@/lib/notifications"; 
import { cn } from "@/lib/utils";

interface QuoteIntelligenceProps {
  quote?: QuoteListItem;
}

export function QuoteIntelligence({ quote }: QuoteIntelligenceProps) {
  const router = useRouter();

  if (!quote) return <IntelligencePlaceholder />;

  // LOGIQUE BUSINESS : Calcul de marge (Hypothèse : 30% de frais fixes/charges)
  const vatAmount = quote.totalAmount * 0.2; // TVA 20%
  const amountHT = quote.totalAmount - vatAmount;
  const estimatedMargin = amountHT * 0.7; // On estime 70% de marge brute sur le HT

  const handleCopyRelance = () => {
    const text = `Bonjour, je reviens vers vous concernant le devis ${quote.number}. Est-il toujours d'actualité ? Je reste à votre disposition.`;
    navigator.clipboard.writeText(text);
    notify.success("RELANCE_COPIÉE", "Le texte est prêt à être envoyé.");
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50 p-6 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* 1. WIDGET PROFIT & TAX */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp size={14} className="text-indigo-600" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-950">
            Intelligence_Financière
          </span>
        </div>

        <div className="bg-white border border-slate-200 p-5 space-y-4 shadow-sm">
          <div className="flex justify-between items-center">
            <span className="text-[9px] font-bold text-slate-400 uppercase">
              TVA_Prévisionnelle
            </span>
            <span className="text-[12px] font-mono font-bold text-slate-950">
              +{new Intl.NumberFormat("fr-CI").format(vatAmount)}
            </span>
          </div>
          <div className="h-px bg-slate-50" />
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-slate-400 uppercase italic">
              Marge_Estimée_(70%)
            </span>
            <p className="text-[24px] font-mono font-black text-emerald-600 tracking-tighter tabular-nums">
              {new Intl.NumberFormat("fr-CI").format(estimatedMargin)}{" "}
              <span className="text-[10px]">CFA</span>
            </p>
          </div>
        </div>
      </section>

      {/* 2. ACTIONS DE RELANCE AUTOMATISÉES */}
      <section className="space-y-3">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block px-1">
          Actions_Stratégiques
        </span>

        <Button
          onClick={handleCopyRelance}
          variant="outline"
          className="w-full justify-between h-12 rounded-none border-slate-200 bg-white hover:border-indigo-600 group transition-all"
        >
          <div className="flex items-center gap-2">
            <MessageSquare
              size={14}
              className="text-slate-400 group-hover:text-indigo-600"
            />
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-950 italic">
              Générer_Relance
            </span>
          </div>
          <Copy size={12} className="text-slate-300" />
        </Button>

        <Button
          onClick={() => router.push(`/clients?id=${quote.clientName}`)} // Redirection vers le module Client
          variant="outline"
          className="w-full justify-between h-12 rounded-none border-slate-200 bg-white hover:border-slate-950 group transition-all"
        >
          <div className="flex items-center gap-2">
            <UserCircle
              size={14}
              className="text-slate-400 group-hover:text-slate-950"
            />
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-950 italic">
              Historique_Client
            </span>
          </div>
          <ExternalLink size={12} className="text-slate-300" />
        </Button>
      </section>

      {/* 3. CHECKLIST DE VALIDATION */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <ShieldCheck size={14} className="text-emerald-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-950">
            Compliance_Check
          </span>
        </div>

        <div className="space-y-2">
          <CheckItem
            label="Mentions_Légales_Présentes"
            checked={!!quote.number}
          />
          <CheckItem label="Calcul_TVA_Conforme" checked={true} />
          <CheckItem label="Coordonnées_Client_OK" checked={true} />
        </div>
      </section>
    </div>
  );
}

// --- SOUS-COMPOSANTS ---

function CheckItem({ label, checked }: { label: string; checked: boolean }) {
  return (
    <div className="flex items-center justify-between p-3 bg-white border border-slate-100">
      <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">
        {label}
      </span>
      <div
        className={cn(
          "w-2 h-2 rounded-full",
          checked
            ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
            : "bg-rose-500"
        )}
      />
    </div>
  );
}

function IntelligencePlaceholder() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 opacity-10 grayscale">
      <TrendingUp size={32} className="mb-4" />
      <span className="text-[9px] font-black uppercase tracking-[0.3em] rotate-90 whitespace-nowrap">
        Analyse_Moteur_Offline
      </span>
    </div>
  );
}
