// components/catalog/cells.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "Tech",
  "Design",
  "Marketing",
  "Consulting",
  "Admin",
  "Divers",
];

/**
 * 1. CELLULE TEXTE ÉDITABLE (Pleine grandeur)
 * S'active au clic, remplit 100% de la cellule, sauvegarde sur Blur/Enter.
 */
interface EditableTextCellProps {
  value: string;
  onSave: (val: string) => void;
  className?: string;
  placeholder?: string;
}

export const EditableTextCell = ({
  value,
  onSave,
  className,
  placeholder,
}: EditableTextCellProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setLocalValue(value), [value]);

  // Focus automatique lors de l'activation
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const commit = () => {
    setIsEditing(false);
    if (localValue !== value) onSave(localValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Empêcher le saut de ligne si dans un form
      commit();
    }
    if (e.key === "Escape") {
      setLocalValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={commit}
        onKeyDown={handleKeyDown}
        className={cn(
          "w-full h-full border-none shadow-none focus-visible:ring-0 px-3 py-0 bg-indigo-50/50 text-sm rounded-none absolute inset-0 z-10",
          className
        )}
        placeholder={placeholder}
      />
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className={cn(
        "w-full h-full flex items-center px-3 cursor-text truncate text-sm hover:bg-zinc-50 transition-colors absolute inset-0",
        !value && "text-zinc-400 italic",
        className
      )}
      title={value} // Tooltip natif
    >
      {value || placeholder}
    </div>
  );
};

/**
 * 2. CELLULE PRIX ÉDITABLE (Alignement Droite + Format Monétaire)
 */
interface EditablePriceCellProps {
  value: number;
  onSave: (val: number) => void;
}

export const EditablePriceCell = ({
  value,
  onSave,
}: EditablePriceCellProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setLocalValue(value.toString()), [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) inputRef.current.focus();
  }, [isEditing]);

  const commit = () => {
    setIsEditing(false);
    const num = parseFloat(localValue);
    if (!isNaN(num) && num !== value) {
      onSave(num);
    } else {
      setLocalValue(value.toString());
    }
  };

  if (isEditing) {
    return (
      <Input
        ref={inputRef}
        type="number"
        step="0.01"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") {
            setLocalValue(value.toString());
            setIsEditing(false);
          }
        }}
        className="w-full h-full border-none shadow-none focus-visible:ring-0 px-3 text-right font-mono text-sm bg-indigo-50/50 rounded-none absolute inset-0 z-10"
      />
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className="w-full h-full flex items-center justify-end px-3 cursor-text hover:bg-zinc-50 font-mono text-sm font-medium text-zinc-700 absolute inset-0 transition-colors"
    >
      {new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }).format(value)}
    </div>
  );
};

/**
 * 3. CELLULE SÉLECTEUR DE CATÉGORIE (Compact)
 */
interface CategorySelectCellProps {
  value: string;
  onSave: (val: string) => void;
}

export const CategorySelectCell = ({
  value,
  onSave,
}: CategorySelectCellProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="w-full h-full flex items-center justify-center cursor-pointer hover:bg-zinc-50 absolute inset-0 transition-colors group">
          {value ? (
            <span className="inline-flex items-center justify-center px-2 py-0.5 w-20 rounded text-[11px] font-medium bg-zinc-100 text-zinc-800 border border-zinc-200 truncate max-w-[90%] group-hover:border-zinc-300">
              {value}
            </span>
          ) : (
            <span className="text-zinc-300 text-xs group-hover:text-zinc-400">
              --
            </span>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[180px]" align="start">
        <Command>
          <CommandInput placeholder="Filtrer..." />
          <CommandList>
            <CommandEmpty>Aucune catégorie.</CommandEmpty>
            <CommandGroup>
              {CATEGORIES.map((cat) => (
                <CommandItem
                  key={cat}
                  value={cat}
                  onSelect={(currentValue) => {
                    // Si on resélectionne la même, on ne fait rien ou on vide ? Ici on set.
                    onSave(cat);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === cat ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {cat}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

/**
 * 4. CELLULE TOGGLE TVA (Centre)
 */
interface TaxToggleCellProps {
  isTaxable: boolean;
  onToggle: () => void;
}

export const TaxToggleCell = ({ isTaxable, onToggle }: TaxToggleCellProps) => (
  <div
    onClick={onToggle}
    className="w-full h-full flex items-center justify-center cursor-pointer hover:bg-zinc-50 absolute inset-0 transition-colors"
  >
    <div
      className={cn(
        "w-3 h-3 rounded-full border shadow-sm transition-all",
        isTaxable
          ? "bg-emerald-500 border-emerald-600 ring-2 ring-emerald-100"
          : "bg-zinc-100 border-zinc-300"
      )}
      title={isTaxable ? "Soumis à la TVA" : "Non Taxable"}
    />
  </div>
);
