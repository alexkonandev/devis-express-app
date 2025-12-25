"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Plus,
  X,
  Search,
  GripVertical,
  Box,
  Sparkles,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  Book,
  Palette,
  Check,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";

// --- TYPES ---

// 1. Définition de la structure d'un thème pour la sidebar
export interface ThemeConfig {
  id: string;
  name: string;
  color: string; // Code Hex pour la pastille
  description?: string;
}

interface QuoteItem {
  title: string;
  subtitle: string;
  quantity: number;
  unitPriceEuros: number;
}
interface CatalogItem {
  id: string;
  title: string;
  description?: string;
  unitPriceEuros?: number;
  defaultPrice?: number;
  salesCopy?: { description: string };
}
interface TemplateItem {
  id: string;
  title: string;
  category: string;
  defaultPrice: number;
}
interface QuoteStructure {
  items: QuoteItem[];
}

interface StudioSidebarRightProps {
  activeQuote: QuoteStructure;
  catalogItems: CatalogItem[];
  systemTemplates: TemplateItem[];

  // Gestion des Thèmes
  availableThemes?: ThemeConfig[]; // Nouvelle prop (Optionnelle avec fallback)
  currentTheme: string;
  setTheme: (theme: string) => void;

  updateItem: (
    index: number,
    field: keyof QuoteItem,
    value: string | number
  ) => void;
  addItem: (item?: Partial<QuoteItem>) => void;
  removeItem: (index: number) => void;
  moveItem: (fromIndex: number, toIndex: number) => void;
}

// --- MICRO-COMPOSANTS ---

const StudioInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={cn(
      "w-full bg-zinc-100 text-zinc-900 border border-transparent rounded-sm px-2.5 py-2 text-xs font-medium outline-none transition-all placeholder:text-zinc-400",
      "hover:bg-zinc-200/70 hover:border-zinc-300",
      "focus:bg-white focus:border-indigo-600 focus:shadow-sm focus:ring-1 focus:ring-indigo-600/20"
    )}
  />
);

const StudioTextarea = (
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) => (
  <textarea
    {...props}
    className={cn(
      "w-full h-30 bg-zinc-100 text-zinc-900 border border-transparent rounded-sm px-2.5 py-2 text-[11px] font-medium outline-none transition-all resize-none min-h-[50px] placeholder:text-zinc-400 leading-relaxed",
      "hover:bg-zinc-200/70 hover:border-zinc-300",
      "focus:bg-white focus:shadow-sm",
      "overflow-y-auto",
      "[&::-webkit-scrollbar]:w-1.5",
      "[&::-webkit-scrollbar-track]:bg-transparent",
      "[&::-webkit-scrollbar-thumb]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full",
      "hover:[&::-webkit-scrollbar-thumb]:bg-zinc-300"
    )}
  />
);

const TinyLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 select-none block mb-1.5 ml-0.5">
    {children}
  </span>
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
      className="w-full flex items-center justify-between py-3 px-2 hover:bg-zinc-50 transition-colors group select-none"
    >
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "transition-transform duration-200 text-zinc-400 group-hover:text-zinc-600",
            isOpen ? "rotate-90" : "rotate-0"
          )}
        >
          <ChevronRight className="w-3 h-3" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 group-hover:text-zinc-900 flex items-center gap-2">
          {Icon && <Icon className="w-3 h-3 opacity-70" />}
          {title}
        </span>
      </div>
      {count > 0 && (
        <span className="text-[9px] font-mono text-zinc-400 bg-zinc-100 px-1.5 rounded-sm group-hover:text-zinc-600">
          {count}
        </span>
      )}
    </button>

    {isOpen && (
      <div className="pl-2 animate-in slide-in-from-top-1 duration-200 pb-2">
        {children}
      </div>
    )}
  </div>
);

// --- LISTE DE SECOURS (Si le parent n'envoie rien) ---
const DEFAULT_THEMES: ThemeConfig[] = [
  {
    id: "swiss",
    name: "Swiss International",
    color: "#000000",
    description: "Minimaliste & Helvetica",
  },
  {
    id: "tech",
    name: "Tech Unicorn",
    color: "#6366f1",
    description: "Moderne & Indigo",
  },
  {
    id: "corporate",
    name: "Blue Corporate",
    color: "#1e3a8a",
    description: "Classique & Sérieux",
  },
];

// --- MAIN COMPONENT ---

export const StudioSidebarRight = ({
  activeQuote,
  catalogItems = [],
  systemTemplates = [],

  availableThemes = DEFAULT_THEMES, // Utilisation du fallback
  currentTheme,
  setTheme,

  updateItem,
  addItem,
  removeItem,
  moveItem,
}: StudioSidebarRightProps) => {
  const [activeTab, setActiveTab] = useState<"items" | "design">("items");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);

  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [showCatalog, setShowCatalog] = useState(true);
  const [showTemplates, setShowTemplates] = useState(true);

  // État pour savoir QUEL item est actuellement "prenable" par le drag
  const [activeDragIndex, setActiveDragIndex] = useState<number | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  const getFilteredItems = () => {
    const lowerQuery = debouncedSearch.toLowerCase();
    const filteredServices = catalogItems.filter(
      (i) =>
        i.title.toLowerCase().includes(lowerQuery) ||
        i.description?.toLowerCase().includes(lowerQuery)
    );
    const filteredTemplates = systemTemplates.filter(
      (t) =>
        t.title.toLowerCase().includes(lowerQuery) ||
        t.category.toLowerCase().includes(lowerQuery)
    );
    return { filteredServices, filteredTemplates };
  };

  const { filteredServices, filteredTemplates } = getFilteredItems();

  const handleAdd = (item: CatalogItem | TemplateItem) => {
    const price =
      "unitPriceEuros" in item ? item.unitPriceEuros : item.defaultPrice;
    const subtitle =
      "salesCopy" in item
        ? item.salesCopy?.description
        : "description" in item
        ? item.description
        : "";

    addItem({
      title: item.title,
      subtitle: subtitle || "",
      unitPriceEuros: price || 0,
      quantity: 1,
    });
  };

  // Drag & Drop Handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };
  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;
    moveItem(draggedIndex, targetIndex);
    setDraggedIndex(null);
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

      <div className="flex flex-col h-full bg-white border-l border-zinc-200 w-[320px] relative">
        {/* A. HEADER TABS */}
        <div className="flex border-b border-zinc-200 shrink-0 h-14 bg-white z-20 items-center">
          <button
            onClick={() => setActiveTab("items")}
            className={cn(
              "flex-1 h-full text-[9px] font-bold uppercase tracking-widest transition-all relative flex items-center justify-center gap-2",
              activeTab === "items"
                ? "text-zinc-900 bg-white"
                : "text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50"
            )}
          >
            <Box className="w-3 h-3 mb-0.5" />
            Prestations
            {activeTab === "items" && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-zinc-900" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("design")}
            className={cn(
              "flex-1 h-full text-[9px] font-bold uppercase tracking-widest transition-all relative flex items-center justify-center gap-2",
              activeTab === "design"
                ? "text-zinc-900 bg-white"
                : "text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50"
            )}
          >
            <Palette className="w-3 h-3 mb-0.5" />
            Design
            {activeTab === "design" && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-zinc-900" />
            )}
          </button>
        </div>

        {/* B. CONTENT AREA */}
        <div className="flex-1 overflow-y-auto figma-scrollbar bg-zinc-50/30 pb-20">
          {/* TAB 1: ITEMS LIST */}
          {activeTab === "items" && (
            <div className="p-4 space-y-4">
              <div className="flex justify-between items-end px-1 mb-1">
                <span className="text-[9px] font-bold uppercase text-zinc-400 tracking-widest">
                  Liste des services ({activeQuote.items.length})
                </span>
              </div>

              {activeQuote.items.map((item, index) => (
                <div
                  key={index}
                  draggable={activeDragIndex === index}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className={cn(
                    "group relative bg-white border border-zinc-200 shadow-sm rounded-sm p-4 transition-all hover:border-zinc-300 hover:shadow-md",
                    draggedIndex === index && "opacity-50 border-dashed"
                  )}
                >
                  <div
                    onMouseEnter={() => setActiveDragIndex(index)}
                    onMouseLeave={() => setActiveDragIndex(null)}
                    onTouchStart={() => setActiveDragIndex(index)}
                    className="absolute left-0 top-0 bottom-0 w-6 flex flex-col items-center justify-center text-zinc-300 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing hover:text-zinc-600 hover:bg-zinc-50/50 transition-all z-20"
                  >
                    <GripVertical className="w-3 h-3" />
                  </div>

                  <div className="pl-3 space-y-3">
                    <div className="w-full">
                      <input
                        value={item.title}
                        onChange={(e) =>
                          updateItem(index, "title", e.target.value)
                        }
                        className="w-full bg-transparent text-sm font-bold text-zinc-900 placeholder:text-zinc-300 outline-none transition-colors border-b border-transparent hover:border-zinc-200 focus:border-zinc-200 pb-1"
                        placeholder="Titre de la prestation..."
                      />
                    </div>

                    <div>
                      <StudioTextarea
                        value={item.subtitle}
                        onChange={(e) =>
                          updateItem(index, "subtitle", e.target.value)
                        }
                        placeholder="Description technique..."
                      />
                    </div>

                    <div className="flex items-start gap-3 pt-1">
                      <div className="flex-1">
                        <TinyLabel>Prix Unit. HT</TinyLabel>
                        <div className="relative group/price">
                          <StudioInput
                            type="number"
                            value={item.unitPriceEuros}
                            onChange={(e) =>
                              updateItem(
                                index,
                                "unitPriceEuros",
                                parseFloat(e.target.value)
                              )
                            }
                            className="text-right pr-6 font-mono text-zinc-700"
                          />
                          <span className="absolute right-2.5 top-2 text-[10px] text-zinc-400 pointer-events-none font-bold group-hover/price:text-zinc-600">
                            €
                          </span>
                        </div>
                      </div>
                      <div className="w-20">
                        <TinyLabel>Qté</TinyLabel>
                        <StudioInput
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(
                              index,
                              "quantity",
                              parseFloat(e.target.value)
                            )
                          }
                          className="text-center font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(index)}
                    className="absolute right-2 top-2 text-zinc-300 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-all z-10"
                    title="Supprimer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {activeQuote.items.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-zinc-400 border-2 border-dashed border-zinc-200 rounded-lg bg-zinc-50/30">
                  <Box className="w-8 h-8 mb-3 opacity-20" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                    Devis vide
                  </span>
                  <span className="text-[10px] text-zinc-400 mt-1">
                    Utilisez le catalogue ci-dessous
                  </span>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DESIGN - SYNCHRONISÉ */}
          {activeTab === "design" && (
            <div className="p-4 space-y-6">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-3 block">
                  Identité Visuelle
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {availableThemes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setTheme(theme.id)}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-sm border transition-all text-left group",
                        currentTheme === theme.id
                          ? "border-zinc-900 bg-white ring-1 ring-zinc-900/5 shadow-sm"
                          : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50"
                      )}
                    >
                      <div
                        className="w-4 h-4 rounded-full border border-zinc-200 shrink-0 mt-0.5"
                        style={{ backgroundColor: theme.color }}
                      />
                      <div className="flex-1">
                        <div
                          className={cn(
                            "text-xs font-bold mb-0.5",
                            currentTheme === theme.id
                              ? "text-zinc-900"
                              : "text-zinc-600"
                          )}
                        >
                          {theme.name}
                        </div>
                        {theme.description && (
                          <div className="text-[10px] text-zinc-400">
                            {theme.description}
                          </div>
                        )}
                      </div>
                      {currentTheme === theme.id && (
                        <Check className="w-3.5 h-3.5 text-zinc-900" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* C. BOTTOM PICKER (Overlay) */}
        {activeTab === "items" && (
          <div
            ref={pickerRef}
            className={cn(
              "absolute bottom-0 left-0 right-0 bg-white border-t border-zinc-200 shadow-[-4px_0_20px_rgba(0,0,0,0.08)] transition-all duration-300 ease-in-out z-30 flex flex-col",
              isPickerOpen ? "h-[85%]" : "h-12"
            )}
          >
            <div
              className="h-12 shrink-0 flex items-center px-4 gap-3 bg-white z-40 relative cursor-pointer hover:bg-zinc-50 transition-colors"
              onClick={() => !isPickerOpen && setIsPickerOpen(true)}
            >
              <Search
                className={cn(
                  "w-3.5 h-3.5 transition-colors",
                  isPickerOpen ? "text-indigo-600" : "text-zinc-400"
                )}
              />
              <input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (!isPickerOpen) setIsPickerOpen(true);
                }}
                placeholder="Ajouter une prestation..."
                className="flex-1 bg-transparent text-xs font-medium outline-none placeholder:text-zinc-400 text-zinc-900 h-full"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPickerOpen(!isPickerOpen);
                }}
                className="p-1.5 hover:bg-zinc-100 rounded-sm text-zinc-400 transition-colors"
              >
                <ChevronUp
                  className={cn(
                    "w-3.5 h-3.5 transition-transform duration-300",
                    isPickerOpen && "rotate-180"
                  )}
                />
              </button>
            </div>

            {isPickerOpen && (
              <div className="flex-1 overflow-y-auto figma-scrollbar bg-zinc-50 p-4 space-y-6 border-t border-zinc-100">
                <button
                  onClick={() => {
                    addItem({});
                    setSearchQuery("");
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-sm bg-white border border-dashed border-zinc-300 hover:border-indigo-500 hover:text-indigo-600 hover:shadow-sm text-zinc-500 transition-all group shadow-sm"
                >
                  <div className="w-8 h-8 rounded-sm bg-zinc-100 group-hover:bg-indigo-50 flex items-center justify-center transition-colors">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                      Ligne Vide
                    </div>
                    <div className="text-[10px] text-zinc-400 group-hover:text-indigo-400">
                      Saisie manuelle
                    </div>
                  </div>
                </button>

                <div className="h-px bg-zinc-200 w-full" />

                <div className="space-y-4">
                  <CollapsibleHeader
                    title="Catalogue"
                    icon={Book}
                    count={filteredServices.length}
                    isOpen={showCatalog}
                    onToggle={() => setShowCatalog(!showCatalog)}
                  >
                    {filteredServices.length === 0 && (
                      <div className="text-[10px] text-zinc-400 italic pl-2">
                        Aucun service trouvé.
                      </div>
                    )}

                    {filteredServices.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleAdd(item)}
                        className="w-full text-left flex items-center justify-between p-2.5 rounded-sm hover:bg-indigo-50 hover:text-indigo-700 text-zinc-600 transition-colors group border border-transparent hover:border-indigo-100 mb-1"
                      >
                        <span className="text-xs font-bold truncate pr-2">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500 group-hover:text-indigo-600 bg-zinc-100 px-2 py-0.5 rounded-sm border border-zinc-200 group-hover:border-indigo-200 group-hover:bg-white">
                          {item.unitPriceEuros}€
                        </span>
                      </button>
                    ))}
                  </CollapsibleHeader>

                  <CollapsibleHeader
                    title="Templates"
                    icon={Sparkles}
                    count={filteredTemplates.length}
                    isOpen={showTemplates}
                    onToggle={() => setShowTemplates(!showTemplates)}
                  >
                    {filteredTemplates.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleAdd(item)}
                        className="w-full text-left flex items-center justify-between p-2.5 rounded-sm hover:bg-emerald-50 hover:text-emerald-700 text-zinc-600 transition-colors group border border-transparent hover:border-emerald-100 mb-1"
                      >
                        <div className="flex flex-col">
                          <span className="text-xs font-bold truncate pr-2">
                            {item.title}
                          </span>
                          <span className="text-[9px] text-zinc-400 group-hover:text-emerald-600/70">
                            {item.category}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-zinc-500 group-hover:text-emerald-600 bg-zinc-100 px-2 py-0.5 rounded-sm border border-zinc-200 group-hover:border-emerald-200 group-hover:bg-white">
                          {item.defaultPrice}€
                        </span>
                      </button>
                    ))}
                  </CollapsibleHeader>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};
