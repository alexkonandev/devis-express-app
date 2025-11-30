"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  File,
  Hash,
  Plus,
  FolderPlus,
  Search,
  ArrowRight,
  ArrowLeft,
  Folder,
  CornerDownLeft,
  Loader2,
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
import { createFolderAction, searchDevisAction } from "@/app/(app)/devis/actions";
import { useDebounce } from "@/hooks/use-debounce";

// On remplace le store par l'action serveur et le hook debounce


interface SearchCommandProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function SearchCommand({ open, setOpen }: SearchCommandProps) {
  const router = useRouter();

  // --- ÉTAT DE RECHERCHE ---
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);

  // Debounce pour ne pas surcharger la DB (300ms)
  const debouncedQuery = useDebounce(query, 300);

  // --- ÉTAT NAVIGATION INTERNE ---
  const [page, setPage] = React.useState<"root" | "new-folder">("root");
  const [newFolderName, setNewFolderName] = React.useState("");

  // Reset de l'état quand on ferme/ouvre
  React.useEffect(() => {
    if (open) {
      setPage("root");
      setNewFolderName("");
      setQuery("");
      setResults([]);
    }
  }, [open]);

  // --- EFFET DE RECHERCHE ---
  React.useEffect(() => {
    const performSearch = async () => {
      if (debouncedQuery.length < 2) {
        setResults([]);
        return;
      }
      setIsSearching(true);
      const data = await searchDevisAction(debouncedQuery);
      setResults(data);
      setIsSearching(false);
    };

    performSearch();
  }, [debouncedQuery]);

  // Raccourci Clavier Global
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);

  const closeCommand = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  // --- HANDLERS ---

  const handleOpenQuote = (id: string) => {
    closeCommand();
    // Redirection vers la route dynamique
    router.push(`/devis/${id}`);
  };

  const handleNewQuote = () => {
    closeCommand();
    // Redirection vers la route de création
    router.push("/devis/new");
  };

  const submitNewFolder = async () => {
    if (!newFolderName.trim()) return;

    await createFolderAction(newFolderName.trim());

    closeCommand();
    // Feedback ou refresh
    router.refresh();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      {/* VUE 1 : RACINE (RECHERCHE) */}
      {page === "root" && (
        <>
          <CommandInput
            placeholder="Rechercher un document, une action..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            {/* ETAT DE CHARGEMENT */}
            {isSearching && (
              <div className="flex items-center justify-center py-4 text-neutral-400">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                <span className="text-xs">Recherche en cours...</span>
              </div>
            )}

            {/* AUCUN RÉSULTAT */}
            {!isSearching && results.length === 0 && query.length > 1 && (
              <CommandEmpty>
                <div className="flex flex-col items-center justify-center py-6 text-neutral-500">
                  <Search className="h-8 w-8 mb-2 opacity-20" />
                  <p className="text-sm">Aucun résultat.</p>
                </div>
              </CommandEmpty>
            )}

            {/* RÉSULTATS DE RECHERCHE DYNAMIQUE */}
            {results.length > 0 && (
              <CommandGroup heading="Documents trouvés">
                {results.map((quote) => (
                  <CommandItem
                    key={quote.id}
                    value={`${quote.number} ${quote.clientName}`}
                    onSelect={() => handleOpenQuote(quote.id)}
                    className="cursor-pointer group"
                  >
                    <File className="mr-2 h-4 w-4 text-neutral-400" />
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="font-medium text-sm truncate">
                        {quote.clientName || "Client inconnu"}
                      </span>
                      <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                        <span className="flex items-center gap-0.5 bg-neutral-100 px-1 rounded">
                          <Hash className="w-2.5 h-2.5" /> {quote.number}
                        </span>
                        <span>•</span>
                        <span>
                          {new Intl.NumberFormat("fr-FR", {
                            style: "currency",
                            currency: "EUR",
                          }).format(quote.total)}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="ml-2 h-3 w-3 text-neutral-300 opacity-0 group-aria-selected:opacity-100 transition-opacity" />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            <CommandSeparator />

            {/* ACTIONS STATIQUES */}
            <CommandGroup heading="Actions rapides">
              <CommandItem
                onSelect={handleNewQuote}
                className="cursor-pointer group"
              >
                <Plus className="mr-2 h-4 w-4 text-neutral-500 group-aria-selected:text-neutral-900" />
                <span>Créer un nouveau devis</span>
                <CommandShortcut>⌘N</CommandShortcut>
              </CommandItem>

              <CommandItem
                onSelect={() => {
                  setPage("new-folder");
                  setNewFolderName("");
                }}
                className="cursor-pointer group"
              >
                <FolderPlus className="mr-2 h-4 w-4 text-neutral-500 group-aria-selected:text-neutral-900" />
                <span>Nouveau dossier...</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </>
      )}

      {/* VUE 2 : CRÉATION DOSSIER (INPUT) */}
      {page === "new-folder" && (
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4 text-sm text-neutral-400">
            <button
              onClick={() => setPage("root")}
              className="hover:text-neutral-900 transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" /> Retour
            </button>
            <span className="text-neutral-300">/</span>
            <span className="text-neutral-900 font-medium flex items-center gap-2">
              <Folder className="w-3 h-3" /> Nouveau dossier
            </span>
          </div>

          <div className="flex gap-2">
            <Input
              autoFocus
              placeholder="Nom du dossier (ex: Projets 2025)"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitNewFolder();
                if (e.key === "Escape") setPage("root");
              }}
              className="h-10"
            />
            <Button
              onClick={submitNewFolder}
              disabled={!newFolderName.trim()}
              className="bg-neutral-900 text-white"
            >
              Créer <CornerDownLeft className="ml-2 w-3 h-3 opacity-50" />
            </Button>
          </div>

          <p className="text-[10px] text-neutral-400 mt-3 ml-1">
            Appuyez sur <span className="font-bold">Entrée</span> pour valider
            ou <span className="font-bold">Échap</span> pour annuler.
          </p>
        </div>
      )}
    </CommandDialog>
  );
}
