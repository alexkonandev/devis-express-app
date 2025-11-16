"use client";

import React, {
  useState, // Gardé pour isLoading/error
  useMemo, // Gardé pour les calculs
  ChangeEvent,
  FormEvent,
} from "react";

// --- Import du Store et des Types ---
import { useQuoteStore, QuoteDataState, LineItem } from "@/store/quote.store";

// --- Icônes Lucide ---
import { PlusIcon, TrashIcon, Loader2, AlertCircle, Save } from "lucide-react";

// --- Composants shadcn/ui ---
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

// --- Composant Principal: Le Formulaire "Cerveau" ---
export function QuoteEditorForm() {
  // --- LECTURE DEPUIS ZUSTAND ---
  const data = useQuoteStore((state) => state.activeQuote);

  // Récupérer les actions du store
  const {
    updateActiveQuoteField,
    updateActiveLineItem,
    addActiveLineItem,
    removeActiveLineItem,
    saveActiveQuoteToList, // On aura besoin de le lier
  } = useQuoteStore();

  // --- États Locaux (UI) (Conservés) ---
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Calculs (Conservés) ---
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

  // --- Handlers (Refactorisés pour appeler le store) ---
  const createNestedHandler =
    <T extends keyof QuoteDataState>(group: T) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      const isNumeric = ["vatRatePercent", "discountAmountEuros"].includes(
        name
      );
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

  const handleLineChange = (
    index: number,
    field: keyof LineItem,
    value: LineItem[keyof LineItem]
  ) => {
    updateActiveLineItem(index, field, value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // 1. Sauvegarder l'état actuel dans la liste (via le store)
    saveActiveQuoteToList();

    // 2. Préparer les données pour l'API PDF
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

    // 3. Appel API
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
      setIsLoading(false);
    }
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // --- Le JSX est maintenant le formulaire lui-même ---
  return (
    // Note : Le <form> est déplacé ici,
    // il sera soit en pleine page, soit dans le <Sheet>
    <form
      onSubmit={handleSubmit}
      className="flex flex-col h-full" // Important pour le <Sheet>
    >
      <div className="flex-grow overflow-y-auto p-4 md:p-8">
        {" "}
        {/* Scrollable content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <CompanySection
              company={data.company}
              onChange={handleCompanyChange}
            />
            <ClientSection client={data.client} onChange={handleClientChange} />
            <QuoteDetailsSection
              quote={data.quote}
              onChange={handleQuoteChange}
            />
            <QuoteItemsSection
              items={data.items}
              handleChange={handleLineChange}
              addItem={addActiveLineItem}
              removeItem={removeActiveLineItem}
            />
            <NotesSection quote={data.quote} handleChange={handleQuoteChange} />
          </div>

          <div className="lg:col-span-1 space-y-8">
            <div className="lg:sticky lg:top-8">
              <SummarySection
                totals={totals}
                financials={data.financials}
                handleChange={handleFinancialsChange}
                isLoading={isLoading}
                error={error}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Le bouton "Générer PDF" est maintenant dans le SummarySection,
        MAIS pour le <Sheet>, on pourrait vouloir un footer flottant.
        Pour l'instant, on le laisse dans le Summary pour plus de simplicité.
      */}
    </form>
  );
}

// --- Composants d'UI (identiques à avant) ---

// Composant de champ réutilisable (Inchangé)
function FormField({
  label,
  name,
  ...props
}: {
  label: string;
  name: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} {...props} />
    </div>
  );
}

// Composant de champ réutilisable (Inchangé)
function FormTextArea({
  label,
  name,
  ...props
}: {
  label: string;
  name: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Textarea id={name} name={name} {...props} />
    </div>
  );
}

// (CompanySection, ClientSection, QuoteDetailsSection)
function CompanySection({
  company,
  onChange,
}: {
  company: QuoteDataState["company"];
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
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

function ClientSection({
  client,
  onChange,
}: {
  client: QuoteDataState["client"];
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
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
            placeholder="Doe SARL"
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

function QuoteDetailsSection({
  quote,
  onChange,
}: {
  quote: QuoteDataState["quote"];
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
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

// (QuoteItemsSection)
function QuoteItemsSection({
  items,
  handleChange,
  addItem,
  removeItem,
}: {
  items: LineItem[];
  handleChange: (
    index: number,
    field: keyof LineItem,
    value: LineItem[keyof LineItem]
  ) => void;
  addItem: () => void;
  removeItem: (index: number) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lignes d&apos;articles</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Mobile View */}
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

        {/* Desktop View */}
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

// (NotesSection)
function NotesSection({
  quote,
  handleChange,
}: {
  quote: QuoteDataState["quote"];
  handleChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}) {
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

// (SummarySection)
function SummarySection({
  totals,
  financials,
  handleChange,
  isLoading,
  error,
}: {
  totals: {
    subTotal: number;
    totalAfterDiscount: number;
    taxAmount: number;
    totalTTC: number;
  };
  financials: QuoteDataState["financials"];
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  error: string | null;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Résumé</CardTitle>
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
        <Button type="submit" size="lg" disabled={isLoading} className="w-full">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Génération en cours..." : "GÉNÉRER LE PDF"}
        </Button>
      </CardFooter>
    </Card>
  );
}

// (SummaryRow)
function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium font-sans tracking-tight">
        {value} €
      </dd>
    </div>
  );
}
