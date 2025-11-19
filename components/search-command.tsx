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
import { Input } from "@/components/ui/input"; // Assurez-vous d'avoir ce composant UI
import { Button } from "@/components/ui/button";

import { useQuoteStore } from "@/store/quote.store";

interface SearchCommandProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function SearchCommand({ open, setOpen }: SearchCommandProps) {
  const router = useRouter();

  // Gestion des "Pages" dans la commande (root | new-folder)
  const [page, setPage] = React.useState<"root" | "new-folder">("root");
  const [newFolderName, setNewFolderName] = React.useState("");

  const { quotes, loadQuoteForEditing, resetActiveQuote, createFolder } =
    useQuoteStore();

  // Reset de l'état quand on ferme/ouvre
  React.useEffect(() => {
    if (open) {
      setPage("root");
      setNewFolderName("");
    }
  }, [open]);

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

  // Helper pour fermer
  const closeCommand = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  // --- ACTIONS ---

  const handleOpenQuote = (quoteNumber: string) => {
    loadQuoteForEditing(quoteNumber);
    closeCommand();
    router.push("/creer");
  };

  const handleNewQuote = () => {
    resetActiveQuote();
    closeCommand();
    router.push("/creer");
  };

  // Validation de la création de dossier
  const submitNewFolder = () => {
    if (!newFolderName.trim()) return;

    createFolder(newFolderName.trim());
    closeCommand();
    // Redirection vers le dashboard (optionnel, ou on reste où on est)
    router.push("/mes-devis");
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      {/* VUE 1 : RACINE (RECHERCHE) */}
      {page === "root" && (
        <>
          <CommandInput placeholder="Rechercher un document, une action..." />
          <CommandList>
            <CommandEmpty>
              <div className="flex flex-col items-center justify-center py-6 text-neutral-500">
                <Search className="h-8 w-8 mb-2 opacity-20" />
                <p className="text-sm">Aucun résultat.</p>
              </div>
            </CommandEmpty>

            {/* DOCUMENTS */}
            {quotes.length > 0 && (
              <CommandGroup heading="Documents récents">
                {quotes.map((quote) => (
                  <CommandItem
                    key={quote.quote.number}
                    value={`${quote.quote.number} ${quote.client.name}`}
                    onSelect={() => handleOpenQuote(quote.quote.number)}
                    className="cursor-pointer"
                  >
                    <File className="mr-2 h-4 w-4 text-neutral-400" />
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="font-medium text-sm truncate">
                        {quote.client.name || "Brouillon sans nom"}
                      </span>
                      <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                        <span className="flex items-center gap-0.5 bg-neutral-100 px-1 rounded">
                          <Hash className="w-2.5 h-2.5" /> {quote.quote.number}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="ml-2 h-3 w-3 text-neutral-300 opacity-0 group-aria-selected:opacity-100" />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {quotes.length > 0 && <CommandSeparator />}

            {/* ACTIONS */}
            <CommandGroup heading="Actions rapides">
              <CommandItem
                onSelect={handleNewQuote}
                className="cursor-pointer group"
              >
                <Plus className="mr-2 h-4 w-4 text-neutral-500 group-aria-selected:text-neutral-900" />
                <span>Créer un nouveau devis</span>
                <CommandShortcut>⌘N</CommandShortcut>
              </CommandItem>

              {/* ACTION: CHANGER DE VUE */}
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
          {/* Header Retour */}
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

          {/* Champ de saisie */}
          <div className="flex gap-2">
            <Input
              autoFocus
              placeholder="Nom du dossier (ex: Projets 2024)"
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
