"use client";

import React, { useState, useMemo } from "react";
import {
  ShoppingBag,
  Import,
  Sparkles,
  Ghost,
  ArrowDownToLine,
  Calculator,
  Trash2,
  ReceiptEuro,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UIItem } from "@/types/explorer";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface ImportSetBuilderProps {
  importSet: UIItem[];
  onRemoveItem: (id: string) => void;
  onDropItem: (item: UIItem) => void;
  onImport: () => void;
  isImporting: boolean;
}

// --- LOGIQUE MÉTIER EXTERNALISÉE (HOOK) ---
const useCartCalculations = (items: UIItem[]) => {
  return useMemo(() => {
    const subtotal = items.reduce((acc, item) => acc + item.defaultPrice, 0);
    const taxRate = 0.2; // 20%
    const taxAmount = subtotal * taxRate;
    const totalTTC = subtotal + taxAmount;
    const averageItemPrice = items.length > 0 ? subtotal / items.length : 0;

    const format = (n: number) =>
      new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }).format(n);

    return {
      count: items.length,
      subtotalRaw: subtotal,
      subtotalFormatted: format(subtotal),
      taxFormatted: format(taxAmount),
      totalTTCFormatted: format(totalTTC),
      averageFormatted: format(averageItemPrice),
    };
  }, [items]);
};

export const ImportSetBuilder = ({
  importSet,
  onRemoveItem,
  onDropItem,
  onImport,
  isImporting,
}: ImportSetBuilderProps) => {
  const [isDragOver, setIsDragOver] = useState(false);

  // Utilisation de notre hook de calcul robuste
  const financials = useCartCalculations(importSet);

  // --- DRAG HANDLERS ---
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isDragOver) setIsDragOver(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    try {
      const jsonData = e.dataTransfer.getData("application/json");
      if (!jsonData) return;
      const item: UIItem = JSON.parse(jsonData);
      onDropItem(item);
    } catch (error) {
      console.error("JSON Parse Error", error);
    }
  };

  return (
    <aside className="w-96 shrink-0 flex flex-col h-full bg-white border-l border-zinc-200 z-20 shadow-xl shadow-zinc-200/50">
      {/* HEADER */}
      <div className="h-20 px-6 py-4 border-b border-zinc-100 bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shadow-sm">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900">
              Pré-Devis
            </h2>
            <p className="text-[10px] text-zinc-400 font-medium">
              Zone d'importation
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-medium text-zinc-400">Total HT</div>
          <div className="text-lg font-mono font-bold text-zinc-900 leading-none">
            {financials.subtotalFormatted}
          </div>
        </div>
      </div>

      {/* DROP ZONE & LIST */}
      <div className="flex-1 overflow-hidden relative flex flex-col bg-zinc-50/30">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "flex-1 flex flex-col transition-all duration-300",
            isDragOver
              ? "bg-indigo-50/80 scale-[0.98] rounded-lg m-2 ring-2 ring-indigo-400 ring-dashed"
              : ""
          )}
        >
          <ScrollArea className="flex-1 w-full h-full">
            <div className="p-4 min-h-full flex flex-col gap-3">
              {importSet.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-20 opacity-60">
                  {isDragOver ? (
                    <ArrowDownToLine className="w-12 h-12 text-indigo-500 animate-bounce" />
                  ) : (
                    <Ghost className="w-12 h-12 text-zinc-300 mb-4" />
                  )}
                  <p className="text-sm font-bold text-zinc-600">
                    Le panier est vide
                  </p>
                  <p className="text-xs text-zinc-400 mt-1">
                    Glissez des services ici
                  </p>
                </div>
              )}
              {importSet.map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  className="group relative flex items-center justify-between p-3 bg-white rounded-xl border border-zinc-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all animate-in slide-in-from-right-8 duration-500"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="font-semibold text-sm text-zinc-900 truncate">
                      {item.title}
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-0.5 flex items-center gap-1">
                      <span className="bg-zinc-100 px-1.5 py-0.5 rounded">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm font-bold text-zinc-700">
                      {new Intl.NumberFormat("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                      }).format(item.defaultPrice)}
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 bg-red-100 text-red-600 p-1.5 rounded-full shadow-sm hover:bg-red-200 transition-all scale-75 group-hover:scale-100"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <div className="h-6" /> {/* Spacer */}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* FOOTER FINANCIER COMPLET */}
      <div className="border-t border-zinc-200 bg-white p-5 space-y-4 z-20">
        {/* Détails financiers compacts */}
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between text-zinc-500">
            <span>Nombre d'items</span>
            <span className="font-mono">{financials.count}</span>
          </div>
          <div className="flex justify-between text-zinc-500">
            <span>Panier moyen</span>
            <span className="font-mono">{financials.averageFormatted}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between text-zinc-600">
            <span>Total HT</span>
            <span className="font-mono font-medium">
              {financials.subtotalFormatted}
            </span>
          </div>
          <div className="flex justify-between text-zinc-500 italic">
            <span>TVA (estimée 20%)</span>
            <span className="font-mono">{financials.taxFormatted}</span>
          </div>
          <div className="flex justify-between text-indigo-900 font-bold text-sm mt-1">
            <span>Total TTC</span>
            <span className="font-mono text-base">
              {financials.totalTTCFormatted}
            </span>
          </div>
        </div>

        <Button
          onClick={onImport}
          disabled={importSet.length === 0 || isImporting}
          className={cn(
            "w-full h-12 text-sm font-bold uppercase tracking-wide shadow-lg transition-all",
            importSet.length > 0
              ? "bg-zinc-900 text-white hover:bg-indigo-600 hover:shadow-indigo-200"
              : "bg-zinc-100 text-zinc-400 border border-zinc-200"
          )}
        >
          {isImporting ? (
            <>
              <Sparkles className="w-4 h-4 mr-2 animate-spin" /> Traitement...
            </>
          ) : (
            <>
              <Import className="w-4 h-4 mr-2" /> Générer le Devis
            </>
          )}
        </Button>
      </div>
    </aside>
  );
};
