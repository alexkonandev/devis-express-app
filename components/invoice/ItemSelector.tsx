"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Package, Plus, Loader2 } from "lucide-react";
import { getItemsAction } from "@/app/actions/item.actions"; // Assurez-vous que cette action existe
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface ItemData {
  id: string;
  title: string;
  description?: string | null;
  unitPriceEuros: number;
  defaultQuantity?: number;
  isTaxable?: boolean;
}

interface ItemSelectorProps {
  onSelect: (item: ItemData) => void;
}

export function ItemSelector({ onSelect }: ItemSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<ItemData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleOpen = async () => {
    setIsOpen(true);
    if (items.length === 0 && !isLoading) {
      setIsLoading(true);
      // On récupère tout le catalogue (souvent petit pour les freelances)
      const res = await getItemsAction();
      if (res.success && res.data) {
        setItems(res.data as any[]);
      } else {
        toast.error("Impossible de charger le catalogue");
      }
      setIsLoading(false);
    }
  };

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

  const filteredItems = items.filter((i) =>
    i.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative w-full print:hidden" ref={wrapperRef}>
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 group-hover:text-emerald-500 transition-colors" />
        <input
          type="text"
          placeholder="Ajouter depuis le catalogue..."
          className="w-full h-8 pl-9 pr-4 rounded-md border border-neutral-200 bg-neutral-50/50 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all placeholder:text-neutral-400"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleOpen}
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border border-neutral-200 shadow-xl z-50 max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 flex justify-center text-neutral-400">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="p-1">
              <div className="px-2 py-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                Catalogue ({filteredItems.length})
              </div>
              {filteredItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelect(item);
                    setIsOpen(false);
                    setQuery("");
                    toast.success("Service ajouté !");
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-emerald-50 rounded-md flex items-center justify-between group transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-md bg-neutral-100 flex items-center justify-center text-neutral-500">
                      <Package className="w-3 h-3" />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900 text-xs">
                        {item.title}
                      </p>
                      <p className="text-[10px] text-neutral-400">
                        {item.unitPriceEuros} €
                      </p>
                    </div>
                  </div>
                  <Plus className="w-3.5 h-3.5 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          ) : (
            <div className="p-3 text-center">
              <p className="text-xs text-neutral-500 mb-2">Catalogue vide.</p>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs h-7"
                onClick={() => window.open("/items", "_blank")}
              >
                <Plus className="w-3 h-3 mr-2" /> Créer un service
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
