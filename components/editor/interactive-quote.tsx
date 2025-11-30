"use client";

import React, { useTransition } from "react";
import { Quote, LineItem } from "@/store/quote.store";
import { Plus, Trash2, Save, Loader2 } from "lucide-react"; // Ajout d'icônes
import { Button } from "@/components/ui/button";
import TextareaAutosize from "react-textarea-autosize";
import { saveDevisAction, QuotePayload } from "../../app/(app)/devis/actions"; // Import de l'action
import { useRouter } from "next/navigation";

interface InteractiveQuoteProps {
  quote: Quote;
  totals: { subTotal: number; taxAmount: number; totalTTC: number };
  onUpdateField: (group: string, field: string, value: any) => void;
  onUpdateLineItem: (index: number, field: string, value: any) => void;
  onAddLineItem: () => void;
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
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // --- LOGIQUE DE SAUVEGARDE (Server Action) ---
  const handleSave = () => {
    startTransition(async () => {
      // 1. Construction du Payload pour le Backend (Nettoyage des données)
      const payload: QuotePayload = {
        id: quote.id, // Si vide, c'est une création
        number: quote.quote.number,
        // Conversion de la date string en Date object pour Prisma
        issueDate: new Date(quote.quote.issueDate || Date.now()),
        terms: quote.quote.terms,
        totalTTC: totals.totalTTC, // On sauvegarde le total calculé

        financials: {
          vatRatePercent: quote.financials.vatRatePercent,
          discountAmountEuros: quote.financials.discountAmountEuros,
        },
        client: {
          name: quote.client.name,
          email: quote.client.email,
          address: quote.client.address,
        },
        items: quote.items.map((item) => ({
          title: item.title,
          quantity: item.quantity,
          unitPriceEuros: item.unitPriceEuros,
          subtitle: item.subtitle,
        })),
      };

      // 2. Appel du Server Action
      const result = await saveDevisAction(payload);

      if (result.success) {
        // Feedback V1 rapide (alert) - À remplacer par un Toast plus tard
        // Si c'était une création, on pourrait rediriger ou mettre à jour l'URL avec l'ID
        if (!quote.id && result.devisId) {
          // Mise à jour de l'URL sans rechargement complet si nécessaire,
          // ou simplement laisser l'utilisateur continuer.
          console.log("Devis créé avec ID:", result.devisId);
        }
        alert("✅ Devis sauvegardé avec succès !");
        router.refresh(); // Rafraîchir les données serveur (Dashboard, etc.)
      } else {
        alert(`❌ Erreur lors de la sauvegarde : ${result.error}`);
      }
    });
  };

  // --- HANDLERS D'INTERFACE ---
  const handleClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateField("client", e.target.name, e.target.value);
  };

  const handleFinancialsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value) || 0;
    onUpdateField("financials", e.target.name, val);
  };

  return (
    <div className="relative flex flex-col items-center gap-6 pb-20">
     

      {/* FEUILLE A4 */}
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
              <p>Date : {quote.quote.issueDate}</p>
            </div>
          </div>
          <div className="text-right">
            <h3 className="font-bold text-lg">
              {quote.company.name || "Votre Entreprise"}
            </h3>
            <div className="text-sm text-neutral-500 space-y-0.5 mt-2">
              <p>{quote.company.email}</p>
              <p>{quote.company.phone}</p>
              <p className="max-w-[200px] ml-auto">{quote.company.address}</p>
            </div>
          </div>
        </div>

        {/* Client - Editable */}
        <div
          className={`mb-16 group relative p-4 -mx-4 rounded-lg transition-colors border border-transparent ${
            !readOnly && "hover:bg-neutral-50 hover:border-neutral-200"
          }`}
        >
          {!readOnly && (
            <div className="absolute -top-3 left-4 bg-white px-2 text-[10px] font-bold uppercase text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity">
              Destinataire
            </div>
          )}
          {readOnly ? (
            <div className="space-y-1">
              <div className="text-xl font-bold">
                {quote.client.name || "Nom du client"}
              </div>
              <div className="text-neutral-600">{quote.client.email}</div>
              <div className="text-neutral-600">{quote.client.address}</div>
            </div>
          ) : (
            <>
              <input
                name="name"
                value={quote.client.name}
                onChange={handleClientChange}
                placeholder="Nom du client"
                className="w-full bg-transparent text-xl font-bold placeholder:text-neutral-300 focus:outline-none"
              />
              <input
                name="email"
                value={quote.client.email}
                onChange={handleClientChange}
                placeholder="Email"
                className="w-full bg-transparent text-neutral-600 placeholder:text-neutral-300 focus:outline-none"
              />
              <input
                name="address"
                value={quote.client.address}
                onChange={handleClientChange}
                placeholder="Adresse"
                className="w-full bg-transparent text-neutral-600 placeholder:text-neutral-300 focus:outline-none"
              />
            </>
          )}
        </div>

        {/* Tableau */}
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
                        placeholder="Description détaillée (optionnelle)"
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
                          parseFloat(e.target.value)
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
                          parseFloat(e.target.value)
                        )
                      }
                      className="w-full text-right bg-transparent text-neutral-600 focus:outline-none"
                    />
                  )}
                </div>
                <div className="col-span-2 text-right font-bold text-neutral-900">
                  {(item.quantity * item.unitPriceEuros).toFixed(2)} €
                </div>

                {/* Delete Button */}
                {!readOnly && (
                  <button
                    onClick={() => onRemoveLineItem(i)}
                    className="absolute -right-8 top-4 p-1.5 text-neutral-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {!readOnly && (
            <Button
              variant="ghost"
              onClick={onAddLineItem}
              className="w-full mt-2 border border-dashed border-neutral-200 text-neutral-400 hover:text-neutral-900 hover:border-neutral-400 hover:bg-transparent"
            >
              <Plus className="w-4 h-4 mr-2" /> Ajouter une ligne
            </Button>
          )}
        </div>

        {/* Totaux */}
        <div className="flex justify-end mt-auto pt-8">
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

        {/* Pied de page - Editable */}
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
