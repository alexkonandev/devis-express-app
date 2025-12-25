"use client";

import React, { useState, useRef, useMemo } from "react";
import { Theme } from "@prisma/client";
import { QuoteEditorLayout } from "@/components/editor/quote-editor-layout";
import { StudioSidebarLeft } from "@/components/editor/studio-sidebar-left";
import { StudioSidebarRight } from "@/components/editor/studio-sidebar-right";
import { FloatingToolbar } from "@/components/editor/floating-toolbar";
import { QuoteVisualizer } from "@/components/editor/QuoteVisualizer";
import PrintableQuote from "@/components/pdf/PrintableQuote";

// --- INTERFACES (INCHANGÉES) ---

interface QuoteItem {
  title: string;
  subtitle: string;
  quantity: number;
  unitPriceEuros: number;
}

interface ActiveQuote {
  title: string;
  company: {
    name: string;
    email: string;
    phone: string;
    address?: string;
    siret?: string;
    website?: string;
  };
  client: { name: string; email: string; address: string };
  quote: { number: string; issueDate: string | Date; terms: string };
  financials: { vatRatePercent: number; discountAmountEuros: number };
  items: QuoteItem[];
}

interface ServiceItem {
  id: string;
  title: string;
  description?: string;
  salesCopy?: { description: string };
  unitPriceEuros?: number;
  defaultPrice?: number;
  category?: string;
}

interface UserSettings {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  companySiret: string;
  companyWebsite: string;
  quotePrefix: string;
  nextQuoteNumber: number;
  defaultVatRate: number;
  defaultTerms: string;
}

interface CreateQuoteClientProps {
  initialCatalog: ServiceItem[];
  initialTemplates: ServiceItem[];
  initialThemes: Theme[];
  userSettings: UserSettings;
}

export default function CreateQuoteClient({
  initialCatalog,
  initialTemplates,
  initialThemes,
  userSettings,
}: CreateQuoteClientProps) {
  // --- STATE ---

  const [activeQuote, setActiveQuote] = useState<ActiveQuote>({
    title: "Nouveau Devis",
    company: {
      name: userSettings.companyName,
      email: userSettings.companyEmail,
      phone: userSettings.companyPhone,
      address: userSettings.companyAddress,
      siret: userSettings.companySiret,
      website: userSettings.companyWebsite,
    },
    client: { name: "", email: "", address: "" },
    quote: {
      number: `${userSettings.quotePrefix}${String(
        userSettings.nextQuoteNumber
      ).padStart(3, "0")}`,
      issueDate: new Date().toISOString().split("T")[0],
      terms: userSettings.defaultTerms,
    },
    financials: {
      vatRatePercent: userSettings.defaultVatRate,
      discountAmountEuros: 0,
    },
    items: [],
  });

  const [activeThemeId, setActiveThemeId] = useState<string>(
    initialThemes.length > 0 ? initialThemes[0].id : ""
  );

  const activeThemeObject = useMemo(() => {
    return (
      initialThemes.find((t) => t.id === activeThemeId) || initialThemes[0]
    );
  }, [activeThemeId, initialThemes]);

  const [viewMode, setViewMode] = useState<"studio" | "preview">("studio");
  const [zoom, setZoom] = useState<number>(0.85);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const printRef = useRef<HTMLDivElement>(null);

  // --- CRUD HANDLERS ---

  const handleUpdateField = (
    group: keyof ActiveQuote | null,
    field: string,
    value: string | number
  ) => {
    setActiveQuote((prev) => {
      if (group === null) return { ...prev, [field]: value };
      // @ts-ignore
      return { ...prev, [group]: { ...prev[group], [field]: value } };
    });
  };

  const handleAddItem = (item: Partial<QuoteItem> = {}) => {
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
    field: keyof QuoteItem,
    value: string | number
  ) => {
    setActiveQuote((prev) => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
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

  // Préparation de la liste des thèmes (utilisée par Sidebar ET Toolbar)
  const formattedThemesForSidebar = initialThemes.map((t) => ({
    id: t.id,
    name: t.name,
    color: t.color,
    description: t.description || undefined,
  }));

  return (
    <QuoteEditorLayout
      // 1. SIDEBAR GAUCHE (Masquée en Preview)
      leftSidebar={
        viewMode === "studio" ? (
          <StudioSidebarLeft
            activeQuote={activeQuote}
            updateField={handleUpdateField}
          />
        ) : undefined
      }
      // 2. SIDEBAR DROITE (Masquée en Preview)
      rightSidebar={
        viewMode === "studio" ? (
          <StudioSidebarRight
            activeQuote={activeQuote}
            availableThemes={formattedThemesForSidebar}
            currentTheme={activeThemeId}
            setTheme={setActiveThemeId}
            catalogItems={initialCatalog}
            systemTemplates={initialTemplates}
            addItem={handleAddItem}
            updateItem={handleUpdateItem}
            removeItem={handleRemoveItem}
            moveItem={handleMoveItem}
          />
        ) : undefined
      }
      // 3. TOOLBAR FLOTTANTE (Toujours visible, avec Quick Switcher)
      bottomToolbar={
        <FloatingToolbar
          zoom={zoom}
          setZoom={setZoom}
          onPrint={() => window.print()}
          onSave={() => setIsSaving(true)}
          isSaving={isSaving}
          viewMode={viewMode}
          setViewMode={setViewMode}
          // --- CONNEXION DU QUICK SWITCHER ---
          themes={formattedThemesForSidebar}
          activeThemeId={activeThemeId}
          onThemeChange={setActiveThemeId}
        />
      }
    >
      <div
        // 4. ZONE CENTRALE (Ambiance adaptée)
        className={`flex justify-center items-start pt-12 pb-32 min-h-full transition-all duration-200 origin-top will-change-transform `}
        style={{
          transform: viewMode === "studio" ? `scale(${zoom})` : "none",
        }}
      >
        <div id="printable-content">
          {viewMode === "studio" ? (
            // MODE STUDIO : QuoteVisualizer (Édition)
            <QuoteVisualizer
              data={activeQuote}
              theme={activeThemeObject}
              printRef={printRef as React.RefObject<HTMLDivElement>}
              zoom={1}
            />
          ) : (
            // MODE PREVIEW : PrintableQuote (Aperçu final)
            <div className="flex justify-center my-8">
              <PrintableQuote
                ref={printRef as React.RefObject<HTMLDivElement>}
                quote={activeQuote as any}
                theme={activeThemeObject}
              />
            </div>
          )}
        </div>
      </div>
    </QuoteEditorLayout>
  );
}
