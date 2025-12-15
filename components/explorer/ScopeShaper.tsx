"use client";

import React from "react";
import { Check, X, Plus, ArrowRightLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface ScopeShaperProps {
  included: string[];
  excluded: string[];
  onToggle: (item: string, from: "included" | "excluded") => void;
}

export const ScopeShaper = ({
  included,
  excluded,
  onToggle,
}: ScopeShaperProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full min-h-[300px]">
      {/* INCLUDED COLUMN */}
      <div className="flex flex-col rounded-xl border border-emerald-100 bg-emerald-50/30 overflow-hidden">
        <div className="p-3 bg-emerald-100/50 border-b border-emerald-100 flex justify-between items-center">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-2">
            <Check className="w-3 h-3" /> Inclus
          </span>
          <Badge className="bg-white text-emerald-700 hover:bg-white">
            {included.length}
          </Badge>
        </div>
        <ScrollArea className="flex-1 p-2">
          <div className="space-y-1">
            {included.map((item, idx) => (
              <button
                key={idx}
                onClick={() => onToggle(item, "included")}
                className="w-full text-left p-3 rounded-lg bg-white border border-transparent hover:border-red-200 hover:bg-red-50 group transition-all flex items-start gap-3"
              >
                <div className="mt-0.5 shrink-0">
                  <Check className="w-4 h-4 text-emerald-500 group-hover:hidden" />
                  <ArrowRightLeft className="w-4 h-4 text-red-400 hidden group-hover:block" />
                </div>
                <span className="text-xs font-medium text-zinc-700 group-hover:text-red-700 group-hover:line-through transition-colors">
                  {item}
                </span>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* EXCLUDED COLUMN */}
      <div className="flex flex-col rounded-xl border border-zinc-200 bg-zinc-50/50 overflow-hidden">
        <div className="p-3 bg-zinc-100 border-b border-zinc-200 flex justify-between items-center">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
            <X className="w-3 h-3" /> Exclus (Options)
          </span>
          <Badge
            variant="outline"
            className="bg-white text-zinc-500 border-zinc-200"
          >
            {excluded.length}
          </Badge>
        </div>
        <ScrollArea className="flex-1 p-2">
          <div className="space-y-1">
            {excluded.map((item, idx) => (
              <button
                key={idx}
                onClick={() => onToggle(item, "excluded")}
                className="w-full text-left p-3 rounded-lg bg-white/50 border border-transparent hover:border-emerald-200 hover:bg-emerald-50 group transition-all flex items-start gap-3 opacity-75 hover:opacity-100"
              >
                <div className="mt-0.5 shrink-0">
                  <X className="w-4 h-4 text-zinc-400 group-hover:hidden" />
                  <Plus className="w-4 h-4 text-emerald-600 hidden group-hover:block" />
                </div>
                <span className="text-xs text-zinc-500 group-hover:text-emerald-800 group-hover:font-medium transition-colors">
                  {item}
                </span>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
