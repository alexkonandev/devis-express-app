"use client";

import React, { useState, useMemo } from "react";
import {
  CaretLeftIcon,
  UserIcon,
  PlusIcon,
  HashIcon,
  GearSixIcon,
  CloudCheckIcon,
  ListBulletsIcon,
  XIcon,
  CurrencyEurIcon,
  MagnifyingGlassIcon,
  Icon,
} from "@phosphor-icons/react";
import { ClientFormDialog } from "@/components/editor/client-form-dialog";
import {
  EditorActiveQuote,
  EditorQuoteItem,
  EditorCatalogOffer,
  EditorClient,
} from "@/types/editor";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "sonner";

interface StudioSidebarLeftProps {
  activeQuote: EditorActiveQuote;
  updateField: (
    group: keyof EditorActiveQuote | null,
    field: string,
    value: string | number
  ) => void;
  onBack?: () => void;
  initialClients: EditorClient[];
  catalogItems: EditorCatalogOffer[];
  addItem: (item?: Partial<EditorQuoteItem>) => void;
  updateItem: (
    index: number,
    field: keyof EditorQuoteItem,
    value: string | number
  ) => void;
  removeItem: (index: number) => void;
}

// --- MICRO-COMPOSANTS BLUEPRINT V3.1 ---

const SectionHeader = ({
  title,
  icon: Icon,
  right,
}: {
  title: string;
  icon: Icon;
  right?: React.ReactNode;
}) => (
  <div className="h-9 bg-slate-50 border-y border-slate-200 flex items-center justify-between px-3 shrink-0">
    <div className="flex items-center gap-2">
      <Icon size={12} weight="bold" className="text-slate-900" />
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">
        {title}
      </span>
    </div>
    {right}
  </div>
);

const ChampPropriete = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1 px-3 py-3 border-b border-slate-50">
    <label className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-500 select-none">
      {label}
    </label>
    <div className="flex items-center gap-2">{children}</div>
  </div>
);

export const StudioSidebarLeft = ({
  activeQuote,
  updateField,
  onBack,
  catalogItems,
  addItem,
  updateItem,
  removeItem,
}: StudioSidebarLeftProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 200);

  const filteredCatalog = useMemo(
    () =>
      catalogItems.filter(
        (i) =>
          i.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          i.category.toLowerCase().includes(debouncedSearch.toLowerCase())
      ),
    [catalogItems, debouncedSearch]
  );

  return (
    <>
      <ClientFormDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={async () => true}
        clientToEdit={null}
      />

      <div className="flex flex-col h-full bg-white border-r border-slate-200 w-[320px] overflow-hidden rounded-none shadow-none">
        {/* EN-TÊTE : NAVIGATION & IDENTITÉ PROJET */}
        <div className="h-14 shrink-0 flex items-center px-3 gap-3 border-b border-slate-200 bg-white z-10">
          <button
            onClick={onBack}
            className="p-1.5 hover:bg-slate-100 transition-none rounded-none text-slate-900"
          >
            <CaretLeftIcon size={18} weight="bold" />
          </button>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
              INST_EDITEUR
            </span>
            <input
              value={activeQuote.title}
              onChange={(e) => updateField(null, "title", e.target.value)}
              className="bg-transparent text-[14px] font-black text-indigo-600 uppercase tracking-tighter outline-none truncate placeholder:italic placeholder:font-normal placeholder:text-slate-200"
              placeholder="NOM_DU_PROJET..."
            />
          </div>
        </div>

        {/* ZONE DE TRAVAIL INTERNE */}
        <div className="flex-1 overflow-y-auto scrollbar-none flex flex-col min-h-0 bg-white">
          {/* IDENTIFICATION CLIENT */}
          <div className="shrink-0">
            <SectionHeader title="IDENTIFICATION_CLIENT" icon={UserIcon} />
            <ChampPropriete label="Raison Sociale">
              <div className="flex w-full items-center border border-slate-200 bg-white focus-within:border-slate-900 transition-none">
                <input
                  value={activeQuote.client.name}
                  onChange={(e) =>
                    updateField("client", "name", e.target.value)
                  }
                  className="w-full bg-transparent px-2 py-2 text-[12px] font-bold text-slate-900 uppercase outline-none placeholder:text-slate-200 placeholder:italic placeholder:font-normal"
                  placeholder="CLIENT_NON_DEFINI..."
                />
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="h-9 w-9 flex items-center justify-center border-l border-slate-100 text-slate-900 hover:bg-slate-50"
                >
                  <PlusIcon size={14} weight="bold" />
                </button>
              </div>
            </ChampPropriete>

            {/* FINANCES : GRILLE DE HAUTE DENSITÉ */}
            <div className="grid grid-cols-2 divide-x divide-slate-100 border-b border-slate-200">
              <div className="flex flex-col px-3 py-3 gap-1">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                  Remise_€
                </span>
                <input
                  type="number"
                  value={activeQuote.financials.discountAmountEuros}
                  onChange={(e) =>
                    updateField(
                      "financials",
                      "discountAmountEuros",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="bg-transparent font-mono text-[14px] font-black text-indigo-600 outline-none"
                />
              </div>
              <div className="flex flex-col px-3 py-3 gap-1">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                  TVA_%
                </span>
                <input
                  type="number"
                  value={activeQuote.financials.vatRatePercent}
                  onChange={(e) =>
                    updateField(
                      "financials",
                      "vatRatePercent",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="bg-transparent font-mono text-[14px] font-black text-slate-900 outline-none"
                />
              </div>
            </div>
          </div>

          {/* LIGNES DE DEVIS */}
          <div className="shrink-0 flex flex-col min-h-0">
            <SectionHeader
              title="LIGNES_ACTIVES"
              icon={ListBulletsIcon}
              right={
                <span className="font-mono text-[11px] font-black text-white px-2 py-0.5 bg-slate-900">
                  {activeQuote.items.length}
                </span>
              }
            />
            <div className="p-3 space-y-4">
              {activeQuote.items.map((item, idx) => (
                <div
                  key={idx}
                  className="group border-l-2 border-slate-200 hover:border-indigo-600 pl-3 py-1 relative transition-none"
                >
                  <button
                    onClick={() => removeItem(idx)}
                    className="absolute -right-1 top-0 opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-red-600 transition-none"
                  >
                    <XIcon size={12} weight="bold" />
                  </button>
                  <input
                    value={item.title}
                    onChange={(e) => updateItem(idx, "title", e.target.value)}
                    className="w-full bg-transparent text-[12px] font-bold text-slate-900 uppercase outline-none focus:text-indigo-600 placeholder:text-slate-200 italic"
                    placeholder="DESIGNATION_SERVICE..."
                  />
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1.5">
                      <CurrencyEurIcon
                        size={12}
                        weight="bold"
                        className="text-slate-400"
                      />
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) =>
                          updateItem(
                            idx,
                            "unitPrice",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-16 bg-transparent font-mono text-[12px] font-black text-slate-900 outline-none border-b border-transparent focus:border-slate-200"
                      />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <HashIcon
                        size={12}
                        weight="bold"
                        className="text-slate-400"
                      />
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(
                            idx,
                            "quantity",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-12 bg-transparent font-mono text-[12px] font-black text-slate-900 outline-none border-b border-transparent focus:border-slate-200"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={() => addItem()}
                className="w-full py-2 border border-dashed border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-none"
              >
                + AJOUTER_LIGNE
              </button>
            </div>
          </div>

          {/* CATALOGUE SOURCE */}
          <div className="shrink-0 bg-slate-50/50">
            <SectionHeader
              title="CATALOGUE_SOURCE"
              icon={MagnifyingGlassIcon}
            />
            <div className="p-3">
              <input
                placeholder="RECHERCHER_SERVICE..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border-2 border-slate-200 px-3 py-2 text-[10px] font-black uppercase outline-none focus:border-slate-900 transition-all placeholder:text-slate-200"
              />
            </div>
            <div className="max-h-50 overflow-y-auto p-3 pt-0 space-y-2 scrollbar-none">
              {filteredCatalog.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    addItem({
                      title: item.title,
                      unitPrice: item.unitPrice,
                      quantity: 1,
                    });
                    toast.success(`SERVICE_AJOUTE`);
                  }}
                  className="w-full flex items-center justify-between p-2.5 bg-white border border-slate-200 hover:border-indigo-600 text-left transition-none group shadow-sm"
                >
                  <span className="text-[10px] font-bold text-slate-900 uppercase truncate flex-1 group-hover:text-indigo-600">
                    {item.title}
                  </span>
                  <span className="font-mono text-[11px] font-black text-slate-900 ml-3">
                    {item.unitPrice}€
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 min-h-10" />

          {/* AUDIT SYSTEME */}
          <div className="shrink-0 mt-auto border-t border-slate-200 bg-white">
            <SectionHeader title="AUDIT_SYSTEME" icon={GearSixIcon} />
            <div className="px-3 py-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400">
                  <HashIcon size={12} weight="bold" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    DOC_ID
                  </span>
                </div>
                <span className="text-[11px] font-mono font-black text-indigo-600">
                  {activeQuote.quote.number || "EN_ATTENTE"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400">
                  <CloudCheckIcon
                    size={12}
                    weight="bold"
                    className="text-indigo-600"
                  />
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    STATUT_SYNC
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 font-black uppercase tracking-tighter">
                  FLUX_OPTIMAL
                </span>
              </div>
            </div>
            {/* LIGNE DE FORCE FINALE */}
            <div className="h-1 bg-indigo-600 w-full" />
          </div>
        </div>
      </div>
    </>
  );
};
