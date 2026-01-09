"use client";

import React, { forwardRef, useMemo } from "react";
import { EditorActiveQuote, EditorTheme } from "@/types/editor";

interface PrintableQuoteProps {
  quote: EditorActiveQuote;
  theme: EditorTheme;
}

const PrintableQuote = forwardRef<HTMLDivElement, PrintableQuoteProps>(
  ({ quote, theme }, ref) => {
    // --- 1. CALCULS FINANCIERS STRICTS ---
    const financials = useMemo(() => {
      const subTotal = quote.items.reduce(
        (acc, item) => acc + (Number(item.quantity) * Number(item.unitPriceEuros) || 0),
        0
      );
      const discount = Number(quote.financials.discountAmountEuros) || 0;
      const taxable = Math.max(0, subTotal - discount);
      const vatRate = Number(quote.financials.vatRatePercent) || 0;
      const vatAmount = taxable * (vatRate / 100);
      
      return { subTotal, discount, taxable, vatAmount, totalTTC: taxable + vatAmount };
    }, [quote.items, quote.financials]);

    const primaryColor = theme?.color || "#000000";

    return (
      <div className="relative font-sans text-zinc-900 leading-tight">
        {/* INJECTION VARIABLES CSS */}
        <style dangerouslySetInnerHTML={{ __html: `
          .print-container {
            --brand: ${primaryColor};
            --zinc-100: #f4f4f5;
            --zinc-400: #a1a1aa;
            --zinc-500: #71717a;
            --zinc-900: #18181b;
          }
          @page { size: A4; margin: 0; }
          @media print {
            .print-container { shadow: none; margin: 0; }
          }
        `}} />

        <div
          ref={ref}
          className="print-container w-[210mm] min-h-[297mm] mx-auto bg-white flex flex-col p-16 shadow-2xl print:shadow-none transition-all"
        >
          {/* --- HEADER : BRANDING & INFO --- */}
          <div className="flex justify-between items-start mb-20">
            <div>
              <h1 className="text-4xl font-black tracking-tighter uppercase mb-2" style={{ color: 'var(--brand)' }}>
                {quote.title || "DEVIS"}
              </h1>
              <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                <span>Ref: {quote.quote.number}</span>
                <span>•</span>
                <span>Date: {quote.quote.issueDate}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-black uppercase">{quote.company.name}</div>
              <div className="text-[10px] text-zinc-500 font-medium max-w-[200px] mt-1 italic">
                {quote.company.address}<br />
                {quote.company.website}
              </div>
            </div>
          </div>

          {/* --- CONTACTS : CLIENT VS SENDER --- */}
          <div className="grid grid-cols-2 gap-10 mb-16">
            <div className="p-6 bg-zinc-50 rounded-sm border-l-4" style={{ borderColor: 'var(--brand)' }}>
              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block mb-3">Destinataire</span>
              <div className="text-lg font-black uppercase mb-1">{quote.client.name}</div>
              <div className="text-[11px] text-zinc-500 leading-relaxed font-medium">
                {quote.client.email}<br />
                {quote.client.address}
                {quote.client.siret && <div className="mt-2 text-[9px] font-mono text-zinc-400">ID: {quote.client.siret}</div>}
              </div>
            </div>
          </div>

          {/* --- TABLE : PRESTATIONS (CLEAN & BOLD) --- */}
          <div className="flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-zinc-900">
                  <th className="py-4 text-[10px] font-black uppercase tracking-widest">Description</th>
                  <th className="py-4 text-[10px] font-black uppercase tracking-widest text-center w-20">Qté</th>
                  <th className="py-4 text-[10px] font-black uppercase tracking-widest text-right w-32">Prix Unitaire</th>
                  <th className="py-4 text-[10px] font-black uppercase tracking-widest text-right w-32">Total HT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {quote.items.map((item, idx) => (
                  <tr key={idx} className="group">
                    <td className="py-6 pr-4">
                      <div className="text-[12px] font-black uppercase mb-1">{item.title}</div>
                      <div className="text-[10px] text-zinc-500 leading-snug">{item.subtitle}</div>
                    </td>
                    <td className="py-6 text-[11px] font-bold text-center text-zinc-500">x{item.quantity}</td>
                    <td className="py-6 text-[11px] font-bold text-right tabular-nums">
                      {Number(item.unitPriceEuros).toLocaleString('fr-FR', { minimumFractionDigits: 2 })}€
                    </td>
                    <td className="py-6 text-[11px] font-black text-right tabular-nums">
                      {(item.quantity * item.unitPriceEuros).toLocaleString('fr-FR', { minimumFractionDigits: 2 })}€
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* --- TOTALS BLOCK --- */}
          <div className="mt-12 flex justify-end">
            <div className="w-72 space-y-3">
              <div className="flex justify-between text-[11px] font-bold text-zinc-400 uppercase">
                <span>Sous-Total HT</span>
                <span className="tabular-nums">{financials.subTotal.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}€</span>
              </div>
              
              {financials.discount > 0 && (
                <div className="flex justify-between text-[11px] font-bold text-emerald-600 uppercase">
                  <span>Remise</span>
                  <span className="tabular-nums">-{financials.discount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}€</span>
                </div>
              )}

              <div className="flex justify-between text-[11px] font-bold text-zinc-400 uppercase">
                <span>TVA ({quote.financials.vatRatePercent}%)</span>
                <span className="tabular-nums">{financials.vatAmount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}€</span>
              </div>

              <div className="pt-4 border-t-2 border-zinc-900 flex justify-between items-end">
                <span className="text-[13px] font-black uppercase tracking-tighter">Total TTC</span>
                <span className="text-2xl font-black tabular-nums" style={{ color: 'var(--brand)' }}>
                  {financials.totalTTC.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}€
                </span>
              </div>
            </div>
          </div>

          {/* --- FOOTER : LEGAL & NOMAD FOOTPRINT --- */}
          <div className="mt-20 grid grid-cols-2 gap-10 items-end border-t border-zinc-100 pt-10">
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-300 block mb-2">Notes & Conditions</span>
              <p className="text-[10px] text-zinc-400 leading-relaxed italic">
                {quote.quote.terms || "Validité du devis : 30 jours. Début des travaux après signature et réception de l'acompte."}
              </p>
            </div>
            <div className="text-right space-y-1">
              <div className="text-[8px] font-black text-zinc-300 uppercase tracking-[0.4em]">Propulsé par</div>
              <div className="text-[10px] font-black uppercase tracking-tighter text-zinc-900">DEVIS EXPRESS STUDIO</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

PrintableQuote.displayName = "PrintableQuote";
export default PrintableQuote;