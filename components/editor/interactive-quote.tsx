"use client";

import React from "react";
import { Quote, LineItem } from "@/store/quote.store";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import TextareaAutosize from "react-textarea-autosize";
import { ClientSelector } from "@/components/invoice/ClientSelector";
import { ItemSelector } from "@/components/invoice/ItemSelector";

// --- DÉFINITION DES TYPES STRICTS ---

// Type pour les données renvoyées par le sélecteur de client
interface ClientSelection {
  id: string;
  name: string;
  email?: string | null;
  address?: string | null;
  siret?: string | null;
  phone?: string | null;
}

// Type pour les données renvoyées par le sélecteur d'articles
interface ItemSelection {
  id: string;
  title: string;
  description?: string | null;
  unitPriceEuros: number;
  defaultQuantity?: number;
}

interface InteractiveQuoteProps {
  quote: Quote;
  totals: { subTotal: number; taxAmount: number; totalTTC: number };
  // On remplace 'any' par 'string | number' car ce sont les seules valeurs possibles d'un input
  onUpdateField: (group: string, field: string, value: string | number) => void;
  onUpdateLineItem: (
    index: number,
    field: string,
    value: string | number
  ) => void;
  // On utilise Partial<LineItem> car on peut ajouter un item incomplet
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
  // --- HANDLERS D'INTERFACE ---

  const handleClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateField("client", e.target.name, e.target.value);
  };

  // Injection Client (Typage Strict)
  const handleSelectClient = (clientData: ClientSelection) => {
    onUpdateField("client", "name", clientData.name);
    onUpdateField("client", "email", clientData.email || "");
    onUpdateField("client", "address", clientData.address || "");
  };

  // Injection Item du Catalogue (Typage Strict)
  const handleSelectItem = (itemData: ItemSelection) => {
    // On construit un objet partiel conforme à LineItem
    const newItem: Partial<LineItem> = {
      title: itemData.title,
      subtitle: itemData.description || "",
      quantity: itemData.defaultQuantity || 1,
      unitPriceEuros: itemData.unitPriceEuros,
    };
    onAddLineItem(newItem);
  };

  const handleFinancialsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Conversion explicite pour garantir le type number
    const val = parseFloat(e.target.value);
    onUpdateField("financials", e.target.name, isNaN(val) ? 0 : val);
  };

  return (
    <div className="relative flex flex-col items-center gap-6 pb-20">
      {/* FEUILLE A4 - MOTEUR DE RENDU VISUEL */}
      <div className="w-[210mm] min-h-[297mm] bg-white shadow-2xl text-neutral-900 p-12 md:p-16 flex flex-col relative animate-in fade-in zoom-in-95 duration-300 select-none transition-all">
        {/* En-tête */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tighter mb-2">DEVIS</h1>
            <div className="text-sm text-neutral-500 font-mono space-y-1">
              <p>
                N°{" "}
                <span className="text-black font-bold">
                  {quote.quote.number}
                </span>
              </p>
              <p>
                Date :{" "}
                {new Date(quote.quote.issueDate).toLocaleDateString("fr-FR")}
              </p>
            </div>
          </div>
          <div className="text-right">
            <h3 className="font-bold text-lg">
              {quote.company.name || "Votre Entreprise"}
            </h3>
            <div className="text-sm text-neutral-500 space-y-0.5 mt-2">
              <p>{quote.company.email}</p>
              <p>{quote.company.phone}</p>
              <p className="max-w-[200px] ml-auto whitespace-pre-line">
                {quote.company.address}
              </p>
            </div>
          </div>
        </div>

        {/* --- ZONE CLIENT (INTELLIGENTE) --- */}
        <div
          className={`mb-16 group relative p-4 -mx-4 rounded-lg transition-colors border border-transparent ${
            !readOnly && "hover:bg-neutral-50 hover:border-neutral-200"
          }`}
        >
          {!readOnly && (
            <div className="absolute -top-3 left-4 bg-white px-2 text-[10px] font-bold uppercase text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              Destinataire
            </div>
          )}

          {readOnly ? (
            <div className="space-y-1">
              <div className="text-xl font-bold">
                {quote.client.name || "Nom du client"}
              </div>
              <div className="text-neutral-600">{quote.client.email}</div>
              <div className="text-neutral-600 whitespace-pre-line">
                {quote.client.address}
              </div>
            </div>
          ) : (
            <div className="relative">
              {/* AUTOMATISATION : SÉLECTEUR CLIENT */}
              <div className="w-full max-w-sm mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus-within:opacity-100">
                <ClientSelector onSelect={handleSelectClient} />
              </div>

              <input
                name="name"
                value={quote.client.name}
                onChange={handleClientChange}
                placeholder="Nom du client"
                className="w-full bg-transparent text-xl font-bold placeholder:text-neutral-300 focus:outline-none mb-1"
              />
              <input
                name="email"
                value={quote.client.email}
                onChange={handleClientChange}
                placeholder="Email"
                className="w-full bg-transparent text-neutral-600 placeholder:text-neutral-300 focus:outline-none mb-1"
              />
              <TextareaAutosize
                name="address"
                value={quote.client.address}
                onChange={(e) =>
                  onUpdateField("client", "address", e.target.value)
                }
                placeholder="Adresse complète"
                className="w-full bg-transparent text-neutral-600 placeholder:text-neutral-300 focus:outline-none resize-none"
              />
            </div>
          )}
        </div>

        {/* --- TABLEAU DES PRESTATIONS --- */}
        <div className="mb-8">
          <div className="grid grid-cols-12 border-b-2 border-black pb-2 text-xs font-bold uppercase tracking-wider">
            <div className="col-span-6">Description</div>
            <div className="col-span-2 text-center">Qté</div>
            <div className="col-span-2 text-right">Prix U.</div>
            <div className="col-span-2 text-right">Total</div>
          </div>

          <div className="divide-y divide-neutral-100">
            {quote.items.map((item: LineItem, i: number) => (
              <div
                key={i}
                className={`group grid grid-cols-12 py-4 text-sm items-start -mx-2 px-2 rounded-md transition-colors relative ${
                  !readOnly && "hover:bg-neutral-50"
                }`}
              >
                <div className="col-span-6 pr-4 space-y-1">
                  {readOnly ? (
                    <>
                      <div className="font-bold text-neutral-800">
                        {item.title}
                      </div>
                      <div className="text-neutral-500 text-xs whitespace-pre-wrap">
                        {item.subtitle}
                      </div>
                    </>
                  ) : (
                    <>
                      <input
                        value={item.title}
                        onChange={(e) =>
                          onUpdateLineItem(i, "title", e.target.value)
                        }
                        placeholder="Titre de la prestation"
                        className="w-full font-bold text-neutral-800 bg-transparent focus:outline-none placeholder:text-neutral-300"
                      />
                      <TextareaAutosize
                        value={item.subtitle}
                        onChange={(e) =>
                          onUpdateLineItem(i, "subtitle", e.target.value)
                        }
                        placeholder="Description (facultatif)"
                        className="w-full text-neutral-500 text-xs bg-transparent resize-none focus:outline-none placeholder:text-neutral-300"
                      />
                    </>
                  )}
                </div>
                <div className="col-span-2 text-center">
                  {readOnly ? (
                    <span className="text-neutral-600">{item.quantity}</span>
                  ) : (
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        onUpdateLineItem(
                          i,
                          "quantity",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="w-full text-center bg-transparent text-neutral-600 focus:outline-none"
                    />
                  )}
                </div>
                <div className="col-span-2 text-right">
                  {readOnly ? (
                    <span className="text-neutral-600">
                      {item.unitPriceEuros}
                    </span>
                  ) : (
                    <input
                      type="number"
                      value={item.unitPriceEuros}
                      onChange={(e) =>
                        onUpdateLineItem(
                          i,
                          "unitPriceEuros",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="w-full text-right bg-transparent text-neutral-600 focus:outline-none"
                    />
                  )}
                </div>
                <div className="col-span-2 text-right font-bold text-neutral-900">
                  {(item.quantity * item.unitPriceEuros).toFixed(2)} €
                </div>

                {/* Bouton Supprimer Ligne */}
                {!readOnly && (
                  <button
                    onClick={() => onRemoveLineItem(i)}
                    className="absolute -right-8 top-4 p-1.5 text-neutral-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all print:hidden"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* ACTIONS D'AJOUT (CATALOGUE OU MANUEL) */}
          {!readOnly && (
            <div className="mt-4 flex flex-col gap-2 print:hidden">
              {/* AUTOMATISATION : SÉLECTEUR ITEM */}
              <div className="w-full max-w-sm">
                <ItemSelector onSelect={handleSelectItem} />
              </div>

              <div className="flex items-center gap-2">
                <div className="h-px bg-neutral-100 flex-1"></div>
                <span className="text-[10px] text-neutral-400 uppercase">
                  OU
                </span>
                <div className="h-px bg-neutral-100 flex-1"></div>
              </div>

              <Button
                variant="ghost"
                onClick={() => onAddLineItem()} // Ajout vide
                className="w-full border border-dashed border-neutral-200 text-neutral-400 hover:text-neutral-900 hover:border-neutral-400 hover:bg-transparent"
              >
                <Plus className="w-4 h-4 mr-2" /> Ajouter une ligne vide
              </Button>
            </div>
          )}
        </div>

        {/* --- TOTAUX --- */}
        <div className="flex justify-end mt-auto pt-8 break-inside-avoid">
          <div className="w-72 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-neutral-600">Total HT</span>
              <span className="font-bold">{totals.subTotal.toFixed(2)} €</span>
            </div>

            <div className="flex justify-between text-sm text-emerald-600 items-center group relative">
              <span
                className={`border-b border-dashed border-emerald-200 ${
                  !readOnly && "cursor-help"
                }`}
              >
                Remise (€)
              </span>
              {readOnly ? (
                <span className="font-bold">
                  {quote.financials.discountAmountEuros}
                </span>
              ) : (
                <input
                  type="number"
                  name="discountAmountEuros"
                  value={quote.financials.discountAmountEuros}
                  onChange={handleFinancialsChange}
                  className="w-20 text-right bg-transparent focus:outline-none font-bold"
                />
              )}
            </div>

            <div className="flex justify-between text-sm text-neutral-500 pb-4 border-b border-neutral-200 items-center">
              <span
                className={`border-b border-dashed border-neutral-200 ${
                  !readOnly && "cursor-help"
                }`}
              >
                TVA (%)
              </span>
              {readOnly ? (
                <span>{quote.financials.vatRatePercent}</span>
              ) : (
                <input
                  type="number"
                  name="vatRatePercent"
                  value={quote.financials.vatRatePercent}
                  onChange={handleFinancialsChange}
                  className="w-16 text-right bg-transparent focus:outline-none"
                />
              )}
            </div>

            <div className="flex justify-between text-sm text-neutral-500">
              <span>Montant TVA</span>
              <span>{totals.taxAmount.toFixed(2)} €</span>
            </div>

            <div className="flex justify-between items-end">
              <span className="font-bold text-lg uppercase tracking-wider">
                Net à payer
              </span>
              <span className="font-black text-3xl">
                {totals.totalTTC.toFixed(2)} €
              </span>
            </div>
          </div>
        </div>

        {/* Pied de page */}
        <div
          className={`mt-20 pt-8 border-t-2 border-neutral-100 text-[10px] text-neutral-400 text-center uppercase tracking-widest group relative`}
        >
          {!readOnly && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-2 text-[8px] font-bold uppercase text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity">
              Mentions légales
            </div>
          )}
          {readOnly ? (
            <p className="whitespace-pre-wrap">{quote.quote.terms}</p>
          ) : (
            <TextareaAutosize
              value={quote.quote.terms}
              onChange={(e) => onUpdateField("quote", "terms", e.target.value)}
              placeholder="Conditions de paiement, mentions légales..."
              className="w-full text-center bg-transparent resize-none focus:outline-none placeholder:text-neutral-200"
            />
          )}
        </div>
      </div>
    </div>
  );
};
