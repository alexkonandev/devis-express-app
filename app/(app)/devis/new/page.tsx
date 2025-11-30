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
import { QuotePayload, saveDevisAction } from "../actions";

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
  initialQuote: any; // Données venant du serveur
  userId: string;
}

export default function CreateQuoteClient({
  initialQuote,
  userId,
}: CreateQuoteClientProps) {
  const router = useRouter();

  // 1. ZUSTAND : GESTION D'ÉTAT UI (RAPIDE)
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

  // 2. HYDRATATION : SERVEUR -> ZUSTAND
  useEffect(() => {
    if (initialQuote) {
      setActiveQuote(initialQuote);
    }
    setIsLoading(false);
  }, [initialQuote, setActiveQuote]);

  // Calculs en temps réel
  const totals = useMemo(
    () => calculateQuoteTotals(activeQuote),
    [activeQuote]
  );

  // Debounce pour l'Auto-Save (2s)
  const debouncedQuote = useDebounce(activeQuote, 2000);
  const debouncedTotals = useMemo(
    () => calculateQuoteTotals(debouncedQuote),
    [debouncedQuote]
  );

  // 3. FONCTION DE SAUVEGARDE : ZUSTAND -> SERVER ACTION -> DB
  const handleSaveToDB = async () => {
    if (!activeQuote) return;
    setIsSaving(true);

    try {
      // Construction du Payload sécurisé pour le Server Action
      const payload: QuotePayload = {
        id: activeQuote.id === "new" ? undefined : activeQuote.id,
        number: activeQuote.quote.number,
        issueDate: new Date(activeQuote.quote.issueDate),
        terms: activeQuote.quote.terms,
        totalTTC: totals.totalTTC,
        financials: activeQuote.financials,
        client: activeQuote.client,
        company: activeQuote.company, // Mise à jour de l'émetteur
        status: activeQuote.meta.status, // Mise à jour du statut
        items: activeQuote.items.map((item: any) => ({
          title: item.title,
          quantity: item.quantity,
          unitPriceEuros: item.unitPriceEuros,
          subtitle: item.subtitle,
        })),
      };

      const result = await saveDevisAction(payload);

      if (result.success && result.devisId) {
        // Cas spécial : Si on vient de créer un nouveau devis ("new"),
        // on met à jour l'URL et l'ID local pour éviter de le recréer au prochain save.
        if (activeQuote.id === "new") {
          router.replace(`/devis/${result.devisId}`);
          setActiveQuote({ ...activeQuote, id: result.devisId });
        }
        console.log("✅ Devis sauvegardé sur Neon.");
      } else {
        // Gestion d'erreur silencieuse pour l'autosave, ou toast pour le manuel
        console.error("Erreur Save:", result.error);
      }
    } catch (e) {
      console.error("Erreur critique:", e);
    } finally {
      setIsSaving(false);
    }
  };

  // 4. AUTOSAVE INTELLIGENT
  useEffect(() => {
    // Conditions d'arrêt : chargement en cours, pas de donnée, ou c'est un "nouveau" devis
    // (on attend souvent le premier save manuel pour créer la ligne en DB, ou on le fait ici)
    if (!debouncedQuote || isLoading) return;

    // Si l'ID est "new", on peut choisir de ne pas autosave pour ne pas spammer la DB de brouillons vides,
    // ou alors on autosave quand même. Ici, je bloque l'autosave sur "new" pour être propre.
    if (debouncedQuote.id === "new") return;

    handleSaveToDB();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuote]);

  // 5. EXPORT PDF
  const handleExportPDF = async () => {
    if (!activeQuote) return;
    // On force une sauvegarde avant de générer le PDF pour être sûr des données
    await handleSaveToDB();

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
    }
  };

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
          onSave={handleSaveToDB} // Sauvegarde Manuelle
          isSaving={isSaving}
          zoom={zoom}
          setZoom={setZoom}
          onExport={handleExportPDF} // Export PDF
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
      {viewMode === "edit" ? (
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
        <div className="w-full h-full flex justify-center items-start pt-8 pb-20">
          <PDFViewer
            width="100%"
            height="1200px"
            className="shadow-2xl rounded-lg border border-neutral-200"
            showToolbar={false}
          >
            <QuoteDocument
              quote={debouncedQuote || activeQuote}
              totals={debouncedTotals}
            />
          </PDFViewer>
        </div>
      )}
    </EditorLayout>
  );
}
