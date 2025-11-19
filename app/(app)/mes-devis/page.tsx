"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuoteStore } from "@/store/quote.store";

import {
  PlusIcon,
  TrashIcon,
  EditIcon,
  FileText,
  Folder,
  Search,
  LayoutGrid,
  List,
  MoreHorizontal,
  Download,
  Printer,
  ChevronRight,
  Home,
  ArrowLeft,
  FolderPlus,
  Loader2,
  X,
  Inbox,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";

// Placeholder si le composant n'est pas encore là
const QuoteEditorForm = ({ mode }: { mode?: string }) => (
  <div>Formulaire Éditeur</div>
);

// ============================================================================
// 1. COMPOSANTS EXPLORATEUR (Dossiers & Fichiers)
// ============================================================================

// --- CARTE DOSSIER ---
const FolderCard = ({ name, count, onClick, onRename, onDelete }: any) => (
  <div
    onClick={onClick}
    className="group relative flex flex-col justify-between p-5 h-40 bg-neutral-50/50 border border-neutral-200 rounded-2xl hover:bg-blue-50/50 hover:border-blue-200 transition-all cursor-pointer select-none active:scale-[0.98]"
  >
    <div className="flex justify-between items-start">
      <div className="h-10 w-10 bg-yellow-100/80 text-yellow-600 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
        <Folder className="h-5 w-5 fill-yellow-500/20" />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white rounded-md text-neutral-400 hover:text-neutral-900 transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onRename(name);
            }}
          >
            Renommer
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(name);
            }}
          >
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <div>
      <h4 className="font-bold text-neutral-900 truncate mb-1">{name}</h4>
      <p className="text-xs text-neutral-500">
        {count} élément{count > 1 ? "s" : ""}
      </p>
    </div>
  </div>
);

// --- CARTE FICHIER (DEVIS) ---
const FileCard = ({ quote, active, onClick, onEdit, onDelete }: any) => {
  const totalTTC = useMemo(() => {
    const subTotal = quote.items.reduce(
      (acc: any, item: any) => acc + item.quantity * item.unitPriceEuros,
      0
    );
    const total = subTotal - quote.financials.discountAmountEuros;
    return (total * (1 + quote.financials.vatRatePercent / 100)).toFixed(2);
  }, [quote]);

  return (
    <div
      onClick={() => onClick(quote)}
      className={`group relative p-5 h-40 flex flex-col justify-between rounded-2xl border transition-all duration-200 cursor-pointer select-none
            ${
              active
                ? "bg-white border-neutral-900 shadow-[0_0_0_2px_rgba(0,0,0,1)]"
                : "bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-lg hover:shadow-neutral-200/50"
            }`}
    >
      <div className="flex justify-between items-start">
        <div
          className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${
            active
              ? "bg-neutral-900 text-white"
              : "bg-neutral-50 text-neutral-500 group-hover:bg-neutral-100"
          }`}
        >
          <FileText className="h-5 w-5" />
        </div>
        {/* Actions au survol */}
        <div
          className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-neutral-100"
            onClick={() => onEdit(quote.quote.number)}
          >
            <EditIcon className="h-4 w-4 text-neutral-500" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
            onClick={() => onDelete(quote.quote.number)}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-baseline mb-1">
          <h4 className="font-bold text-neutral-900 truncate max-w-[120px]">
            {quote.client.name || "Client inconnu"}
          </h4>
          <span className="text-xs font-medium text-neutral-900">
            {totalTTC}€
          </span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-neutral-400 font-mono">
            {quote.quote.number}
          </p>
          <span className="text-[10px] text-neutral-400 bg-neutral-50 px-1.5 py-0.5 rounded">
            {quote.quote.issueDate}
          </span>
        </div>
      </div>
    </div>
  );
};

// --- TOOLBAR EXPLORATEUR ---
const ExplorerToolbar = ({
  currentPath,
  onNavigate,
  onSearch,
  onCreateFolder,
  onCreateQuote,
}: any) => {
  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-neutral-200 px-6 flex items-center justify-between shrink-0 z-20 sticky top-0">
      {/* FIL D'ARIANE (BREADCRUMBS) */}
      <div className="flex items-center gap-2 flex-1">
        <button
          onClick={() => onNavigate("root")}
          className={`flex items-center gap-2 text-sm font-medium transition-colors px-2 py-1 rounded-md hover:bg-neutral-100 ${
            currentPath === "root" ? "text-neutral-900" : "text-neutral-500"
          }`}
        >
          <Home className="w-4 h-4" />
          <span className="hidden sm:inline">Accueil</span>
        </button>

        {currentPath !== "root" && (
          <>
            <ChevronRight className="w-4 h-4 text-neutral-300" />
            <div className="flex items-center gap-2 px-2 py-1 bg-neutral-100 rounded-md text-sm font-bold text-neutral-900">
              <Folder className="w-3.5 h-3.5 text-neutral-500" />
              {currentPath}
            </div>
          </>
        )}
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-3">
        {/* Recherche */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <Input
            placeholder="Rechercher..."
            className="pl-9 w-64 bg-white border-neutral-200 h-9 text-sm"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        <Separator orientation="vertical" className="h-6 bg-neutral-200 mx-2" />

        {/* Boutons Création */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3 border-dashed border-neutral-300 text-neutral-600 hover:border-neutral-400 hover:bg-white"
                onClick={onCreateFolder}
              >
                <FolderPlus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Dossier</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Nouveau dossier</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Button
          onClick={onCreateQuote}
          size="sm"
          className="h-9 bg-neutral-900 text-white hover:bg-black shadow-sm gap-2"
        >
          <PlusIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Nouveau Devis</span>
        </Button>
      </div>
    </header>
  );
};

// ============================================================================
// 2. PAGE PRINCIPALE
// ============================================================================

export default function FileManagerPage() {
  const router = useRouter();
  const {
    quotes,
    userFolders,
    createFolder,
    deleteFolder,
    renameFolder,
    deleteQuoteFromList,
    resetActiveQuote,
    loadQuoteForEditing,
  } = useQuoteStore();

  // --- STATE ---
  const [currentPath, setCurrentPath] = useState("root"); // 'root' ou nom du dossier
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Modales
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  // Hydration check
  const [hasHydrated, setHasHydrated] = useState(false);
  useEffect(() => {
    setHasHydrated(true);
  }, []);

  // --- LOGIQUE DE FILTRAGE ---

  // 1. Dossiers à afficher (Seulement si on est à la racine)
  const visibleFolders = useMemo(() => {
    if (currentPath !== "root" || searchTerm) return []; // Pas de dossiers dans les résultats de recherche ou sous-dossiers
    return userFolders;
  }, [userFolders, currentPath, searchTerm]);

  // 2. Fichiers à afficher
  const visibleFiles = useMemo(() => {
    let filtered = quotes;

    // Filtre par dossier
    if (currentPath === "root") {
      // À la racine, on montre les fichiers qui n'ont PAS de dossier (ou root)
      // ET on ne filtre pas si on cherche (recherche globale)
      if (!searchTerm) {
        filtered = filtered.filter(
          (q) => !q.meta.folder || q.meta.folder === "root"
        );
      }
    } else {
      // Dans un dossier spécifique
      filtered = filtered.filter((q) => q.meta.folder === currentPath);
    }

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(
        (q) =>
          q.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.quote.number.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [quotes, currentPath, searchTerm]);

  // --- HANDLERS ---

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      createFolder(newFolderName.trim());
      setNewFolderName("");
      setIsCreateFolderOpen(false);
    }
  };

  const handleCreateQuote = () => {
    resetActiveQuote();
    // Si on est dans un dossier, on pourrait pré-remplir le dossier (à implémenter dans le store)
    router.push("/creer");
  };

  const handleEditQuote = (id: string) => {
    loadQuoteForEditing(id);
    // Idéalement ouvrir une sheet ici, ou rediriger
    router.push("/creer");
  };

  if (!hasHydrated) return null;

  return (
    <div className="flex flex-col h-full w-full bg-neutral-50/50">
      {/* 1. TOOLBAR TYPE "EXPLORATEUR" */}
      <ExplorerToolbar
        currentPath={currentPath}
        onNavigate={setCurrentPath}
        onSearch={setSearchTerm}
        onCreateFolder={() => setIsCreateFolderOpen(true)}
        onCreateQuote={handleCreateQuote}
      />

      {/* 2. ZONE DE CONTENU PRINCIPALE */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-[1600px] mx-auto min-h-full flex flex-col">
            {/* HEADER DE SECTION */}
            <div className="mb-6 flex items-end justify-between">
              <h2 className="text-lg font-bold text-neutral-900">
                {currentPath === "root"
                  ? searchTerm
                    ? "Résultats de recherche"
                    : "Bibliothèque"
                  : currentPath}
              </h2>
              <span className="text-xs text-neutral-500 font-medium">
                {visibleFolders.length + visibleFiles.length} élément(s)
              </span>
            </div>

            {/* BOUTON RETOUR (Si dans un dossier) */}
            {currentPath !== "root" && !searchTerm && (
              <button
                onClick={() => setCurrentPath("root")}
                className="mb-6 flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 w-fit px-3 py-2 rounded-lg hover:bg-white transition-all border border-transparent hover:border-neutral-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour aux dossiers
              </button>
            )}

            {/* EMPTY STATE GLOBAL */}
            {visibleFolders.length === 0 && visibleFiles.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-neutral-200 rounded-2xl bg-neutral-50/50 m-4">
                <div className="h-16 w-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                  {searchTerm ? (
                    <Search className="w-8 h-8 text-neutral-300" />
                  ) : (
                    <Inbox className="w-8 h-8 text-neutral-300" />
                  )}
                </div>
                <p className="text-neutral-500 font-medium">
                  {searchTerm ? "Aucun résultat trouvé" : "Ce dossier est vide"}
                </p>
                {!searchTerm && (
                  <Button
                    variant="link"
                    onClick={handleCreateQuote}
                    className="mt-2"
                  >
                    Créer un devis ici
                  </Button>
                )}
              </div>
            )}

            {/* GRILLE DE CONTENU */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 auto-rows-max">
              {/* A. DOSSIERS */}
              {visibleFolders.map((folderName) => (
                <FolderCard
                  key={folderName}
                  name={folderName}
                  // Calcul du nombre de fichiers dans ce dossier
                  count={
                    quotes.filter((q) => q.meta.folder === folderName).length
                  }
                  onClick={() => setCurrentPath(folderName)}
                  onRename={(name: string) => {
                    /* Add logic */
                  }}
                  onDelete={(name: string) => deleteFolder(name)}
                />
              ))}

              {/* B. FICHIERS */}
              {visibleFiles.map((quote) => (
                <FileCard
                  key={quote.quote.number}
                  quote={quote}
                  active={selectedQuote?.quote.number === quote.quote.number}
                  onClick={setSelectedQuote}
                  onEdit={handleEditQuote}
                  onDelete={(id: string) => deleteQuoteFromList(id)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 3. PANNEAU DE PRÉVISUALISATION (LATÉRAL DROIT) */}
        {/* S'affiche uniquement si un FICHIER est sélectionné */}
        {selectedQuote && (
          <div className="w-[400px] border-l border-neutral-200 bg-white shadow-xl z-30 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="h-16 border-b border-neutral-100 flex items-center justify-between px-6 shrink-0">
              <span className="font-bold text-xs uppercase tracking-widest text-neutral-500">
                Détails
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedQuote(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-neutral-50/50">
              {/* Aperçu visuel du PDF */}
              <div className="aspect-[210/297] bg-white shadow-sm border border-neutral-200 w-full mb-6 p-6 text-[8px] overflow-hidden text-neutral-400 flex flex-col">
                <div className="flex justify-between mb-4">
                  <div className="w-12 h-2 bg-neutral-100" />
                  <div className="w-8 h-2 bg-neutral-100" />
                </div>
                <div className="space-y-1 mb-4">
                  <div className="w-20 h-1 bg-neutral-50" />
                  <div className="w-16 h-1 bg-neutral-50" />
                </div>
                <div className="space-y-2 border-t border-neutral-50 pt-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-full h-2 bg-neutral-50/50" />
                  ))}
                </div>
                <div className="mt-auto flex justify-end">
                  <div className="w-16 h-4 bg-neutral-100" />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-xs text-neutral-400">Client</Label>
                  <p className="font-medium text-neutral-900">
                    {selectedQuote.client.name}
                  </p>
                  <p className="text-sm text-neutral-500">
                    {selectedQuote.client.email}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-neutral-400">Date</Label>
                    <p className="text-sm font-medium">
                      {selectedQuote.quote.issueDate}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-neutral-400">Montant</Label>
                    <p className="text-sm font-medium">
                      {/* Calcul rapide du total */}
                      {(
                        selectedQuote.items.reduce(
                          (acc: any, i: any) =>
                            acc + i.quantity * i.unitPriceEuros,
                          0
                        ) *
                        (1 + selectedQuote.financials.vatRatePercent / 100)
                      ).toFixed(2)}{" "}
                      €
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-neutral-200 bg-white space-y-2">
              <Button
                onClick={() => handleEditQuote(selectedQuote.quote.number)}
                className="w-full bg-neutral-900 text-white"
              >
                Ouvrir / Modifier
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  Télécharger
                </Button>
                <Button variant="outline" className="flex-1">
                  Imprimer
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modale Création Dossier */}
      <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouveau Dossier</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Nom du dossier..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button onClick={handleCreateFolder}>Créer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
