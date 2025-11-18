"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useQuoteStore } from "@/store/quote.store";
import { Button } from "@/components/ui/button";
import { QuoteEditorForm } from "@/components/QuoteEditorForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FilePenLine,
  User,
  ListChecks,
  Percent,
  Receipt,
  Info,
  Lightbulb,
} from "lucide-react";

function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200/50 bg-background/90 backdrop-blur-sm">
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

function PageTitleBanner() {
  return (
    <section className=" py-6 flex justify-between items-center ">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          Créer un nouveau devis
        </h1>
        <p className="mt-1 text-neutral-600">
          Remplissez les sections ci-dessous pour générer votre document.
        </p>
      </div>
      <FilePenLine className="w-10 h-10 text-neutral-300 hidden sm:block" />
    </section>
  );
}

function StepsIndicator() {
  const steps = [
    { name: "Client", icon: User, status: "current" },
    { name: "Prestations", icon: ListChecks, status: "upcoming" },
    { name: "Taxes", icon: Percent, status: "upcoming" },
    { name: "Résumé", icon: Receipt, status: "upcoming" },
  ];

  return (
    <nav aria-label="Progression" className="hidden md:block">
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200/80 p-5">
        <ol className="flex items-center">
          {steps.map((step, stepIdx) => (
            <li
              key={step.name}
              className={`relative flex-1 ${
                stepIdx !== steps.length - 1 ? "pr-12" : ""
              }`}
            >
              {step.status === "current" && (
                <div className="flex items-center gap-x-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <step.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-sm font-semibold text-primary">
                      {step.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Étape {stepIdx + 1}
                    </span>
                  </span>
                </div>
              )}
              {step.status === "upcoming" && (
                <div className="flex items-center gap-x-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed border-neutral-300 bg-neutral-50">
                    <step.icon
                      className="h-5 w-5 text-neutral-400"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-sm font-medium text-neutral-500">
                      {step.name}
                    </span>
                    <span className="text-xs text-neutral-400">
                      Étape {stepIdx + 1}
                    </span>
                  </span>
                </div>
              )}

              {stepIdx !== steps.length - 1 ? (
                <div
                  className="absolute right-0 top-1/2 -translate-y-1/2 h-0.5 w-8 bg-neutral-200"
                  aria-hidden="true"
                />
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}



export default function CreateQuotePage() {
  const resetActiveQuote = useQuoteStore((state) => state.resetActiveQuote);

  useEffect(() => {
    resetActiveQuote();
  }, [resetActiveQuote]);

  return (
    <div className="min-h-screen bg-muted/20 text-foreground">
      <AppHeader />

      <main className="mx-auto max-w-7xl px-4 sm:px-6  animate-in fade-in duration-500">
        <div className="space-y-8">
          <PageTitleBanner />
          <StepsIndicator />

          <div className="flex rounded-xl shadow-sm">
            <QuoteEditorForm mode="create" />
          </div>
        </div>
      </main>

      <footer className="text-center py-6">
        <p className="text-xs text-neutral-500">
          Vos données sont automatiquement sauvegardées dans votre navigateur.
        </p>
      </footer>
    </div>
  );
}
