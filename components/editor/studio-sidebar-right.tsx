"use client";

import React, { useState, useMemo } from "react";
import {
  Plus,
  X,
  Search,
  ChevronRight,
  Book,
  Check,
  Lock,
  ChevronUp,
  Sparkles,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import { toast } from "sonner";

// --- TYPES CENTRALISÉS ---
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
  moveItem: (fromIndex: number, toIndex: number) => void;
  totals: { totalTTC: number; subTotal: number };
}

// --- UI COMPONENTS ---

const TinyLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 select-none block mb-1.5 ml-0.5">
    {children}
  </span>
);

const StudioInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className="w-full bg-zinc-100 text-zinc-900 border border-transparent rounded-sm px-2.5 py-2 text-xs font-bold outline-none transition-all placeholder:text-zinc-400 hover:bg-zinc-200/70 focus:bg-white focus:border-zinc-900 focus:ring-0"
  />
);

const CollapsibleHeader = ({
  title,
  count,
  icon: Icon,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  count: number;
  icon: LucideIcon;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) => (
  <div className="border-b border-zinc-100 last:border-0">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between py-3 px-2 hover:bg-white transition-colors group"
    >
      <div className="flex items-center gap-2">
        <ChevronRight
          className={cn(
            "w-3 h-3 text-zinc-300 transition-transform",
            isOpen && "rotate-90"
          )}
        />
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-zinc-900 flex items-center gap-2">
          <Icon className="w-3 h-3" />
          {title}
        </span>
      </div>
      <span className="text-[9px] font-mono font-bold text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded-sm">
        {count}
      </span>
    </button>
    {isOpen && (
      <div className="p-2 pt-0 flex flex-col gap-1 animate-in slide-in-from-top-1">
        {children}
      </div>
    )}
  </div>
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
  const [activeTab, setActiveTab] = useState<"items" | "design">("items");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [showCatalog, setShowCatalog] = useState(true);

  // Filtrage intelligent basé sur le catalogue Prisma
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
    <div className="flex flex-col h-full bg-white border-l border-zinc-200 w-[320px] relative">
      {/* TABS STUDIO */}
      <div className="flex border-b border-zinc-200 shrink-0 h-14 bg-zinc-50/50">
        {(["items", "design"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex-1 h-full text-[9px] font-black uppercase tracking-[0.2em] transition-all relative",
              activeTab === tab
                ? "text-zinc-900 bg-white"
                : "text-zinc-400 hover:text-zinc-600"
            )}
          >
            {tab === "items" ? "Prestations" : "Design"}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-900" />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto pb-32">
        {activeTab === "items" ? (
          <div className="p-4 space-y-6">
            <div className="flex justify-between items-end">
              <TinyLabel>Lignes du devis</TinyLabel>
              <span className="text-[10px] font-mono font-black text-zinc-900 mb-1.5">
                TOTAL HT:{" "}
                {totals.subTotal.toLocaleString("fr-FR", {
                  minimumFractionDigits: 2,
                })}
                €
              </span>
            </div>

            {activeQuote.items.length === 0 ? (
              <div className="py-12 border-2 border-dashed border-zinc-100 rounded-sm flex flex-col items-center justify-center text-center px-4">
                <Plus className="w-5 h-5 text-zinc-200 mb-2" />
                <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">
                  Aucune ligne ajoutée
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeQuote.items.map((item, index) => (
                  <div
                    key={index}
                    className="group relative bg-white border border-zinc-200 rounded-sm p-3 hover:border-zinc-400 transition-all"
                  >
                    <div className="space-y-2">
                      <input
                        value={item.title}
                        onChange={(e) =>
                          updateItem(index, "title", e.target.value)
                        }
                        className="w-full bg-transparent text-xs font-black text-zinc-900 uppercase tracking-tight outline-none"
                        placeholder="TITRE DE LA MISSION..."
                      />
                      <textarea
                        value={item.subtitle}
                        onChange={(e) =>
                          updateItem(index, "subtitle", e.target.value)
                        }
                        className="w-full bg-transparent text-[10px] text-zinc-500 font-medium outline-none resize-none min-h-10 leading-tight"
                        placeholder="Détails de la prestation..."
                      />
                      <div className="flex gap-2 pt-1">
                        <div className="flex-1">
                          <StudioInput
                            type="number"
                            value={item.unitPriceEuros}
                            onChange={(e) =>
                              updateItem(
                                index,
                                "unitPriceEuros",
                                parseFloat(e.target.value) || 0
                              )
                            }
                          />
                        </div>
                        <div className="w-14">
                          <StudioInput
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              updateItem(
                                index,
                                "quantity",
                                parseFloat(e.target.value) || 0
                              )
                            }
                          />
                        </div>
                        <button
                          onClick={() => removeItem(index)}
                          className="w-8 flex items-center justify-center text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded transition-all"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 space-y-4">
            <TinyLabel>Thèmes Disponibles</TinyLabel>
            <div className="grid grid-cols-1 gap-2">
              {availableThemes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setTheme(theme.id)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-sm border transition-all text-left",
                    currentTheme === theme.id
                      ? "border-zinc-900 bg-zinc-50"
                      : "border-zinc-100 bg-white hover:border-zinc-200"
                  )}
                >
                  <div
                    className="w-4 h-4 rounded-full border border-zinc-200 shadow-inner"
                    style={{ backgroundColor: theme.color }}
                  />
                  <div className="flex-1">
                    <div className="text-[10px] font-black uppercase tracking-widest">
                      {theme.name}
                    </div>
                  </div>
                  {currentTheme === theme.id && (
                    <Check className="w-3 h-3 text-zinc-900" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FOOTER PICKER */}
      {activeTab === "items" && (
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 bg-white border-t border-zinc-200 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] transition-all duration-300 z-30 flex flex-col",
            isPickerOpen ? "h-[70%]" : "h-14"
          )}
        >
          <div
            className="h-14 flex items-center px-4 gap-3 cursor-pointer group"
            onClick={() => setIsPickerOpen(!isPickerOpen)}
          >
            <Search className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
            <input
              placeholder="AJOUTER DEPUIS LE CATALOGUE..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (!isPickerOpen) setIsPickerOpen(true);
              }}
              className="flex-1 bg-transparent text-[10px] font-black uppercase tracking-widest outline-none"
            />
            <ChevronUp
              className={cn(
                "w-4 h-4 text-zinc-300 transition-transform",
                isPickerOpen && "rotate-180"
              )}
            />
          </div>

          {isPickerOpen && (
            <div className="flex-1 overflow-y-auto p-4 pt-0 bg-white">
              <button
                onClick={() => {
                  addItem();
                  setIsPickerOpen(false);
                }}
                className="w-full p-3 mb-4 border-2 border-dashed border-zinc-100 rounded-sm hover:border-zinc-900 hover:bg-zinc-50 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Ligne Vide Manuelle
              </button>

              <CollapsibleHeader
                title="Mon Catalogue"
                count={filteredCatalog.length}
                icon={Book}
                isOpen={showCatalog}
                onToggle={() => setShowCatalog(!showCatalog)}
              >
                {filteredCatalog.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      addItem({
                        title: item.title,
                        subtitle: item.subtitle,
                        unitPriceEuros: item.unitPriceEuros,
                        quantity: 1,
                      });
                      setIsPickerOpen(false);
                      toast.success(`${item.title} ajouté`);
                    }}
                    className="w-full text-left p-2.5 bg-zinc-50 border border-zinc-100 rounded-sm hover:border-zinc-900 flex justify-between items-center group transition-all"
                  >
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-tight">
                        {item.title}
                      </span>
                      <span className="text-[8px] text-zinc-400 font-bold uppercase">
                        {item.category}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-black text-zinc-900">
                      {item.unitPriceEuros}€
                    </span>
                  </button>
                ))}
              </CollapsibleHeader>

              {/* SECTION PREMIUM/IA FALLBACK */}
              <CollapsibleHeader
                title="Templates Avancés"
                count={0}
                icon={Sparkles}
                isOpen={false}
                onToggle={() => {}}
              >
                <div className="p-4 text-center">
                  <Lock className="w-4 h-4 text-zinc-300 mx-auto mb-2" />
                  <p className="text-[8px] font-black uppercase text-zinc-400">
                    Bientôt disponible
                  </p>
                </div>
              </CollapsibleHeader>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
