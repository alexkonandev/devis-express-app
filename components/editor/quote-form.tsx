// @/components/editor/quote-form.tsx
import React from "react";
import { Quote, LineItem } from "@/store/quote.store";
import {
  Plus,
  Trash2,
  Calendar,
  Hash,
  User,
  Building2,
  CreditCard,
  ChevronDown,
  AlignLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import TextareaAutosize from "react-textarea-autosize";
import { cn } from "@/lib/utils";

interface QuoteFormProps {
  quote: Quote;
  onUpdateField: (group: string, field: string, value: string | number) => void;
  onUpdateLineItem: (
    index: number,
    field: string,
    value: string | number
  ) => void;
  onAddLineItem: () => void;
  onRemoveLineItem: (index: number) => void;
}

export const QuoteForm = ({
  quote,
  onUpdateField,
  onUpdateLineItem,
  onAddLineItem,
  onRemoveLineItem,
}: QuoteFormProps) => {
  // Styles communs pour les inputs "Clean"
  const cleanInput =
    "border-0 border-b border-zinc-200 rounded-none px-0 focus-visible:ring-0 focus-visible:border-zinc-900 bg-transparent placeholder:text-zinc-300 transition-colors";
  const sectionTitle =
    "text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2";

  return (
    <div className="space-y-10">
      {/* HEADER FORM */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-zinc-900 mb-2">
          Éditeur
        </h1>
        <p className="text-sm text-zinc-500">
          Modifiez les données à gauche, visualisez à droite.
        </p>
      </div>

      <Accordion
        type="multiple"
        defaultValue={["identity", "client", "items", "financials"]}
        className="w-full space-y-4"
      >
        {/* 1. IDENTITÉ & DATES */}
        <AccordionItem
          value="identity"
          className="border rounded-xl px-4 shadow-sm bg-white"
        >
          <AccordionTrigger className="hover:no-underline py-4">
            <span className="font-bold text-sm flex items-center gap-2">
              <Hash className="w-4 h-4 text-zinc-400" /> Identifiants
            </span>
          </AccordionTrigger>
          <AccordionContent className="pt-0 pb-6 grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <Label className="text-xs text-zinc-400">Numéro</Label>
              <Input
                value={quote.quote.number}
                onChange={(e) =>
                  onUpdateField("quote", "number", e.target.value)
                }
                className={cleanInput}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-zinc-400">Date d'émission</Label>
              <Input
                type="date"
                value={
                  quote.quote.issueDate
                    ? new Date(quote.quote.issueDate)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  onUpdateField("quote", "issueDate", e.target.value)
                }
                className={cleanInput}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* 2. CLIENT */}
        <AccordionItem
          value="client"
          className="border rounded-xl px-4 shadow-sm bg-white"
        >
          <AccordionTrigger className="hover:no-underline py-4">
            <span className="font-bold text-sm flex items-center gap-2">
              <User className="w-4 h-4 text-zinc-400" /> Client
            </span>
          </AccordionTrigger>
          <AccordionContent className="pt-0 pb-6 space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1 col-span-2">
                <Input
                  placeholder="Nom du client / Entreprise"
                  value={quote.client.name}
                  name="name"
                  onChange={(e) =>
                    onUpdateField("client", "name", e.target.value)
                  }
                  className={cn(cleanInput, "text-lg font-bold")}
                />
              </div>
              <div className="space-y-1">
                <Input
                  placeholder="Email contact"
                  value={quote.client.email}
                  name="email"
                  onChange={(e) =>
                    onUpdateField("client", "email", e.target.value)
                  }
                  className={cleanInput}
                />
              </div>
              <div className="space-y-1">
                <Input
                  placeholder="Téléphone (Optionnel)"
                  className={cleanInput}
                />
              </div>
            </div>
            <TextareaAutosize
              placeholder="Adresse complète..."
              value={quote.client.address}
              onChange={(e) =>
                onUpdateField("client", "address", e.target.value)
              }
              className={cn(
                cleanInput,
                "w-full resize-none text-sm min-h-[60px]"
              )}
            />
          </AccordionContent>
        </AccordionItem>

        {/* 3. PRESTATIONS (LE COEUR) */}
        <AccordionItem
          value="items"
          className="border rounded-xl px-4 shadow-sm bg-white border-l-4 border-l-zinc-900"
        >
          <AccordionTrigger className="hover:no-underline py-4">
            <span className="font-bold text-sm flex items-center gap-2">
              <AlignLeft className="w-4 h-4 text-zinc-400" /> Prestations (
              {quote.items.length})
            </span>
          </AccordionTrigger>
          <AccordionContent className="pt-0 pb-6 space-y-6">
            {quote.items.map((item, i) => (
              <div
                key={i}
                className="group relative pl-4 border-l-2 border-zinc-100 hover:border-indigo-500 transition-colors py-2"
              >
                {/* Delete Button (Absolute) */}
                <button
                  onClick={() => onRemoveLineItem(i)}
                  className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity p-2 text-zinc-300 hover:text-red-500"
                  tabIndex={-1}
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-12 gap-4 mb-3">
                  {/* Title */}
                  <div className="col-span-8">
                    <Input
                      value={item.title}
                      onChange={(e) =>
                        onUpdateLineItem(i, "title", e.target.value)
                      }
                      placeholder="Titre de la prestation"
                      className="border-none p-0 text-base font-bold placeholder:font-normal focus-visible:ring-0"
                    />
                  </div>
                  {/* Price & Qty */}
                  <div className="col-span-4 flex gap-2">
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        onUpdateLineItem(
                          i,
                          "quantity",
                          parseFloat(e.target.value)
                        )
                      }
                      className="text-center h-8 text-xs bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200"
                      placeholder="Qté"
                    />
                    <div className="relative w-full">
                      <span className="absolute right-3 top-2 text-xs text-zinc-400">
                        €
                      </span>
                      <Input
                        type="number"
                        value={item.unitPriceEuros}
                        onChange={(e) =>
                          onUpdateLineItem(
                            i,
                            "unitPriceEuros",
                            parseFloat(e.target.value)
                          )
                        }
                        className="text-right pr-6 h-8 text-xs bg-zinc-50 border-transparent focus:bg-white focus:border-zinc-200 font-mono"
                        placeholder="Prix"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <TextareaAutosize
                  value={item.subtitle}
                  onChange={(e) =>
                    onUpdateLineItem(i, "subtitle", e.target.value)
                  }
                  placeholder="Ajouter une description détaillée..."
                  className="w-full text-sm text-zinc-500 resize-none outline-none placeholder:text-zinc-300 bg-transparent"
                />
              </div>
            ))}

            <Button
              onClick={onAddLineItem}
              variant="outline"
              className="w-full border-dashed border-zinc-300 text-zinc-500 hover:text-zinc-900 hover:border-zinc-400 hover:bg-zinc-50"
            >
              <Plus className="w-4 h-4 mr-2" /> Ajouter une ligne
            </Button>
          </AccordionContent>
        </AccordionItem>

        {/* 4. FINANCES */}
        <AccordionItem
          value="financials"
          className="border rounded-xl px-4 shadow-sm bg-white"
        >
          <AccordionTrigger className="hover:no-underline py-4">
            <span className="font-bold text-sm flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-zinc-400" /> Totaux & Remises
            </span>
          </AccordionTrigger>
          <AccordionContent className="pt-0 pb-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <Label className="text-xs text-zinc-400">Taux TVA (%)</Label>
                <Input
                  type="number"
                  value={quote.financials.vatRatePercent}
                  onChange={(e) =>
                    onUpdateField(
                      "financials",
                      "vatRatePercent",
                      parseFloat(e.target.value)
                    )
                  }
                  className={cleanInput}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-zinc-400">Remise (€)</Label>
                <Input
                  type="number"
                  value={quote.financials.discountAmountEuros}
                  onChange={(e) =>
                    onUpdateField(
                      "financials",
                      "discountAmountEuros",
                      parseFloat(e.target.value)
                    )
                  }
                  className={cn(cleanInput, "text-emerald-600 font-bold")}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* 5. MENTIONS */}
        <AccordionItem
          value="terms"
          className="border rounded-xl px-4 shadow-sm bg-white"
        >
          <AccordionTrigger className="hover:no-underline py-4">
            <span className="font-bold text-sm flex items-center gap-2">
              <Building2 className="w-4 h-4 text-zinc-400" /> Mentions & Pied de
              page
            </span>
          </AccordionTrigger>
          <AccordionContent className="pt-0 pb-6">
            <TextareaAutosize
              value={quote.quote.terms}
              onChange={(e) => onUpdateField("quote", "terms", e.target.value)}
              className={cn(
                cleanInput,
                "w-full resize-none text-xs min-h-[80px]"
              )}
              placeholder="Conditions de paiement, IBAN, Validité..."
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
