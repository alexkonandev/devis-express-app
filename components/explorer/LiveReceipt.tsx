"use client";

import React, { useMemo } from "react";
import { Separator } from "@/components/ui/separator";
import { Receipt } from "lucide-react";
import { cn } from "@/lib/utils";

interface LiveReceiptProps {
  basePrice: number;
  quantity: number;
  mode: "fixed" | "daily" | "monthly";
  optionsCount: number; // Juste pour l'effet visuel ou si on ajoute des prix aux options
}

export const LiveReceipt = ({
  basePrice,
  quantity,
  mode,
  optionsCount,
}: LiveReceiptProps) => {
  const financials = useMemo(() => {
    const subtotal = basePrice * quantity;
    const tva = subtotal * 0.2; // Assuming 20%
    const total = subtotal + tva;

    return {
      subtotal: subtotal.toLocaleString("fr-FR", {
        style: "currency",
        currency: "EUR",
      }),
      tva: tva.toLocaleString("fr-FR", { style: "currency", currency: "EUR" }),
      total: total.toLocaleString("fr-FR", {
        style: "currency",
        currency: "EUR",
      }),
    };
  }, [basePrice, quantity]);

  return (
    <div
      className={cn(
        "bg-white rounded-xl p-6 border border-zinc-200 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] space-y-4 transition-all duration-300"
        // Petite animation CSS "flash" pourrait être ajoutée ici via une classe keyframe quand les props changent
      )}
    >
      <div className="flex items-center gap-2 text-zinc-400 mb-2">
        <Receipt className="w-4 h-4" />
        <span className="text-xs font-bold uppercase tracking-widest">
          Récapitulatif
        </span>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex justify-between text-zinc-600">
          <span>
            Tarif{" "}
            {mode === "daily"
              ? "Journalier"
              : mode === "monthly"
              ? "Mensuel"
              : "Forfait"}
            <span className="text-zinc-400 ml-1">x {quantity}</span>
          </span>
          <span className="font-mono">{financials.subtotal}</span>
        </div>

        {optionsCount > 0 && (
          <div className="flex justify-between text-emerald-600">
            <span>Options incluses</span>
            <span className="font-bold">{optionsCount}</span>
          </div>
        )}

        <div className="flex justify-between text-zinc-400">
          <span>TVA (20%)</span>
          <span className="font-mono">{financials.tva}</span>
        </div>
      </div>

      <Separator className="border-dashed my-2" />

      <div className="flex justify-between items-end">
        <span className="text-sm font-bold text-zinc-900">Total Client</span>
        <div className="flex flex-col items-end">
          <span className="font-mono text-xl font-bold text-indigo-600 tracking-tight leading-none">
            {financials.total}
          </span>
          {mode === "monthly" && (
            <span className="text-[10px] text-zinc-400 font-bold uppercase">
              / mois
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
