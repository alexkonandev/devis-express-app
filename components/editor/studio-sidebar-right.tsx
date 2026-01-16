"use client";

import React, { useState, useMemo, ChangeEvent } from "react";
import {
  PlusIcon,
  XIcon,
  MagnifyingGlassIcon,
  PaletteIcon,
  ListBulletsIcon,
  HashIcon,
  CurrencyEurIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "sonner";

import {
  EditorActiveQuote,
  EditorTheme,
  EditorCatalogOffer,
  EditorQuoteItem,
} from "@/types/editor";

interface StudioSidebarRightProps {
  activeQuote: EditorActiveQuote;
  availableThemes: EditorTheme[];
  currentTheme: string;
  setTheme: (theme: string) => void;
  catalogItems: EditorCatalogOffer[];
  addItem: (item?: Partial<EditorQuoteItem>) => void;
  updateItem: (
    index: number,
    field: keyof EditorQuoteItem,
    value: string | number
  ) => void;
  removeItem: (index: number) => void;
  totals: { totalTTC: number; subTotal: number };
}

// --- STRUCTURES ATOMIQUES ---

const SectionHeader = ({
  title,
  icon: Icon,
  right,
}: {
  title: string;
  icon: any;
  right?: React.ReactNode;
}) => (
  <div className="h-10 bg-slate-50 border-y border-slate-200 flex items-center justify-between px-3 shrink-0">
    <div className="flex items-center gap-2">
      <Icon size={14} weight="bold" className="text-slate-400" />
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
        {title}
      </span>
    </div>
    {right}
  </div>
);

const SlimInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={cn(
      "w-full bg-transparent border-b border-slate-100 py-1 text-[12px] font-medium text-slate-900 outline-none focus:border-indigo-600 transition-none",
      props.className
    )}
  />
);

export const StudioSidebarRight = ({
  activeQuote,
  availableThemes,
  currentTheme,
  setTheme,
  catalogItems,
  addItem,
  updateItem,
  removeItem,
  totals,
}: StudioSidebarRightProps) => {
  const [view, setView] = useState<"content" | "style">("content");
  const [search, setSearch] = useState<string>("");
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
    <div className="flex flex-col h-full bg-white border-l border-slate-200 w-[320px] overflow-hidden">
      {/* TABS DE CONTRÔLE OS-LIKE */}
      <div className="flex shrink-0 h-12 border-b border-slate-200">
        <button
          onClick={() => setView("content")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-none",
            view === "content"
              ? "bg-white text-indigo-600 shadow-[inset_0_-2px_0_0_#4f46e5]"
              : "bg-slate-50 text-slate-400"
          )}
        >
          <ListBulletsIcon size={16} weight="bold" /> ITEMS
        </button>
        <button
          onClick={() => setView("style")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-none",
            view === "style"
              ? "bg-white text-indigo-600 shadow-[inset_0_-2px_0_0_#4f46e5]"
              : "bg-slate-50 text-slate-400"
          )}
        >
          <PaletteIcon size={16} weight="bold" /> STYLE
        </button>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        {view === "content" ? (
          <>
            {/* PANNEAU A : ÉDITION DES LIGNES (50% de l'espace) */}
            <div className="flex-[6] flex flex-col min-h-0">
              <SectionHeader
                title="Lignes Actives"
                icon={ListBulletsIcon}
                right={
                  <span className="font-mono text-[11px] font-bold text-slate-900">
                    {activeQuote.items.length}
                  </span>
                }
              />
              <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-none">
                {activeQuote.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="group border-l-2 border-slate-100 hover:border-indigo-500 pl-3 py-1 space-y-2 relative transition-none"
                  >
                    <button
                      onClick={() => removeItem(idx)}
                      className="absolute -right-1 top-0 opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-red-500 transition-none"
                    >
                      <XIcon size={12} weight="bold" />
                    </button>

                    <input
                      value={item.title}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        updateItem(idx, "title", e.target.value)
                      }
                      className="w-full bg-transparent text-[11px] font-bold text-slate-900 uppercase outline-none focus:text-indigo-600"
                      placeholder="DESIGNATION..."
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <CurrencyEurIcon size={12} className="text-slate-400" />
                        <SlimInput
                          type="number"
                          value={item.unitPriceEuros}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            updateItem(
                              idx,
                              "unitPriceEuros",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="font-mono"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <HashIcon size={12} className="text-slate-400" />
                        <SlimInput
                          type="number"
                          value={item.quantity}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            updateItem(
                              idx,
                              "quantity",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => addItem()}
                  className="w-full py-2 border border-dashed border-slate-200 text-[9px] font-black uppercase text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-none"
                >
                  + Nouvelle Ligne Manuelle
                </button>
              </div>
            </div>

            {/* PANNEAU B : CATALOGUE SOURCE (40% de l'espace) */}
            <div className="flex-[4] flex flex-col min-h-0 border-t border-slate-200 bg-slate-50/50">
              <div className="p-2 shrink-0">
                <div className="relative">
                  <input
                    placeholder="RECHERCHER DANS LE CATALOGUE..."
                    value={search}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setSearch(e.target.value)
                    }
                    className="w-full bg-white border border-slate-200 pl-8 py-1.5 text-[10px] font-bold uppercase outline-none focus:border-indigo-600"
                  />
                  <MagnifyingGlassIcon
                    size={14}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-none">
                {filteredCatalog.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      addItem({
                        title: item.title,
                        unitPriceEuros: item.unitPriceEuros,
                        quantity: 1,
                      });
                      toast.success(`Ajouté : ${item.title}`);
                    }}
                    className="w-full flex items-center justify-between p-2 bg-white border border-slate-100 hover:border-indigo-600 transition-none text-left"
                  >
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] font-bold text-slate-900 uppercase truncate">
                        {item.title}
                      </span>
                      <span className="text-[8px] text-slate-400 font-medium uppercase">
                        {item.category}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] font-bold text-slate-900 ml-2">
                      {item.unitPriceEuros}€
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* VUE STYLE ÉPURÉE */
          <div className="p-4 space-y-2">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
              Sélecteur de Thème
            </span>
            {availableThemes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setTheme(theme.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 border rounded-none transition-none",
                  currentTheme === theme.id
                    ? "border-indigo-600 bg-white"
                    : "border-slate-100 hover:border-slate-300"
                )}
              >
                <div
                  className="w-3 h-3 rounded-none"
                  style={{ backgroundColor: theme.color }}
                />
                <span className="text-[11px] font-bold uppercase text-slate-900">
                  {theme.name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* TOTALS FOOTER : IMMUABLE & ROI ORIENTÉ */}
      <div className="shrink-0 bg-slate-950 p-4 space-y-1">
        <div className="flex justify-between items-center text-slate-400 text-[10px] font-bold uppercase">
          <span>Sous-total HT</span>
          <span className="font-mono">
            {totals.subTotal.toLocaleString("fr-FR")} €
          </span>
        </div>
        <div className="flex justify-between items-center text-white text-[14px] font-black uppercase tracking-tight pt-1 border-t border-white/10">
          <span>Net à Payer</span>
          <span className="font-mono text-indigo-400">
            {totals.totalTTC.toLocaleString("fr-FR")} €
          </span>
        </div>
      </div>
    </div>
  );
};
