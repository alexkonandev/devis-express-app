"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Slash } from "lucide-react";
import { cn } from "@/lib/utils";

// --- LE DICTIONNAIRE INTELLIGENT ---
const PATH_MAP: Record<string, string> = {
  dashboard: "Tableau de bord",
  clients: "Clients",
  items: "Catalogue",
  devis: "Gestion des Devis",
  new: "Nouveau Projet",
  settings: "Paramètres",
  editor: "Studio Éditeur", // <--- La traduction critique
  preview: "Aperçu Client",
};

export function AppBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter((item) => item !== "");

  if (segments.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-1">
      {segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join("/")}`;
        const isLast = index === segments.length - 1;

        // 1. Traduction
        let label = PATH_MAP[segment];

        // 2. Gestion des IDs (si pas dans le dictionnaire et long)
        if (!label) {
          // Si c'est un ID long (ex: cl6...) on met une version courte ou générique
          label =
            segment.length > 20
              ? `#${segment.slice(-6).toUpperCase()}`
              : segment;
        }

        return (
          <div key={href} className="flex items-center">
            {/* Séparateur (Sauf pour le premier, car on a le logo avant) */}
            <ChevronRight className="w-3 h-3 text-zinc-300 mx-1" />

            {isLast ? (
              <span className="text-[11px] font-bold text-zinc-900 capitalize select-none bg-zinc-100 px-1.5 py-0.5 rounded-[4px] border border-zinc-200/50">
                {label}
              </span>
            ) : (
              <Link
                href={href}
                className="text-[11px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors capitalize hover:underline decoration-zinc-300 underline-offset-4"
              >
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
