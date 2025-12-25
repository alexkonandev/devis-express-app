"use client";

import { forwardRef, useMemo } from "react";
import { getLayout, DEFAULT_VARIABLES } from "./themes/registry";
import { ThemeVariables } from "./themes/types";
import { cn } from "@/lib/utils";
import { QuoteHeader } from "./components/QuoteHeader";
import { QuoteTable } from "./components/QuoteTable";
import { QuoteTotals } from "./components/QuoteTotals";

// --- TYPES ---
interface QuoteItem {
  title: string;
  subtitle: string;
  quantity: number;
  unitPriceEuros: number;
}

interface ActiveQuote {
  company: {
    name: string;
    email: string;
    phone: string;
    address?: string;
    siret?: string;
    website?: string;
  };
  client: { name: string; email: string; address: string };
  quote: { number: string; issueDate: string | Date; terms: string };
  financials: { vatRatePercent: number; discountAmountEuros: number };
  items: QuoteItem[];
}

// L'interface de l'objet Theme tel qu'il sort de la DB (via l'action)
export interface ThemeConfigProp {
  id: string;
  baseLayout: string;
  config: any; // JSON Prisma contenant colors, typography, etc.
}

interface PrintableQuoteProps {
  quote: ActiveQuote;
  theme: ThemeConfigProp; // On exige l'objet complet
}

const PrintableQuote = forwardRef<HTMLDivElement, PrintableQuoteProps>(
  ({ quote, theme }, ref) => {
    // 1. STRUCTURE (Layout via Registry)
    // On mappe "swiss" -> swissLayout object
    const layout = getLayout(theme.baseLayout || "swiss");

    // 2. APPARENCE (Config via DB)
    // On caste la config JSON en types connus
    const dbConfig = theme.config as Partial<ThemeVariables>;

    // Fusion avec les valeurs par défaut pour éviter tout crash visuel
    const variables: ThemeVariables = {
      colors: { ...DEFAULT_VARIABLES.colors, ...dbConfig?.colors },
      typography: { ...DEFAULT_VARIABLES.typography, ...dbConfig?.typography },
      borderRadius: dbConfig?.borderRadius || DEFAULT_VARIABLES.borderRadius,
    };

    // 3. LOGIQUE MÉTIER (Calculs)
    const totals = useMemo(() => {
      const subTotal = (quote.items || []).reduce(
        (acc, item) =>
          acc + (Number(item.quantity) * Number(item.unitPriceEuros) || 0),
        0
      );
      const discount = Number(quote.financials?.discountAmountEuros) || 0;
      const vatRate = Number(quote.financials?.vatRatePercent) || 0;
      const taxable = Math.max(0, subTotal - discount);
      const taxAmount = taxable * (vatRate / 100);
      return {
        subTotal,
        taxAmount,
        totalTTC: taxable + taxAmount,
        discount,
        vatRate,
      };
    }, [quote.items, quote.financials]);

    return (
      <div className="relative">
        {/* INJECTION CSS DYNAMIQUE : Le coeur du système */}
        <style jsx global>{`
          .theme-scope-${theme.id} {
            --primary: ${variables.colors.primary};
            --secondary: ${variables.colors.secondary};
            --text: ${variables.colors.text};
            --bg: ${variables.colors.bg};
            --border: ${variables.colors.border};

            --font-family: ${variables.typography.fontFamily};
            --heading-weight: ${variables.typography.headingWeight};

            --radius: ${variables.borderRadius};
          }
        `}</style>

        {/* Chargement conditionnel de la police Google Fonts */}
        {variables.typography.fontUrl && (
          <link rel="stylesheet" href={variables.typography.fontUrl} />
        )}

        <div
          ref={ref}
          id="printable-content" // ID pour l'impression
          className={cn(
            `theme-scope-${theme.id}`, // Application du Scope CSS
            "w-[210mm] min-h-[297mm] mx-auto flex flex-col transition-all duration-300 shadow-xl print:shadow-none print:m-0",
            layout.styles.container // Application des classes Tailwind du Layout
          )}
        >
          {/* HEADER */}
          <QuoteHeader layout={layout} quote={quote} />

          {/* CLIENT & META */}
          <div className="mb-10 flex flex-col gap-2">
            <span className="text-[9px] font-bold uppercase tracking-widest opacity-40">
              Destinataire
            </span>
            <div
              className={layout.styles.header.title
                .replace("text-7xl", "text-xl")
                .replace("text-5xl", "text-xl")
                .replace("text-4xl", "text-xl")}
            >
              {quote.client.name || "Nom du Client"}
            </div>
            <div className="text-xs opacity-70 whitespace-pre-line leading-relaxed max-w-sm">
              {quote.client.address || "Adresse..."}
              {quote.client.email && (
                <p className="mt-1 font-bold italic">{quote.client.email}</p>
              )}
            </div>
          </div>

          {/* TOTALS (Top) */}
          {layout.layoutConfig.totalPosition === "hero-top" && (
            <QuoteTotals layout={layout} totals={totals} />
          )}

          {/* TABLEAU */}
          <div className="flex-1">
            <QuoteTable layout={layout} quote={quote} />
          </div>

          {/* TOTALS (Bottom) */}
          {layout.layoutConfig.totalPosition !== "hero-top" && (
            <div className="mt-8 flex justify-end">
              <QuoteTotals layout={layout} totals={totals} />
            </div>
          )}

          {/* FOOTER */}
          <footer className={layout.styles.footer}>
            <div className="max-w-[70%] text-left">
              <span className="opacity-40 block mb-1">
                Conditions & Paiement
              </span>
              <p className="normal-case opacity-80 leading-snug">
                {quote.quote.terms ||
                  "Paiement à réception de facture. Validité 30 jours."}
              </p>
            </div>
            <div className="text-right self-end opacity-40">
              {quote.company.name} • {quote.company.website || "Studio"}
            </div>
          </footer>
        </div>
      </div>
    );
  }
);

PrintableQuote.displayName = "PrintableQuote";
export default PrintableQuote;
