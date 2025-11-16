"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// --- Import du store et des types ---
import { useQuoteStore, QuoteDataState } from "@/store/quote.store";

// --- Icônes Lucide ---
import { PlusIcon, TrashIcon, EditIcon, FileText } from "lucide-react";

// --- Composants shadcn/ui ---
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area"; // <-- Ajouté pour le tiroir
import { QuoteEditorForm } from "@/components/QuoteEditorForm"; // <-- Importe le "cerveau"

// --- Header (identique) ---
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
export default function MyQuotesPage() {
  const router = useRouter();

  // --- Lecture des données depuis Zustand ---
  const quotes = useQuoteStore((state) => state.quotes);
  const { loadQuoteForEditing, deleteQuoteFromList, resetActiveQuote } =
    useQuoteStore();

  // État local pour contrôler l'ouverture du <Sheet> d'édition
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [activeQuoteNumber, setActiveQuoteNumber] = useState<string | null>(
    null
  );

  // Hook pour s'assurer que le store est prêt côté client
  const [hasHydrated, setHasHydrated] = useState(false);
  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const handleEdit = (quoteNumber: string) => {
    // 1. Charger le devis dans le store
    loadQuoteForEditing(quoteNumber);
    // 2. Noter quel devis on modifie (pour le titre du <Sheet>)
    setActiveQuoteNumber(quoteNumber);
    // 3. Ouvrir le tiroir
    setIsSheetOpen(true);
  };

  const handleCreateNew = () => {
    // 1. Réinitialiser l'éditeur à un devis vide
    resetActiveQuote();
    // 2. Rediriger vers la page de création
    router.push("/creer");
  };

  const handleDelete = (quoteNumber: string) => {
    deleteQuoteFromList(quoteNumber);
  };

  // Gestion de l'état d'hydratation (évite les erreurs Next.js)
  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-muted/20 text-foreground">
        <AppHeader />
        {/* On peut mettre un loader ici */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 text-foreground">
      <AppHeader />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Mes Devis</h1>
          <Button onClick={handleCreateNew}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Créer un devis
          </Button>
        </div>

        {quotes.length === 0 ? (
          <EmptyState onCreateNew={handleCreateNew} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quotes.map((quote) => (
              <QuoteCard
                key={quote.quote.number}
                quote={quote}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {/* --- LE TIROIR D'ÉDITION --- */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-4xl p-0">
          <SheetHeader className="p-6 border-b">
            <SheetTitle>Modification du devis</SheetTitle>
            <SheetDescription>{activeQuoteNumber}</SheetDescription>
          </SheetHeader>
          {/* On rend le formulaire "cerveau" dans une zone scrollable */}
          <ScrollArea className="h-[calc(100vh-150px)]">
            <QuoteEditorForm />
          </ScrollArea>
          <SheetFooter className="p-6 border-t">
            <SheetClose asChild>
              <Button variant="outline">Annuler</Button>
            </SheetClose>
            <SheetClose asChild>
              {/* Le bouton "Sauvegarder" est géré par le handleSubmit
                  du formulaire, mais on ajoute un bouton "Fermer"
                  pour une meilleure UX.
                  L'idéal serait de lier le 'onSaveQuote' du store ici.
              */}
              <Button>Fermer</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

// --- Composant Carte (Inchangé) ---
function QuoteCard({
  quote,
  onEdit,
  onDelete,
}: {
  quote: QuoteDataState;
  onEdit: (quoteNumber: string) => void;
  onDelete: (quoteNumber: string) => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const totalTTC = useMemo(() => {
    const subTotal = quote.items.reduce(
      (acc, item) => acc + item.quantity * item.unitPriceEuros,
      0
    );
    const totalAfterDiscount = subTotal - quote.financials.discountAmountEuros;
    const taxAmount =
      totalAfterDiscount * (quote.financials.vatRatePercent / 100);
    return (totalAfterDiscount + taxAmount).toFixed(2);
  }, [quote]);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{quote.client.name || "Client non défini"}</CardTitle>
        <CardDescription>{quote.quote.number}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-3xl font-bold font-mono">{totalTTC} €</p>
        <p className="text-sm text-muted-foreground mt-2">
          Créé le: {quote.quote.issueDate}
        </p>
      </CardContent>
      <CardFooter className="flex justify-end gap-x-2">
        {/* ... (AlertDialog pour la suppression - inchangé) ... */}
        <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-destructive">
              <TrashIcon className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Vraiment supprimer ce devis ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. Le devis pour {quote.client.name}{" "}
                sera définitivement supprimé.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive hover:bg-destructive/90"
                onClick={() => onDelete(quote.quote.number)}
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Le bouton "Modifier" déclenche l'ouverture du <Sheet> */}
        <Button variant="outline" onClick={() => onEdit(quote.quote.number)}>
          <EditIcon className="mr-2 h-4 w-4" />
          Modifier
        </Button>
      </CardFooter>
    </Card>
  );
}

// --- Composant "État Vide" (Inchangé) ---
function EmptyState({ onCreateNew }: { onCreateNew: () => void }) {
  return (
    <div className="text-center p-12 border-2 border-dashed border-muted rounded-lg">
      <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-semibold">Aucun devis trouvé</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Commencez par créer votre premier devis.
      </p>
      <Button className="mt-6" onClick={onCreateNew}>
        <PlusIcon className="mr-2 h-4 w-4" />
        Créer un devis
      </Button>
    </div>
  );
}
