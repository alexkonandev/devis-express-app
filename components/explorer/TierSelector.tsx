"use client";

import React from "react";
import { Shield, Crosshair, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

export type TierType = "junior" | "senior" | "expert";

interface TierSelectorProps {
  currentTier: TierType;
  onSelect: (tier: TierType) => void;
}

export const TierSelector = ({ currentTier, onSelect }: TierSelectorProps) => {
  const tiers = [
    {
      id: "junior",
      label: "Junior",
      sub: "Pénétration",
      icon: Shield,
      color: "blue",
      activeClass: "border-blue-500 bg-blue-50/10 ring-2 ring-blue-100",
      iconColor: "text-blue-500",
    },
    {
      id: "senior",
      label: "Senior",
      sub: "Standard",
      icon: Crosshair,
      color: "indigo",
      activeClass: "border-indigo-500 bg-indigo-50/10 ring-2 ring-indigo-100",
      iconColor: "text-indigo-500",
    },
    {
      id: "expert",
      label: "Expert",
      sub: "Premium",
      icon: Crown,
      color: "purple",
      activeClass: "border-purple-500 bg-purple-50/10 ring-2 ring-purple-100",
      iconColor: "text-purple-500",
    },
  ] as const;

  return (
    <div className="grid grid-cols-3 gap-3">
      {tiers.map((t) => {
        const isActive = currentTier === t.id;
        const Icon = t.icon;

        return (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            className={cn(
              "relative flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-300 ease-out",
              isActive
                ? t.activeClass
                : "bg-white border-zinc-100 text-zinc-400 hover:border-zinc-300 hover:bg-zinc-50"
            )}
          >
            <Icon
              className={cn(
                "w-6 h-6 mb-2 transition-colors",
                isActive ? t.iconColor : "text-zinc-300"
              )}
            />
            <span
              className={cn(
                "text-xs font-bold uppercase tracking-wider",
                isActive ? "text-zinc-900" : "text-zinc-400"
              )}
            >
              {t.label}
            </span>
            <span className="text-[10px] font-medium opacity-70 mt-1">
              {t.sub}
            </span>
          </button>
        );
      })}
    </div>
  );
};
