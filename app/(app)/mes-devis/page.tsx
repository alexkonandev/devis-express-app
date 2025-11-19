"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuoteStore, Quote } from "@/store/quote.store";

import {
  PlusIcon,
  TrashIcon,
  EditIcon,
  FileText,
  Folder,
  Search,
  MoreHorizontal,
  Download,
  Printer,
  ChevronRight,
  Home,
  ArrowLeft,
  FolderPlus,
  X,
  Inbox,
  Pencil,
  Save,
  CheckCircle2,
  Loader2,
  Percent,
  Hash,
  Calendar,
  Plus,
  CreditCard,
  List,
  Layers,
  CalendarDays,
  Mail,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

// ============================================================================
// 1. COMPOSANTS D'INTERFACE
// ============================================================================

// --- CARTE DOSSIER ---
const FolderCard = ({ name, count, onClick, onRename, onDelete }: any) => (
  <div
    onClick={onClick}
    className="group relative flex flex-col justify-between p-5 h-40 bg-white border border-neutral-200 rounded-2xl hover:border-blue-300 hover:shadow-md hover:shadow-blue-100/50 transition-all cursor-pointer select-none active:scale-[0.98]"
  >
    <div className="flex justify-between items-start">
      <div className="h-10 w-10 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center shadow-sm border border-yellow-100 group-hover:scale-110 transition-transform">
        <Folder className="h-5 w-5 fill-yellow-500/20" />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-neutral-100 rounded-md text-neutral-400 hover:text-neutral-900 transition-all"
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
            <Pencil className="w-4 h-4 mr-2" /> Renommer
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600 focus:text-red-600"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(name);
            }}
          >
            <TrashIcon className="w-4 h-4 mr-2" /> Supprimer
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

// --- CARTE FICHIER (DEVIS ENRICHI) ---
const FileCard = ({ quote, active, onClick, onEdit, onDelete }: any) => {
  
  // Calculs
  const totalTTC = useMemo(() => {
    const subTotal = quote.items.reduce(
      (acc: any, item: any) => acc + item.quantity * item.unitPriceEuros,
      0
    );
    const total = subTotal - quote.financials.discountAmountEuros;
    return (total * (1 + quote.financials.vatRatePercent / 100)).toFixed(2);
  }, [quote]);

  const itemsCount = quote.items.length;

  // Simulation de statut (tu pourras connecter ça à ton store plus tard)
  // Pour l'instant, on considère que tout est en "Brouillon"
  const status = { label: "Brouillon", color: "bg-neutral-100 text-neutral-500" }; 
  // Exemple futur: const status = quote.meta.status === 'sent' ? { label: "Envoyé", color: "bg-blue-100 text-blue-700" } : ...

  return (
    <div
      onClick={() => onClick(quote)}
      className={`group relative flex flex-col justify-between p-6 h-60 w-80 rounded-2xl border transition-all duration-200 cursor-pointer select-none
            ${
              active
                ? "bg-white border-neutral-900 shadow-[0_0_0_2px_rgba(0,0,0,1)] z-10"
                : "bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-lg hover:shadow-neutral-200/50"
            }`}
    >
      {/* --- EN-TÊTE : ID & ACTIONS --- */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          {/* Icone Fichier stylisée */}
          <div className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${active ? "bg-neutral-900 text-white" : "bg-blue-50 text-blue-600"}`}>
            <FileText className="h-4 w-4" />
          </div>
          {/* Numéro de devis */}
          <span className="font-mono text-[10px] font-medium text-neutral-400 bg-neutral-50 px-1.5 py-0.5 rounded">
            {quote.quote.number}
          </span>
        </div>

        {/* Actions au survol (Opacité) */}
        <div
          className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 hover:bg-neutral-100"
            onClick={() => onEdit(quote)}
          >
            <EditIcon className="h-3.5 w-3.5 text-neutral-500" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 hover:bg-red-50 hover:text-red-600"
            onClick={() => onDelete(quote.quote.number)}
          >
            <TrashIcon className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* --- CORPS : INFO CLIENT --- */}
      <div className="space-y-1 mt-2">
        <div className="flex justify-between items-start">
           <h4 className="font-bold text-neutral-900 truncate text-sm pr-2" title={quote.client.name}>
             {quote.client.name || "Nouveau Client"}
           </h4>
           {/* Badge Statut */}
           <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${status.color}`}>
             {status.label}
           </span>
        </div>
        
        {/* Email Client (Très utile pour identifier) */}
        <div className="flex items-center gap-1.5 text-neutral-400">
             <Mail className="w-3 h-3" />
             <span className="text-xs truncate max-w-[150px]">{quote.client.email || "Pas d'email"}</span>
        </div>
      </div>

      <Separator className="my-auto bg-neutral-100" />

      {/* --- PIED : CHIFFRES CLÉS --- */}
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium flex items-center gap-1">
             Total TTC
          </span>
          <span className="font-bold text-lg text-neutral-900 tracking-tight leading-none">
            {totalTTC}€
          </span>
        </div>
        
        <div className="flex flex-col items-end gap-1">
           {/* Nombre d'articles */}
           <div className="flex items-center gap-1 text-[10px] text-neutral-500 bg-neutral-50 px-1.5 py-0.5 rounded">
              <Layers className="w-3 h-3" />
              <span>{itemsCount} ligne{itemsCount > 1 ? 's' : ''}</span>
           </div>
           {/* Date */}
           <div className="text-[10px] text-neutral-400 flex items-center gap-1">
              <CalendarDays className="w-3 h-3" />
              {quote.quote.issueDate}
           </div>
        </div>
      </div>
    </div>
  );
};

// --- TOOLBAR ---
const ExplorerToolbar = ({
  currentPath,
  onNavigate,
  onSearch,
  onCreateFolder,
  onCreateQuote,
}: any) => (
  <header className="h-16 bg-white/80 backdrop-blur-md border-b border-neutral-200 px-6 flex items-center justify-between shrink-0 z-20 sticky top-0">
    <div className="flex items-center gap-2 flex-1">
      <button
        onClick={() => onNavigate("root")}
        className={`flex items-center gap-2 text-sm font-medium transition-colors px-2 py-1 rounded-md hover:bg-neutral-100 ${
          currentPath === "root" ? "text-neutral-900" : "text-neutral-500"
        }`}
      >
        <Home className="w-4 h-4" />{" "}
        <span className="hidden sm:inline">Accueil</span>
      </button>
      {currentPath !== "root" && (
        <>
          <ChevronRight className="w-4 h-4 text-neutral-300" />
          <div className="flex items-center gap-2 px-2 py-1 bg-neutral-100 rounded-md text-sm font-bold text-neutral-900">
            <Folder className="w-3.5 h-3.5 text-neutral-500" /> {currentPath}
          </div>
        </>
      )}
    </div>
    <div className="flex items-center gap-3">
      <div className="relative hidden md:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <Input
          placeholder="Rechercher..."
          className="pl-9 w-64 bg-white border-neutral-200 h-9 text-sm"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <Separator orientation="vertical" className="h-6 bg-neutral-200 mx-2" />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-3 border-dashed border-neutral-300 text-neutral-600 hover:border-neutral-400 hover:bg-white"
              onClick={onCreateFolder}
            >
              <FolderPlus className="w-4 h-4 mr-2" />{" "}
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
        <PlusIcon className="w-4 h-4" />{" "}
        <span className="hidden sm:inline">Nouveau Devis</span>
      </Button>
    </div>
  </header>
);

// --- MINI VISUALISATEUR PDF (Réaliste) ---
const RealQuotePreview = ({ quote }: { quote: Quote }) => {
  const totalTTC =
    quote.items.reduce(
      (acc, item) => acc + item.quantity * item.unitPriceEuros,
      0
    ) *
    (1 + quote.financials.vatRatePercent / 100);

  return (
    <div className="bg-white shadow-sm border border-neutral-200 w-full aspect-[210/297] p-8 text-[10px] flex flex-col relative overflow-hidden select-none">
      {/* Filigrane de fond */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
        <FileText className="w-48 h-48" />
      </div>

      {/* Header */}
      <div className="flex justify-between mb-8 relative z-10">
        <div>
          <div className="font-bold text-neutral-900 text-sm mb-1">
            {quote.company.name || "Votre Entreprise"}
          </div>
          <div className="text-neutral-400 max-w-[120px] leading-tight">
            {quote.company.email}
          </div>
        </div>
        <div className="text-right">
          <div className="font-bold text-neutral-900 text-lg tracking-tight">
            DEVIS
          </div>
          <div className="font-mono text-neutral-400">
            #{quote.quote.number}
          </div>
        </div>
      </div>

      {/* Client info */}
      <div className="mb-8 relative z-10">
        <div className="text-neutral-400 mb-1 uppercase tracking-wider text-[8px]">
          Destinataire
        </div>
        <div className="font-bold text-neutral-900">
          {quote.client.name || "Nom du client"}
        </div>
        <div className="text-neutral-500">{quote.client.email}</div>
      </div>

      {/* Lignes */}
      <div className="flex-1 relative z-10">
        <div className="flex border-b border-neutral-200 pb-2 mb-2 font-bold text-neutral-900">
          <div className="flex-1">Description</div>
          <div className="w-8 text-right">Qté</div>
          <div className="w-12 text-right">Prix</div>
        </div>
        {quote.items.map((item, i) => (
          <div
            key={i}
            className="flex py-1.5 border-b border-neutral-100/50 text-neutral-600"
          >
            <div className="flex-1 font-medium truncate pr-2">
              {item.title || "Ligne sans nom"}
            </div>
            <div className="w-8 text-right text-neutral-400">
              {item.quantity}
            </div>
            <div className="w-12 text-right font-mono">
              {item.unitPriceEuros}
            </div>
          </div>
        ))}
        {/* Lignes vides pour remplissage visuel */}
        {Array.from({ length: Math.max(0, 5 - quote.items.length) }).map(
          (_, i) => (
            <div
              key={`empty-${i}`}
              className="flex py-1.5 border-b border-neutral-50"
            >
              <div className="flex-1 h-2 bg-neutral-50 rounded w-1/2" />
            </div>
          )
        )}
      </div>

      {/* Footer Totaux */}
      <div className="mt-auto border-t-2 border-neutral-900 pt-2 relative z-10">
        <div className="flex justify-between items-end">
          <div className="text-neutral-400 text-[8px]">Validité: 30 jours</div>
          <div className="text-right">
            <div className="text-[8px] text-neutral-500 uppercase tracking-wider">
              Total TTC
            </div>
            <div className="font-bold text-xl text-neutral-900">
              {totalTTC.toFixed(2)} €
            </div>
          </div>
        </div>
      </div>
    </div>
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
    activeQuote,
    updateActiveQuoteField,
  } = useQuoteStore();

  // State
  const [currentPath, setCurrentPath] = useState("root");
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [hasHydrated, setHasHydrated] = useState(false);

  // Modales
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [isRenameFolderOpen, setIsRenameFolderOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false); // Pour l'édition in-place

  // Form data
  const [newFolderName, setNewFolderName] = useState("");
  const [folderToRename, setFolderToRename] = useState("");
  const [renamedFolderName, setRenamedFolderName] = useState("");

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  // --- LOGIC ---

  const visibleFolders = useMemo(() => {
    if (currentPath !== "root" || searchTerm) return [];
    return userFolders;
  }, [userFolders, currentPath, searchTerm]);

  const visibleFiles = useMemo(() => {
    let filtered = quotes;
    if (currentPath === "root") {
      if (!searchTerm)
        filtered = filtered.filter(
          (q) => !q.meta.folder || q.meta.folder === "root"
        );
    } else {
      filtered = filtered.filter((q) => q.meta.folder === currentPath);
    }
    if (searchTerm) {
      filtered = filtered.filter(
        (q) =>
          q.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.quote.number.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  }, [quotes, currentPath, searchTerm]);

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      createFolder(newFolderName.trim());
      setNewFolderName("");
      setIsCreateFolderOpen(false);
    }
  };

  const handleRenameFolder = () => {
    if (renamedFolderName.trim() && folderToRename) {
      renameFolder(folderToRename, renamedFolderName.trim());
      setRenamedFolderName("");
      setFolderToRename("");
      setIsRenameFolderOpen(false);
    }
  };

  const openRenameModal = (folderName: string) => {
    setFolderToRename(folderName);
    setRenamedFolderName(folderName);
    setIsRenameFolderOpen(true);
  };

  // Lancer l'édition IN-PLACE (Sheet)
  const handleEditInPlace = (quote: Quote) => {
    loadQuoteForEditing(quote.quote.number);
    setIsEditSheetOpen(true);
  };

  if (!hasHydrated) return null;

  return (
    <div className="flex flex-col h-full w-full bg-neutral-50/50">
      <ExplorerToolbar
        currentPath={currentPath}
        onNavigate={setCurrentPath}
        onSearch={setSearchTerm}
        onCreateFolder={() => setIsCreateFolderOpen(true)}
        onCreateQuote={() => {
          resetActiveQuote();
          router.push("/creer");
        }}
      />

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
          <div className="max-w-[1600px] mx-auto min-h-full flex flex-col">
            {/* Header & Breadcrumbs (déjà dans toolbar mais on peut ajouter infos ici) */}
            <div className="mb-6 flex items-end justify-between">
              <div>
                <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                  {currentPath === "root" ? (
                    <Inbox className="w-5 h-5 text-neutral-400" />
                  ) : (
                    <Folder className="w-5 h-5 text-yellow-500" />
                  )}
                  {currentPath === "root"
                    ? searchTerm
                      ? "Résultats"
                      : "Bibliothèque"
                    : currentPath}
                </h2>
              </div>
              <span className="text-xs text-neutral-500 font-medium bg-neutral-100 px-2 py-1 rounded-full">
                {visibleFolders.length + visibleFiles.length} élément(s)
              </span>
            </div>

            {/* Bouton Retour Dossier */}
            {currentPath !== "root" && !searchTerm && (
              <button
                onClick={() => setCurrentPath("root")}
                className="mb-6 flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 w-fit px-3 py-2 rounded-lg hover:bg-white transition-all border border-transparent hover:border-neutral-200"
              >
                <ArrowLeft className="w-4 h-4" /> Retour
              </button>
            )}

            {/* Empty State */}
            {visibleFolders.length === 0 && visibleFiles.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-neutral-200 rounded-2xl bg-neutral-50/50 m-4">
                <div className="h-16 w-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                  {searchTerm ? (
                    <Search className="w-8 h-8 text-neutral-300" />
                  ) : (
                    <Inbox className="w-8 h-8 text-neutral-300" />
                  )}
                </div>
                <p className="text-neutral-500 font-medium mb-4">
                  {searchTerm ? "Aucun résultat" : "Ce dossier est vide"}
                </p>
                {!searchTerm && (
                  <Button
                    onClick={() => {
                      resetActiveQuote();
                      router.push("/creer");
                    }}
                    variant="outline"
                  >
                    Créer un devis ici
                  </Button>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 auto-rows-max">
              {visibleFolders.map((folderName) => (
                <FolderCard
                  key={folderName}
                  name={folderName}
                  count={
                    quotes.filter((q) => q.meta.folder === folderName).length
                  }
                  onClick={() => setCurrentPath(folderName)}
                  onRename={openRenameModal}
                  onDelete={(name: string) => deleteFolder(name)}
                />
              ))}
              {visibleFiles.map((quote) => (
                <FileCard
                  key={quote.quote.number}
                  quote={quote}
                  active={selectedQuote?.quote.number === quote.quote.number}
                  onClick={setSelectedQuote}
                  onEdit={() => handleEditInPlace(quote)} // Clic sur le crayon de la carte
                  onDelete={(id: string) => {
                    deleteQuoteFromList(id);
                    if (selectedQuote?.quote.number === id)
                      setSelectedQuote(null);
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* PANNEAU PRÉVISUALISATION (Sidebar Droite) */}
        {selectedQuote && (
          <div className="w-[450px] border-l border-neutral-200 bg-white shadow-xl z-30 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="h-16 border-b border-neutral-100 flex items-center justify-between px-6 shrink-0">
              <span className="font-bold text-xs uppercase tracking-widest text-neutral-500">
                Aperçu
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedQuote(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-neutral-50/50 flex flex-col items-center">
              {/* VRAI APERÇU DU DEVIS */}
              <RealQuotePreview quote={selectedQuote} />

              <div className="w-full mt-8 space-y-4">
                <div className="bg-white p-4 rounded-xl border border-neutral-200 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Date création</span>
                    <span className="font-medium">
                      {selectedQuote.quote.issueDate}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Client</span>
                    <span className="font-medium">
                      {selectedQuote.client.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-neutral-200 bg-white space-y-2">
              <Button
                onClick={() => handleEditInPlace(selectedQuote)}
                className="w-full bg-neutral-900 text-white h-12 text-base shadow-lg shadow-neutral-200/50"
              >
                <EditIcon className="w-4 h-4 mr-2" /> Modifier le contenu
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 h-10">
                  <Download className="w-4 h-4 mr-2" /> PDF
                </Button>
                <Button variant="outline" className="flex-1 h-10">
                  <Printer className="w-4 h-4 mr-2" /> Print
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODALES (Dialogs) */}
      <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouveau Dossier</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Nom..."
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

      <Dialog open={isRenameFolderOpen} onOpenChange={setIsRenameFolderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renommer le dossier</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Nouveau nom..."
              value={renamedFolderName}
              onChange={(e) => setRenamedFolderName(e.target.value)}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button onClick={handleRenameFolder}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* SHEET D'ÉDITION RAPIDE (IN-PLACE EDITING) */}
      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent className="w-full sm:max-w-2xl p-0 border-l border-neutral-200 shadow-2xl bg-white z-50">
          <div className="h-full flex flex-col bg-neutral-50">
            <SheetHeader className="px-6 py-4 border-b border-neutral-200 bg-white">
              <SheetTitle>Modification rapide</SheetTitle>
              <SheetDescription>
                Les changements sont sauvegardés automatiquement.
              </SheetDescription>
            </SheetHeader>

            {/* Zone Formulaire (Ici on injecte le composant d'édition simplifié) */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* IMPORTANT : Ici vous devriez mettre <QuoteEditorForm mode="simple" /> 
                        Pour l'instant je mets un placeholder fonctionnel qui modifie vraiment le store
                     */}
              <QuickEditForm />
            </div>

            <SheetFooter className="px-6 py-4 border-t border-neutral-200 bg-white">
              <SheetClose asChild>
                <Button className="w-full bg-neutral-900 text-white">
                  Terminer
                </Button>
              </SheetClose>
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

// --- COMPOSANT PLACEHOLDER POUR L'ÉDITION (À remplacer par votre vrai formulaire) ---
const QuickEditForm = () => {
  const {
    activeQuote,
    updateActiveQuoteField,
    updateActiveLineItem,
    addActiveLineItem,
    removeActiveLineItem,
  } = useQuoteStore();

  if (!activeQuote)
    return (
      <div className="p-6 text-center text-neutral-400">Chargement...</div>
    );

  // Helper pour les inputs text
  const handleFieldChange = (section: string, field: string, value: any) => {
    updateActiveQuoteField(section, field, value);
  };

  // Helper pour les inputs numériques (TVA, Prix)
  const handleNumberChange = (
    section: string,
    field: string,
    value: string
  ) => {
    const num = parseFloat(value);
    updateActiveQuoteField(section, field, isNaN(num) ? 0 : num);
  };

  return (
    <div className="space-y-8 font-sans text-neutral-900">
      {/* SECTION 1 : INFO GÉNÉRALES */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
          <FileText className="w-3 h-3" /> Informations
        </h3>

        <div className="bg-white border border-neutral-200 rounded-xl p-4 space-y-4 shadow-sm">
          {/* Numéro & Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs text-neutral-500">Numéro</Label>
              <div className="relative">
                <Hash className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-neutral-400" />
                <Input
                  value={activeQuote.quote.number}
                  onChange={(e) =>
                    handleFieldChange("quote", "number", e.target.value)
                  }
                  className="pl-8 h-9 bg-neutral-50/50 border-neutral-200"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-neutral-500">Date</Label>
              <div className="relative">
                <Calendar className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-neutral-400" />
                <Input
                  type="date"
                  value={activeQuote.quote.issueDate}
                  onChange={(e) =>
                    handleFieldChange("quote", "issueDate", e.target.value)
                  }
                  className="pl-8 h-9 bg-neutral-50/50 border-neutral-200"
                />
              </div>
            </div>
          </div>

          <Separator className="bg-neutral-100" />

          {/* Client */}
          <div className="space-y-3">
            <Label className="text-xs text-neutral-500">Client</Label>
            <div className="space-y-2">
              <Input
                placeholder="Nom du client"
                value={activeQuote.client.name}
                onChange={(e) =>
                  handleFieldChange("client", "name", e.target.value)
                }
                className="h-9 font-medium border-neutral-200"
              />
              <Input
                placeholder="Email contact"
                value={activeQuote.client.email}
                onChange={(e) =>
                  handleFieldChange("client", "email", e.target.value)
                }
                className="h-9 border-neutral-200 text-neutral-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 : LIGNES (Compact) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
            <List className="w-3 h-3" /> Prestations
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={addActiveLineItem}
            className="h-6 text-xs hover:bg-neutral-100 text-neutral-600"
          >
            <Plus className="w-3 h-3 mr-1" /> Ajouter
          </Button>
        </div>

        <div className="space-y-3">
          {activeQuote.items.map((item, index) => (
            <div
              key={item.id}
              className="group relative bg-white border border-neutral-200 rounded-xl p-3 shadow-sm hover:border-blue-300 transition-all"
            >
              {/* Bouton Supprimer (Absolu) */}
              <button
                onClick={() => removeActiveLineItem(index)}
                className="absolute -right-2 -top-2 bg-white border border-neutral-200 rounded-full p-1 text-neutral-400 hover:text-red-500 hover:border-red-200 shadow-sm opacity-0 group-hover:opacity-100 transition-all z-10"
              >
                <X className="w-3 h-3" />
              </button>

              <div className="space-y-2">
                {/* Titre */}
                <Input
                  className="h-8 border-transparent p-0 font-semibold focus-visible:ring-0 px-1 -ml-1"
                  placeholder="Titre..."
                  value={item.title}
                  onChange={(e) =>
                    updateActiveLineItem(index, "title", e.target.value)
                  }
                />

                {/* Ligne Chiffres */}
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-neutral-400 uppercase font-bold">
                      Qté
                    </span>
                    <Input
                      type="number"
                      className="h-8 pl-8 text-right text-xs bg-neutral-50 border-neutral-100"
                      value={item.quantity}
                      onChange={(e) =>
                        updateActiveLineItem(
                          index,
                          "quantity",
                          parseFloat(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div className="flex-1 relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-neutral-400 uppercase font-bold">
                      Prix
                    </span>
                    <Input
                      type="number"
                      className="h-8 pl-8 text-right text-xs bg-neutral-50 border-neutral-100"
                      value={item.unitPriceEuros}
                      onChange={(e) =>
                        updateActiveLineItem(
                          index,
                          "unitPriceEuros",
                          parseFloat(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div className="flex items-center justify-end min-w-[60px]">
                    <span className="text-xs font-bold font-mono">
                      {(item.quantity * item.unitPriceEuros).toFixed(2)}€
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {activeQuote.items.length === 0 && (
            <div
              onClick={addActiveLineItem}
              className="border-2 border-dashed border-neutral-200 rounded-xl p-6 flex flex-col items-center justify-center text-neutral-400 cursor-pointer hover:bg-neutral-50 hover:border-neutral-300 transition-all"
            >
              <Plus className="w-6 h-6 mb-2 opacity-50" />
              <span className="text-xs font-medium">
                Ajouter une première ligne
              </span>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 3 : FINANCIER */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
          <CreditCard className="w-3 h-3" /> Totaux
        </h3>

        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-neutral-500">Remise (€)</Label>
            <Input
              type="number"
              className="w-24 h-8 text-right bg-white border-neutral-200 text-xs"
              value={activeQuote.financials.discountAmountEuros}
              onChange={(e) =>
                handleNumberChange(
                  "financials",
                  "discountAmountEuros",
                  e.target.value
                )
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs text-neutral-500">TVA (%)</Label>
            <div className="relative w-24">
              <Percent className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-neutral-400" />
              <Input
                type="number"
                className="w-full h-8 pl-6 text-right bg-white border-neutral-200 text-xs"
                value={activeQuote.financials.vatRatePercent}
                onChange={(e) =>
                  handleNumberChange(
                    "financials",
                    "vatRatePercent",
                    e.target.value
                  )
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pied de page du formulaire */}
      <div className="pt-4 text-center">
        <p className="text-[10px] text-neutral-400">
          Modifications sauvegardées automatiquement
        </p>
      </div>
    </div>
  );
};