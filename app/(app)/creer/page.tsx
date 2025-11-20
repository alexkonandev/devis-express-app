"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuoteStore } from "@/store/quote.store";
import { pdf, PDFViewer } from "@react-pdf/renderer";
import { QuoteDocument } from "@/components/pdf/QuoteDocument";
import { Loader2 } from "lucide-react";

import { EditorLayout } from "@/components/editor/editor-layout";
import { EditorSidebar } from "@/components/editor/editor-sidebar";
import { EditorHeader } from "@/components/editor/editor-header";
import { InteractiveQuote } from "@/components/editor/interactive-quote";
import { useDebounce } from "@/hooks/use-debounce";

// Helper function to calculate totals
const calculateQuoteTotals = (quote: any) => {
  if (!quote) return { subTotal: 0, taxAmount: 0, totalTTC: 0 };

  const subTotal = quote.items.reduce(
    (acc: number, item: any) => acc + item.quantity * item.unitPriceEuros,
    0
  );

  const totalAfterDiscount =
    subTotal - quote.financials.discountAmountEuros;

  const taxAmount =
    totalAfterDiscount * (quote.financials.vatRatePercent / 100);

  return {
    subTotal,
    taxAmount,
    totalTTC: totalAfterDiscount + taxAmount,
  };
};

export default function CreateQuotePage() {
  const router = useRouter();
  const {
    activeQuote,
    folders,
    updateActiveQuoteField,
    updateActiveLineItem,
    addActiveLineItem,
    removeActiveLineItem,
    resetActiveQuote,
    saveActiveQuoteToList,
  } = useQuoteStore();

  const [isSaving, setIsSaving] = useState(false);
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");
  const [zoom, setZoom] = useState(1);

  // Initialisation
  useEffect(() => {
    if (!activeQuote) resetActiveQuote();
  }, []);

  // Auto-save
  useEffect(() => {
    if (!activeQuote) return;
    setIsSaving(true);
    const t = setTimeout(() => {
      saveActiveQuoteToList();
      setIsSaving(false);
    }, 800);
    return () => clearTimeout(t);
  }, [activeQuote, saveActiveQuoteToList]);

  // Debounce activeQuote for PDF generation to avoid flickering
  const debouncedQuote = useDebounce(activeQuote, 1000);

  // Real-time totals for the Editor
  const totals = useMemo(() => {
    return calculateQuoteTotals(activeQuote);
  }, [activeQuote]);

  // Debounced totals for the PDF
  const debouncedTotals = useMemo(() => {
    return calculateQuoteTotals(debouncedQuote);
  }, [debouncedQuote]);

  // FONCTION D'EXPORT PDF RÉELLE
  const handleExportPDF = async () => {
    if (!activeQuote) return;
    setIsSaving(true);
    try {
      const blob = await pdf(
        <QuoteDocument quote={activeQuote} totals={totals} />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `devis_${activeQuote.quote.number}.pdf`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erreur PDF", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!activeQuote)
    return (
      <div className="h-full flex items-center justify-center bg-neutral-50">
        <Loader2 className="animate-spin text-neutral-400" />
      </div>
    );

  return (
    <EditorLayout
      header={
        <EditorHeader
          activeQuote={activeQuote}
          folders={folders}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onSave={handleExportPDF}
          isSaving={isSaving}
          zoom={zoom}
          setZoom={setZoom}
        />
      }
      sidebar={
        <EditorSidebar
          activeQuote={activeQuote}
          folders={folders}
          onUpdateField={updateActiveQuoteField as any}
          onSave={handleExportPDF}
          isSaving={isSaving}
        />
      }
    >
      {viewMode === "edit" ? (
        <div style={{ transform: `scale(${zoom})`, transformOrigin: "top center", transition: "transform 0.2s" }}>
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
        <div className="w-full h-full flex justify-center items-start pt-8 pb-20">
           <PDFViewer width="100%" height="1200px" className="shadow-2xl rounded-lg border border-neutral-200" showToolbar={false}>
             {/* Use debounced data for the PDF Viewer to prevent flashing */}
             <QuoteDocument quote={debouncedQuote || activeQuote} totals={debouncedTotals} />
           </PDFViewer>
        </div>
      )}
    </EditorLayout>
  );
}
