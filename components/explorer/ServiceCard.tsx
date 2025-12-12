"use client";

import React, { useMemo } from "react";
import { Plus, Check, ArrowRight, GripVertical, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { UIItem } from "@/types/explorer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ServiceCardProps {
  item: UIItem;
  onViewDetails: (item: UIItem) => void;
  onAddToSet: (item: UIItem) => void;
  isInSet: boolean;
}

export const ServiceCard = ({
  item,
  onViewDetails,
  onAddToSet,
  isInSet,
}: ServiceCardProps) => {
  // Formatage Robuste (Calculé une seule fois par rendu)
  const formattedPrice = useMemo(() => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(item.defaultPrice);
  }, [item.defaultPrice]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    // Structure JSON stricte pour éviter les erreurs de parsing au drop
    const dragPayload = JSON.stringify({
      id: item.id,
      title: item.title,
      defaultPrice: item.defaultPrice,
      category: item.category,
    });
    e.dataTransfer.setData("application/json", dragPayload);
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleQuickAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onAddToSet(item);
  };

  return (
    <div
      draggable="true"
      onDragStart={handleDragStart}
      onClick={() => onViewDetails(item)}
      className={cn(
        "group relative flex flex-col justify-between h-60 w-full p-5 bg-white rounded-xl border transition-all duration-300 select-none",
        isInSet
          ? "border-indigo-200 bg-indigo-50/20 shadow-inner"
          : "border-zinc-200 hover:border-indigo-300 hover:shadow-lg hover:-translate-y-1"
      )}
    >
      <div className="absolute top-3 left-1/2 -translate-x-1/2 text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <GripVertical className="w-4 h-4" />
      </div>

      <div className="flex justify-between items-start mb-4">
        <div
          className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center border transition-colors",
            isInSet
              ? "bg-indigo-100 border-indigo-200 text-indigo-600"
              : "bg-zinc-50 border-zinc-100 text-zinc-500"
          )}
        >
          <Layers className="w-4 h-4" />
        </div>

        <Badge
          variant="secondary"
          className={cn(
            "font-mono text-xs font-semibold px-2 py-0.5 border",
            isInSet
              ? "bg-indigo-100 text-indigo-700 border-indigo-200"
              : "bg-zinc-50 text-zinc-700 border-zinc-100"
          )}
        >
          {formattedPrice}
        </Badge>
      </div>

      <div className="flex-1">
        <h4
          className={cn(
            "font-bold text-sm leading-tight mb-2 line-clamp-2",
            isInSet
              ? "text-indigo-900"
              : "text-zinc-900 group-hover:text-indigo-600 transition-colors"
          )}
        >
          {item.title}
        </h4>
        <p className="text-xs text-zinc-500 line-clamp-3 leading-relaxed">
          {item.description || "Description standardisée non disponible."}
        </p>
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-dashed border-zinc-100">
        <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-400 group-hover:text-indigo-500 transition-colors uppercase tracking-wider">
          <span>Détails</span>
          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
        </div>

        <Button
          size="icon"
          className={cn(
            "h-8 w-8 rounded-lg shadow-sm transition-all",
            isInSet
              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
              : "bg-zinc-900 text-white hover:bg-indigo-600"
          )}
          onClick={handleQuickAdd}
          disabled={isInSet}
        >
          {isInSet ? (
            <Check className="w-4 h-4" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
};
