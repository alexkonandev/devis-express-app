"use client";

import { useState, useEffect, useMemo } from "react";
import { UIItem } from "@/types/explorer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Check } from "lucide-react";

// Imports des composants modulaires
import { EditableText } from "./EditableText";
import { TierSelector, TierType } from "./TierSelector";
import { ScopeShaper } from "./ScopeShaper";
import { BillingManager, BillingMode } from "./BillingManager";
import { LiveReceipt } from "./LiveReceipt";

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
  // ===========================================================================
  // 1. HOOKS (TOUJOURS EN PREMIER)
  // ===========================================================================

  // State: Méta-données éditables
  const [title, setTitle] = useState("");

  // State: Configuration Business
  const [tier, setTier] = useState<TierType>("senior");
  const [price, setPrice] = useState(0);
  const [billingMode, setBillingMode] = useState<BillingMode>("fixed");
  const [quantity, setQuantity] = useState(1);

  // State: Périmètre (Scope)
  const [scope, setScope] = useState<{
    included: string[];
    excluded: string[];
  }>({
    included: [],
    excluded: [],
  });

  // Effect: Initialisation / Reset des données
  // C'est ici qu'on charge les données de l'item dans le state local
  useEffect(() => {
    if (isOpen && item) {
      setTitle(item.title);

      // Sécurisation des données du scope (évite le bug d'affichage vide)
      setScope({
        included: item.technicalScope?.included
          ? [...item.technicalScope.included]
          : [],
        excluded: item.technicalScope?.excluded
          ? [...item.technicalScope.excluded]
          : [],
      });

      // Reset du Tier et Prix
      setTier("senior");
      if (item.pricing?.tiers) {
        setPrice(item.pricing.tiers.senior.avg);
      } else {
        setPrice(item.defaultPrice || 0);
      }

      setQuantity(1);
      setBillingMode("fixed");
    }
  }, [isOpen, item]);

  // Derived Data: Bornes de prix (Memoized pour la perf)
  const tierBounds = useMemo(() => {
    if (!item?.pricing?.tiers) return { min: 0, max: 10000 };
    return {
      min: item.pricing.tiers[tier].min,
      max: item.pricing.tiers[tier].max,
    };
  }, [item?.pricing, tier]);

  const isMarketRising = item?.marketContext?.trend === "rising";

  // ===========================================================================
  // 2. HANDLERS (LOGIQUE MÉTIER)
  // ===========================================================================

  const handleTierChange = (newTier: TierType) => {
    if (!item) return;
    setTier(newTier);
    if (item.pricing?.tiers) {
      setPrice(item.pricing.tiers[newTier].avg);
    }
  };

  const handleScopeToggle = (text: string, from: "included" | "excluded") => {
    if (from === "included") {
      // Downsell: On enlève de l'inclus vers l'exclus
      setScope((prev) => ({
        included: prev.included.filter((t) => t !== text),
        excluded: [text, ...prev.excluded],
      }));
    } else {
      // Upsell: On ajoute de l'exclus vers l'inclus
      setScope((prev) => ({
        excluded: prev.excluded.filter((t) => t !== text),
        included: [text, ...prev.included],
      }));
    }
  };

  const handleApplyMarketIncrease = () => {
    setPrice((prev) => Math.floor(prev * 1.15));
  };

  const handleConfirm = () => {
    if (!item) return;

    // SNAPSHOT DU PRIX
    // On prend le prix calculé par le slider/tier (price) et on l'injecte comme prix par défaut
    const configuredPrice = price;

    const finalItem: UIItem = {
      ...item,
      // On ajoute le Tier au titre pour que ce soit clair dans le devis
      title: `${title} [${tier.toUpperCase()}]`,

      // CRUCIAL : C'est ce prix qui sera sauvegardé dans unitPriceEuros
      defaultPrice: configuredPrice * quantity,

      technicalScope: scope,
      // On peut aussi sauvegarder la quantité si le modèle de données le permettait
    };

    onAddToSet(finalItem);
    onClose();
  };

  // ===========================================================================
  // 3. RENDU CONDITIONNEL (SÉCURITÉ)
  // ===========================================================================

  // Si pas d'item, on rend null MAIS les hooks ont déjà été déclarés au dessus -> Pas d'erreur React.
  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-7xl p-0 gap-0 bg-zinc-50 overflow-hidden h-[90vh] flex flex-col border-none shadow-2xl">
        {/* --- HEADER --- */}
        <DialogHeader className="px-8 py-6 bg-white border-b border-zinc-200 shrink-0">
          <div className="flex justify-between items-start">
            <div className="space-y-2 w-full max-w-3xl">
              <div className="flex items-center gap-3">
                <Badge
                  variant="secondary"
                  className="bg-zinc-100 text-zinc-600 border-zinc-200"
                >
                  {item.category}
                </Badge>

                {/* Market Insight (Prop #6) */}
                {isMarketRising && (
                  <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-500">
                    <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200 gap-1 shadow-sm">
                      <TrendingUp className="w-3 h-3" /> Forte Demande
                    </Badge>
                    <button
                      onClick={handleApplyMarketIncrease}
                      className="text-[10px] font-bold text-indigo-600 underline hover:text-indigo-800 transition-colors"
                    >
                      Appliquer +15%
                    </button>
                  </div>
                )}
              </div>

              {/* Copywriting Editor (Prop #4) */}
              <div className="pr-4">
                <DialogTitle>
                  <EditableText
                    as="h1"
                    value={title}
                    onSave={setTitle}
                    className="text-3xl font-bold text-zinc-900 tracking-tight"
                  />
                </DialogTitle>
              </div>
            </div>

            <div className="hidden lg:block text-right">
              <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                Offre N°
              </div>
              <div className="font-mono text-zinc-600">
                {item.id.slice(0, 8)}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 flex overflow-hidden">
          {/* --- GAUCHE: SCOPE SHAPER (Main Content) --- */}
          <div className="flex-1 overflow-y-auto p-8 bg-white scrollbar-thin scrollbar-thumb-zinc-200">
            <div className="max-w-4xl mx-auto space-y-8 pb-10">
              {/* Description Contextuelle */}
              <div className="p-4 bg-zinc-50 border border-zinc-100 rounded-lg text-sm text-zinc-600 leading-relaxed">
                {item.salesCopy?.description || item.description}
              </div>

              {/* Scope Shaper (Prop #2) */}
              <section>
                <h3 className="text-sm font-bold text-zinc-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-indigo-500 rounded-full"></span>
                  Périmètre Technique
                </h3>
                <ScopeShaper
                  included={scope.included}
                  excluded={scope.excluded}
                  onToggle={handleScopeToggle}
                />
              </section>
            </div>
          </div>

          {/* --- DROITE: CONFIGURATION SIDEBAR --- */}
          <div className="w-full lg:w-[420px] bg-zinc-50/80 border-l border-zinc-200 flex flex-col shadow-[inset_10px_0_30px_-15px_rgba(0,0,0,0.03)] backdrop-blur-sm z-10">
            <div className="p-6 space-y-8 flex-1 overflow-y-auto scrollbar-thin">
              {/* Tier Selector (Prop #1) */}
              <section>
                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">
                  Niveau d'expertise
                </h4>
                <TierSelector currentTier={tier} onSelect={handleTierChange} />
              </section>

              {/* Billing & Slider (Prop #7 & #3) */}
              <section>
                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">
                  Modèle Économique
                </h4>
                <BillingManager
                  mode={billingMode}
                  setMode={setBillingMode}
                  quantity={quantity}
                  setQuantity={setQuantity}
                  price={price}
                  setPrice={setPrice}
                  minPrice={tierBounds.min}
                  maxPrice={tierBounds.max}
                />
              </section>

              {/* Live Receipt (Prop #5) */}
              <LiveReceipt
                basePrice={price}
                quantity={quantity}
                mode={billingMode}
                optionsCount={scope.included.length}
              />
            </div>

            {/* Footer Action */}
            <div className="p-6 bg-white border-t border-zinc-200">
              <Button
                onClick={handleConfirm}
                disabled={isInSet}
                className="w-full h-12 text-sm font-bold uppercase tracking-widest bg-zinc-900 hover:bg-indigo-600 shadow-lg hover:shadow-indigo-200 transition-all duration-300"
              >
                {isInSet ? (
                  <>
                    <Check className="mr-2 h-4 w-4" /> Offre Configurée
                  </>
                ) : (
                  "Valider la configuration"
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
