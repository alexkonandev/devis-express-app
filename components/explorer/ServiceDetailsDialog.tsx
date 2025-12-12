"use client";

import React, { useMemo } from "react";
import {
  Check,
  Plus,
  Tag,
  Layers,
  Info,
  CreditCard,
  FileText,
  Calculator,
} from "lucide-react";
import { UIItem } from "@/types/explorer";
import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface ServiceDetailsDialogProps {
  item: UIItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToSet: (item: UIItem) => void;
  isInSet: boolean;
}

export const ServiceDetailsDialog = ({
  item,
  isOpen,
  onClose,
  onAddToSet,
  isInSet,
}: ServiceDetailsDialogProps) => {
  if (!item) return null;

  // --- LOGIQUE FINANCIÈRE AVANCÉE ---
  const financials = useMemo(() => {
    const ht = item.defaultPrice;
    const tvaRate = 0.2; // 20% hardcodé pour l'exemple (devrait venir d'une config)
    const tvaAmount = ht * tvaRate;
    const ttc = ht + tvaAmount;

    return {
      ht: new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }).format(ht),
      tva: new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }).format(tvaAmount),
      ttc: new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
      }).format(ttc),
    };
  }, [item.defaultPrice]);

  const handleAction = () => {
    onAddToSet(item);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl p-0 gap-0 overflow-hidden bg-white border-none shadow-2xl">
        {/* HEADER */}
        <DialogHeader className="p-6 pb-4 border-b border-zinc-100 bg-zinc-50/50">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-white text-zinc-600 border-zinc-200 shadow-sm"
                >
                  <Tag className="w-3 h-3 mr-1" /> {item.category}
                </Badge>
                {item.iconName && (
                  <Badge
                    variant="secondary"
                    className="bg-indigo-50 text-indigo-700 border-indigo-100"
                  >
                    <Layers className="w-3 h-3 mr-1" /> {item.iconName}
                  </Badge>
                )}
              </div>
              <DialogTitle className="text-2xl font-bold text-zinc-900 leading-tight">
                {item.title}
              </DialogTitle>
            </div>
            <div className="text-right">
              <div className="text-3xl font-mono font-bold text-indigo-600 tracking-tight">
                {financials.ht}
              </div>
              <div className="text-[10px] text-zinc-400 uppercase font-bold mt-1 tracking-wider">
                Prix Unitaire HT
              </div>
            </div>
          </div>
          <DialogDescription className="sr-only">
            Détails techniques pour {item.title}
          </DialogDescription>
        </DialogHeader>

        {/* CONTENU */}
        <ScrollArea className="max-h-[60vh] flex flex-col bg-white">
          <div className="p-6 space-y-8">
            {/* Description */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Périmètre du service
              </h4>
              <div className="text-sm text-zinc-700 leading-7 whitespace-pre-wrap bg-zinc-50 p-5 rounded-xl border border-zinc-100">
                {item.description ||
                  "Spécifications standard appliquées. Aucune particularité technique notée."}
              </div>
            </div>

            <Separator />

            {/* SIMULATEUR FINANCIER */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                  <Info className="w-4 h-4" /> Configuration
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-center justify-between text-sm p-2 bg-zinc-50 rounded border border-zinc-100">
                    <span className="text-zinc-600">Quantité par défaut</span>
                    <span className="font-mono font-bold">1.0</span>
                  </li>
                  <li className="flex items-center justify-between text-sm p-2 bg-zinc-50 rounded border border-zinc-100">
                    <span className="text-zinc-600">Type de facturation</span>
                    <span className="font-medium">Au forfait</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                  <Calculator className="w-4 h-4" /> Projection Coût
                </h4>
                <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-100 space-y-2">
                  <div className="flex justify-between text-xs text-zinc-500">
                    <span>Base HT</span>
                    <span className="font-mono">{financials.ht}</span>
                  </div>
                  <div className="flex justify-between text-xs text-zinc-500">
                    <span>TVA (20%)</span>
                    <span className="font-mono">{financials.tva}</span>
                  </div>
                  <Separator className="bg-indigo-200/50" />
                  <div className="flex justify-between text-sm font-bold text-indigo-900 pt-1">
                    <span>Total TTC estimé</span>
                    <span className="font-mono">{financials.ttc}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* FOOTER */}
        <DialogFooter className="p-4 border-t border-zinc-200 bg-zinc-50 flex sm:justify-between items-center gap-4">
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-900 font-medium"
          >
            Fermer sans ajouter
          </Button>

          <Button
            onClick={handleAction}
            disabled={isInSet}
            className={cn(
              "min-w-[200px] shadow-lg transition-all font-bold h-11",
              isInSet
                ? "bg-emerald-600 text-white"
                : "bg-zinc-900 hover:bg-indigo-600 text-white"
            )}
          >
            {isInSet ? (
              <>
                <Check className="w-4 h-4 mr-2" /> Service Déjà Sélectionné
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" /> Ajouter au Devis
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
