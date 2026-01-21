"use client";

import React, { useTransition } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CatalogLayout } from "./components/catalog-layout";
import { CatalogExplorer } from "./components/catalog-explorer";
import { CatalogInspector } from "./components/catalog-inspector";
import { CatalogIntelligence } from "./components/catalog-intelligence"; // Unité d'Analyse
import { CatalogItem } from "@/types/catalog";
import { cn } from "@/lib/utils";

interface CatalogViewProps {
  initialItems: CatalogItem[];
}

export default function CatalogView({ initialItems }: CatalogViewProps) {
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Pilotage par URL : Source de vérité unique pour l'état de l'application
  const activeId = searchParams.get("id");
  const selectedItem = initialItems.find((item) => item.id === activeId);

  const handleSelectItem = (id: string) => {
    if (id === activeId) return;
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.set("id", id);
      replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <CatalogLayout
      explorer={
        <CatalogExplorer
          items={initialItems}
          activeId={activeId}
          onSelect={handleSelectItem}
        />
      }
      inspector={
        <div className="h-full bg-white overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeId || "empty"}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: isPending ? 0.5 : 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.15, ease: "circOut" }}
              className="h-full"
            >
              {selectedItem ? (
                <CatalogInspector key={selectedItem.id} item={selectedItem} />
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-10 grayscale bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] bg-[size:30px_30px]">
                  <span className="text-[10px] font-black uppercase tracking-[0.6em]">
                    Attente_Signal_Radar
                  </span>
                  <div className="w-px h-16 bg-slate-950 mt-8" />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      }
      intelligence={
        <div
          className={cn(
            "h-full transition-opacity duration-300",
            isPending ? "opacity-30" : "opacity-100"
          )}
        >
          {selectedItem ? (
            <CatalogIntelligence
              key={`intel-${selectedItem.id}`}
              item={selectedItem}
            />
          ) : (
            <div className="h-full flex items-center justify-center bg-slate-950 text-white opacity-5">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] rotate-90">
                Intelligence_Offline
              </span>
            </div>
          )}
        </div>
      }
    />
  );
}
