"use client";

import React, { useState, useMemo } from "react";
import { useQuoteStore } from "@/store/quote.store";

import {
  PlusIcon,
  TrashIcon,
  Loader2,
  AlertCircle,
  Save,
  FileDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

export function QuoteEditorForm({ mode }) {
  const isEditMode = mode === "edit";

  const data = useQuoteStore((state) => state.activeQuote);

  const {
    updateActiveQuoteField,
    updateActiveLineItem,
    addActiveLineItem,
    removeActiveLineItem,
    saveActiveQuoteToList,
  } = useQuoteStore();

  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [isLoadingSave, setIsLoadingSave] = useState(false);
  const [error, setError] = useState(null);

  const totals = useMemo(() => {
    if (!data)
      return { subTotal: 0, totalAfterDiscount: 0, taxAmount: 0, totalTTC: 0 };

    const subTotal = data.items.reduce((acc, item) => {
      return acc + item.quantity * item.unitPriceEuros;
    }, 0);
    const totalAfterDiscount = subTotal - data.financials.discountAmountEuros;
    const taxAmount =
      totalAfterDiscount * (data.financials.vatRatePercent / 100);
    const totalTTC = totalAfterDiscount + taxAmount;
    return { subTotal, totalAfterDiscount, taxAmount, totalTTC };
  }, [data]);

  const createNestedHandler = (group) => (e) => {
    const { name, value } = e.target;
    const isNumeric = ["vatRatePercent", "discountAmountEuros"].includes(name);
    updateActiveQuoteField(
      group,
      name,
      isNumeric ? parseFloat(value) || 0 : value
    );
  };

  const handleCompanyChange = createNestedHandler("company");
  const handleClientChange = createNestedHandler("client");
  const handleQuoteChange = createNestedHandler("quote");
  const handleFinancialsChange = createNestedHandler("financials");

  const handleLineChange = (index, field, value) => {
    updateActiveLineItem(index, field, value);
  };

  const handleSaveOnly = async (e) => {
    e.preventDefault();
    setIsLoadingSave(true);
    setError(null);
    try {
      saveActiveQuoteToList();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoadingSave(false);
    }
  };

  const handleSubmitPdf = async (e) => {
    e.preventDefault();
    setIsLoadingPdf(true);
    setError(null);

    saveActiveQuoteToList();

    const apiData = {
      ...data,
      items: data.items.map((item) => ({
        title: item.title,
        subtitle: item.subtitle,
        quantity: item.quantity,
        unitPriceCents: Math.round(item.unitPriceEuros * 100),
      })),
      financials: {
        vatRatePercent: data.financials.vatRatePercent,
        discountAmountCents: Math.round(
          data.financials.discountAmountEuros * 100
        ),
      },
    };

    try {
      const response = await fetch("/api/pdf/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(
          errData.message || `Erreur du serveur: ${response.statusText}`
        );
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `devis-${data.quote.number}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Une erreur inconnue est survenue."
      );
    } finally {
      setIsLoadingPdf(false);
    }
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmitPdf} className="flex flex-col h-full  w-full">
      <div className="   w-full ">
        <div className="flex w-full justify-between space-x-6">
          <div className="lg:col-span-2 space-y-6 w-8/12 ">
            {mode === "create" && (
              <CompanySection
                company={data.company}
                onChange={handleCompanyChange}
              />
            )}

            <ClientSection
              client={data.client}
              onChange={handleClientChange}
              mode={mode}
            />
            <QuoteDetailsSection
              quote={data.quote}
              onChange={handleQuoteChange}
              isEditMode={isEditMode}
            />
            <QuoteItemsSection
              items={data.items}
              handleChange={handleLineChange}
              addItem={addActiveLineItem}
              removeItem={removeActiveLineItem}
            />
            <NotesSection quote={data.quote} handleChange={handleQuoteChange} />
          </div>

          <div className="lg:col-span-1 space-y-8 w-96">
            <div
              className={`lg:sticky ${isEditMode ? "lg:top-8" : "lg:top-22"}`}
            >
              <SummarySection
                mode={mode}
                totals={totals}
                financials={data.financials}
                handleChange={handleFinancialsChange}
                isLoadingPdf={isLoadingPdf}
                isLoadingSave={isLoadingSave}
                onSaveOnly={handleSaveOnly}
                error={error}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

function FormField({ label, name, ...props }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} {...props} />
    </div>
  );
}

function FormTextArea({ label, name, ...props }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Textarea id={name} name={name} {...props} />
    </div>
  );
}

function CompanySection({ company, onChange }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vos Informations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <FormField
            label="Nom / Entreprise"
            name="name"
            value={company.name}
            onChange={onChange}
          />
          <FormField
            label="Email"
            name="email"
            type="email"
            value={company.email}
            onChange={onChange}
          />
          <FormField
            label="Téléphone"
            name="phone"
            type="tel"
            value={company.phone}
            onChange={onChange}
          />
          <FormField
            label="Adresse"
            name="address"
            value={company.address}
            onChange={onChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function ClientSection({ client, onChange, mode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations du Client</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <FormField
            label="Nom / Entreprise"
            name="name"
            value={client.name}
            onChange={onChange}
            placeholder={mode === "create" ? "Nouveau client..." : "Doe SARL"}
          />
          <FormField
            label="Email"
            name="email"
            type="email"
            value={client.email}
            onChange={onChange}
            placeholder="client@email.com"
          />
          <FormField
            label="Téléphone"
            name="phone"
            type="tel"
            value={client.phone}
            onChange={onChange}
          />
          <FormField
            label="Adresse"
            name="address"
            value={client.address}
            onChange={onChange}
            placeholder="123 Rue du Client"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function QuoteDetailsSection({ quote, onChange, isEditMode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Détails du Devis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
          <FormField
            label="Numéro de devis"
            name="number"
            value={quote.number}
            onChange={onChange}
            disabled={isEditMode}
            readOnly={isEditMode}
            className={isEditMode ? "opacity-70 cursor-not-allowed" : ""}
          />
          <FormField
            label="Date d'émission"
            name="issueDate"
            type="date"
            value={quote.issueDate}
            onChange={onChange}
          />
          <FormField
            label="Date de validité"
            name="expiryDate"
            type="date"
            value={quote.expiryDate}
            onChange={onChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function QuoteItemsSection({ items, handleChange, addItem, removeItem }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lignes d&apos;articles</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="md:hidden space-y-4">
          {items.map((item, index) => {
            const rowTotal = item.quantity * item.unitPriceEuros;
            return (
              <Card key={item.id} className="bg-muted/50">
                <CardContent className="p-4 space-y-4">
                  <div className="flex justify-between items-start gap-2">
                 
                    <Input
                      placeholder="Titre de l'article"
                      value={item.title}
                      onChange={(e) =>
                        handleChange(index, "title", e.target.value)
                      }
                      className="flex-1 font-semibold tracking-tight"
                    />
                    <span className="shrink-0 font-sans text-sm font-semibold tracking-tight text-right whitespace-nowrap">
                      {rowTotal.toFixed(2)} €
                    </span>
                  </div>
                  <Textarea
                    placeholder="Sous-titre (optionnel)"
                    value={item.subtitle}
                    onChange={(e) =>
                      handleChange(index, "subtitle", e.target.value)
                    }
                    className="text-xs tracking-tight"
                    rows={2}
                  />
                  <div className="flex flex-wrap items-end gap-x-4 gap-y-3">
                    <div className="space-y-2 flex-1 min-w-20">
                      <Label htmlFor={`qty-${item.id}`} className="sr-only">
                        Qté
                      </Label>
                      <Input
                        id={`qty-${item.id}`}
                        type="number"
                        placeholder="Qté"
                        value={item.quantity}
                        onChange={(e) =>
                          handleChange(
                            index,
                            "quantity",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="tracking-tight"
                      />
                    </div>
                    <div className="space-y-2 flex-1 min-w-[110px]">
                      <Label htmlFor={`price-${item.id}`} className="sr-only">
                        Prix Unit. (€)
                      </Label>
                      <Input
                        id={`price-${item.id}`}
                        type="number"
                        step="0.01"
                        placeholder="Prix Unit. (€)"
                        value={item.unitPriceEuros}
                        onChange={(e) =>
                          handleChange(
                            index,
                            "unitPriceEuros",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="tracking-tight"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                      className="ml-auto text-destructive"
                      aria-label="Supprimer la ligne"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/2 min-w-[250px]">
                  Description
                </TableHead>
                <TableHead className="w-20">Qté</TableHead>
                <TableHead className="w-28">Prix Unit. (€)</TableHead>
                <TableHead className="w-24 text-right">Total HT</TableHead>
                <TableHead className="w-16">
                  <span className="sr-only">Action</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => {
                const rowTotal = item.quantity * item.unitPriceEuros;
                return (
                  <TableRow key={item.id}>
                    <TableCell className="align-top">
                      <Input
                        placeholder="Titre de l'article"
                        value={item.title}
                        onChange={(e) =>
                          handleChange(index, "title", e.target.value)
                        }
                        className="font-medium tracking-tight"
                      />
                      <Textarea
                        placeholder="Sous-titre (optionnel)"
                        value={item.subtitle}
                        onChange={(e) =>
                          handleChange(index, "subtitle", e.target.value)
                        }
                        className="mt-2 text-xs tracking-tight"
                        rows={2}
                      />
                    </TableCell>
                    <TableCell className="align-top">
                      <Input
                        type="number"
                        placeholder="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleChange(
                            index,
                            "quantity",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="tracking-tight"
                      />
                    </TableCell>
                    <TableCell className="align-top">
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="500"
                        value={item.unitPriceEuros}
                        onChange={(e) =>
                          handleChange(
                            index,
                            "unitPriceEuros",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="tracking-tight"
                      />
                    </TableCell>
                    <TableCell className="pt-4 align-top text-right">
                      <span className="font-sans text-sm font-semibold tracking-tight whitespace-nowrap">
                        {rowTotal.toFixed(2)} €
                      </span>
                    </TableCell>
                    <TableCell className="align-top text-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(index)}
                        className="text-destructive"
                        aria-label="Supprimer la ligne"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter>
        <Button type="button" variant="outline" onClick={addItem}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Ajouter une ligne
        </Button>
      </CardFooter>
    </Card>
  );
}

function NotesSection({ quote, handleChange }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes & Conditions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <FormTextArea
            label="Conditions (ex: acompte, délais)"
            name="terms"
            rows={5}
            value={quote.terms}
            onChange={handleChange}
            className="md:col-span-2"
          />
          <FormTextArea
            label="Informations de Paiement (ex: IBAN)"
            name="paymentDetails"
            rows={5}
            value={quote.paymentDetails}
            onChange={handleChange}
          />
          <FormTextArea
            label="Conditions de Paiement (ex: 30 jours)"
            name="paymentTerms"
            rows={5}
            value={quote.paymentTerms}
            onChange={handleChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function SummarySection({
  mode,
  totals,
  financials,
  handleChange,
  isLoadingPdf,
  isLoadingSave,
  onSaveOnly,
  error,
}) {
  const isEditMode = mode === "edit";

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditMode ? "Actions" : "Résumé"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <dl className="space-y-3">
          <SummaryRow
            label="Sous-total HT"
            value={totals.subTotal.toFixed(2)}
          />

          <div className="flex justify-between items-center">
            <Label
              htmlFor="discountAmountEuros"
              className="text-muted-foreground"
            >
              Remise (€)
            </Label>
            <Input
              type="number"
              step="0.01"
              name="discountAmountEuros"
              id="discountAmountEuros"
              value={financials.discountAmountEuros}
              onChange={handleChange}
              className="w-28 font-sans text-right tracking-tight"
            />
          </div>

          <div className="flex justify-between items-center">
            <Label htmlFor="vatRatePercent" className="text-muted-foreground">
              Taux de TVA (%)
            </Label>
            <Input
              type="number"
              name="vatRatePercent"
              id="vatRatePercent"
              value={financials.vatRatePercent}
              onChange={handleChange}
              className="w-28 font-sans text-right tracking-tight"
            />
          </div>

          <SummaryRow
            label={`TVA (${financials.vatRatePercent}%)`}
            value={totals.taxAmount.toFixed(2)}
          />
        </dl>

        <Separator />

        <dl className="space-y-2">
          <div className="flex justify-between items-center">
            <dt className="text-lg font-semibold">Total TTC</dt>
            <dd className="text-2xl font-bold font-sans tracking-tight">
              {totals.totalTTC.toFixed(2)} €
            </dd>
          </div>
        </dl>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isEditMode ? (
          <Button
            type="button"
            size="lg"
            onClick={onSaveOnly}
            disabled={isLoadingSave}
            className="w-full"
          >
            {isLoadingSave ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Mettre à jour
          </Button>
        ) : (
          <Button
            type="submit"
            size="lg"
            disabled={isLoadingPdf}
            className="w-full"
          >
            {isLoadingPdf ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileDown className="mr-2 h-4 w-4" />
            )}
            Générer le PDF
          </Button>
        )}

        {isEditMode && (
          <Button
            type="submit"
            size="lg"
            variant="outline"
            disabled={isLoadingPdf}
            className="w-full"
          >
            {isLoadingPdf ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileDown className="mr-2 h-4 w-4" />
            )}
            Générer le PDF
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between items-center">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium font-sans tracking-tight">
        {value} €
      </dd>
    </div>
  );
}
