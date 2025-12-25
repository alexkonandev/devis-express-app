"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  User,
  Settings2,
  Receipt,
  FileText,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- TYPES ---
interface Company {
  name: string;
  email: string;
  phone: string;
}
interface Client {
  name: string;
  email: string;
  address: string;
}
interface QuoteInfo {
  number: string;
  issueDate: string | Date;
  terms: string;
}
interface Financials {
  vatRatePercent: number;
  discountAmountEuros: number;
}

interface ActiveQuote {
  title: string;
  company: Company;
  client: Client;
  quote: QuoteInfo;
  financials: Financials;
}

interface StudioSidebarLeftProps {
  activeQuote: ActiveQuote;
  updateField: (
    group: keyof ActiveQuote | null,
    field: string,
    value: string | number
  ) => void;
  onBack?: () => void;
}

// --- MICRO-COMPOSANTS UI/UX ---

// 1. SECTION PLIABLE (NETTOYÉE : PLUS DE SCROLL INTERNE)
const PanelSection = ({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
  isTechnical = false,
}: {
  title: string;
  icon?: any;
  children: React.ReactNode;
  defaultOpen?: boolean;
  isTechnical?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className={cn(
        "border-b border-zinc-200 shrink-0",
        isTechnical ? "bg-zinc-50/80" : "bg-white"
      )}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center w-full px-4 py-3  hover:bg-zinc-100 transition-colors group select-none outline-none focus:bg-zinc-100"
      >
        <div
          className={cn(
            "mr-2 transition-transform duration-200 text-zinc-400 group-hover:text-zinc-900",
            isOpen ? "rotate-90" : "rotate-0"
          )}
        >
          <ChevronRight className="w-3 h-3" />
        </div>
        <span
          className={cn(
            "text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-colors",
            isOpen ? "text-zinc-900" : "text-zinc-500 group-hover:text-zinc-700"
          )}
        >
          {Icon && <Icon className="w-3 h-3 opacity-70" />}
          {title}
        </span>
      </button>

      {/* On laisse le contenu prendre sa place naturellement */}
      {isOpen && (
        <div className="px-4 pb-4 animate-in slide-in-from-top-2 fade-in duration-200">
          {children}
        </div>
      )}
    </div>
  );
};

// 2. LIGNE DE PROPRIÉTÉ
const PropertyRow = ({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex flex-col gap-1.5 my-3 last:mb-0", className)}>
    <label className="text-[9px] font-bold text-zinc-400 select-none cursor-default uppercase tracking-wide ml-0.5">
      {label}
    </label>
    {children}
  </div>
);

// 3. INPUTS CONTRASTÉS
const PanelInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={cn(
      "w-full bg-zinc-100 text-zinc-900 border border-transparent rounded-sm px-2.5 py-2 text-xs font-medium outline-none transition-all placeholder:text-zinc-400",
      "hover:bg-zinc-200/70 hover:border-zinc-300",
      "focus:bg-white focus:border-indigo-600 focus:shadow-sm focus:ring-1 focus:ring-indigo-600/20"
    )}
  />
);

const PanelTextarea = (
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) => (
  <textarea
    {...props}
    className={cn(
      "w-full bg-zinc-100 text-zinc-900 border border-transparent rounded-sm px-2.5 py-2 text-xs font-medium outline-none transition-all resize-none min-h-[60px] placeholder:text-zinc-400",
      "hover:bg-zinc-200/70 hover:border-zinc-300",
      "focus:bg-white focus:border-indigo-600 focus:shadow-sm"
    )}
  />
);

// --- MAIN COMPONENT ---

export const StudioSidebarLeft = ({
  activeQuote,
  updateField,
  onBack,
}: StudioSidebarLeftProps) => {
  return (
    <>
      <style jsx global>{`
        /* Scrollbar Unique et Discrète */
        .figma-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .figma-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .figma-scrollbar::-webkit-scrollbar-thumb {
          background: transparent;
          border-radius: 4px;
        }
        .figma-scrollbar:hover::-webkit-scrollbar-thumb {
          background: #d4d4d8;
        }
      `}</style>

      <div className="flex flex-col h-full bg-white border-r border-zinc-200 w-[300px] select-none shadow-sm z-10">
        {/* A. HEADER */}
        <div className="h-14 shrink-0 flex items-center px-3 border-b border-zinc-200 gap-3 bg-white z-20">
          <button
            onClick={onBack}
            className="w-8 h-8 flex items-center justify-center rounded-sm text-zinc-400 hover:text-black hover:bg-zinc-100 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex flex-col flex-1 min-w-0 group">
            <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest mb-0.5">
              Projet
            </span>
            <input
              type="text"
              value={activeQuote.title}
              onChange={(e) => updateField(null, "title", e.target.value)}
              className="w-full bg-transparent text-sm font-black text-zinc-900 outline-none placeholder:text-zinc-300 truncate hover:text-indigo-600 transition-colors cursor-text"
              placeholder="Nom du projet..."
            />
          </div>
        </div>

        {/* B. SCROLLABLE AREA (Le SEUL endroit qui scrolle) */}
        <div className="flex-1 overflow-y-auto figma-scrollbar bg-white">
          {/* 1. CLIENT */}
          <PanelSection
            title="Client & Destinataire"
            icon={User}
            defaultOpen={true}
          >
            <PropertyRow label="Société / Nom">
              <PanelInput
                value={activeQuote.client.name}
                onChange={(e) => updateField("client", "name", e.target.value)}
                placeholder="Ex: ACME Corp"
                autoFocus
                className="font-bold"
              />
            </PropertyRow>

            <PropertyRow label="Email">
              <PanelInput
                value={activeQuote.client.email}
                onChange={(e) => updateField("client", "email", e.target.value)}
                placeholder="contact@client.com"
              />
            </PropertyRow>

            <PropertyRow label="Adresse">
              <PanelTextarea
                value={activeQuote.client.address}
                onChange={(e) =>
                  updateField("client", "address", e.target.value)
                }
                placeholder="Adresse complète..."
                className="min-h-[80px]"
              />
            </PropertyRow>
          </PanelSection>

          {/* 2. OFFRE */}
          <PanelSection title="Négociation" icon={Receipt} defaultOpen={true}>
            <PropertyRow label="Remise Globale">
              <div className="relative group">
                <PanelInput
                  type="number"
                  value={activeQuote.financials.discountAmountEuros}
                  onChange={(e) =>
                    updateField(
                      "financials",
                      "discountAmountEuros",
                      parseFloat(e.target.value)
                    )
                  }
                  className="text-right pr-8 font-mono text-emerald-600 font-bold bg-emerald-50/50 hover:bg-emerald-50 border-emerald-100/50 focus:border-emerald-500 focus:ring-emerald-500/20"
                  placeholder="0"
                />
                <span className="absolute right-3 top-2 text-[10px] font-bold text-emerald-400 pointer-events-none">
                  EUR
                </span>
              </div>
            </PropertyRow>
          </PanelSection>

          {/* 3. SYSTÈME (Zone Technique - Fond Grisé) */}
          <PanelSection
            title="Système"
            icon={Settings2}
            defaultOpen={false}
            isTechnical={true}
          >
            <div className="flex items-start gap-2 p-2 mt-3 bg-white border border-zinc-200 rounded-sm mb-4">
              <Lock className="w-3 h-3 text-zinc-400 mt-0.5" />
              <p className="text-[10px] text-zinc-500 leading-snug">
                Données synchronisées. Surchargez manuellement si nécessaire.
              </p>
            </div>

            <div className="space-y-4">
              <PropertyRow label="ID Devis">
                <PanelInput
                  value={activeQuote.quote.number}
                  onChange={(e) =>
                    updateField("quote", "number", e.target.value)
                  }
                  className="font-mono text-zinc-600 bg-white"
                />
              </PropertyRow>

              <PropertyRow label="Date Émission">
                <PanelInput
                  type="date"
                  value={
                    activeQuote.quote.issueDate
                      ? new Date(activeQuote.quote.issueDate)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    updateField("quote", "issueDate", e.target.value)
                  }
                  className="font-mono text-[10px] text-zinc-600 bg-white"
                />
              </PropertyRow>

              <PropertyRow label="Taux TVA (%)">
                <PanelInput
                  type="number"
                  value={activeQuote.financials.vatRatePercent}
                  onChange={(e) =>
                    updateField(
                      "financials",
                      "vatRatePercent",
                      parseFloat(e.target.value)
                    )
                  }
                  className="text-right font-mono text-zinc-600 bg-white"
                />
              </PropertyRow>
            </div>
          </PanelSection>

          {/* 4. NOTES */}
          <PanelSection title="Mentions" icon={FileText} defaultOpen={false}>
            <PropertyRow label="Conditions Particulières">
              <PanelTextarea
                value={activeQuote.quote.terms}
                onChange={(e) => updateField("quote", "terms", e.target.value)}
                className="min-h-[120px] font-mono text-[10px] leading-relaxed"
                placeholder="Texte libre..."
              />
            </PropertyRow>
          </PanelSection>
        </div>

        {/* C. FOOTER */}
        <div className="h-8 border-t border-zinc-200 flex items-center justify-between px-3 bg-zinc-50 text-[9px] text-zinc-400 font-bold uppercase tracking-widest shrink-0 cursor-default">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            <span>Connecté</span>
          </div>
          <span>Auto-Save On</span>
        </div>
      </div>
    </>
  );
};
