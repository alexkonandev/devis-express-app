"use client";

import React from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CalendarDays, Repeat, Hash } from "lucide-react";
import { cn } from "@/lib/utils";

export type BillingMode = "fixed" | "daily" | "monthly";

interface BillingManagerProps {
  mode: BillingMode;
  setMode: (m: BillingMode) => void;
  quantity: number;
  setQuantity: (q: number) => void;
  price: number;
  setPrice: (p: number) => void;
  minPrice: number;
  maxPrice: number;
}

export const BillingManager = ({
  mode,
  setMode,
  quantity,
  setQuantity,
  price,
  setPrice,
  minPrice,
  maxPrice,
}: BillingManagerProps) => {
  // Fonction pour calculer la couleur du slider (Vert -> Rouge)
  const getSliderColor = () => {
    const range = maxPrice - minPrice;
    const position = price - minPrice;
    const percentage = position / range;

    // Si proche du min (marge faible) = Rouge/Orange. Si proche du max = Vert.
    if (percentage < 0.2) return "bg-red-500";
    if (percentage < 0.5) return "bg-amber-400";
    return "bg-emerald-500";
  };

  return (
    <div className="space-y-6">
      {/* 1. Mode Switcher */}
      <div className="grid grid-cols-3 gap-2 p-1 bg-zinc-100 rounded-lg">
        {[
          { id: "fixed", label: "Forfait", icon: Hash },
          { id: "daily", label: "TJM / Jour", icon: CalendarDays },
          { id: "monthly", label: "Mensuel", icon: Repeat },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id as BillingMode)}
            className={cn(
              "flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-md transition-all",
              mode === m.id
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-zinc-400 hover:text-zinc-600"
            )}
          >
            <m.icon className="w-3 h-3" />
            {m.label}
          </button>
        ))}
      </div>

      {/* 2. Quantity Input (Conditional) */}
      {mode === "daily" && (
        <div className="flex items-center gap-4 bg-indigo-50 p-3 rounded-lg border border-indigo-100 animate-in fade-in slide-in-from-top-2">
          <span className="text-xs font-bold text-indigo-700 uppercase whitespace-nowrap">
            Nombre de jours
          </span>
          <Input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="bg-white border-indigo-200 h-8 font-mono text-right"
          />
        </div>
      )}

      {/* 3. Margin Slider (Bounded) */}
      <div className="space-y-3 pt-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-zinc-500 uppercase">
            Tarif Unitaire HT
          </span>
          <span className="font-mono text-zinc-900 bg-zinc-100 px-2 py-1 rounded">
            {price} €
          </span>
        </div>
        <Slider
          value={[price]}
          min={minPrice}
          max={maxPrice}
          step={10}
          onValueChange={(vals) => setPrice(vals[0])}
          className={cn(
            "cursor-pointer",
            "[&>.relative>.absolute]:bg-indigo-600"
          )} // Custom styling could be applied here via a wrapper to change color dynamically
        />
        <div className="flex justify-between text-[10px] text-zinc-400 font-mono font-medium uppercase">
          <span>Min: {minPrice}€</span>
          <span>Max: {maxPrice}€</span>
        </div>
      </div>
    </div>
  );
};
