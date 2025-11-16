"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useQuoteStore } from "@/store/quote.store";
import { Button } from "@/components/ui/button";
import { QuoteEditorForm } from "@/components/QuoteEditorForm"; // <-- Importe le "cerveau"

// --- Header (local à cette page) ---
function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="font-semibold text-lg tracking-tight"
            aria-label="Retour à l'accueil"
          >
            DEVIS EXPRESS
          </Link>
          <Button variant="outline" asChild>
            <Link href="/mes-devis">Mes devis</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

// --- Composant principal de la page ---
export default function CreateQuotePage() {
  const resetActiveQuote = useQuoteStore((state) => state.resetActiveQuote);

  // Effet pour réinitialiser le formulaire à chaque chargement de cette page.
  // Garantit une "page blanche" pour la création.
  useEffect(() => {
    resetActiveQuote();
  }, [resetActiveQuote]);

  return (
    <div className="min-h-screen bg-muted/20 text-foreground">
      <AppHeader />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Créer un nouveau devis
          </h1>
        </div>

        {/* Affiche le formulaire "cerveau" */}
        <QuoteEditorForm />
      </main>
    </div>
  );
}
