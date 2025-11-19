"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// --- Store ---
import { useQuoteStore } from "@/store/quote.store";

// --- Icônes ---
import {
  ChevronLeft,
  Undo2,
  Redo2,
  Eye,
  Plus,
  Download,
  Loader2,
  X,
  Files,
  Calendar,
  Hash,
  Mail,
  Phone,
  MapPin,
  Building2,
  User,
  CheckCircle2,
  Save,
  Printer,
  FileText,
} from "lucide-react";

// --- UI Components ---
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ============================================================================
// 1. COMPOSANTS UI ATOMIQUES (Style Unifié)
// ============================================================================

const IconInput = ({ icon: Icon, className, ...props }: any) => (
  <div className="relative group">
    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-neutral-900 transition-colors duration-200">
      <Icon className="w-4 h-4" />
    </div>
    <Input
      {...props}
      className={`pl-10 h-10 rounded-lg border-neutral-200 bg-white 
      focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 
      placeholder:text-neutral-400 font-medium text-sm transition-all shadow-sm ${className}`}
    />
  </div>
);

const SectionTitle = ({ number, title }: { number: string; title: string }) => (
  <div className="flex items-center gap-3 mb-6 pb-2 border-b border-neutral-200/60">
    <div className="flex items-center justify-center w-6 h-6 rounded-md bg-neutral-900 text-white text-[10px] font-bold shadow-sm">
      {number}
    </div>
    <h3 className="text-sm font-bold uppercase tracking-wide text-neutral-900">
      {title}
    </h3>
  </div>
);

// ============================================================================
// 2. HEADER SPÉCIFIQUE ÉDITEUR (TOOLBAR)
// ============================================================================

const EditorToolbar = ({
  title,
  onTitleChange,
  isSaving,
  onSave,
}: {
  title: string;
  onTitleChange: (e: any) => void;
  isSaving: boolean;
  onSave: () => void;
}) => {
  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-neutral-200 px-6 flex items-center justify-between shrink-0 z-20 sticky top-0">
      {/* GAUCHE : RETOUR & TITRE */}
      <div className="flex items-center gap-4 flex-1">
        <Link
          href="/mes-devis"
          className="flex items-center justify-center h-9 w-9 rounded-lg border border-neutral-200 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 hover:border-neutral-300 transition-all"
          title="Retour au tableau de bord"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>

        <Separator orientation="vertical" className="h-6 bg-neutral-200" />

        <div className="flex items-center gap-2 group">
          <FileText className="w-4 h-4 text-neutral-400 group-hover:text-neutral-600 transition-colors" />
          <Input
            value={title}
            onChange={onTitleChange}
            className="border-transparent hover:border-neutral-200 focus:border-neutral-900 bg-transparent px-2 h-8 w-64 font-bold text-neutral-900 text-sm transition-all"
            placeholder="Nom du devis..."
          />
        </div>
      </div>

      {/* CENTRE : ACTIONS HISTORIQUE (Visuel) */}
      <div className="flex items-center bg-neutral-100 rounded-lg p-1 gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-2 rounded-md text-neutral-400 hover:text-neutral-900 hover:bg-white hover:shadow-sm transition-all disabled:opacity-50">
                <Undo2 className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Annuler</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-2 rounded-md text-neutral-400 hover:text-neutral-900 hover:bg-white hover:shadow-sm transition-all disabled:opacity-50">
                <Redo2 className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Rétablir</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* DROITE : STATUT & EXPORT */}
      <div className="flex items-center gap-4 flex-1 justify-end">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-50 border border-neutral-100">
          {isSaving ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin text-neutral-400" />
              <span className="text-xs font-medium text-neutral-400">
                Sauvegarde...
              </span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span className="text-xs font-medium text-neutral-600">
                Enregistré
              </span>
            </>
          )}
        </div>
        <Button
          onClick={onSave}
          size="sm"
          className="bg-neutral-900 text-white hover:bg-black shadow-md"
        >
          <Download className="w-4 h-4 mr-2" /> Exporter
        </Button>
      </div>
    </header>
  );
};

// ============================================================================
// 3. PAGE PRINCIPALE
// ============================================================================

export default function CreateQuotePage() {
  const router = useRouter();
  const {
    activeQuote,
    userFolders,
    updateActiveQuoteField,
    updateActiveLineItem,
    addActiveLineItem,
    removeActiveLineItem,
    resetActiveQuote,
    saveActiveQuoteToList,
  } = useQuoteStore();

  const [isLoading, setIsLoading] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState(false);
  const [docTitle, setDocTitle] = useState("Nouveau Devis");

  useEffect(() => {
    resetActiveQuote();
  }, []);

  // Sync Titre Document
  useEffect(() => {
    if (activeQuote?.client?.name) {
      setDocTitle(`Devis - ${activeQuote.client.name}`);
    }
  }, [activeQuote?.client?.name]);

  // Auto-save effect
  useEffect(() => {
    if (!activeQuote) return;
    setAutoSaveStatus(true);
    const timer = setTimeout(() => setAutoSaveStatus(false), 800);
    return () => clearTimeout(timer);
  }, [activeQuote]);

  // Calculs
  const totals = useMemo(() => {
    if (!activeQuote) return { subTotal: 0, taxAmount: 0, totalTTC: 0 };
    const subTotal = activeQuote.items.reduce(
      (acc, item) => acc + item.quantity * item.unitPriceEuros,
      0
    );
    const totalAfterDiscount =
      subTotal - activeQuote.financials.discountAmountEuros;
    const taxAmount =
      totalAfterDiscount * (activeQuote.financials.vatRatePercent / 100);
    const totalTTC = totalAfterDiscount + taxAmount;
    return { subTotal, taxAmount, totalTTC };
  }, [activeQuote]);

  const createHandler = (group: string) => (e: any) => {
    const { name, value } = e.target;
    const isNumeric = ["vatRatePercent", "discountAmountEuros"].includes(name);
    updateActiveQuoteField(
      group,
      name,
      isNumeric ? parseFloat(value) || 0 : value
    );
  };

  const handleMetaChange = (field: string, value: any) => {
    updateActiveQuoteField("meta", field, value);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    saveActiveQuoteToList();
    try {
      await new Promise((r) => setTimeout(r, 1000));
      console.log("Génération PDF...");
    } catch (error) {
      console.error("Erreur PDF", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!activeQuote)
    return (
      <div className="flex h-full items-center justify-center bg-neutral-50">
        <Loader2 className="animate-spin text-neutral-400 w-8 h-8" />
      </div>
    );

  return (
    // IMPORTANT : On utilise flex-col h-full pour remplir l'espace laissé par le Layout
    <div className="flex flex-col h-full w-full bg-neutral-50 overflow-hidden">
      {/* 1. TOOLBAR (Fixe en haut) */}
      <EditorToolbar
        title={docTitle}
        onTitleChange={(e) => setDocTitle(e.target.value)}
        isSaving={autoSaveStatus}
        onSave={handleSubmit}
      />

      {/* 2. ESPACE DE TRAVAIL (Split View) */}
      <div className="flex-1 flex overflow-hidden">
        {/* GAUCHE : FORMULAIRE (Scrollable) */}
        <div className="flex-1 overflow-y-auto scroll-smooth bg-neutral-50">
          <div className="max-w-6xl mx-auto p-6 lg:p-10 space-y-10 pb-32">
            {/* IDENTITÉS */}
            <section className="bg-white p-8 rounded-xl border border-neutral-200 shadow-sm">
              <SectionTitle number="1" title="Identités" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Émetteur */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-blue-50 rounded-md text-blue-600">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold uppercase text-neutral-500 tracking-widest">
                      Émetteur
                    </span>
                  </div>
                  <Input
                    name="name"
                    value={activeQuote.company.name}
                    onChange={createHandler("company")}
                    placeholder="Votre Entreprise"
                    className="font-bold border-neutral-200 text-base h-11"
                  />
                  <div className="space-y-3">
                    <IconInput
                      icon={Mail}
                      name="email"
                      value={activeQuote.company.email}
                      onChange={createHandler("company")}
                      placeholder="Email"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <IconInput
                        icon={Phone}
                        name="phone"
                        value={activeQuote.company.phone}
                        onChange={createHandler("company")}
                        placeholder="Tél."
                      />
                      <IconInput
                        icon={MapPin}
                        name="address"
                        value={activeQuote.company.address}
                        onChange={createHandler("company")}
                        placeholder="Adresse"
                      />
                    </div>
                  </div>
                </div>

                {/* Client */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-purple-50 rounded-md text-purple-600">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold uppercase text-neutral-500 tracking-widest">
                      Client
                    </span>
                  </div>
                  <Input
                    name="name"
                    value={activeQuote.client.name}
                    onChange={createHandler("client")}
                    placeholder="Nom du Client"
                    className="font-bold border-neutral-200 text-base h-11"
                  />
                  <div className="space-y-3">
                    <IconInput
                      icon={Mail}
                      name="email"
                      value={activeQuote.client.email}
                      onChange={createHandler("client")}
                      placeholder="Email"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <IconInput
                        icon={Phone}
                        name="phone"
                        value={activeQuote.client.phone}
                        onChange={createHandler("client")}
                        placeholder="Tél."
                      />
                      <IconInput
                        icon={MapPin}
                        name="address"
                        value={activeQuote.client.address}
                        onChange={createHandler("client")}
                        placeholder="Adresse"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* PRESTATIONS */}
            <section className="bg-white p-8 rounded-xl border border-neutral-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <SectionTitle number="2" title="Prestations" />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addActiveLineItem}
                  className="text-xs h-8"
                >
                  <Plus className="w-3 h-3 mr-2" /> Ajouter
                </Button>
              </div>

              <div className="space-y-3">
                {/* Header */}
                <div className="grid grid-cols-12 gap-4 px-4 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  <div className="col-span-6">Désignation</div>
                  <div className="col-span-2 text-center">Qté</div>
                  <div className="col-span-2 text-right">Prix U.</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>

                {activeQuote.items.length === 0 && (
                  <div className="py-12 flex flex-col items-center justify-center border border-dashed border-neutral-200 rounded-lg bg-neutral-50/50 text-neutral-400">
                    <Files className="w-8 h-8 mb-2 opacity-20" />
                    <span className="text-xs">Le devis est vide</span>
                  </div>
                )}

                {activeQuote.items.map((item, index) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start p-3 rounded-lg border border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm transition-all group"
                  >
                    <div className="col-span-6 space-y-2">
                      <input
                        className="w-full font-semibold text-sm bg-transparent focus:outline-none placeholder:text-neutral-300"
                        placeholder="Titre"
                        value={item.title}
                        onChange={(e) =>
                          updateActiveLineItem(index, "title", e.target.value)
                        }
                      />
                      <textarea
                        className="w-full text-xs text-neutral-500 bg-transparent focus:outline-none resize-none placeholder:text-neutral-300"
                        placeholder="Description..."
                        rows={1}
                        style={{ fieldSizing: "content" } as any}
                        value={item.subtitle}
                        onChange={(e) =>
                          updateActiveLineItem(
                            index,
                            "subtitle",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        className="h-8 text-center text-xs"
                        value={item.quantity}
                        onChange={(e) =>
                          updateActiveLineItem(
                            index,
                            "quantity",
                            parseFloat(e.target.value)
                          )
                        }
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        className="h-8 text-right text-xs"
                        value={item.unitPriceEuros}
                        onChange={(e) =>
                          updateActiveLineItem(
                            index,
                            "unitPriceEuros",
                            parseFloat(e.target.value)
                          )
                        }
                      />
                    </div>
                    <div className="col-span-2 flex items-center justify-end gap-2 h-8">
                      <span className="font-mono font-bold text-sm">
                        {(item.quantity * item.unitPriceEuros).toFixed(2)}€
                      </span>
                      <button
                        onClick={() => removeActiveLineItem(index)}
                        className="opacity-0 group-hover:opacity-100 text-neutral-300 hover:text-red-500 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* CONFIGURATION */}
            <section className="bg-white p-8 rounded-xl border border-neutral-200 shadow-sm">
              <SectionTitle number="3" title="Configuration" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs uppercase text-neutral-500 font-bold">
                    Numéro
                  </Label>
                  <IconInput
                    icon={Hash}
                    name="number"
                    value={activeQuote.quote.number}
                    onChange={createHandler("quote")}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase text-neutral-500 font-bold">
                    Date
                  </Label>
                  <IconInput
                    icon={Calendar}
                    type="date"
                    name="issueDate"
                    value={activeQuote.quote.issueDate}
                    onChange={createHandler("quote")}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase text-neutral-500 font-bold">
                    Dossier
                  </Label>
                  <Select
                    value={activeQuote.meta.folder || "root"}
                    onValueChange={(val) =>
                      handleMetaChange("folder", val === "root" ? null : val)
                    }
                  >
                    <SelectTrigger className="bg-white border-neutral-200">
                      <SelectValue placeholder="Dossier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="root">Racine</SelectItem>
                      {userFolders.map((f) => (
                        <SelectItem key={f} value={f}>
                          {f}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-3 space-y-2">
                  <Label className="text-xs uppercase text-neutral-500 font-bold">
                    Mentions légales
                  </Label>
                  <Textarea
                    className="bg-white border-neutral-200 min-h-[80px]"
                    placeholder="Conditions de paiement..."
                    name="terms"
                    value={activeQuote.quote.terms}
                    onChange={createHandler("quote")}
                  />
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* DROITE : RÉSUMÉ & PREVIEW (Fixe) */}
        <div className="w-[380px] bg-white border-l border-neutral-200 flex flex-col h-full z-10 shadow-xl shadow-neutral-200/50">
          {/* Header Résumé */}
          <div className="p-6 border-b border-neutral-100">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
              Total à payer
            </h3>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-4xl font-bold tracking-tighter font-mono">
                {totals.totalTTC.toFixed(2)}
              </span>
              <span className="text-xl text-neutral-400 font-bold">€</span>
            </div>
          </div>

          {/* Détails Calculs */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            <div className="space-y-3 p-4 bg-neutral-50 rounded-lg border border-neutral-100">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Total HT</span>
                <span className="font-mono font-medium">
                  {totals.subTotal.toFixed(2)} €
                </span>
              </div>
              <Separator className="bg-neutral-200" />
              <div className="flex items-center justify-between">
                <Label className="text-xs text-neutral-500">Remise (€)</Label>
                <Input
                  type="number"
                  className="h-7 w-20 text-right text-xs bg-white"
                  name="discountAmountEuros"
                  value={activeQuote.financials.discountAmountEuros}
                  onChange={createHandler("financials")}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-xs text-neutral-500">TVA (%)</Label>
                <Input
                  type="number"
                  className="h-7 w-20 text-right text-xs bg-white"
                  name="vatRatePercent"
                  value={activeQuote.financials.vatRatePercent}
                  onChange={createHandler("financials")}
                />
              </div>
              <Separator className="bg-neutral-200" />
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Montant TVA</span>
                <span className="font-mono font-medium text-neutral-900">
                  {totals.taxAmount.toFixed(2)} €
                </span>
              </div>
            </div>

            {/* Mini Preview PDF (Visuel) */}
            <div className="relative group cursor-not-allowed opacity-80 hover:opacity-100 transition-opacity">
              <div className="aspect-[210/297] bg-white border border-neutral-200 shadow-sm rounded-sm p-4 text-[6px] text-neutral-300 overflow-hidden select-none">
                <div className="flex justify-between mb-4">
                  <div className="w-8 h-2 bg-neutral-100 rounded" />
                  <div className="w-4 h-2 bg-neutral-100 rounded" />
                </div>
                <div className="space-y-1 mb-4">
                  <div className="w-12 h-1 bg-neutral-100 rounded" />
                  <div className="w-8 h-1 bg-neutral-50 rounded" />
                </div>
                <div className="space-y-1">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-full h-2 border-b border-neutral-50"
                    />
                  ))}
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  variant="secondary"
                  size="sm"
                  className="shadow-lg gap-2 pointer-events-none"
                >
                  <Eye className="w-3 h-3" /> Aperçu PDF
                </Button>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-neutral-100 bg-neutral-50/30">
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full h-12 bg-neutral-900 hover:bg-black text-white shadow-lg shadow-neutral-200 transition-all active:scale-[0.98]"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              <span className="font-semibold">Générer le document</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
