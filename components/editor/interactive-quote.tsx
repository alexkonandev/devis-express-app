"use client";

import React from "react";
import { Quote, LineItem } from "@/store/quote.store";
import {
  Plus,
  Trash2,
  GripVertical,
  FileText,
  UserCircle,
  Check,
  X,
} from "lucide-react"; // Ajout de Check et X
import { Button } from "@/components/ui/button";
import TextareaAutosize from "react-textarea-autosize";
import { ClientSelector } from "@/components/invoice/ClientSelector";
import { ItemSelector } from "@/components/invoice/ItemSelector";
import { cn } from "@/lib/utils";

// --- TYPES ---
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
  // --- HANDLERS ---
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
      // On garde uniquement la description pure ici, on n'injecte plus les bullet points dans le texte
      subtitle: itemData.salesCopy?.description || itemData.description || "",
      quantity: itemData.defaultQuantity || 1,
      unitPriceEuros: itemData.unitPriceEuros,
      // On conserve l'objet complet pour l'affichage riche
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
    <div className="relative flex flex-col items-center gap-6 pb-20 pt-10">
      {/* CANVAS A4 
          J'ai remis w-[210mm] car 300mm dépasserait lors de l'impression PDF standard A4.
          Si tu veux imprimer en A3, tu peux remettre 300mm.
      */}
      <div className="w-[210mm] min-h-[297mm] bg-white shadow-[0_35px_60px_-15px_rgba(0,0,0,0.15)] flex flex-col relative overflow-hidden transition-all duration-300">
        {/* Bande latérale */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-zinc-900 z-0"></div>

        <div className="p-[15mm] md:p-[20mm] pl-[25mm] flex flex-col h-full relative z-10">
          {/* 1. HEADER */}
          <div className="grid grid-cols-2 gap-12 mb-12 items-start">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-zinc-900 text-white flex items-center justify-center font-bold text-xl rounded-lg shadow-xl shadow-zinc-200">
                  {quote.company.name ? quote.company.name.charAt(0) : "D"}
                </div>
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-zinc-900 leading-none">
                    DEVIS
                  </h1>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded text-xs font-mono font-bold">
                      #{quote.quote.number}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right space-y-1">
              <h3 className="font-bold text-zinc-900 text-lg">
                {quote.company.name || "Votre Entreprise"}
              </h3>
              <div className="text-sm text-zinc-500 leading-relaxed">
                <p>{quote.company.email}</p>
                <p>{quote.company.phone}</p>
                <p className="whitespace-pre-line mt-1">
                  {quote.company.address}
                </p>
              </div>
            </div>
          </div>

          {/* 2. DESTINATAIRE */}
          <div className="mb-12">
            <div
              className={cn(
                "relative bg-zinc-50/80 rounded-xl p-6 border border-zinc-100 transition-all",
                !readOnly &&
                  "hover:bg-zinc-50 hover:border-zinc-300 cursor-text group"
              )}
            >
              <div className="flex items-start gap-4">
                <div className="p-2 bg-white rounded-full shadow-sm border border-zinc-100 mt-1">
                  <UserCircle className="w-5 h-5 text-zinc-400" />
                </div>
                <div className="flex-1 space-y-1 relative">
                  {!readOnly && (
                    <div className="absolute -top-10 right-0 opacity-0 group-hover:opacity-100 transition-opacity z-20 w-72">
                      <ClientSelector onSelect={handleSelectClient} />
                    </div>
                  )}
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">
                    Destinataire
                  </p>

                  {readOnly ? (
                    <>
                      <div className="text-lg font-bold text-zinc-900">
                        {quote.client.name || "Nom du client"}
                      </div>
                      <div className="text-sm text-zinc-500">
                        {quote.client.email}
                      </div>
                      <div className="text-sm text-zinc-500 whitespace-pre-line">
                        {quote.client.address}
                      </div>
                    </>
                  ) : (
                    <>
                      <input
                        name="name"
                        value={quote.client.name}
                        onChange={handleClientChange}
                        placeholder="Nom du client..."
                        className="w-full bg-transparent text-lg font-bold text-zinc-900 focus:outline-none placeholder:text-zinc-300"
                      />
                      <input
                        name="email"
                        value={quote.client.email}
                        onChange={handleClientChange}
                        placeholder="Email..."
                        className="w-full bg-transparent text-sm text-zinc-500 focus:outline-none placeholder:text-zinc-300"
                      />
                      <TextareaAutosize
                        name="address"
                        value={quote.client.address}
                        onChange={(e) =>
                          onUpdateField("client", "address", e.target.value)
                        }
                        placeholder="Adresse..."
                        className="w-full bg-transparent text-sm text-zinc-500 focus:outline-none resize-none placeholder:text-zinc-300"
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 3. PRESTATIONS (GRID & SIDE-BY-SIDE) */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-zinc-900">
              <h2 className="text-sm font-black uppercase tracking-widest text-zinc-900">
                Services & Livrables
              </h2>
            </div>

            <div className="space-y-12">
              {quote.items.map((item: LineItem, i: number) => (
                <div
                  key={i}
                  className={cn(
                    "group relative transition-all duration-300",
                    !readOnly &&
                      "hover:pl-4 hover:border-l-2 hover:border-indigo-500 hover:bg-zinc-50/50 -ml-4 p-4 rounded-r-xl"
                  )}
                >
                  {!readOnly && (
                    <div className="absolute left-[-24px] top-6 text-zinc-200 opacity-0 group-hover:opacity-100 cursor-move">
                      <GripVertical className="w-5 h-5" />
                    </div>
                  )}

                  {/* HEADER ITEM: TITRE & PRIX */}
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div className="flex-1">
                      {!readOnly ? (
                        <input
                          value={item.title}
                          onChange={(e) =>
                            onUpdateLineItem(i, "title", e.target.value)
                          }
                          placeholder="Titre de la prestation"
                          className="w-full text-xl font-bold text-zinc-900 bg-transparent focus:outline-none placeholder:text-zinc-200"
                        />
                      ) : (
                        <div className="text-xl font-bold text-zinc-900">
                          {item.title}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-mono font-bold text-zinc-900">
                        {(item.quantity * item.unitPriceEuros).toFixed(2)} €
                      </div>
                      {!readOnly && (
                        <div className="flex items-center justify-end gap-2 mt-1 text-xs text-zinc-400">
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
                            className="w-8 text-right bg-zinc-100 rounded focus:outline-none text-zinc-700"
                          />{" "}
                          x{" "}
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
                            className="w-16 text-right bg-zinc-100 rounded focus:outline-none text-zinc-700"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* DESCRIPTION TEXTUELLE */}
                  <div className="mb-6">
                    {!readOnly ? (
                      <TextareaAutosize
                        value={item.subtitle}
                        onChange={(e) =>
                          onUpdateLineItem(i, "subtitle", e.target.value)
                        }
                        placeholder="Description commerciale..."
                        className="w-full text-sm text-zinc-600 bg-transparent resize-none focus:outline-none placeholder:text-zinc-200 leading-relaxed whitespace-pre-wrap"
                      />
                    ) : (
                      <div className="text-sm text-zinc-600 leading-relaxed whitespace-pre-wrap">
                        {item.subtitle}
                      </div>
                    )}
                  </div>

                  {/* --- SECTION SIDE-BY-SIDE (INCLUS / NON-INCLUS) --- */}
                  {/* On affiche cette section seulement s'il y a des données techniques */}
                  {(item.technicalScope?.included?.length > 0 ||
                    item.technicalScope?.excluded?.length > 0) && (
                    <div className="grid grid-cols-2 gap-6 bg-zinc-50/50 rounded-lg p-4 border border-zinc-100/50">
                      {/* COLONNE GAUCHE : INCLUS */}
                      <div>
                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-zinc-200/50">
                          <div className="p-1 bg-emerald-100 text-emerald-600 rounded-full">
                            <Check className="w-3 h-3" />
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                            Inclus
                          </span>
                        </div>
                        <ul className="space-y-2">
                          {item.technicalScope.included.map(
                            (inc: string, idx: number) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2 text-xs text-zinc-600 leading-snug"
                              >
                                <span className="text-emerald-500 mt-0.5">
                                  •
                                </span>
                                <span>{inc}</span>
                              </li>
                            )
                          )}
                        </ul>
                      </div>

                      {/* COLONNE DROITE : NON INCLUS (Optionnel) */}
                      {item.technicalScope?.excluded?.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-zinc-200/50">
                            <div className="p-1 bg-rose-50 text-rose-400 rounded-full">
                              <X className="w-3 h-3" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                              Hors Périmètre
                            </span>
                          </div>
                          <ul className="space-y-2">
                            {item.technicalScope.excluded.map(
                              (exc: string, idx: number) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-2 text-xs text-zinc-400 leading-snug italic"
                                >
                                  <span className="text-zinc-300 mt-0.5">
                                    x
                                  </span>
                                  <span>{exc}</span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {!readOnly && (
                    <button
                      onClick={() => onRemoveLineItem(i)}
                      className="absolute -right-8 top-6 p-2 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all print:hidden"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* AJOUT */}
            {!readOnly && (
              <div className="mt-12 mb-12 flex flex-col gap-4 print:hidden px-4">
                <div className="w-full max-w-md mx-auto">
                  <ItemSelector onSelect={handleSelectItem} />
                </div>
                <div className="text-center">
                  <Button
                    variant="ghost"
                    onClick={() => onAddLineItem()}
                    className="text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Ajouter une ligne vide
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* 4. FOOTER */}
          <div className="mt-8 pt-8 border-t border-zinc-100 flex justify-end break-inside-avoid">
            <div className="w-full md:w-5/12 space-y-3 bg-zinc-50/50 p-6 rounded-xl">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-zinc-500">Total HT</span>
                <span className="font-bold text-zinc-900 font-mono text-lg">
                  {totals.subTotal.toFixed(2)} €
                </span>
              </div>

              {(quote.financials.discountAmountEuros > 0 || !readOnly) && (
                <div className="flex justify-between items-center text-sm">
                  <span
                    className={cn(
                      "text-zinc-500",
                      !readOnly &&
                        "border-b border-dashed border-zinc-300 cursor-help"
                    )}
                  >
                    Remise
                  </span>
                  {!readOnly ? (
                    <div className="flex items-center gap-1">
                      <span className="text-emerald-600 font-bold">-</span>
                      <input
                        type="number"
                        value={quote.financials.discountAmountEuros}
                        onChange={handleFinancialsChange}
                        name="discountAmountEuros"
                        className="w-16 text-right bg-white border border-zinc-200 rounded px-1 text-emerald-600 font-bold"
                      />
                      <span className="text-emerald-600">€</span>
                    </div>
                  ) : (
                    <span className="font-bold text-emerald-600">
                      -{quote.financials.discountAmountEuros} €
                    </span>
                  )}
                </div>
              )}

              <div className="flex justify-between items-center text-sm pb-4 border-b border-zinc-200">
                <span className="text-zinc-500">
                  TVA ({quote.financials.vatRatePercent}%)
                </span>
                <span className="text-zinc-600 font-mono">
                  {totals.taxAmount.toFixed(2)} €
                </span>
              </div>

              <div className="flex justify-between items-end pt-2">
                <span className="font-black text-sm text-zinc-900 uppercase tracking-widest">
                  Net à payer
                </span>
                <span className="font-black text-3xl text-zinc-900 tracking-tighter font-mono">
                  {totals.totalTTC.toFixed(2)} €
                </span>
              </div>
            </div>
          </div>

          {/* MENTIONS */}
          <div className="mt-16 text-center pt-8 pb-4">
            {!readOnly ? (
              <TextareaAutosize
                value={quote.quote.terms}
                onChange={(e) =>
                  onUpdateField("quote", "terms", e.target.value)
                }
                placeholder="Mentions légales..."
                className="w-full text-center bg-transparent resize-none focus:outline-none placeholder:text-zinc-200 text-xs text-zinc-400 leading-relaxed"
              />
            ) : (
              <p className="whitespace-pre-wrap text-xs text-zinc-400 leading-relaxed">
                {quote.quote.terms}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
