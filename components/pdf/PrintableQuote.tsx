"use client";

import React, { forwardRef } from "react";
import { Quote } from "@/store/quote.store";
import { cn } from "@/lib/utils";

// 1. UTILITAIRES
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(price);
};

const formatDate = (date: string | Date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// 2. CONFIGURATION DES THÈMES
const THEME_CONFIG = {
  minimalist: {
    container: "bg-white font-sans text-neutral-900",
    header: "border-b pb-8 border-neutral-200",
    headerTitle: "text-neutral-900",
    metaLabel: "text-neutral-500",
    metaValue: "text-neutral-900 font-medium",
    sectionTitle:
      "text-xs font-bold uppercase tracking-widest text-neutral-500 mb-4",
    tableHeader: "border-b border-neutral-200 bg-neutral-50 text-neutral-500",
    tableRow: "border-b border-neutral-100",
    totalBox: "bg-neutral-50 border border-neutral-200",
    accentColor: "text-neutral-900",
  },
  executive: {
    container: "bg-white font-sans text-slate-900",
    header: "bg-slate-50 p-8 mb-8 border-b border-slate-200",
    headerTitle: "text-blue-900",
    metaLabel: "text-blue-400",
    metaValue: "text-blue-900 font-bold",
    sectionTitle:
      "text-xs font-bold uppercase tracking-widest text-blue-800 mb-4 border-b border-blue-100 pb-2",
    tableHeader: "bg-blue-900 text-white",
    tableRow: "border-b border-blue-50 even:bg-slate-50",
    totalBox: "bg-slate-50 border border-blue-100 rounded-lg",
    accentColor: "text-blue-700",
  },
  bold: {
    container: "bg-white font-sans text-black",
    header: "bg-black text-white p-8 mb-8",
    headerTitle: "text-white",
    metaLabel: "text-neutral-400",
    metaValue: "text-white font-mono",
    sectionTitle:
      "text-xl font-black uppercase tracking-tight text-black mb-4 decoration-4 underline decoration-yellow-400 underline-offset-4",
    tableHeader: "bg-black text-white border-b-4 border-yellow-400",
    tableRow: "border-b-2 border-black font-medium",
    totalBox: "bg-black text-white border-4 border-black",
    accentColor: "text-black",
  },
};

interface PrintableQuoteProps {
  quote: Quote;
  theme: "minimalist" | "executive" | "bold";
}

// 3. LE COMPOSANT D'IMPRESSION
const PrintableQuote = forwardRef<HTMLDivElement, PrintableQuoteProps>(
  ({ quote, theme }, ref) => {
    const t = THEME_CONFIG[theme] || THEME_CONFIG.minimalist;

    const subTotal = quote.items.reduce(
      (acc, item) => acc + item.quantity * item.unitPriceEuros,
      0
    );
    const taxAmount = subTotal * (quote.financials.vatRatePercent / 100);
    const totalTTC =
      subTotal + taxAmount - quote.financials.discountAmountEuros;

    return (
      <div>
        {/* Style CSS pour forcer le format A4 et LES POLICES lors de l'impression */}
        <style type="text/css" media="print">
          {`
            @page { size: A4; margin: 0; }
            
            body { 
                -webkit-print-color-adjust: exact; 
                print-color-adjust: exact;
                /* On force l'utilisation de Figtree */
                font-family: 'Figtree', sans-serif !important; 
            }

            /* DÉCLARATION FORMELLE DE FIGTREE POUR L'INTÉGRATION PDF */
            /* Regular */
            @font-face {
              font-family: 'Figtree';
              src: url('https://fonts.gstatic.com/s/figtree/v5/_Xmz-HUzqDCFdgfMm4S9Fr8.ttf') format('truetype');
              font-weight: 400;
              font-style: normal;
              font-display: swap;
            }
            
            /* Bold */
            @font-face {
              font-family: 'Figtree';
              src: url('https://fonts.gstatic.com/s/figtree/v5/_Xmz-HUzqDCFdgfMm4S9Fr8.ttf') format('truetype'); /* Note: Google utilise souvent le même fichier variable, mais déclarer explicitement le poids aide */
              font-weight: 700;
              font-style: normal;
              font-display: swap;
            }
          `}
        </style>

        <div
          ref={ref}
          className={cn(
            "w-[210mm] min-h-[297mm] mx-auto p-[15mm] flex flex-col relative bg-white shadow-sm",
            t.container
          )}
          style={{ fontFamily: "'Figtree', sans-serif" }} // Backup inline style
        >
          {/* --- HEADER --- */}
          <header className={cn("flex justify-between items-start", t.header)}>
            <div>
              <h1
                className={cn(
                  "text-4xl font-black uppercase leading-none mb-2",
                  t.headerTitle
                )}
              >
                Devis
              </h1>
              <div className="flex gap-6 mt-4">
                <div>
                  <p
                    className={cn(
                      "text-[10px] uppercase font-bold",
                      t.metaLabel
                    )}
                  >
                    Numéro
                  </p>
                  <p className={cn("text-sm", t.metaValue)}>
                    #{quote.quote.number}
                  </p>
                </div>
                <div>
                  <p
                    className={cn(
                      "text-[10px] uppercase font-bold",
                      t.metaLabel
                    )}
                  >
                    Date
                  </p>
                  <p className={cn("text-sm", t.metaValue)}>
                    {formatDate(quote.quote.issueDate)}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-right">
              <h2 className={cn("text-lg font-bold", t.headerTitle)}>
                {quote.company.name || "Votre Entreprise"}
              </h2>
              <div className={cn("text-xs space-y-1 mt-1 opacity-80")}>
                <p>{quote.company.email}</p>
                <p>{quote.company.phone}</p>
                <p className="max-w-[200px] ml-auto">{quote.company.address}</p>
              </div>
            </div>
          </header>

          {/* --- ADRESSES --- */}
          <section className="flex justify-between mb-12 px-2">
            <div className="w-[45%]">
              <h3 className={t.sectionTitle}>Émetteur</h3>
              <div className="text-sm leading-relaxed opacity-90">
                <p className="font-bold">{quote.company.name}</p>
                <p>{quote.company.address}</p>
              </div>
            </div>

            <div className="w-[45%]">
              <h3 className={t.sectionTitle}>Client</h3>
              <div className="text-sm leading-relaxed opacity-90">
                <p className="font-bold text-lg mb-1">{quote.client.name}</p>
                <p>{quote.client.email}</p>
                <p>{quote.client.address}</p>
              </div>
            </div>
          </section>

          {/* --- TABLEAU --- */}
          <section className="mb-8 flex-grow">
            <table className="w-full text-sm">
              <thead className={t.tableHeader}>
                <tr>
                  <th className="py-3 px-4 text-left font-bold uppercase text-[10px] tracking-wider w-[50%]">
                    Description
                  </th>
                  <th className="py-3 px-4 text-center font-bold uppercase text-[10px] tracking-wider w-[15%]">
                    Qté
                  </th>
                  <th className="py-3 px-4 text-right font-bold uppercase text-[10px] tracking-wider w-[15%]">
                    Prix U.
                  </th>
                  <th className="py-3 px-4 text-right font-bold uppercase text-[10px] tracking-wider w-[20%]">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {quote.items.map((item, index) => (
                  <tr key={index} className={t.tableRow}>
                    <td className="py-4 px-4 align-top">
                      <p className="font-bold">{item.title}</p>
                      {item.subtitle && (
                        <p className="text-xs opacity-60 mt-1 whitespace-pre-wrap">
                          {item.subtitle}
                        </p>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center align-top font-mono">
                      {item.quantity}
                    </td>
                    <td className="py-4 px-4 text-right align-top font-mono">
                      {formatPrice(item.unitPriceEuros)}
                    </td>
                    <td className="py-4 px-4 text-right align-top font-mono font-bold">
                      {formatPrice(item.quantity * item.unitPriceEuros)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* --- TOTAUX --- */}
          <section className="flex justify-end mb-12">
            <div className={cn("w-[50%] p-6", t.totalBox)}>
              <div className="flex justify-between mb-2 text-sm">
                <span className="opacity-70">Total HT</span>
                <span className="font-mono font-medium">
                  {formatPrice(subTotal)}
                </span>
              </div>

              {quote.financials.discountAmountEuros > 0 && (
                <div className="flex justify-between mb-2 text-sm text-green-600">
                  <span>Remise</span>
                  <span className="font-mono font-medium">
                    - {formatPrice(quote.financials.discountAmountEuros)}
                  </span>
                </div>
              )}

              <div className="flex justify-between mb-4 text-sm">
                <span className="opacity-70">
                  TVA ({quote.financials.vatRatePercent}%)
                </span>
                <span className="font-mono font-medium">
                  {formatPrice(taxAmount)}
                </span>
              </div>

              <div
                className={cn(
                  "flex justify-between pt-4 border-t border-current items-center"
                )}
              >
                <span className="font-bold uppercase tracking-widest text-sm">
                  Net à payer
                </span>
                <span
                  className={cn(
                    "text-2xl font-black font-mono",
                    t.accentColor === "text-black"
                      ? "text-white"
                      : t.accentColor
                  )}
                >
                  {formatPrice(totalTTC)}
                </span>
              </div>
            </div>
          </section>

          {/* --- FOOTER --- */}
          <footer className="text-center text-[10px] opacity-50 uppercase tracking-widest mt-auto pt-8 border-t border-neutral-200">
            <p className="mb-1">
              {quote.quote.terms || "Merci de votre confiance."}
            </p>
            <p>{quote.company.name} — Généré par Devis Express</p>
          </footer>
        </div>
      </div>
    );
  }
);

PrintableQuote.displayName = "PrintableQuote";
export default PrintableQuote;
