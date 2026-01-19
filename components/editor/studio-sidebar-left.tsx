"use client";

import React, { useState, useMemo} from "react";
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
import { ClientFormDialog } from "@/components/clients/client-form-dialog";
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

// --- MICRO-COMPOSANTS ---

const SectionHeader = ({
  title,
  icon: Icon,
  right,
}: {
  title: string;
  icon: Icon;
  right?: React.ReactNode;
}) => (
  <div className="h-8 bg-slate-50 border-y border-slate-200 flex items-center justify-between px-3 shrink-0">
    <div className="flex items-center gap-2">
      <Icon size={12} weight="bold" className="text-slate-400" />
      <span className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-500">
        {title}
      </span>
    </div>
    {right}
  </div>
);

const PropertyRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-0.5 px-3 py-2 border-b border-slate-50">
    <label className="text-[8px] font-bold uppercase tracking-wider text-slate-400 select-none">
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
        {/* HEADER : NAVIGATION */}
        <div className="h-12 shrink-0 flex items-center px-3 gap-3 border-b border-slate-200 bg-white z-10">
          <button
            onClick={onBack}
            className="p-1 hover:bg-slate-100 transition-none"
          >
            <CaretLeftIcon size={16} weight="bold" />
          </button>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
              Editor_Instance
            </span>
            <input
              value={activeQuote.title}
              onChange={(e) => updateField(null, "title", e.target.value)}
              className="bg-transparent text-[13px] font-black text-slate-900 uppercase tracking-tighter outline-none truncate"
            />
          </div>
        </div>

        {/* ZONE DE SCROLL PRINCIPALE */}
        <div className="flex-1 overflow-y-auto scrollbar-none flex flex-col min-h-0 bg-white">
          {/* SECTION 1 : CLIENT & FINANCIALS */}
          <div className="shrink-0 border-b border-slate-100">
            <SectionHeader title="Identification" icon={UserIcon} />
            <PropertyRow label="Raison Sociale">
              <div className="flex w-full items-center border border-slate-200 bg-white focus-within:border-slate-950 transition-none">
                <input
                  value={activeQuote.client.name}
                  onChange={(e) =>
                    updateField("client", "name", e.target.value)
                  }
                  className="w-full bg-transparent px-2 py-1 text-[11px] font-bold text-slate-900 outline-none"
                  placeholder="Client..."
                />
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="h-7 w-7 flex items-center justify-center border-l border-slate-100 text-slate-400 hover:text-indigo-600"
                >
                  <PlusIcon size={12} weight="bold" />
                </button>
              </div>
            </PropertyRow>

            <div className="grid grid-cols-2 divide-x divide-slate-100 border-b border-slate-50">
              <div className="flex flex-col px-3 py-2 gap-0.5">
                <span className="text-[7px] font-black text-slate-400 uppercase">
                  Discount_€
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
                  className="bg-transparent font-mono text-[12px] font-bold text-indigo-600 outline-none"
                />
              </div>
              <div className="flex flex-col px-3 py-2 gap-0.5">
                <span className="text-[7px] font-black text-slate-400 uppercase">
                  Tax_Rate_%
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
                  className="bg-transparent font-mono text-[12px] font-medium text-slate-900 outline-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2 : ITEMS (LIGNES ACTIVES) */}
          <div className="shrink-0 flex flex-col min-h-0">
            <SectionHeader
              title="Lignes Actives"
              icon={ListBulletsIcon}
              right={
                <span className="font-mono text-[10px] font-bold text-slate-900 px-2 py-0.5 bg-slate-100">
                  {activeQuote.items.length}
                </span>
              }
            />
            <div className="p-3 space-y-3">
              {activeQuote.items.map((item, idx) => (
                <div
                  key={idx}
                  className="group border-l-2 border-slate-100 hover:border-indigo-500 pl-3 py-1 relative transition-none"
                >
                  <button
                    onClick={() => removeItem(idx)}
                    className="absolute -right-1 top-0 opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-red-500"
                  >
                    <XIcon size={12} weight="bold" />
                  </button>
                  <input
                    value={item.title}
                    onChange={(e) => updateItem(idx, "title", e.target.value)}
                    className="w-full bg-transparent text-[11px] font-bold text-slate-900 uppercase outline-none focus:text-indigo-600"
                    placeholder="Désignation..."
                  />
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1">
                      <CurrencyEurIcon size={10} className="text-slate-400" />
                      <input
                        type="number"
                        value={item.unitPriceEuros}
                        onChange={(e) =>
                          updateItem(
                            idx,
                            "unitPriceEuros",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-16 bg-transparent font-mono text-[11px] font-medium border-b border-transparent focus:border-slate-200 outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <HashIcon size={10} className="text-slate-400" />
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
                        className="w-12 bg-transparent font-mono text-[11px] font-medium border-b border-transparent focus:border-slate-200 outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={() => addItem()}
                className="w-full py-2 border border-dashed border-slate-200 text-[9px] font-black uppercase text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-none"
              >
                + Nouvelle Ligne
              </button>
            </div>
          </div>

          {/* SECTION 3 : CATALOGUE (SOURCE) */}
          <div className="shrink-0 border-t border-slate-100 bg-slate-50/30">
            <SectionHeader
              title="Catalogue Source"
              icon={MagnifyingGlassIcon}
            />
            <div className="p-2 shrink-0">
              <input
                placeholder="Filtrer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-slate-200 px-2 py-1.5 text-[10px] font-bold uppercase outline-none focus:border-indigo-600 shadow-sm"
              />
            </div>
            <div className="max-h-[200px] overflow-y-auto p-2 space-y-1 scrollbar-none">
              {filteredCatalog.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    addItem({
                      title: item.title,
                      unitPriceEuros: item.unitPriceEuros,
                      quantity: 1,
                    });
                    toast.success(`Ajouté`);
                  }}
                  className="w-full flex items-center justify-between p-2 bg-white border border-slate-100 hover:border-indigo-600 text-left shadow-sm"
                >
                  <span className="text-[10px] font-bold text-slate-900 uppercase truncate flex-1">
                    {item.title}
                  </span>
                  <span className="font-mono text-[10px] font-bold text-slate-900 ml-2 whitespace-nowrap">
                    {item.unitPriceEuros}€
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* SPACER : Consomme l'espace restant pour coller l'audit en bas */}
          <div className="flex-1 min-h-[40px]" />

          {/* ANCHOR BOTTOM : SYSTEM AUDIT */}
          <div className="shrink-0 mt-auto border-t border-slate-200 bg-white">
            <SectionHeader title="System_Audit" icon={GearSixIcon} />
            <div className="px-3 py-3 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-slate-400 uppercase tracking-tighter">
                  <HashIcon size={10} />
                  <span className="text-[9px] font-bold">Document_ID</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-indigo-600">
                  {activeQuote.quote.number || "PENDING"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-slate-400 uppercase tracking-tighter">
                  <CloudCheckIcon size={10} className="text-indigo-500" />
                  <span className="text-[8px] font-black">Sync_Status</span>
                </div>
                <span className="text-[9px] font-mono text-slate-400 uppercase">
                  20:22_OPTIMAL
                </span>
              </div>
            </div>
            <div className="h-[3px] bg-indigo-600 w-full" />
          </div>
        </div>
      </div>
    </>
  );
};
