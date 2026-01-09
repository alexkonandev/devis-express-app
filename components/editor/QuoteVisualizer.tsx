"use client";

import React from "react";
import PrintableQuote from "@/components/pdf/printable-quote";

// --- TYPES STRICTS (Zéro Any - Alignement DB/Interface) ---
import { EditorActiveQuote, EditorTheme } from "@/types/editor";

interface QuoteVisualizerProps {
  data: EditorActiveQuote;
  theme: EditorTheme;
  printRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Composant de prévisualisation du devis.
 * Gère l'affichage dynamique dans le studio et le fallback en cas de DB vide.
 */
export const QuoteVisualizer = ({
  data,
  theme,
  printRef,
}: QuoteVisualizerProps) => {
  // Sécurité : Si les données du devis ne sont pas encore chargées
  if (!data) {
    return (
      <div className="p-20 text-zinc-400 font-black uppercase tracking-widest text-center border-2 border-dashed border-zinc-100 rounded-xl">
        Initialisation des données...
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start cursor-default select-none print:p-0 print:m-0 animate-in fade-in duration-500">
      <PrintableQuote
        ref={printRef}
        quote={data}
        // ✅ GESTION DU ZERO-DATA STATE :
        // Si aucune donnée n'est en DB (theme undefined), on injecte un fallback
        // pour que le devis s'affiche immédiatement sans erreur TS.
        theme={
          theme || {
            id: "default-fallback",
            name: "Design Standard",
            baseLayout: "swiss",
            color: "#18181b",
            config: {},
          }
        }
      />
    </div>
  );
};
