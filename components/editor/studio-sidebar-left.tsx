"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  User,
  Settings2,
  Receipt,
  Plus,
  Check,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// --- ACTIONS BACKEND ---
import { upsertClient } from "@/actions/client-action";
import { ClientFormDialog } from "@/components/clients/client-form-dialog";

// --- TYPES (Importés depuis ton socle Editor) ---
import { EditorActiveQuote } from "@/types/editor";

// ====================================================================
// INTERFACES
// ====================================================================

export interface ClientItem {
  id: string;
  name: string;
  email: string | null;
  address: string | null;
  siret: string | null;
  phone?: string | null;
}

interface StudioSidebarLeftProps {
  activeQuote: EditorActiveQuote;
  updateField: (
    group: keyof EditorActiveQuote | null,
    field: string,
    value: string | number
  ) => void;
  onBack?: () => void;
  initialClients: ClientItem[];
}

// --- MICRO-COMPOSANTS UI ---

const PanelSection = ({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
  isTechnical = false,
}: {
  title: string;
  icon: LucideIcon;
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
        className="flex items-center w-full px-4 py-3 hover:bg-zinc-100 transition-colors group outline-none"
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
            "text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2",
            isOpen ? "text-zinc-900" : "text-zinc-500"
          )}
        >
          <Icon className="w-3 h-3 opacity-70" />
          {title}
        </span>
      </button>
      {isOpen && (
        <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  );
};

const PropertyRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1.5 my-3 last:mb-0">
    <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-0.5">
      {label}
    </label>
    {children}
  </div>
);

const PanelInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    value={props.value || ""}
    className={cn(
      "w-full bg-zinc-100 text-zinc-900 border border-transparent rounded-sm px-2.5 py-2 text-xs font-bold outline-none transition-all hover:bg-zinc-200/70 focus:bg-white focus:border-zinc-900 focus:ring-0",
      props.className
    )}
  />
);

const PanelTextarea = (
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) => (
  <textarea
    {...props}
    value={props.value || ""}
    className={cn(
      "w-full bg-zinc-100 text-zinc-900 border border-transparent rounded-sm px-2.5 py-2 text-xs font-medium outline-none transition-all resize-none min-h-[60px] hover:bg-zinc-200/70 focus:bg-white focus:border-zinc-900",
      props.className
    )}
  />
);

// --- AUTOCOMPLETE ---

const ClientAutocomplete = ({
  value,
  onChange,
  onSelectClient,
  clients,
  onAddNew,
}: {
  value: string;
  onChange: (val: string) => void;
  onSelectClient: (client: ClientItem) => void;
  clients: ClientItem[];
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
      )
        setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <input
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
        className="w-full bg-zinc-100 text-zinc-900 border border-transparent rounded-sm px-2.5 py-2 text-xs font-black uppercase tracking-tight outline-none"
        placeholder="RECHERCHER OU CRÉER..."
      />
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-1 bg-white border border-zinc-200 rounded-sm shadow-xl z-50 max-h-[220px] overflow-y-auto">
          {filtered.map((client) => (
            <button
              key={client.id}
              onClick={() => {
                onSelectClient(client);
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 text-xs hover:bg-zinc-50 flex items-center justify-between border-b border-zinc-50 last:border-0 transition-colors"
            >
              <div className="min-w-0 font-black text-zinc-900 uppercase truncate">
                {client.name}
              </div>
              {value === client.name && (
                <Check className="w-3.5 h-3.5 text-zinc-900" />
              )}
            </button>
          ))}
          <button
            onClick={() => {
              onAddNew();
              setIsOpen(false);
            }}
            className="w-full text-left px-3 py-3 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 sticky bottom-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nouveau : {search || "Client"}</span>
          </button>
        </div>
      )}
    </div>
  );
};

// --- MAIN COMPONENT ---

export const StudioSidebarLeft = ({
  activeQuote,
  updateField,
  onBack,
  initialClients,
}: StudioSidebarLeftProps) => {
  const [clients, setClients] = useState<ClientItem[]>(initialClients);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prefilledName, setPrefilledName] = useState("");

  const handleSelectClient = (client: ClientItem) => {
    updateField("client", "name", client.name);
    updateField("client", "email", client.email || "");
    updateField("client", "phone", client.phone || "");
    updateField("client", "siret", client.siret || "");
    updateField("client", "address", client.address || "");
    toast.success(`Client appliqué : ${client.name}`);
  };

  const handleCreateClient = async (formData: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    siret?: string;
  }) => {
    const res = await upsertClient(formData);
    if (res.success && res.data) {
      const newClient = res.data as ClientItem;
      setClients((prev) => [newClient, ...prev]);
      handleSelectClient(newClient);
      return true;
    }
    return false;
  };

  return (
    <>
      <ClientFormDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateClient}
        // ✅ Strictement typé avec Partial pour éviter le 'any'
        clientToEdit={
          prefilledName
            ? ({ name: prefilledName } as Partial<ClientItem>)
            : null
        }
      />

      <div className="flex flex-col h-full bg-white border-r border-zinc-200 w-[300px] select-none shadow-sm z-10">
        <div className="h-14 shrink-0 flex items-center px-3 border-b border-zinc-200 gap-3 bg-white">
          <button
            onClick={onBack}
            className="w-8 h-8 flex items-center justify-center rounded-sm text-zinc-400 hover:text-black hover:bg-zinc-100 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-[9px] text-zinc-400 font-black uppercase tracking-[0.2em]">
              PROJET
            </span>
            <input
              value={activeQuote.title}
              onChange={(e) => updateField(null, "title", e.target.value)}
              className="w-full bg-transparent text-sm font-black text-zinc-900 outline-none truncate uppercase tracking-tight"
              placeholder="NOM DU PROJET..."
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <PanelSection title="Destinataire" icon={User}>
            <PropertyRow label="Client / Société">
              <ClientAutocomplete
                value={activeQuote.client.name}
                onChange={(val) => updateField("client", "name", val)}
                clients={clients}
                onSelectClient={handleSelectClient}
                onAddNew={() => {
                  setPrefilledName(activeQuote.client.name);
                  setIsModalOpen(true);
                }}
              />
            </PropertyRow>
            <div className="grid grid-cols-1 gap-1">
              <PropertyRow label="Contact">
                <PanelInput
                  placeholder="Email..."
                  value={activeQuote.client.email}
                  onChange={(e) =>
                    updateField("client", "email", e.target.value)
                  }
                />
              </PropertyRow>
            </div>
            <PropertyRow label="Adresse de facturation">
              <PanelTextarea
                placeholder="Rue, Code Postal, Ville..."
                value={activeQuote.client.address}
                onChange={(e) =>
                  updateField("client", "address", e.target.value)
                }
              />
            </PropertyRow>
          </PanelSection>

          <PanelSection title="Conditions Financières" icon={Receipt}>
            <PropertyRow label="Remise Commerciale (HT)">
              <div className="relative">
                <PanelInput
                  type="number"
                  value={activeQuote.financials.discountAmountEuros}
                  onChange={(e) =>
                    updateField(
                      "financials",
                      "discountAmountEuros",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="text-right font-mono text-emerald-600 font-black pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-emerald-600">
                  €
                </span>
              </div>
            </PropertyRow>
            <PropertyRow label="Taux de TVA (%)">
              <PanelInput
                type="number"
                value={activeQuote.financials.vatRatePercent}
                onChange={(e) =>
                  updateField(
                    "financials",
                    "vatRatePercent",
                    parseFloat(e.target.value) || 0
                  )
                }
                className="font-mono font-black"
              />
            </PropertyRow>
          </PanelSection>

          <PanelSection
            title="Réglages du Devis"
            icon={Settings2}
            defaultOpen={false}
            isTechnical={true}
          >
            <PropertyRow label="Identifiant Devis">
              <PanelInput
                value={activeQuote.quote.number}
                onChange={(e) => updateField("quote", "number", e.target.value)}
                className="font-mono uppercase"
              />
            </PropertyRow>
            <PropertyRow label="Date d'émission">
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
              />
            </PropertyRow>
            <PropertyRow label="Mentions Légales">
              <PanelTextarea
                value={activeQuote.quote.terms}
                onChange={(e) => updateField("quote", "terms", e.target.value)}
                placeholder="Délais de paiement, validité..."
              />
            </PropertyRow>
          </PanelSection>
        </div>

        <div className="h-10 border-t border-zinc-200 flex items-center justify-between px-4 bg-zinc-50/50">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] text-zinc-400 font-black uppercase tracking-widest">
              Studio Mode
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
