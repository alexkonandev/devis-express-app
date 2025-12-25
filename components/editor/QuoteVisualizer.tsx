"use client";

import React from "react";
// On importe le composant PDF et son type pour le typage des props
import PrintableQuote, {
  ThemeConfigProp,
} from "@/components/pdf/PrintableQuote";

interface QuoteVisualizerProps {
  data: any; // ActiveQuote
  theme: ThemeConfigProp; // On reçoit l'objet complet ici aussi
  printRef: React.RefObject<HTMLDivElement>;
  zoom: number;
}

export const QuoteVisualizer = ({
  data,
  theme,
  printRef,
  zoom,
}: QuoteVisualizerProps) => {
  if (!data) return null;

  return (
    <div
      className="flex justify-center items-start pt-12 pb-32 min-h-full cursor-default select-none print:p-0 print:m-0"
      style={{
        transform: `scale(${zoom})`,
        transformOrigin: "top center",
        transition: "transform 0.1s linear",
      }}
    >
      {/* STRATÉGIE : On utilise PrintableQuote ici.
        Pourquoi ? Pour que le rendu visuel dans l'éditeur (couleurs, polices, layout)
        soit strictement identique au rendu PDF final.
      */}
      <PrintableQuote ref={printRef} quote={data} theme={theme} />
    </div>
  );
};
