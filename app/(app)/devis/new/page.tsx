"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQuoteStore } from "@/store/quote.store";
import { Loader2, Palette } from "lucide-react";

import { EditorLayout } from "@/components/editor/editor-layout";
import { EditorSidebar } from "@/components/editor/editor-sidebar";
import { EditorHeader } from "@/components/editor/editor-header";
import { InteractiveQuote } from "@/components/editor/interactive-quote";
import { useDebounce } from "@/hooks/use-debounce";
import { QuotePayload, saveDevisAction } from "../actions";

// IMPORTS PDF
import PrintableQuote from "@/components/pdf/PrintableQuote";
import { useReactToPrint } from "react-to-print";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Helper function to calculate totals
const calculateQuoteTotals = (quote: any) => {
  if (!quote) return { subTotal: 0, taxAmount: 0, totalTTC: 0 };
  const subTotal = quote.items.reduce(
    (acc: number, item: any) => acc + item.quantity * item.unitPriceEuros,
    0
  );
  const totalAfterDiscount = subTotal - quote.financials.discountAmountEuros;
  const taxAmount =
    totalAfterDiscount * (quote.financials.vatRatePercent / 100);
  return { subTotal, taxAmount, totalTTC: totalAfterDiscount + taxAmount };
};

interface CreateQuoteClientProps {
  initialQuote: any;
  userId: string;
}

export default function CreateQuoteClient({
  initialQuote,
  userId,
}: CreateQuoteClientProps) {
  const router = useRouter();

  const {
    activeQuote,
    userFolders,
    setActiveQuote,
    updateActiveQuoteField,
    updateActiveLineItem,
    addActiveLineItem,
    removeActiveLineItem,
  } = useQuoteStore();

  const [isSaving, setIsSaving] = useState(false);
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");
  const [zoom, setZoom] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // État pour le thème de la prévisualisation
  const [previewTheme, setPreviewTheme] = useState<
    "minimalist" | "executive" | "bold"
  >("minimalist");

  // --- LOGIQUE D'IMPRESSION CORRIGÉE ---
  const printableRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    // C'EST ICI LA CORRECTION MAJEURE (Nouvelle API v3)
    contentRef: printableRef,
    documentTitle: `Devis-${activeQuote?.quote.number || "Brouillon"}`,
    onBeforeGetContent: () => {
      handleSaveToDB();
    },
  });

  // HYDRATATION
  useEffect(() => {
    if (initialQuote) {
      setActiveQuote(initialQuote);
    }
    setIsLoading(false);
  }, [initialQuote, setActiveQuote]);

  // Calculs
  const totals = useMemo(
    () => calculateQuoteTotals(activeQuote),
    [activeQuote]
  );

  const debouncedQuote = useDebounce(activeQuote, 2000);

  // SAUVEGARDE DB
  const handleSaveToDB = async () => {
    if (!activeQuote) return;
    setIsSaving(true);

    try {
      const payload: QuotePayload = {
        id: activeQuote.id === "new" ? undefined : activeQuote.id,
        number: activeQuote.quote.number,
        issueDate: new Date(activeQuote.quote.issueDate),
        terms: activeQuote.quote.terms,
        totalTTC: totals.totalTTC,
        financials: activeQuote.financials,
        client: activeQuote.client,
        company: activeQuote.company,
        status: activeQuote.meta.status,
        items: activeQuote.items.map((item: any) => ({
          title: item.title,
          quantity: item.quantity,
          unitPriceEuros: item.unitPriceEuros,
          subtitle: item.subtitle,
        })),
      };

      const result = await saveDevisAction(payload);

      if (result.success && result.devisId) {
        if (activeQuote.id === "new") {
          router.replace(`/devis/${result.devisId}`);
          setActiveQuote({ ...activeQuote, id: result.devisId });
        }
        console.log("✅ Devis sauvegardé.");
      } else {
        console.error("Erreur Save:", result.error);
      }
    } catch (e) {
      console.error("Erreur critique:", e);
    } finally {
      setIsSaving(false);
    }
  };

  // AUTOSAVE
  useEffect(() => {
    if (!debouncedQuote || isLoading) return;
    if (debouncedQuote.id === "new") return;
    handleSaveToDB();
  }, [debouncedQuote]);

  if (isLoading || !activeQuote) {
    return (
      <div className="h-full flex items-center justify-center bg-neutral-50">
        <Loader2 className="animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <EditorLayout
      header={
        <EditorHeader
          activeQuote={activeQuote}
          folders={userFolders}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onSave={handleSaveToDB}
          isSaving={isSaving}
          zoom={zoom}
          setZoom={setZoom}
          onPrint={handlePrint}
        />
      }
      sidebar={
        <EditorSidebar
          activeQuote={activeQuote}
          folders={userFolders}
          onUpdateField={updateActiveQuoteField as any}
          onSave={handleSaveToDB}
          isSaving={isSaving}
        />
      }
    >
      {/* 🛑 COMPOSANT FANTÔME (WRAPPER DIV) */}
      <div style={{ display: "none" }}>
        {/* On attache la ref directement sur cette div wrapper */}
        <div ref={printableRef}>
          <PrintableQuote quote={activeQuote} theme={previewTheme} />
        </div>
      </div>

      {viewMode === "edit" ? (
        // MODE ÉDITION
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "top center",
            transition: "transform 0.2s",
          }}
        >
          <InteractiveQuote
            quote={activeQuote}
            totals={totals}
            onUpdateField={updateActiveQuoteField as any}
            onUpdateLineItem={updateActiveLineItem as any}
            onAddLineItem={addActiveLineItem}
            onRemoveLineItem={removeActiveLineItem}
          />
        </div>
      ) : (
        // MODE APERÇU
        <div className="w-full h-full flex flex-col items-center pt-8 pb-20 px-8 overflow-y-auto bg-neutral-100/50">
          <div className="relative">
            {/* SÉLECTEUR DE THÈME */}
            <div className="absolute top-[-40px] right-0 z-20">
              <div className="flex items-center gap-2 bg-white p-2 rounded-full shadow-md border border-neutral-200">
                <Palette className="w-4 h-4 text-neutral-500 ml-1" />
                <Select
                  value={previewTheme}
                  onValueChange={(v: any) => setPreviewTheme(v)}
                >
                  <SelectTrigger className="w-[160px] h-8 text-xs border-none shadow-none focus:ring-0 bg-neutral-100/80 rounded-full">
                    <SelectValue placeholder="Choisir un style..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minimalist">Standard (Clean)</SelectItem>
                    <SelectItem value="executive">Executive (Blue)</SelectItem>
                    <SelectItem value="bold">Startup (Bold)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* DOCUMENT VISIBLE (Aperçu Écran) */}
            <div
              className="shadow-2xl border border-neutral-200 bg-white"
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "top center",
                transition: "transform 0.2s",
              }}
            >
              <PrintableQuote quote={activeQuote} theme={previewTheme} />
            </div>
          </div>
        </div>
      )}
    </EditorLayout>
  );
}
