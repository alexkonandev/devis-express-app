"use client";

import Link from "next/link";
import { Plus, Zap } from "lucide-react";
interface SuggestedService {
  id: string;
  title: string;
  price: number; // Changé de unitPriceEuros -> price
  category: string; // Ajouté pour correspondre au retour backend
}

interface SuggestedServicesProps {
  services: SuggestedService[];
}

export function SuggestedServices({ services }: SuggestedServicesProps) {
  if (!services || services.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 px-1">
        <Zap className="w-3 h-3 text-zinc-400" />
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
          Templates de services suggérés
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="group p-6 bg-white border border-zinc-200 rounded-sm hover:border-zinc-900 transition-all flex flex-col justify-between min-h-40"
          >
            <div className="flex justify-between items-start">
              {/* On affiche la catégorie puisque le billingModel n'est pas renvoyé par l'action */}
              <span className="text-[9px] font-black border border-zinc-900 px-1.5 py-0.5 uppercase tracking-tighter text-zinc-900">
                {service.category}
              </span>
              <span className="text-sm font-bold text-zinc-900 font-mono">
                {new Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: "EUR",
                  maximumFractionDigits: 0,
                }).format(service.price)}
              </span>
            </div>

            <h3 className="text-sm font-black uppercase italic leading-tight mt-4 mb-6 max-w-50">
              {service.title}
            </h3>

            <Link
              href={`/editor?templateId=${service.id}`}
              className="w-full py-2.5 border border-zinc-200 group-hover:border-zinc-900 flex items-center justify-center gap-2 transition-all bg-white text-zinc-900 no-underline"
            >
              <Plus className="w-3 h-3" />
              <span className="text-[9px] font-bold uppercase tracking-widest">
                Utiliser ce template
              </span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
