"use client";

import React from "react";
import { Quote, LineItem } from "@/store/quote.store";
import {
  Plus,
  Trash2,
  GripVertical,
  Check,
  X,
  ArrowRight,
  Hash,
  CalendarDays,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import TextareaAutosize from "react-textarea-autosize";
import { ClientSelector } from "@/components/invoice/ClientSelector";
import { ItemSelector } from "@/components/invoice/ItemSelector";
import { cn } from "@/lib/utils";

// --- TYPES (Inchangés) ---
interface ClientSelection {
  id: string;
  name: string;
  email?: string | null;
  address?: string | null;
  siret?: string | null;
  phone?: string | null;
}

interface ItemSelection {
  id: string;
  title: string;
  description?: string | null;
  unitPriceEuros: number;
  defaultQuantity?: number;
  technicalScope?: any;
  pricing?: any;
  salesCopy?: any;
}

interface InteractiveQuoteProps {
  quote: Quote;
  totals: { subTotal: number; taxAmount: number; totalTTC: number };
  onUpdateField: (group: string, field: string, value: string | number) => void;
  onUpdateLineItem: (
    index: number,
    field: string,
    value: string | number
  ) => void;
  onAddLineItem: (item?: Partial<LineItem>) => void;
  onRemoveLineItem: (index: number) => void;
  readOnly?: boolean;
}

export const InteractiveQuote = ({
  quote,
  totals,
  onUpdateField,
  onUpdateLineItem,
  onAddLineItem,
  onRemoveLineItem,
  readOnly = false,
}: InteractiveQuoteProps) => {
  // --- HANDLERS (Inchangés) ---
  const handleClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateField("client", e.target.name, e.target.value);
  };

  const handleSelectClient = (clientData: ClientSelection) => {
    onUpdateField("client", "name", clientData.name);
    onUpdateField("client", "email", clientData.email || "");
    onUpdateField("client", "address", clientData.address || "");
  };

  const handleSelectItem = (itemData: ItemSelection) => {
    const newItem: Partial<LineItem> = {
      title: itemData.title,
      subtitle: itemData.salesCopy?.description || itemData.description || "",
      quantity: itemData.defaultQuantity || 1,
      unitPriceEuros: itemData.unitPriceEuros,
      technicalScope: itemData.technicalScope,
      pricing: itemData.pricing,
      salesCopy: itemData.salesCopy,
    };
    onAddLineItem(newItem);
  };

  const handleFinancialsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onUpdateField("financials", e.target.name, isNaN(val) ? 0 : val);
  };

  return (
    <div className="relative flex flex-col items-center gap-8 pb-20 pt-8 font-sans antialiased text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* --- DOCUMENT CANVAS (A4) --- */}
      <div className="w-[210mm] min-h-[297mm] bg-white shadow-2xl flex flex-col relative overflow-hidden ring-1 ring-neutral-900/5">
        {/* TOP ACCENT (Brand Authority) */}
        <div className="h-2 w-full bg-neutral-900" />

        <div className="p-12 md:p-16 flex flex-col h-full relative z-10">
          {/* 1. HEADER: STRATEGIC SPLIT */}
          <div className="flex justify-between items-start mb-16 border-b border-neutral-100 pb-8">
            {/* Left: Provider Identity */}
            <div className="w-1/2 pr-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 bg-neutral-900 text-white flex items-center justify-center font-bold text-lg rounded-md">
                  {quote.company.name ? quote.company.name.charAt(0) : "D"}
                </div>
                <span className="font-bold text-xl tracking-tight">
                  {quote.company.name || "Votre Entreprise"}
                </span>
              </div>
              <div className="text-xs text-neutral-500 space-y-1 font-medium leading-relaxed">
                <p className="flex items-center gap-2">
                  <Building2 className="w-3 h-3 text-neutral-400" />
                  {quote.company.email || "email@company.com"}
                </p>
                <p className="pl-5">{quote.company.phone}</p>
                <p className="pl-5 whitespace-pre-line opacity-75">
                  {quote.company.address}
                </p>
              </div>
            </div>

            {/* Right: Meta Data (Technical Look) */}
            <div className="w-1/2 flex flex-col items-end">
              <h1 className="text-4xl font-black tracking-tighter text-neutral-900 mb-6">
                DEVIS
              </h1>

              <div className="flex flex-col gap-2 text-right">
                <div className="group flex items-center justify-end gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                    Réf.
                  </span>
                  <div className="flex items-center gap-2 bg-neutral-50 px-3 py-1 rounded border border-neutral-100">
                    <Hash className="w-3 h-3 text-neutral-400" />
                    {!readOnly ? (
                      <input
                        value={quote.quote.number}
                        onChange={(e) =>
                          onUpdateField("quote", "number", e.target.value)
                        }
                        className="bg-transparent text-right font-mono text-sm font-medium text-neutral-900 w-24 focus:outline-none"
                      />
                    ) : (
                      <span className="font-mono text-sm font-medium">
                        {quote.quote.number}
                      </span>
                    )}
                  </div>
                </div>

                <div className="group flex items-center justify-end gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                    Date
                  </span>
                  <div className="flex items-center gap-2 bg-neutral-50 px-3 py-1 rounded border border-neutral-100">
                    <CalendarDays className="w-3 h-3 text-neutral-400" />
                    <span className="font-mono text-sm font-medium">
                      {new Date(quote.quote.issueDate).toLocaleDateString(
                        "fr-FR"
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. CLIENT: THE TARGET */}
          <div className="mb-16">
            <div
              className={cn(
                "relative group transition-all duration-200",
                !readOnly &&
                  "hover:bg-neutral-50/50 -mx-4 px-4 py-4 rounded-lg border border-transparent hover:border-neutral-100"
              )}
            >
              <div className="flex items-start justify-between">
                <div className="max-w-md w-full relative">
                  {!readOnly && (
                    <div className="absolute -top-10 left-0 opacity-0 group-hover:opacity-100 transition-opacity z-20 w-72">
                      <ClientSelector onSelect={handleSelectClient} />
                    </div>
                  )}

                  <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-4 flex items-center gap-2">
                    <ArrowRight className="w-3 h-3" /> Pour le compte de
                  </p>

                  {readOnly ? (
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-neutral-900 tracking-tight">
                        {quote.client.name || "Client Name"}
                      </div>
                      <div className="text-sm text-neutral-500">
                        {quote.client.email}
                      </div>
                      <div className="text-sm text-neutral-500 whitespace-pre-line mt-2 border-l-2 border-neutral-200 pl-3">
                        {quote.client.address}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <input
                        name="name"
                        value={quote.client.name}
                        onChange={handleClientChange}
                        placeholder="Nom du client..."
                        className="w-full bg-transparent text-2xl font-bold text-neutral-900 placeholder:text-neutral-200 focus:outline-none"
                      />
                      <input
                        name="email"
                        value={quote.client.email}
                        onChange={handleClientChange}
                        placeholder="Email contact..."
                        className="w-full bg-transparent text-sm text-neutral-600 placeholder:text-neutral-200 focus:outline-none"
                      />
                      <TextareaAutosize
                        name="address"
                        value={quote.client.address}
                        onChange={(e) =>
                          onUpdateField("client", "address", e.target.value)
                        }
                        placeholder="Adresse de facturation..."
                        className="w-full bg-transparent text-sm text-neutral-500 resize-none placeholder:text-neutral-200 focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 3. LINE ITEMS: THE VALUE STACK */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-xs font-black uppercase tracking-widest text-neutral-900 bg-neutral-100 px-2 py-1 rounded">
                Scope of Work
              </h2>
              <div className="h-px flex-1 bg-neutral-100"></div>
            </div>

            <div className="space-y-10">
              {quote.items.map((item: LineItem, i: number) => (
                <div
                  key={i}
                  className={cn(
                    "group relative transition-all duration-300 pb-10 border-b border-dashed border-neutral-200 last:border-0",
                    !readOnly &&
                      "hover:bg-neutral-50/40 -mx-6 px-6 py-6 rounded-xl"
                  )}
                >
                  {!readOnly && (
                    <div className="absolute left-[-16px] top-8 text-neutral-300 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing">
                      <GripVertical className="w-4 h-4" />
                    </div>
                  )}

                  {/* Top Row: Title & Price */}
                  <div className="flex justify-between items-start gap-8 mb-4">
                    <div className="flex-1">
                      {!readOnly ? (
                        <input
                          value={item.title}
                          onChange={(e) =>
                            onUpdateLineItem(i, "title", e.target.value)
                          }
                          placeholder="Service Title"
                          className="w-full text-lg font-bold text-neutral-900 bg-transparent focus:outline-none placeholder:text-neutral-200"
                        />
                      ) : (
                        <h3 className="text-lg font-bold text-neutral-900">
                          {item.title}
                        </h3>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="font-mono font-bold text-lg text-neutral-900">
                        {(item.quantity * item.unitPriceEuros).toFixed(2)} €
                      </div>
                      {/* Subtle Quantity Editor */}
                      {!readOnly && (
                        <div className="flex justify-end mt-1">
                          <div className="inline-flex items-center gap-1 bg-white border border-neutral-200 rounded px-1.5 py-0.5 shadow-sm">
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                onUpdateLineItem(
                                  i,
                                  "quantity",
                                  parseFloat(e.target.value)
                                )
                              }
                              className="w-6 text-center text-xs font-mono bg-transparent focus:outline-none"
                            />
                            <span className="text-[10px] text-neutral-400">
                              x
                            </span>
                            <input
                              type="number"
                              value={item.unitPriceEuros}
                              onChange={(e) =>
                                onUpdateLineItem(
                                  i,
                                  "unitPriceEuros",
                                  parseFloat(e.target.value)
                                )
                              }
                              className="w-12 text-right text-xs font-mono bg-transparent focus:outline-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-6 max-w-2xl">
                    {!readOnly ? (
                      <TextareaAutosize
                        value={item.subtitle}
                        onChange={(e) =>
                          onUpdateLineItem(i, "subtitle", e.target.value)
                        }
                        placeholder="Add a detailed description to increase value perception..."
                        className="w-full text-sm text-neutral-500 bg-transparent resize-none focus:outline-none placeholder:text-neutral-200 leading-relaxed"
                      />
                    ) : (
                      <p className="text-sm text-neutral-600 leading-relaxed">
                        {item.subtitle}
                      </p>
                    )}
                  </div>

                  {/* TECHNICAL SCOPE (Visual Cards) */}
                  {(item.technicalScope?.included?.length > 0 ||
                    item.technicalScope?.excluded?.length > 0) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      {/* INCLUDED: High Value Perception */}
                      {item.technicalScope.included.length > 0 && (
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-3 block">
                            Inclus
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {item.technicalScope.included.map(
                              (inc: string, idx: number) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2 bg-emerald-50/50 border border-emerald-100/50 px-3 py-1.5 rounded-md"
                                >
                                  <div className="bg-emerald-100 rounded-full p-0.5">
                                    <Check className="w-2.5 h-2.5 text-emerald-600" />
                                  </div>
                                  <span className="text-xs font-medium text-emerald-900">
                                    {inc}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}

                      {/* EXCLUDED: Subtle Clarity */}
                      {item.technicalScope?.excluded?.length > 0 && (
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-3 block">
                            Non Inclus
                          </span>
                          <div className="space-y-1">
                            {item.technicalScope.excluded.map(
                              (exc: string, idx: number) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2 px-2 py-1 opacity-60"
                                >
                                  <X className="w-3 h-3 text-neutral-400" />
                                  <span className="text-xs text-neutral-500 italic">
                                    {exc}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Delete Action */}
                  {!readOnly && (
                    <button
                      onClick={() => onRemoveLineItem(i)}
                      className="absolute right-0 top-8 p-2 text-neutral-200 hover:text-red-500 transition-colors print:hidden"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* ADD ACTION */}
            {!readOnly && (
              <div className="mt-8 mb-12 flex flex-col gap-4 print:hidden px-4">
                <div className="w-full max-w-md mx-auto transform hover:scale-[1.01] transition-transform">
                  <ItemSelector onSelect={handleSelectItem} />
                </div>
                <Button
                  variant="ghost"
                  onClick={() => onAddLineItem()}
                  className="mx-auto text-neutral-400 hover:text-neutral-900 hover:bg-neutral-50"
                >
                  <Plus className="w-4 h-4 mr-2" /> Nouvelle ligne vide
                </Button>
              </div>
            )}
          </div>

          {/* 4. FINANCIAL SUMMARY (The Anchor) */}
          <div className="mt-12 break-inside-avoid">
            <div className="flex justify-end">
              <div className="w-full md:w-1/2 bg-neutral-50 rounded-2xl p-8 border border-neutral-100">
                {/* Subtotal */}
                <div className="flex justify-between items-center mb-4 text-sm">
                  <span className="text-neutral-500 font-medium">
                    Sous-total
                  </span>
                  <span className="font-mono text-neutral-900 font-bold">
                    {totals.subTotal.toFixed(2)} €
                  </span>
                </div>

                {/* Discount */}
                {(quote.financials.discountAmountEuros > 0 || !readOnly) && (
                  <div className="flex justify-between items-center mb-4 text-sm group">
                    <span
                      className={cn(
                        "text-neutral-500",
                        !readOnly &&
                          "border-b border-dashed border-neutral-300 cursor-help"
                      )}
                    >
                      Remise
                    </span>
                    <div className="flex items-center gap-2">
                      {!readOnly ? (
                        <div className="flex items-center bg-white px-2 py-0.5 rounded border border-neutral-200">
                          <span className="text-emerald-600 font-bold mr-1">
                            -
                          </span>
                          <input
                            type="number"
                            value={quote.financials.discountAmountEuros}
                            onChange={handleFinancialsChange}
                            name="discountAmountEuros"
                            className="w-16 text-right font-mono text-emerald-600 font-bold bg-transparent focus:outline-none"
                          />
                          <span className="text-emerald-600 text-xs">€</span>
                        </div>
                      ) : (
                        <span className="font-mono text-emerald-600 font-bold">
                          -{quote.financials.discountAmountEuros.toFixed(2)} €
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* VAT */}
                <div className="flex justify-between items-center mb-6 text-sm pb-6 border-b border-neutral-200">
                  <span className="text-neutral-500">
                    TVA ({quote.financials.vatRatePercent}%)
                  </span>
                  <span className="font-mono text-neutral-600">
                    {totals.taxAmount.toFixed(2)} €
                  </span>
                </div>

                {/* TOTAL */}
                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                    Total TTC
                  </span>
                  <span className="text-4xl font-black tracking-tighter text-neutral-900 font-mono">
                    {totals.totalTTC.toFixed(2)} €
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* MENTIONS LEGALES */}
          <div className="mt-20 pt-8 border-t border-neutral-100 text-center">
            {!readOnly ? (
              <TextareaAutosize
                value={quote.quote.terms}
                onChange={(e) =>
                  onUpdateField("quote", "terms", e.target.value)
                }
                placeholder="Conditions de paiement, validité, IBAN..."
                className="w-full text-center bg-transparent resize-none focus:outline-none placeholder:text-neutral-200 text-[10px] text-neutral-400 leading-relaxed font-mono"
              />
            ) : (
              <p className="whitespace-pre-wrap text-[10px] text-neutral-400 leading-relaxed font-mono">
                {quote.quote.terms}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
