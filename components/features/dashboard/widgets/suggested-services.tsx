"use client";

import Link from "next/link";
import { Plus, Zap, ArrowRight } from "lucide-react";

interface SuggestedService {
  id: string;
  title: string;
  price: number;
  category: string;
}

interface SuggestedServicesProps {
  services: SuggestedService[];
}

export function SuggestedServices({ services }: SuggestedServicesProps) {
  if (!services || services.length === 0) return null;

  return (
    <div className="flex flex-col gap-6 font-sans">
      {/* LABEL SECTION : Intelligence Actionnable */}
      <div className="flex items-center gap-3 px-1">
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[--primary]/10">
          <Zap className="w-3.5 h-3.5 text-[--primary]" />
        </div>
        <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[--foreground]/50">
          Templates de services suggérés
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className="group relative p-6 bg-white border border-[--border] rounded-[10px] hover:border-[--primary] hover:shadow-xl hover:shadow-[--primary]/5 transition-all duration-300 flex flex-col justify-between min-h-45"
          >
            <div className="flex justify-between items-start">
              {/* Badge Catégorie : Standard Expert */}
              <span className="text-[9px] font-black bg-[--foreground] text-white px-2 py-1 rounded-lg uppercase tracking-wider">
                {service.category}
              </span>

              {/* Prix : JetBrains Mono pour la valeur marchande */}
              <span className="text-sm font-bold text-[--foreground] font-mono tabular-nums bg-[--muted] px-2 py-1 rounded-lg">
                {new Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: "EUR",
                  maximumFractionDigits: 0,
                }).format(service.price)}
              </span>
            </div>

            {/* Titre : Figtree ExtraBold pour l'impact */}
            <h3 className="text-lg font-extrabold text-[--foreground] leading-tight mt-6 mb-8 group-hover:text-[--primary] transition-colors">
              {service.title}
            </h3>

            <Link
              href={`/editor?templateId=${service.id}`}
              className="w-full h-11 bg-[--muted] hover:bg-[--primary] text-[--foreground] hover:text-[--primary-fg] rounded-xl flex items-center justify-center gap-2 transition-all duration-200 font-bold group/btn"
            >
              <Plus className="w-4 h-4 transition-transform group-hover/btn:rotate-90" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Utiliser ce template
              </span>
              <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
