"use client";

import React, { useState, useRef, ChangeEvent } from "react";
import {
  CaretLeftIcon,
  UserIcon,
  GearSixIcon,
  ReceiptIcon,
  PlusIcon,
  CheckIcon,
  IdentificationCardIcon,
  EnvelopeSimpleIcon,
  MapPinIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { upsertClient } from "@/actions/client-action";
import { ClientFormDialog } from "@/components/clients/client-form-dialog";
import { EditorActiveQuote } from "@/types/editor";

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

// --- MICRO-COMPOSANTS ---

const SectionHeader = ({ title, icon: Icon }: { title: string; icon: any }) => (
  <div className="h-10 bg-slate-50 border-y border-slate-200 flex items-center px-3 shrink-0">
    <div className="flex items-center gap-2">
      <Icon size={14} weight="bold" className="text-slate-400" />
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
        {title}
      </span>
    </div>
  </div>
);

const PropertyRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1 px-3 py-2 border-b border-slate-50 last:border-0">
    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-tight ml-0.5">
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
      "w-full bg-transparent border-b border-transparent py-0.5 text-[12px] font-medium text-slate-900 outline-none focus:border-indigo-600 transition-none placeholder:text-slate-300",
      props.className
    )}
  />
);

// --- AUTOCOMPLETE TYPÉ ---

const ClientAutocomplete = ({
  value,
  onChange,
  onSelectClient,
  clients,
  onAddNew,
}: {
  value: string;
  onChange: (val: string) => void;
  onSelectClient: (c: ClientItem) => void;
  clients: ClientItem[];
  onAddNew: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative w-full">
      <div className="relative flex items-center border-b border-slate-200">
        <input
          value={value || ""}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            onChange(e.target.value);
            setSearch(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full bg-white py-1.5 text-[12px] font-black text-slate-900 uppercase outline-none focus:text-indigo-600"
          placeholder="RECHERCHE CLIENT..."
        />
        <button
          onClick={onAddNew}
          className="text-slate-300 hover:text-indigo-600"
        >
          <PlusIcon size={14} weight="bold" />
        </button>
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-1 bg-white border border-slate-200 shadow-2xl z-50 max-h-[160px] overflow-y-auto">
          {filtered.map((client) => (
            <button
              key={client.id}
              onClick={() => {
                onSelectClient(client);
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-[11px] hover:bg-slate-50 flex items-center justify-between border-b border-slate-50 last:border-0"
            >
              <span className="font-bold text-slate-700 uppercase">
                {client.name}
              </span>
              {value === client.name && (
                <CheckIcon
                  size={12}
                  weight="bold"
                  className="text-indigo-600"
                />
              )}
            </button>
          ))}
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
  const [view, setView] = useState<"client" | "config">("client");
  const [clients, setClients] = useState<ClientItem[]>(initialClients);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectClient = (client: ClientItem) => {
    updateField("client", "name", client.name);
    updateField("client", "email", client.email || "");
    updateField("client", "siret", client.siret || "");
    updateField("client", "address", client.address || "");
    toast.success(`TARGET: ${client.name}`);
  };

  const handleCreateClient = async (formData: any): Promise<boolean> => {
    const res = await upsertClient(formData);
    if (res.success && res.data) {
      const newClient = res.data as ClientItem;
      setClients((prev) => [newClient, ...prev]);
      handleSelectClient(newClient);
      setIsModalOpen(false);
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
        clientToEdit={
          activeQuote.client.name
            ? ({ name: activeQuote.client.name } as Partial<ClientItem>)
            : null
        }
      />

      <div className="flex flex-col h-full bg-white border-r border-slate-200 w-[320px] overflow-hidden">
        {/* HEADER & TABS (Alignés sur Sidebar Droite) */}
        <div className="h-12 shrink-0 flex items-center px-3 border-b border-slate-200 gap-3 bg-white">
          <button
            onClick={onBack}
            className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-none"
          >
            <CaretLeftIcon size={16} weight="bold" />
          </button>
          <input
            value={activeQuote.title}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              updateField(null, "title", e.target.value)
            }
            className="flex-1 bg-transparent text-[12px] font-black text-slate-900 uppercase outline-none"
            placeholder="PROJET_ID..."
          />
        </div>

        <div className="flex shrink-0 h-10 border-b border-slate-200">
          {(["client", "config"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setView(tab)}
              className={cn(
                "flex-1 text-[9px] font-black uppercase tracking-widest transition-none",
                view === tab
                  ? "bg-white text-indigo-600 shadow-[inset_0_-2px_0_0_#4f46e5]"
                  : "bg-slate-50 text-slate-400"
              )}
            >
              {tab === "client" ? "Destinataire" : "Paramètres"}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-none">
          {view === "client" ? (
            <div className="flex flex-col">
              <SectionHeader title="Identification" icon={UserIcon} />
              <PropertyRow label="Client / Raison Sociale">
                <ClientAutocomplete
                  value={activeQuote.client.name}
                  onChange={(val) => updateField("client", "name", val)}
                  clients={clients}
                  onSelectClient={handleSelectClient}
                  onAddNew={() => setIsModalOpen(true)}
                />
              </PropertyRow>
              <PropertyRow label="Contact Direct">
                <div className="flex items-center gap-2">
                  <EnvelopeSimpleIcon size={14} className="text-slate-300" />
                  <PanelInput
                    placeholder="EMAIL@CLIENT.COM"
                    value={activeQuote.client.email || ""}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      updateField("client", "email", e.target.value)
                    }
                  />
                </div>
              </PropertyRow>
              <PropertyRow label="Localisation">
                <div className="flex items-start gap-2 pt-1">
                  <MapPinIcon size={14} className="text-slate-300 mt-1" />
                  <textarea
                    placeholder="ADRESSE COMPLETE..."
                    value={activeQuote.client.address || ""}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                      updateField("client", "address", e.target.value)
                    }
                    className="w-full bg-transparent text-[11px] font-medium text-slate-600 outline-none resize-none h-20"
                  />
                </div>
              </PropertyRow>
              <SectionHeader title="Finance & TVA" icon={ReceiptIcon} />
              <div className="grid grid-cols-2">
                <div className="border-r border-slate-50">
                  <PropertyRow label="Remise (€)">
                    <PanelInput
                      type="number"
                      value={activeQuote.financials.discountAmountEuros}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        updateField(
                          "financials",
                          "discountAmountEuros",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="font-mono text-indigo-600 font-bold"
                    />
                  </PropertyRow>
                </div>
                <div>
                  <PropertyRow label="Taux TVA (%)">
                    <PanelInput
                      type="number"
                      value={activeQuote.financials.vatRatePercent}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        updateField(
                          "financials",
                          "vatRatePercent",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="font-mono"
                    />
                  </PropertyRow>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              <SectionHeader title="Méta-données" icon={GearSixIcon} />
              <PropertyRow label="Référence Devis">
                <div className="flex items-center gap-2">
                  <IdentificationCardIcon
                    size={14}
                    className="text-slate-300"
                  />
                  <PanelInput
                    value={activeQuote.quote.number}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      updateField("quote", "number", e.target.value)
                    }
                    className="font-mono uppercase text-indigo-600"
                  />
                </div>
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
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    updateField("quote", "issueDate", e.target.value)
                  }
                  className="font-mono"
                />
              </PropertyRow>
            </div>
          )}
        </div>

        {/* FOOTER (Noir ROI - Aligné Sidebar Droite) */}
        <div className="h-10 shrink-0 bg-slate-950 flex items-center px-4 justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-indigo-500 rounded-full animate-pulse" />
            <span className="text-[8px] text-slate-500 font-black uppercase tracking-[0.2em]">
              Engine_Ready
            </span>
          </div>
          <span className="text-[8px] text-slate-600 font-mono italic">
            v3.0.1
          </span>
        </div>
      </div>
    </>
  );
};
