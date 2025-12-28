"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Hash,
  Plus,
  FolderPlus,
  Search,
  ArrowRight,
  CornerDownLeft,
  Loader2,
  LayoutDashboard,
  Users,
  Tag,
  Settings,
  CreditCard,
  LogOut,
  Laptop,
  Moon,
  Sun,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // Assure-toi d'avoir ce composant ou retire-le
import {
  createFolderAction,
  searchDevisAction,
} from "@/app/(app)/dashboard/actions";
import { useDebounce } from "@/hooks/use-debounce";
import { useClerk } from "@clerk/nextjs";

// --- TYPES ---
interface SearchResult {
  id: string;
  number: string;
  clientName: string;
  total: number;
  status: "DRAFT" | "PENDING" | "PAID" | "OVERDUE"; // Exemple de statuts
  date: string;
}

interface SearchCommandProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

// --- UTILS : Status Badge Helper ---
const getStatusIcon = (status: string) => {
  switch (status) {
    case "PAID":
      return <CheckCircle2 className="w-3 h-3 text-emerald-500" />;
    case "PENDING":
      return <Clock className="w-3 h-3 text-amber-500" />;
    case "OVERDUE":
      return <AlertCircle className="w-3 h-3 text-red-500" />;
    default:
      return <FileText className="w-3 h-3 text-neutral-400" />;
  }
};

export function SearchCommand({ open, setOpen }: SearchCommandProps) {
  const router = useRouter();
  const { signOut } = useClerk();

  // --- ÉTATS ---
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [pages, setPages] = React.useState<string[]>([]); // Pour gérer la navigation interne (ex: Home > Folder)

  // Gestion du Input spécifique pour "Nouveau Dossier"
  const [newFolderName, setNewFolderName] = React.useState("");
  const activePage = pages[pages.length - 1];

  // Debounce (300ms)
  const debouncedQuery = useDebounce(query, 300);

  // --- RESET & SHORTCUTS ---
  React.useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setPages([]);
        setQuery("");
        setNewFolderName("");
        setResults([]);
      }, 300); // Reset après l'animation de fermeture
    }
  }, [open]);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      // Backspace pour revenir en arrière dans les pages internes
      if (e.key === "Backspace" && !query && pages.length > 0) {
        e.preventDefault();
        setPages((curr) => curr.slice(0, -1));
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen, query, pages]);

  // --- RECHERCHE SERVEUR ---
  React.useEffect(() => {
    const performSearch = async () => {
      if (debouncedQuery.length < 2) {
        setResults([]);
        return;
      }
      setIsSearching(true);
      // @ts-ignore - Mock ou vraie action
      const data = await searchDevisAction(debouncedQuery);
      setResults(data);
      setIsSearching(false);
    };

    performSearch();
  }, [debouncedQuery]);

  // --- ACTIONS ---
  const runCommand = React.useCallback(
    (command: () => void) => {
      setOpen(false);
      command();
    },
    [setOpen]
  );

  const submitNewFolder = async () => {
    if (!newFolderName.trim()) return;
    await createFolderAction(newFolderName.trim());
    runCommand(() => router.refresh());
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      {/* HEADER DE LA COMMAND BAR (BREADCRUMB SI NECESSAIRE) */}
      <div className="flex items-center border-b border-neutral-100 px-3">
        {activePage === "new-folder" ? (
          <div className="flex items-center w-full h-12 gap-2">
            <button
              onClick={() => setPages([])}
              className="bg-neutral-100 px-1.5 py-0.5 rounded text-[10px] font-bold text-neutral-500 uppercase tracking-wider hover:bg-neutral-200 transition-colors"
            >
              Retour
            </button>
            <FolderPlus className="w-4 h-4 text-neutral-400" />
            <Input
              autoFocus
              className="border-none shadow-none focus-visible:ring-0 px-0 h-full text-sm"
              placeholder="Nom du nouveau dossier..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitNewFolder();
              }}
            />
          </div>
        ) : (
          <>
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              placeholder="Rechercher ou taper une commande..."
              value={query}
              onValueChange={setQuery}
              className="border-none shadow-none focus:ring-0 pl-0"
            />
          </>
        )}
      </div>

      <CommandList className="max-h-[350px] overflow-y-auto custom-scrollbar">
        {/* VUE PRINCIPALE */}
        {!activePage && (
          <>
            {/* 1. ÉTAT DE CHARGEMENT */}
            {isSearching && (
              <div className="py-6 flex items-center justify-center text-sm text-neutral-500 gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Recherche intelligente...
              </div>
            )}

            {/* 2. RÉSULTATS DE RECHERCHE (Prioritaires si query existe) */}
            {!isSearching && results.length > 0 && (
              <CommandGroup heading="Documents trouvés">
                {results.map((item) => (
                  <CommandItem
                    key={item.id}
                    onSelect={() =>
                      runCommand(() => router.push(`/devis/${item.id}`))
                    }
                    className="group flex items-center justify-between py-3 aria-selected:bg-neutral-100 cursor-pointer"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="flex items-center justify-center w-8 h-8 rounded-md bg-white border border-neutral-200 shadow-sm text-neutral-500 group-aria-selected:border-neutral-300">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col truncate">
                        <span className="font-semibold text-neutral-900 truncate">
                          {item.clientName}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-neutral-500">
                          <span className="font-mono">{item.number}</span>
                          <span>•</span>
                          <span>{item.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-bold text-neutral-900 text-sm">
                          {new Intl.NumberFormat("fr-FR", {
                            style: "currency",
                            currency: "EUR",
                          }).format(item.total)}
                        </p>
                        <div className="flex items-center justify-end gap-1 text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                          {getStatusIcon(item.status)}
                          <span>{item.status}</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-neutral-300 opacity-0 group-aria-selected:opacity-100 -translate-x-2 group-aria-selected:translate-x-0 transition-all" />
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* 3. NAVIGATION & ACTIONS (Si pas de recherche précise) */}
            {results.length === 0 && (
              <>
                <CommandGroup heading="Navigation">
                  <CommandItem
                    onSelect={() => runCommand(() => router.push("/devis"))}
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4 text-neutral-500" />
                    <span>Tableau de bord</span>
                  </CommandItem>
                  <CommandItem
                    onSelect={() => runCommand(() => router.push("/clients"))}
                  >
                    <Users className="mr-2 h-4 w-4 text-neutral-500" />
                    <span>Clients</span>
                  </CommandItem>
                  <CommandItem
                    onSelect={() => runCommand(() => router.push("/items"))}
                  >
                    <Tag className="mr-2 h-4 w-4 text-neutral-500" />
                    <span>Catalogue</span>
                  </CommandItem>
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup heading="Création Rapide">
                  <CommandItem
                    onSelect={() => runCommand(() => router.push("/devis/new"))}
                    className="group"
                  >
                    <Plus className="mr-2 h-4 w-4 text-blue-500" />
                    <span className="text-neutral-900 font-medium">
                      Nouveau Devis
                    </span>
                    <CommandShortcut className="bg-blue-50 text-blue-600 border-blue-100">
                      ⌘N
                    </CommandShortcut>
                  </CommandItem>
                  <CommandItem
                    onSelect={() =>
                      runCommand(() => router.push("/clients/new"))
                    }
                  >
                    <Users className="mr-2 h-4 w-4 text-purple-500" />
                    <span>Nouveau Client</span>
                  </CommandItem>
                  <CommandItem
                    onSelect={() => setPages([...pages, "new-folder"])}
                  >
                    <FolderPlus className="mr-2 h-4 w-4 text-orange-500" />
                    <span>Nouveau Dossier...</span>
                    <CommandShortcut>F</CommandShortcut>
                  </CommandItem>
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup heading="Système">
                  <CommandItem
                    onSelect={() => runCommand(() => router.push("/settings"))}
                  >
                    <Settings className="mr-2 h-4 w-4 text-neutral-500" />
                    <span>Paramètres</span>
                    <CommandShortcut>⌘,</CommandShortcut>
                  </CommandItem>
                  <CommandItem
                    onSelect={() => runCommand(() => router.push("/billing"))}
                  >
                    <CreditCard className="mr-2 h-4 w-4 text-neutral-500" />
                    <span>Abonnement</span>
                  </CommandItem>
                  <CommandItem
                    onSelect={() => window.open("mailto:support@devis.com")}
                  >
                    <Laptop className="mr-2 h-4 w-4 text-neutral-500" />
                    <span>Contacter le support</span>
                  </CommandItem>
                  <CommandItem
                    onSelect={() =>
                      runCommand(() =>
                        signOut(() => (window.location.href = "/"))
                      )
                    }
                    className="text-red-600 aria-selected:text-red-700 aria-selected:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Se déconnecter</span>
                  </CommandItem>
                </CommandGroup>
              </>
            )}
            <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
          </>
        )}
      </CommandList>

      {/* FOOTER INTELLIGENT (Style Raycast) */}
      <div className="flex items-center justify-between border-t border-neutral-100 bg-neutral-50/50 px-3 py-2">
        <div className="flex gap-4">
          {activePage === "new-folder" ? (
            <div className="flex items-center gap-1 text-[10px] text-neutral-400">
              <CornerDownLeft className="w-3 h-3" />
              <span className="font-bold text-neutral-600">Entrée</span>
              <span>pour créer</span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-1 text-[10px] text-neutral-400">
                <ArrowRight className="w-3 h-3" />
                <span className="font-bold text-neutral-600">Sélectionner</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-neutral-400">
                <span className="font-bold text-neutral-600">↓ ↑</span>
                <span>Naviguer</span>
              </div>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-px bg-neutral-200" />
          <div className="flex items-center gap-1 text-[10px] text-neutral-400">
            <span className="font-bold text-neutral-600">Esc</span>
            <span>Fermer</span>
          </div>
        </div>
      </div>
    </CommandDialog>
  );
}
