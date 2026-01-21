"use client";

import  { useState, useTransition } from "react";
import {
  Hash,
  Zap,
  Repeat,
  Layers,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CatalogItem } from "@/types/catalog";
import { upsertCatalogOfferAction } from "@/actions/catalog-action";
import { toast } from "sonner";

interface CatalogInspectorProps {
  item: CatalogItem;
}

/**
 * INSPECTEUR DE SERVICE
 * On utilise 'key' dans le parent pour réinitialiser l'état local sans useEffect.
 */
export function CatalogInspector({ item }: CatalogInspectorProps) {
  const [isPending, startTransition] = useTransition();
  // L'état est initialisé une seule fois par montage.
  // Le changement d'item via 'key' dans CatalogView forcera le remontage.
  const [price, setPrice] = useState(item.unitPrice.toString());

  const handlePriceUpdate = () => {
    const newPrice = parseFloat(price);
    if (isNaN(newPrice) || newPrice === item.unitPrice) return;

    startTransition(async () => {
      // Extraction propre sans 'any' pour satisfaire le linter et TypeScript
      const { ...payload } = item;

      const res = await upsertCatalogOfferAction({
        ...payload,
        unitPrice: newPrice,
      });

      if (res.success) {
        toast.success("TARIF_SYNCHRONISÉ");
      } else {
        toast.error("ÉCHEC_MIS_À_JOUR", { description: res.error });
        setPrice(item.unitPrice.toString());
      }
    });
  };

  // Type Guard pour extraire le businessModel en string affichable
  const displayModel =
    "businessModel" in item ? String(item.businessModel) : null;

  return (
    <div className="flex flex-col h-full bg-white relative">
      <header className="p-10 border-b border-slate-100 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:40px_40px]">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-slate-950 text-white p-1">
            <Hash size={16} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
            System_Asset_Specs // {item.id.slice(0, 12)}
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black px-2 py-0.5 bg-indigo-600 text-white uppercase tracking-widest">
              {item.category}
            </span>
            {item.isPremium && (
              <span className="text-[10px] font-black px-2 py-0.5 border-2 border-slate-950 text-slate-950 uppercase tracking-widest">
                Premium_Tier
              </span>
            )}
          </div>
          <h2 className="text-[56px] font-black uppercase tracking-tighter text-slate-950 leading-[0.85] italic">
            {item.title}
          </h2>
        </div>
      </header>

      <main className="flex-1 p-10 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Tag size={14} className="text-indigo-600" />
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-950">
                Configuration_Prix_Unitaire_HT
              </label>
            </div>
            <div className="relative group">
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                onBlur={handlePriceUpdate}
                disabled={isPending}
                className={cn(
                  "w-full bg-slate-50 border-b-4 border-slate-200 p-8 text-[48px] font-mono font-black text-slate-950 outline-none transition-all",
                  "focus:bg-white focus:border-indigo-600 focus:shadow-xl",
                  isPending && "opacity-50"
                )}
              />
              <span className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-300 font-black text-xl">
                EUR
              </span>
            </div>
          </section>

          <section className="border-l border-slate-100 pl-10 space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Modèle_Business
              </span>
              <div className="flex items-center gap-2">
                {displayModel ? (
                  <div className="flex items-center gap-2 bg-slate-950 text-white px-3 py-1.5">
                    {displayModel === "RECURRING" && <Repeat size={14} />}
                    {displayModel === "PROJECT" && <Zap size={14} />}
                    {displayModel === "UNIT" && <Layers size={14} />}
                    <span className="text-[12px] font-black uppercase tracking-tighter">
                      {displayModel}
                    </span>
                  </div>
                ) : (
                  <span className="text-[12px] font-bold text-slate-400 italic">
                    NON_DÉFINI
                  </span>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-3 h-3 rotate-45",
              isPending ? "bg-amber-500 animate-spin" : "bg-emerald-500"
            )}
          />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
            {isPending ? "Sync_Transaction..." : "System_Idle_Ready"}
          </span>
        </div>
      </footer>
    </div>
  );
}
