// Fichier: components/invoice/ItemSelector.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Check, ChevronsUpDown, Search, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDebounce } from "@/hooks/use-debounce";
import { searchCatalogItemsAction } from "@/app/actions/item.actions";

// Type aligné avec InteractiveQuote
interface ItemSelection {
  id: string;
  title: string;
  description?: string | null;
  unitPriceEuros: number;
  defaultQuantity?: number;
  technicalScope?: any;
  pricing?: any;
  salesCopy?: any;
}

interface ItemSelectorProps {
  onSelect: (item: ItemSelection) => void;
}

export function ItemSelector({ onSelect }: ItemSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Debounce pour ne pas spammer la DB à chaque frappe
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    // Si le menu est fermé, on ne cherche pas
    if (!open) return;

    const fetchItems = async () => {
      setLoading(true);
      const data = await searchCatalogItemsAction(debouncedSearch);
      setResults(data)
      setLoading(false);
    };

    fetchItems();
  }, [debouncedSearch, open]);

  const handleSelect = (item: any) => {
    // CORRECTION MAJEURE : On passe l'objet complet proprement
    onSelect({
      id: item.id,
      title: item.title,
      description: item.description,
      unitPriceEuros: item.unitPriceEuros ?? 0, // Sécurité anti-null
      defaultQuantity: item.defaultQuantity ?? 1,
      technicalScope: item.technicalScope,
      pricing: item.pricing,
      salesCopy: item.salesCopy,
    });
    setOpen(false);
    setSearchTerm(""); // Reset
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between text-zinc-500 hover:text-zinc-900 border-dashed hover:border-solid hover:bg-zinc-50"
        >
          <span className="flex items-center gap-2 truncate">
            <Package className="w-4 h-4" />
            Importer depuis le catalogue...
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[300px] p-0" align="start">
        <Command shouldFilter={false}>
          {/* shouldFilter=false car on filtre côté serveur */}

          <CommandInput
            placeholder="Rechercher un service..."
            value={searchTerm}
            onValueChange={setSearchTerm}
          />

          <CommandList>
            {loading && (
              <div className="py-6 text-center text-xs text-zinc-400">
                Chargement...
              </div>
            )}

            {!loading && results.length === 0 && (
              <CommandEmpty className="py-4 text-center text-xs text-zinc-400">
                Aucun service trouvé.
              </CommandEmpty>
            )}

            {!loading && results.length > 0 && (
              <CommandGroup heading="Catalogue">
                {results.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={item.id} // Important pour la key interne
                    onSelect={() => handleSelect(item)}
                    className="flex flex-col items-start gap-1 py-3 cursor-pointer"
                  >
                    <div className="flex w-full justify-between items-center">
                      <span className="font-bold text-zinc-900 text-sm">
                        {item.title}
                      </span>
                      <span className="font-mono text-xs font-medium text-emerald-600">
                        {item.unitPriceEuros.toFixed(2)} €
                      </span>
                    </div>
                    {item.description && (
                      <span className="text-xs text-zinc-500 line-clamp-1 w-full">
                        {item.description}
                      </span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
