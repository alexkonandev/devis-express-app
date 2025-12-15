"use client";

import React, { useMemo } from "react";
import {
  Plus,
  Check,
  ArrowRight,
  GripVertical,
  TrendingUp,
  MoreHorizontal,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UIItem } from "@/types/explorer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  // 1. CALCUL DE LA PLAGE DE PRIX (Range Strategy)
  // Au lieu d'un prix fixe, on montre l'étendue du marché.
  const priceDisplay = useMemo(() => {
    const pricing = item.pricing;
    const format = (n: number) =>
      new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
      }).format(n);

    if (pricing?.tiers) {
      const min = pricing.tiers.junior.min;
      const max = pricing.tiers.expert.max;
      return `${format(min)} — ${format(max)}`;
    }

    // Fallback si pas de tiers (flat fee simple)
    return format(item.defaultPrice);
  }, [item.pricing, item.defaultPrice]);

  // 2. DONNÉES RICHES (Sécurisées)
  // On s'assure que salesCopy existe, sinon fallback sur titre
  const headline = item.salesCopy?.headline;
  const benefits = item.salesCopy?.key_benefits?.slice(0, 3) || [];
  const trend = item.marketContext?.trend;

  // Drag logic
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("application/json", JSON.stringify(item));
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div
      draggable="true"
      onDragStart={handleDragStart}
      onClick={() => onViewDetails(item)}
      className={cn(
        "group relative flex flex-col justify-between h-[320px] w-full p-5 bg-white rounded-xl border transition-all duration-300 select-none cursor-pointer",
        isInSet
          ? "border-indigo-200 bg-indigo-50/30 shadow-inner"
          : "border-zinc-200 hover:border-indigo-400 hover:shadow-xl hover:-translate-y-1"
      )}
    >
      {/* Grip pour le Drag */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <GripVertical className="w-4 h-4" />
      </div>

      {/* --- HEADER : Market Context & Category --- */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-2">
          <Badge
            variant="outline"
            className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 bg-zinc-50 border-zinc-200"
          >
            {item.subcategory || item.category}
          </Badge>
          {trend === "rising" && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="bg-amber-100 text-amber-600 p-1 rounded-full animate-pulse">
                    <TrendingUp className="w-3 h-3" />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="text-xs bg-amber-900 text-white border-none">
                  Marché en forte demande
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      {/* --- BODY : Value Proposition --- */}
      <div className="flex-1 flex flex-col">
        <h4
          className={cn(
            "font-bold text-base leading-tight mb-2 transition-colors",
            isInSet
              ? "text-indigo-900"
              : "text-zinc-900 group-hover:text-indigo-600"
          )}
        >
          {item.title}
        </h4>

        {/* Headline Marketing (Si dispo) */}
        {headline && (
          <p className="text-xs text-zinc-500 italic mb-4 line-clamp-2 leading-relaxed">
            "{headline}"
          </p>
        )}

        {/* Bénéfices (Checklist) */}
        {benefits.length > 0 ? (
          <div className="mt-auto space-y-1.5">
            {benefits.map((benefit, i) => (
              <div
                key={i}
                className="flex items-start gap-2 text-[11px] text-zinc-600 font-medium"
              >
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="leading-tight line-clamp-1">{benefit}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-auto flex items-center gap-2 text-xs text-zinc-400 italic">
            <MoreHorizontal className="w-4 h-4" />
            <span>Détails techniques disponibles</span>
          </div>
        )}
      </div>

      {/* --- FOOTER : Pricing Strategy --- */}
      <div className="mt-5 pt-4 border-t border-dashed border-zinc-100">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider mb-0.5">
              Estimation Marché
            </p>
            <div className="font-mono text-sm font-bold text-zinc-800 bg-zinc-50 px-2 py-1 rounded inline-block border border-zinc-200 group-hover:border-indigo-200 group-hover:bg-indigo-50 group-hover:text-indigo-700 transition-colors">
              {priceDisplay}
            </div>
          </div>

          <Button
            size="icon"
            className={cn(
              "h-9 w-9 rounded-xl shadow-sm transition-all",
              isInSet
                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                : "bg-zinc-900 text-white hover:bg-indigo-600 shadow-lg shadow-zinc-200"
            )}
            onClick={(e) => {
              e.stopPropagation();
              onAddToSet(item);
            }}
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
    </div>
  );
};
