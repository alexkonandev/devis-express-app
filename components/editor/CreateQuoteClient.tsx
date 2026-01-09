"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

// --- UI COMPONENTS ---
import { QuoteEditorLayout } from "@/components/editor/quote-editor-layout";
import { StudioSidebarLeft } from "@/components/editor/studio-sidebar-left";
import { StudioSidebarRight } from "@/components/editor/studio-sidebar-right";
import { FloatingToolbar } from "@/components/editor/floating-toolbar";
import { QuoteVisualizer } from "@/components/editor/QuoteVisualizer";

// --- TYPES CENTRALISÉS ---
import {
  EditorActiveQuote,
  EditorUserSettings,
  EditorTheme,
  EditorCatalogOffer,
  EditorClient,
  EditorQuoteItem,
  EditorQuoteStatus,
} from "@/types/editor";

// --- ACTIONS ---
import { upsertQuoteAction } from "@/actions/quote-action";

interface CreateQuoteClientProps {
  initialCatalog: EditorCatalogOffer[];
  initialThemes: EditorTheme[];
  initialClients: EditorClient[];
  userSettings: EditorUserSettings;
  preSelectedTheme?: EditorTheme | null;
  preSelectedOffer?: EditorCatalogOffer | null;
  existingQuoteId?: string;
  initialQuoteData?: EditorActiveQuote;
}

export default function CreateQuoteClient({
  initialCatalog,
  initialThemes,
  initialClients,
  userSettings,
  preSelectedTheme,
  preSelectedOffer,
  existingQuoteId,
  initialQuoteData,
}: CreateQuoteClientProps) {
  const router = useRouter();

  // --- STATE ALIGNÉ (Phone supprimé pour matcher EditorActiveQuote) ---
  const [activeQuote, setActiveQuote] = useState<EditorActiveQuote>(
    initialQuoteData || {
      title: "Nouveau Devis",
      company: {
        name: userSettings.companyName,
        email: userSettings.companyEmail,
        address: userSettings.companyAddress,
        siret: userSettings.companySiret,
        website: userSettings.companyWebsite,
      },
      // ✅ Client aligné : name, email, address, siret uniquement
      client: { name: "", email: "", address: "", siret: "" },
      quote: {
        number: `${userSettings.quotePrefix}${String(
          userSettings.nextQuoteNumber
        ).padStart(3, "0")}`,
        issueDate: new Date().toISOString().split("T")[0],
        terms: userSettings.defaultTerms,
        status: "DRAFT" as EditorQuoteStatus,
      },
      financials: {
        vatRatePercent: userSettings.defaultVatRate,
        discountAmountEuros: 0,
      },
      items: [],
    }
  );

  const [dbQuoteId, setDbQuoteId] = useState<string | null>(
    existingQuoteId || null
  );
  const [activeThemeId, setActiveThemeId] = useState<string>(
    preSelectedTheme?.id ||
      (initialThemes.length > 0 ? initialThemes[0].id : "")
  );
  const [viewMode, setViewMode] = useState<"studio" | "preview">("studio");
  const [zoom, setZoom] = useState<number>(0.85);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const printRef = useRef<HTMLDivElement>(null);

  // --- AUTO-INJECTION D'OFFRE ---
  useEffect(() => {
    if (preSelectedOffer && activeQuote.items.length === 0) {
      const newItem: EditorQuoteItem = {
        title: preSelectedOffer.title,
        subtitle: preSelectedOffer.subtitle || "",
        quantity: 1,
        unitPriceEuros: preSelectedOffer.unitPriceEuros,
      };

      setActiveQuote((prev) => ({
        ...prev,
        items: [newItem],
      }));
    }
  }, [preSelectedOffer, activeQuote.items.length]);

  // --- THEME LOGIC ---
  const activeThemeObject = useMemo(() => {
    return (
      initialThemes.find((t) => t.id === activeThemeId) || initialThemes[0]
    );
  }, [activeThemeId, initialThemes]);

  // --- CALCULS FINANCIERS ---
  const totals = useMemo(() => {
    const subTotal = activeQuote.items.reduce(
      (acc, item) =>
        acc + (Number(item.quantity) * Number(item.unitPriceEuros) || 0),
      0
    );
    const discount = Number(activeQuote.financials.discountAmountEuros) || 0;
    const taxable = Math.max(0, subTotal - discount);
    const vat = taxable * (activeQuote.financials.vatRatePercent / 100);

    return { subTotal, totalTTC: taxable + vat };
  }, [activeQuote.items, activeQuote.financials]);

  // --- HANDLERS ---
  const handleUpdateField = (
    group: keyof EditorActiveQuote | null,
    field: string,
    value: string | number
  ) => {
    setActiveQuote((prev) => {
      if (group === null) return { ...prev, [field]: value };
      const groupData = prev[group];
      if (
        typeof groupData === "object" &&
        groupData !== null &&
        !Array.isArray(groupData)
      ) {
        return {
          ...prev,
          [group]: { ...groupData, [field]: value },
        };
      }
      return prev;
    });
  };

  const handleAddItem = (item: Partial<EditorQuoteItem> = {}) => {
    setActiveQuote((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          title: item.title || "Nouvelle Prestation",
          subtitle: item.subtitle || "",
          quantity: item.quantity || 1,
          unitPriceEuros: item.unitPriceEuros || 0,
        },
      ],
    }));
  };

  const handleUpdateItem = (
    index: number,
    field: keyof EditorQuoteItem,
    value: string | number
  ) => {
    setActiveQuote((prev) => {
      const newItems = [...prev.items];
      newItems[index] = {
        ...newItems[index],
        [field]: value,
      } as EditorQuoteItem;
      return { ...prev, items: newItems };
    });
  };

  const handleRemoveItem = (index: number) => {
    setActiveQuote((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleMoveItem = (fromIndex: number, toIndex: number) => {
    setActiveQuote((prev) => {
      const newItems = [...prev.items];
      const [movedItem] = newItems.splice(fromIndex, 1);
      newItems.splice(toIndex, 0, movedItem);
      return { ...prev, items: newItems };
    });
  };

  const handleSaveQuote = async () => {
    if (!activeQuote.client.name) {
      toast.error("Veuillez renseigner un nom de client.");
      return;
    }

    setIsSaving(true);
    try {
      // ✅ Désormais, les types match parfaitement (phone absent des deux côtés)
      const result = await upsertQuoteAction(activeQuote, dbQuoteId);
      if (result.success && result.data) {
        setDbQuoteId(result.data.id);
        toast.success("Devis enregistré !");
        router.refresh();
      } else {
        toast.error(result.error || "Une erreur est survenue.");
      }
    } catch {
      toast.error("Échec de la connexion au serveur.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <QuoteEditorLayout
      leftSidebar={
        viewMode === "studio" && (
          <StudioSidebarLeft
            activeQuote={activeQuote}
            updateField={handleUpdateField}
            initialClients={initialClients}
          />
        )
      }
      rightSidebar={
        viewMode === "studio" && (
          <StudioSidebarRight
            activeQuote={activeQuote}
            availableThemes={initialThemes}
            currentTheme={activeThemeId}
            setTheme={setActiveThemeId}
            catalogItems={initialCatalog}
            addItem={handleAddItem}
            updateItem={handleUpdateItem}
            removeItem={handleRemoveItem}
            moveItem={handleMoveItem}
            totals={totals}
          />
        )
      }
      bottomToolbar={
        <FloatingToolbar
          zoom={zoom}
          setZoom={setZoom}
          onPrint={() => window.print()}
          onSave={handleSaveQuote}
          isSaving={isSaving}
          viewMode={viewMode}
          setViewMode={setViewMode}
          themes={initialThemes}
          activeThemeId={activeThemeId}
          onThemeChange={setActiveThemeId}
        />
      }
    >
      <div
        className={cn(
          "flex justify-center items-start pt-12 pb-32 min-h-full transition-all duration-300 origin-top",
          viewMode === "preview" ? "bg-zinc-900/40 scale-100" : ""
        )}
        style={{
          transform: viewMode === "studio" ? `scale(${zoom})` : undefined,
        }}
      >
        <div id="printable-content" className="shadow-2xl shadow-black/10">
          <QuoteVisualizer
            data={activeQuote}
            theme={activeThemeObject}
            printRef={printRef as React.RefObject<HTMLDivElement>}
          />
        </div>
      </div>
    </QuoteEditorLayout>
  );
}
