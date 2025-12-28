"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  User,
  Settings2,
  Receipt,
  FileText,
  Lock,
  Plus,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { Client } from "@/hooks/useClientManager";
import { ClientFormDialog } from "@/components/clients/client-form-dialog";
import { upsertClientAction } from "@/app/actions/client.actions";

// --- TYPES ---
interface Company {
  name: string;
  email: string;
  phone: string;
}

interface ClientData {
  name: string;
  email: string;
  phone: string;
  address: string;
  siret: string;
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
  client: ClientData;
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
  initialClients: Client[];
}

// ====================================================================
// 1. MICRO-COMPOSANTS UI
// ====================================================================

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
        className="flex items-center w-full px-4 py-3 hover:bg-zinc-100 transition-colors group select-none outline-none focus:bg-zinc-100"
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
      {isOpen && (
        <div className="px-4 pb-4 animate-in slide-in-from-top-2 fade-in duration-200">
          {children}
        </div>
      )}
    </div>
  );
};

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

const PanelInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    // CORRECTION ICI : On s'assure que value n'est jamais undefined
    value={props.value || ""}
    className={cn(
      "w-full bg-zinc-100 text-zinc-900 border border-transparent rounded-sm px-2.5 py-2 text-xs font-medium outline-none transition-all placeholder:text-zinc-400",
      "hover:bg-zinc-200/70 hover:border-zinc-300",
      "focus:bg-white focus:border-indigo-600 focus:shadow-sm focus:ring-1 focus:ring-indigo-600/20",
      props.className
    )}
  />
);

const PanelTextarea = (
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) => (
  <textarea
    {...props}
    // CORRECTION ICI : Idem pour le textarea
    value={props.value || ""}
    className={cn(
      "w-full bg-zinc-100 text-zinc-900 border border-transparent rounded-sm px-2.5 py-2 text-xs font-medium outline-none transition-all resize-none min-h-[60px] placeholder:text-zinc-400",
      "hover:bg-zinc-200/70 hover:border-zinc-300",
      "focus:bg-white focus:border-indigo-600 focus:shadow-sm",
      props.className
    )}
  />
);

// ====================================================================
// 2. COMPOSANT AUTOCOMPLETE CLIENT
// ====================================================================

const ClientAutocomplete = ({
  value,
  onChange,
  onSelectClient,
  clients,
  onAddNew,
}: {
  value: string;
  onChange: (val: string) => void;
  onSelectClient: (client: Client) => void;
  clients: Client[];
  onAddNew: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div className="relative">
        <input
          // CORRECTION ICI : Sécurité anti-undefined
          value={value || ""}
          onChange={(e) => {
            onChange(e.target.value);
            setSearch(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            setSearch(value || "");
            setIsOpen(true);
          }}
          className={cn(
            "w-full bg-zinc-100 text-zinc-900 border border-transparent rounded-sm px-2.5 py-2 text-xs font-bold outline-none transition-all placeholder:text-zinc-400",
            "hover:bg-zinc-200/70 hover:border-zinc-300",
            "focus:bg-white focus:border-indigo-600 focus:shadow-sm focus:ring-1 focus:ring-indigo-600/20"
          )}
          placeholder="Rechercher ou créer..."
        />
        {filtered.length > 0 && isOpen && search !== "" && (
          <div className="absolute right-2 top-2.5 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse pointer-events-none" />
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-1 bg-white border border-zinc-200 rounded-md shadow-xl z-50 max-h-[220px] overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
          {filtered.length > 0 ? (
            filtered.map((client) => (
              <button
                key={client.id}
                onClick={() => {
                  onSelectClient(client);
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs hover:bg-zinc-50 flex items-center justify-between group border-b border-zinc-50 last:border-0 transition-colors"
              >
                <div className="min-w-0">
                  <div className="font-bold text-zinc-900 truncate">
                    {client.name}
                  </div>
                  {client.siret && (
                    <div className="text-[9px] text-zinc-400 font-mono">
                      SIRET: {client.siret}
                    </div>
                  )}
                </div>
                {value === client.name && (
                  <Check className="w-3 h-3 text-indigo-600 shrink-0 ml-2" />
                )}
              </button>
            ))
          ) : (
            <div className="px-3 py-2 text-[10px] text-zinc-400 italic bg-zinc-50/50">
              Aucun résultat pour "{search}"
            </div>
          )}

          <button
            onClick={() => {
              onAddNew();
              setIsOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 bg-white hover:bg-indigo-50 text-indigo-600 text-xs font-bold border-t border-zinc-100 flex items-center gap-2 transition-colors sticky bottom-0 backdrop-blur-sm"
          >
            <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
              <Plus className="w-3 h-3" />
            </div>
            <span className="truncate">Créer "{search || "Nouveau"}"</span>
          </button>
        </div>
      )}
    </div>
  );
};

// ====================================================================
// 3. MAIN SIDEBAR COMPONENT
// ====================================================================

export const StudioSidebarLeft = ({
  activeQuote,
  updateField,
  onBack,
  initialClients,
}: StudioSidebarLeftProps) => {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prefilledName, setPrefilledName] = useState("");

  const handleSelectClient = (client: Client) => {
    updateField("client", "name", client.name);
    updateField("client", "email", client.email || "");
    updateField("client", "phone", client.phone || "");
    updateField("client", "siret", client.siret || "");
    updateField("client", "address", client.address || "");
    toast.success(`Client "${client.name}" appliqué`);
  };

  const handleCreateClient = async (formData: any) => {
    const res = await upsertClientAction(formData);
    if (res.success && res.data) {
      const newClient = res.data as Client;
      setClients((prev) => [newClient, ...prev]);
      handleSelectClient(newClient);
      toast.success("Client créé");
      return true;
    } else {
      toast.error("Erreur création");
      return false;
    }
  };

  return (
    <>
      <style jsx global>{`
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

      <ClientFormDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateClient}
        clientToEdit={prefilledName ? ({ name: prefilledName } as any) : null}
      />

      <div className="flex flex-col h-full bg-white border-r border-zinc-200 w-[300px] select-none shadow-sm z-10">
        {/* HEADER */}
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
              // CORRECTION ICI
              value={activeQuote.title || ""}
              onChange={(e) => updateField(null, "title", e.target.value)}
              className="w-full bg-transparent text-sm font-black text-zinc-900 outline-none placeholder:text-zinc-300 truncate hover:text-indigo-600 transition-colors cursor-text"
              placeholder="Nom du projet..."
            />
          </div>
        </div>

        {/* CONTENU */}
        <div className="flex-1 overflow-y-auto figma-scrollbar bg-white">
          {/* CLIENT */}
          <PanelSection
            title="Client & Destinataire"
            icon={User}
            defaultOpen={true}
          >
            <PropertyRow label="Société / Nom">
              <ClientAutocomplete
                // CORRECTION ICI
                value={activeQuote.client.name || ""}
                onChange={(val) => updateField("client", "name", val)}
                clients={clients}
                onSelectClient={handleSelectClient}
                onAddNew={() => {
                  setPrefilledName(activeQuote.client.name || "");
                  setIsModalOpen(true);
                }}
              />
            </PropertyRow>

            <div className="grid grid-cols-2 gap-2">
              <PropertyRow label="Email">
                <PanelInput
                  value={activeQuote.client.email || ""}
                  onChange={(e) =>
                    updateField("client", "email", e.target.value)
                  }
                  placeholder="@"
                />
              </PropertyRow>

              <PropertyRow label="Téléphone">
                <PanelInput
                  value={activeQuote.client.phone || ""}
                  onChange={(e) =>
                    updateField("client", "phone", e.target.value)
                  }
                  placeholder="06..."
                />
              </PropertyRow>
            </div>

            <PropertyRow label="SIRET / TVA">
              <PanelInput
                value={activeQuote.client.siret || ""}
                onChange={(e) => updateField("client", "siret", e.target.value)}
                placeholder="N° Légal..."
                className="font-mono text-[10px]"
              />
            </PropertyRow>

            <PropertyRow label="Adresse">
              <PanelTextarea
                value={activeQuote.client.address || ""}
                onChange={(e) =>
                  updateField("client", "address", e.target.value)
                }
                placeholder="Adresse complète..."
                className="min-h-[60px]"
              />
            </PropertyRow>

            <div className="mt-2 flex items-center gap-1.5 opacity-60">
              <div className="w-1 h-1 rounded-full bg-indigo-500" />
              <p className="text-[9px] text-zinc-500">
                Remplissage auto. activé
              </p>
            </div>
          </PanelSection>

          {/* NEGOCIATION */}
          <PanelSection title="Négociation" icon={Receipt} defaultOpen={true}>
            <PropertyRow label="Remise Globale">
              <div className="relative group">
                <PanelInput
                  type="number"
                  // Note: pour un nombre, 0 est falsy, donc on garde la valeur brute si elle existe
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

          {/* SYSTEME */}
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
                  value={activeQuote.quote.number || ""}
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

          {/* MENTIONS */}
          <PanelSection title="Mentions" icon={FileText} defaultOpen={false}>
            <PropertyRow label="Conditions Particulières">
              <PanelTextarea
                value={activeQuote.quote.terms || ""}
                onChange={(e) => updateField("quote", "terms", e.target.value)}
                className="min-h-[120px] font-mono text-[10px] leading-relaxed"
                placeholder="Texte libre..."
              />
            </PropertyRow>
          </PanelSection>
        </div>

        {/* FOOTER */}
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
