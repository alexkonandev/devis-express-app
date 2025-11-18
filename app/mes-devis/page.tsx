"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// --- Import du store et des types (INCHANGÉ) ---
import { useQuoteStore, QuoteDataState } from "@/store/quote.store";

// --- Icônes Lucide (Étendues pour l'UI File Manager) ---
import {
  PlusIcon,
  TrashIcon,
  EditIcon,
  FileText,
  FolderOpen,
  Clock,
  CreditCard,
  ArrowRight,
  Search,
  Filter,
  LayoutGrid,
  List,
  Star,
  Archive,
  MoreHorizontal,
  Download,
  Printer,
  ExternalLink,
  ChevronRight,
  File,
  Settings,
  Home,
  Inbox,
  X,
} from "lucide-react";

// --- Composants shadcn/ui (INCHANGÉ) ---
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Nécessaire pour la search bar
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge"; // Nouveau pour les tags

// --- Import du formulaire existant (INCHANGÉ) ---
import { QuoteEditorForm } from "@/components/QuoteEditorForm";

// ============================================================================
// 1. COMPOSANTS UI STRUCTURELS (Arc Style)
// ============================================================================

const TopNavigationBar = ({ onCreateNew }: { onCreateNew: () => void }) => (
  <header className="sticky top-0 z-50 w-full h-16 flex items-center justify-between px-6 bg-white/70 backdrop-blur-xl border-b border-neutral-200/60 transition-all duration-300">
    <div className="flex items-center gap-2">
      <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-700 flex items-center justify-center text-white shadow-lg shadow-neutral-500/20">
        <FileText className="h-4 w-4" />
      </div>
      <span className="font-bold text-lg tracking-tight text-neutral-900">
        DEVIS EXPRESS
      </span>
    </div>

    <div className="flex items-center gap-3">
      <Button
        variant="ghost"
        size="sm"
        className="text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100/50"
      >
        <Settings className="h-4 w-4" />
      </Button>
      <Separator orientation="vertical" className="h-6 bg-neutral-200" />
      <Button
        onClick={onCreateNew}
        className="rounded-full px-6 bg-neutral-900 text-white hover:bg-neutral-800 shadow-lg shadow-neutral-900/10 transition-all hover:-translate-y-0.5"
      >
        <PlusIcon className="mr-2 h-4 w-4" />
        Nouveau Devis
      </Button>
    </div>
  </header>
);

const SidebarItem = ({
  icon: Icon,
  label,
  active = false,
  count,
}: {
  icon: any;
  label: string;
  active?: boolean;
  count?: number;
}) => (
  <button
    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${
      active
        ? "bg-neutral-100 text-neutral-900 shadow-sm"
        : "text-neutral-500 hover:bg-white hover:text-neutral-700 hover:shadow-sm"
    }`}
  >
    <div className="flex items-center gap-3">
      <Icon
        className={`h-4 w-4 ${
          active
            ? "text-neutral-900"
            : "text-neutral-400 group-hover:text-neutral-600"
        }`}
      />
      <span>{label}</span>
    </div>
    {count !== undefined && (
      <span className="text-xs text-neutral-400 bg-neutral-50 px-2 py-0.5 rounded-full border border-neutral-100">
        {count}
      </span>
    )}
  </button>
);

const AppSidebar = ({ totalCount }: { totalCount: number }) => (
  <aside className="hidden md:flex w-64 flex-col gap-6 border-r border-neutral-200/60 bg-neutral-50/50 p-4 h-[calc(100vh-64px)] sticky top-16">
    <div className="space-y-1">
      <h3 className="px-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
        Espace de travail
      </h3>
      <SidebarItem
        icon={Inbox}
        label="Tous les devis"
        active
        count={totalCount}
      />
      <SidebarItem icon={Star} label="Favoris" />
      <SidebarItem icon={Clock} label="Récents" />
      <SidebarItem icon={Archive} label="Archivés" />
    </div>

    <div className="space-y-1">
      <h3 className="px-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
        Dossiers
      </h3>
      <SidebarItem icon={FolderOpen} label="Clients VIP" />
      <SidebarItem icon={FolderOpen} label="Projets Web" />
      <SidebarItem icon={FolderOpen} label="Consulting" />
    </div>

    <div className="mt-auto">
      <Card className="bg-gradient-to-br from-white to-neutral-50 border-neutral-200 shadow-sm">
        <CardContent className="p-4">
          <p className="text-xs font-medium text-neutral-600 mb-1">
            Stockage local
          </p>
          <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
            <div className="h-full w-[35%] bg-neutral-900 rounded-full" />
          </div>
          <p className="text-[10px] text-neutral-400 mt-2">
            Vos données sont privées.
          </p>
        </CardContent>
      </Card>
    </div>
  </aside>
);

const Toolbar = ({ onSearch }: { onSearch: (term: string) => void }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
    <div className="flex items-center gap-2 text-sm text-neutral-500">
      <Link href="/" className="hover:text-neutral-900 transition-colors">
        Accueil
      </Link>
      <ChevronRight className="h-3 w-3" />
      <span className="font-medium text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded-md">
        Mes Devis
      </span>
    </div>

    <div className="flex items-center gap-2">
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 group-focus-within:text-neutral-600 transition-colors" />
        <Input
          placeholder="Rechercher un client..."
          className="pl-9 w-full sm:w-64 bg-white border-neutral-200 focus-visible:ring-neutral-200 focus-visible:border-neutral-400 rounded-full transition-all shadow-sm"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <Separator orientation="vertical" className="h-8 mx-1" />
      <Button
        variant="outline"
        size="icon"
        className="rounded-full border-neutral-200 text-neutral-500 hover:text-neutral-900 hover:bg-white shadow-sm"
      >
        <Filter className="h-4 w-4" />
      </Button>
      <div className="flex bg-white rounded-full border border-neutral-200 p-1 shadow-sm">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-full bg-neutral-100 text-neutral-900"
        >
          <LayoutGrid className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-full text-neutral-400 hover:text-neutral-600"
        >
          <List className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  </div>
);

// ============================================================================
// 2. COMPOSANTS MÉTIER (Cards, Preview)
// ============================================================================

// Carte Devis (Refondue style File Manager)
const FileQuoteCard = ({ quote, active, onClick, onEdit, onDelete }: any) => {
  const totalTTC = useMemo(() => {
    const subTotal = quote.items.reduce(
      (acc: any, item: any) => acc + item.quantity * item.unitPriceEuros,
      0
    );
    const totalAfterDiscount = subTotal - quote.financials.discountAmountEuros;
    const taxAmount =
      totalAfterDiscount * (quote.financials.vatRatePercent / 100);
    return (totalAfterDiscount + taxAmount).toFixed(2);
  }, [quote]);

  return (
    <div
      onClick={() => onClick(quote)}
      className={`group relative p-4 rounded-2xl border transition-all duration-300 cursor-pointer
            ${
              active
                ? "bg-white border-neutral-300 shadow-[0_0_0_4px_rgba(0,0,0,0.03)] ring-1 ring-neutral-900/5"
                : "bg-white/50 border-neutral-200 hover:bg-white hover:border-neutral-300 hover:shadow-lg hover:shadow-neutral-500/5"
            }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div
          className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors
                    ${
                      active
                        ? "bg-neutral-900 text-white"
                        : "bg-neutral-100 text-neutral-500 group-hover:bg-neutral-200"
                    }`}
        >
          <FileText className="h-5 w-5" />
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full hover:bg-neutral-100"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(quote.quote.number);
            }}
          >
            <EditIcon className="h-3.5 w-3.5 text-neutral-600" />
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full hover:bg-red-50 text-neutral-400 hover:text-red-600"
                onClick={(e) => e.stopPropagation()}
              >
                <TrashIcon className="h-3.5 w-3.5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border-neutral-200 shadow-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle>Supprimer ce devis ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Action irréversible. Le devis{" "}
                  <span className="font-mono font-medium text-neutral-900">
                    {quote.quote.number}
                  </span>{" "}
                  sera effacé.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-full border-neutral-200">
                  Annuler
                </AlertDialogCancel>
                <AlertDialogAction
                  className="rounded-full bg-red-600 hover:bg-red-700 border-red-600 text-white"
                  onClick={(e) => {
                    e.stopPropagation(); // Important pour ne pas trigger la preview
                    onDelete(quote.quote.number);
                  }}
                >
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="space-y-1">
        <h4 className="font-semibold text-neutral-900 truncate pr-2">
          {quote.client.name || "Client sans nom"}
        </h4>
        <p className="text-xs text-neutral-400 font-mono">
          {quote.quote.number}
        </p>
      </div>

      <Separator className="my-3 bg-neutral-100" />

      <div className="flex items-end justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
            Total TTC
          </span>
          <span className="font-medium text-neutral-900">{totalTTC} €</span>
        </div>
        <Badge
          variant="secondary"
          className="bg-neutral-100 text-neutral-500 hover:bg-neutral-200 font-normal text-[10px]"
        >
          {quote.quote.issueDate}
        </Badge>
      </div>
    </div>
  );
};

// Aperçu du PDF (Split View)
const QuotePreviewPanel = ({
  quote,
  onClose,
  onEdit,
}: {
  quote: any;
  onClose: () => void;
  onEdit: () => void;
}) => {
  if (!quote) return null;

  const totalTTC =
    quote.items.reduce(
      (acc: any, item: any) => acc + item.quantity * item.unitPriceEuros,
      0
    ) *
    (1 + quote.financials.vatRatePercent / 100);

  return (
    <div className="h-full flex flex-col bg-white border-l border-neutral-200 shadow-[0_0_40px_rgba(0,0,0,0.03)] animate-in slide-in-from-right duration-300">
      {/* Preview Header */}
      <div className="h-14 border-b border-neutral-100 flex items-center justify-between px-6 bg-white/80 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-neutral-50 border border-neutral-100 flex items-center justify-center">
            <File className="h-4 w-4 text-neutral-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">
              {quote.quote.number}.pdf
            </h3>
            <p className="text-[10px] text-neutral-400">
              Aperçu avant impression
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-neutral-400 hover:text-neutral-900"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-neutral-400 hover:text-neutral-900"
          >
            <Printer className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-neutral-400 hover:text-neutral-900"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Fake PDF Viewer (Visual Representation) */}
      <div className="flex-1 bg-neutral-100/50 p-8 overflow-y-auto flex justify-center">
        <div className="w-full max-w-[500px] min-h-[700px] bg-white shadow-lg rounded-sm p-8 flex flex-col text-[10px] text-neutral-600 border border-neutral-200/50">
          {/* Mock PDF Content */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="h-3 w-20 bg-neutral-900 rounded-sm mb-2" />
              <div className="h-2 w-32 bg-neutral-100 rounded-sm" />
            </div>
            <div className="text-right">
              <div className="font-bold text-neutral-900 text-sm">DEVIS</div>
              <div>#{quote.quote.number}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="p-3 bg-neutral-50 rounded-lg">
              <div className="font-semibold text-neutral-900 mb-1">De</div>
              <div>{quote.company.name}</div>
              <div className="opacity-60">{quote.company.email}</div>
            </div>
            <div className="p-3 bg-neutral-50 rounded-lg">
              <div className="font-semibold text-neutral-900 mb-1">Pour</div>
              <div>{quote.client.name}</div>
              <div className="opacity-60">{quote.client.email}</div>
            </div>
          </div>

          <div className="flex-1">
            <div className="border-b border-neutral-200 pb-2 mb-2 font-semibold grid grid-cols-4">
              <span className="col-span-2">Description</span>
              <span className="text-right">Qté</span>
              <span className="text-right">Prix</span>
            </div>
            {quote.items.map((item: any, i: number) => (
              <div
                key={i}
                className="grid grid-cols-4 py-2 border-b border-neutral-100/50"
              >
                <span className="col-span-2 font-medium text-neutral-800">
                  {item.title}
                </span>
                <span className="text-right">{item.quantity}</span>
                <span className="text-right">{item.unitPriceEuros} €</span>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-4 border-t border-neutral-200">
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold text-neutral-900">Total TTC</span>
              <span className="font-bold text-neutral-900">
                {totalTTC.toFixed(2)} €
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-neutral-200 bg-white/80 backdrop-blur-sm">
        <Button
          onClick={onEdit}
          className="w-full rounded-full bg-neutral-900 hover:bg-neutral-800 text-white shadow-md"
        >
          <EditIcon className="mr-2 h-4 w-4" />
          Modifier ce devis
        </Button>
      </div>
    </div>
  );
};

const PremiumEmptyState = ({ onCreateNew }: { onCreateNew: () => void }) => (
  <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-in fade-in duration-500">
    <div className="relative mb-6">
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-full blur-2xl opacity-60" />
      <div className="relative h-24 w-24 bg-white rounded-2xl shadow-xl shadow-neutral-200/50 flex items-center justify-center border border-neutral-100">
        <FileText className="h-10 w-10 text-neutral-300" />
      </div>
    </div>
    <h2 className="text-2xl font-bold text-neutral-900 mb-2 tracking-tight">
      C'est un peu vide ici...
    </h2>
    <p className="text-neutral-500 max-w-md mb-8">
      Votre espace est prêt. Créez votre premier devis professionnel en quelques
      secondes.
    </p>
    <Button
      onClick={onCreateNew}
      size="lg"
      className="rounded-full px-8 bg-neutral-900 text-white hover:bg-neutral-800 hover:-translate-y-1 transition-all shadow-lg shadow-neutral-900/20"
    >
      <PlusIcon className="mr-2 h-5 w-5" />
      Commencer maintenant
    </Button>
  </div>
);

// ============================================================================
// 3. PAGE PRINCIPALE (MyQuotesPage)
// ============================================================================

export default function MyQuotesPage() {
  const router = useRouter();

  // --- Logique existante (Store) ---
  const quotes = useQuoteStore((state) => state.quotes);
  const { loadQuoteForEditing, deleteQuoteFromList, resetActiveQuote } =
    useQuoteStore();

  // --- États Locaux UI ---
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [activeQuoteNumber, setActiveQuoteNumber] = useState<string | null>(
    null
  );
  const [hasHydrated, setHasHydrated] = useState(false);

  // Nouvel état pour la Split View
  const [selectedQuote, setSelectedQuote] = useState<QuoteDataState | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  // --- Handlers (Connectés à la logique existante) ---
  const handleEdit = (quoteNumber: string) => {
    loadQuoteForEditing(quoteNumber);
    setActiveQuoteNumber(quoteNumber);
    setIsSheetOpen(true);
  };

  const handleCreateNew = () => {
    resetActiveQuote();
    router.push("/creer");
  };

  const handleDelete = (quoteNumber: string) => {
    deleteQuoteFromList(quoteNumber);
    if (selectedQuote?.quote.number === quoteNumber) {
      setSelectedQuote(null); // Fermer la preview si supprimé
    }
  };

  // Filtrage (UI Only)
  const filteredQuotes = useMemo(() => {
    if (!searchTerm) return quotes;
    return quotes.filter(
      (q) =>
        q.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.quote.number.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [quotes, searchTerm]);

  if (!hasHydrated) return <div className="min-h-screen bg-neutral-50" />;

  return (
    <div className="min-h-screen bg-neutral-50 text-foreground font-sans antialiased flex flex-col">
      {/* 1. Top Navigation */}
      <TopNavigationBar onCreateNew={handleCreateNew} />

      <div className="flex flex-1 overflow-hidden">
        {/* 2. Sidebar (Desktop) */}
        <AppSidebar totalCount={quotes.length} />

        {/* 3. Main Workspace */}
        <main className="flex-1 flex flex-col min-w-0 h-[calc(100vh-64px)]">
          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-[1600px] mx-auto h-full flex flex-col">
              {/* Toolbar & Breadcrumbs */}
              {quotes.length > 0 && <Toolbar onSearch={setSearchTerm} />}

              {/* Content Area */}
              <div className="flex-1 flex gap-6 min-h-0 relative">
                {/* A. Grid de devis (Scrollable) */}
                <div
                  className={`flex-1 transition-all duration-500 ease-in-out ${
                    selectedQuote ? "hidden xl:block xl:w-1/2" : "w-full"
                  }`}
                >
                  {filteredQuotes.length === 0 ? (
                    <div className="text-center py-20 text-neutral-400">
                      Aucun résultat trouvé.
                    </div>
                  ) : quotes.length === 0 ? (
                    <PremiumEmptyState onCreateNew={handleCreateNew} />
                  ) : (
                    <div
                      className={`grid gap-4 ${
                        selectedQuote
                          ? "grid-cols-1 lg:grid-cols-2"
                          : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                      }`}
                    >
                      {filteredQuotes.map((quote) => (
                        <FileQuoteCard
                          key={quote.quote.number}
                          quote={quote}
                          active={
                            selectedQuote?.quote.number === quote.quote.number
                          }
                          onClick={setSelectedQuote}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* B. Preview Panel (Split View) */}
                {selectedQuote && (
                  <div className="fixed inset-0 z-40 md:static md:z-auto w-full md:w-[450px] xl:w-[600px] md:block h-full rounded-2xl overflow-hidden ring-1 ring-neutral-200 shadow-2xl md:shadow-none">
                    <QuotePreviewPanel
                      quote={selectedQuote}
                      onClose={() => setSelectedQuote(null)}
                      onEdit={() => handleEdit(selectedQuote.quote.number)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* 4. Le Tiroir d'Édition (Logic Intact) */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-4xl p-0 border-l border-neutral-200 shadow-2xl bg-white">
          <div className="flex flex-col h-full">
            <SheetHeader className="px-8 py-6 border-b border-neutral-100 bg-neutral-50/50">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <SheetTitle className="text-xl font-semibold tracking-tight">
                    Modifier le devis
                  </SheetTitle>
                  <SheetDescription className="text-neutral-500">
                    Référence :{" "}
                    <span className="font-mono text-neutral-700 font-medium">
                      {activeQuoteNumber}
                    </span>
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>

            <div className="flex-1 overflow-hidden bg-white">
              <ScrollArea className="h-full">
                <div className="px-8 py-8">
                  <QuoteEditorForm mode="edit" />
                </div>
              </ScrollArea>
            </div>

            <SheetFooter className="px-8 py-4 border-t border-neutral-100 bg-neutral-50/50">
              <SheetClose asChild>
                <Button
                  variant="outline"
                  className="border-neutral-200 hover:bg-white hover:text-neutral-900"
                >
                  Fermer
                </Button>
              </SheetClose>
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
