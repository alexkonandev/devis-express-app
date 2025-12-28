"use client";

import React, { useState, useRef, useMemo } from "react";
import { Theme } from "@prisma/client";
import { toast } from "sonner"; // Pour les notifications
import { useRouter } from "next/navigation"; // Pour rediriger si besoin

import { Client as ClientType } from "@/hooks/useClientManager";
import { QuoteEditorLayout } from "@/components/editor/quote-editor-layout";
import { StudioSidebarLeft } from "@/components/editor/studio-sidebar-left";
import { StudioSidebarRight } from "@/components/editor/studio-sidebar-right";
import { FloatingToolbar } from "@/components/editor/floating-toolbar";
import { QuoteVisualizer } from "@/components/editor/QuoteVisualizer";
import PrintableQuote from "@/components/pdf/PrintableQuote";
import { cn } from "@/lib/utils";

// IMPORT DE L'ACTION BACKEND
import { upsertQuoteAction } from "@/app/actions/quote.actions";

// --- INTERFACES ---
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
  client: {
    name: string;
    email: string;
    phone: string;
    address: string;
    siret: string;
  };
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
  initialClients: ClientType[];
  userSettings: UserSettings;
  // Optionnel: si on édite un devis existant
  existingQuoteId?: string;
  initialQuoteData?: ActiveQuote;
}

export default function CreateQuoteClient({
  initialCatalog,
  initialTemplates,
  initialThemes,
  initialClients,
  userSettings,
  existingQuoteId, // À venir pour le mode édition
  initialQuoteData,
}: CreateQuoteClientProps) {
  const router = useRouter();

  // --- STATE ---

  // Si on a des données initiales (mode edit), on les utilise, sinon valeurs par défaut
  const [activeQuote, setActiveQuote] = useState<ActiveQuote>(
    initialQuoteData || {
      title: "Nouveau Devis",
      company: {
        name: userSettings.companyName,
        email: userSettings.companyEmail,
        phone: userSettings.companyPhone,
        address: userSettings.companyAddress,
        siret: userSettings.companySiret,
        website: userSettings.companyWebsite,
      },
      client: { name: "", email: "", phone: "", address: "", siret: "" },
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
    }
  );

  // ID du devis en base de données (null si nouveau, string si sauvegardé)
  const [dbQuoteId, setDbQuoteId] = useState<string | null>(
    existingQuoteId || null
  );

  const [activeThemeId, setActiveThemeId] = useState<string>(
    initialThemes.length > 0 ? initialThemes[0].id : ""
  );

  const [viewMode, setViewMode] = useState<"studio" | "preview">("studio");
  const [zoom, setZoom] = useState<number>(0.8);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const printRef = useRef<HTMLDivElement>(null);

  // --- MEMOS ---
  const activeThemeObject = useMemo(() => {
    return (
      initialThemes.find((t) => t.id === activeThemeId) || initialThemes[0]
    );
  }, [activeThemeId, initialThemes]);

  const formattedThemesForSidebar = useMemo(
    () =>
      initialThemes.map((t) => ({
        id: t.id,
        name: t.name,
        color: t.color,
        description: t.description || undefined,
      })),
    [initialThemes]
  );

  // --- HANDLERS D'ÉTAT ---
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

  // --- HANDLER SAUVEGARDE (DATABASE) ---
  const handleSaveQuote = async () => {
    if (!activeQuote.client.name) {
      toast.error("Veuillez renseigner un nom de client.");
      return;
    }

    setIsSaving(true);

    // Appel à la Server Action
    const result = await upsertQuoteAction(activeQuote, dbQuoteId);

    if (result.success && result.data) {
      setDbQuoteId(result.data.id); // On enregistre l'ID pour les prochaines sauvegardes
      toast.success("Devis enregistré avec succès !");

      // Optionnel : Changer l'URL pour refléter l'ID sans recharger la page
      // window.history.replaceState(null, "", `/devis/${result.data.id}`);
    } else {
      toast.error(result.error || "Erreur lors de la sauvegarde.");
    }

    setIsSaving(false);
  };

  // --- HANDLER PDF ---
  const handleGeneratePDF = async () => {
    // 1. On sauvegarde d'abord pour être sûr d'avoir la dernière version en base
    if (!dbQuoteId) {
      await handleSaveQuote();
    } else {
      // Sauvegarde silencieuse (sans bloquer si déjà existant, mais bonne pratique)
      upsertQuoteAction(activeQuote, dbQuoteId);
    }

    setIsSaving(true);
    try {
      const element = document.getElementById("printable-content");
      if (!element) return;

      const config = activeThemeObject.config as any;
      const primary = config?.colors?.primary || "#000000";
      const secondary = config?.colors?.secondary || "#666666";
      const text = config?.colors?.text || "#000000";
      const bg = config?.colors?.bg || "#ffffff";
      const border = config?.colors?.border || "#e5e7eb";
      const fontFamily = config?.typography?.fontFamily || "Inter, sans-serif";
      const headingWeight = config?.typography?.headingWeight || "700";

      const styles = Array.from(document.querySelectorAll("style"))
        .map((style) => style.innerHTML)
        .join("\n");

      const fullHTML = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap" rel="stylesheet">
            <script src="https://cdn.tailwindcss.com"></script>
            <script>
              tailwind.config = {
                theme: {
                  extend: {
                    colors: {
                      border: "var(--border)",
                      input: "var(--input)",
                      ring: "var(--ring)",
                      background: "var(--bg)",
                      foreground: "var(--text)",
                    },
                    fontFamily: {
                      sans: ['var(--font-family)', 'ui-sans-serif', 'system-ui'],
                      heading: ['var(--font-family)', 'ui-sans-serif'],
                    }
                  }
                }
              }
            </script>
            <style>
              ${styles}
              :root {
                --primary: ${primary} !important;
                --secondary: ${secondary} !important;
                --text: ${text} !important;
                --bg: ${bg} !important;
                --border: ${border} !important;
                --font-family: ${fontFamily} !important;
                --heading-weight: ${headingWeight} !important;
              }
              body {
                margin: 0; padding: 0; background: white;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                font-family: var(--font-family); color: var(--text);
              }
              h1, h2, h3, .text-4xl, .text-5xl, .text-6xl, .font-bold {
                font-family: var(--font-family) !important;
                font-weight: var(--heading-weight, 700) !important;
              }
              .theme-scope-${activeThemeObject.id} h1 {
                 font-weight: 800 !important;
              }
            </style>
          </head>
          <body>
            <div class="theme-scope-${activeThemeObject.id}" style="width: 210mm; min-height: 297mm;">
              ${element.innerHTML}
            </div>
          </body>
        </html>
      `;

      const response = await fetch("/api/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          html: fullHTML,
          fileName: `Devis_${
            activeQuote.quote.number
          }_${activeQuote.client.name.replace(/\s+/g, "_")}`,
        }),
      });

      if (!response.ok) throw new Error("Génération PDF échouée");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Devis_${activeQuote.quote.number}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error("PDF_DL_ERROR:", error);
      toast.error("Erreur lors de la génération PDF");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <QuoteEditorLayout
      leftSidebar={
        viewMode === "studio" ? (
          <StudioSidebarLeft
            activeQuote={activeQuote}
            updateField={handleUpdateField}
            initialClients={initialClients}
          />
        ) : undefined
      }
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
      bottomToolbar={
        <FloatingToolbar
          zoom={zoom}
          setZoom={setZoom}
          onPrint={handleGeneratePDF}
          onSave={handleSaveQuote} // <-- CONNEXION ICI
          isSaving={isSaving}
          viewMode={viewMode}
          setViewMode={setViewMode}
          themes={formattedThemesForSidebar}
          activeThemeId={activeThemeId}
          onThemeChange={setActiveThemeId}
        />
      }
    >
      <div
        className={cn(
          "flex justify-center items-start pt-12 pb-32 min-h-full transition-all duration-300 origin-top will-change-transform",
          viewMode === "preview" ? "bg-zinc-900/40" : "bg-transparent"
        )}
        style={{ transform: `scale(${zoom})` }}
      >
        <div id="printable-content" className="shadow-2xl shadow-black/10">
          {viewMode === "studio" ? (
            <QuoteVisualizer
              data={activeQuote}
              theme={activeThemeObject}
              printRef={printRef as React.RefObject<HTMLDivElement>}
              zoom={1}
            />
          ) : (
            <div className="flex justify-center">
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
