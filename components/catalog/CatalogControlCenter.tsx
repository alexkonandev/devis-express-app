"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Sparkles,
  FolderOpen,
  LayoutGrid,
  Box,
  Server,
  ArrowRight,
  Import,
} from "lucide-react";
import { toast } from "sonner";
import { ServiceItem, ItemInput } from "@/lib/types";
import { upsertItemAction } from "@/app/actions/item.actions";
import { useServiceSearch } from "@/hooks/useServiceSearch";

// UI Imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// Sub-components
import { ServiceGridTable } from "./ServiceGridTable";
import { AddEditServiceSheet } from "./AddEditServiceSheet";

interface CatalogControlCenterProps {
  initialItems: ServiceItem[];
  mappedDomains: any[];
}

export default function CatalogControlCenter({
  initialItems,
}: CatalogControlCenterProps) {
  const router = useRouter();
  const [items, setItems] = useState<ServiceItem[]>(initialItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // --- LOGIC ---
  const searchedItems = useServiceSearch(items, searchQuery);
  const displayItems = useMemo(() => {
    if (selectedCategory === "All") return searchedItems;
    return searchedItems.filter((i) => i.category === selectedCategory);
  }, [searchedItems, selectedCategory]);

  const categories = useMemo(() => {
    const cats = new Set(
      items.map((i) => i.category || "Uncategorized").filter(Boolean)
    );
    return ["All", ...Array.from(cats)].sort();
  }, [items]);

  // --- ACTIONS ---
  const handleUpdateItem = async (
    id: string,
    field: keyof ItemInput,
    value: any
  ) => {
    const previousItems = [...items];
    const targetItem = items.find((i) => i.id === id);
    if (!targetItem) return;

    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );

    try {
      const updatedData = { ...targetItem, [field]: value };
      const res = await upsertItemAction(updatedData, id);
      if (!res.success) throw new Error(res.error);
    } catch (error) {
      setItems(previousItems);
      toast.error("Erreur de sauvegarde");
    }
  };

  // CORRECTION MAJEURE : Feedback Immédiat
  const handleCreateSuccess = async (newItem: ItemInput) => {
    // 1. Appel serveur
    const res = await upsertItemAction(newItem);

    if (res.success) {
      toast.success("Service ajouté au catalogue");
      setIsSheetOpen(false);

      // 2. Mise à jour Locale Immédiate (Optimistic-like)
      // Si l'action serveur retourne l'item créé (res.data), on l'utilise.
      // Sinon, on simule un item localement pour l'affichage immédiat.
      // Note: Assurez-vous que upsertItemAction retourne idéalement l'objet créé.
      // Ici, on crée un objet temporaire pour l'UI si nécessaire.

      const createdItem: ServiceItem = {
        id: res.data?.id || `temp-${Date.now()}`, // ID temporaire ou réel
        ...newItem,
        // Valeurs par défaut pour les champs manquants
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "current-user",
      } as ServiceItem;

      // Ajout en HAUT de la liste (nouveauté visible tout de suite)
      setItems((prev) => [createdItem, ...prev]);

      // On refresh quand même en background pour la consistance des données
      router.refresh();
    } else {
      toast.error("Impossible de créer le service");
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full bg-white text-zinc-900 font-sans overflow-hidden">
      {/* SIDEBAR : Navigation & PROMO EXPLORER */}
      <aside className="w-64 shrink-0 border-r border-zinc-200 bg-zinc-50 flex flex-col z-10">
        {/* ZONE PROMO */}
        <div className="p-4">
          <div
            onClick={() => router.push("/explore")}
            className="group cursor-pointer relative overflow-hidden rounded-xl border border-indigo-200 bg-linear-to-br from-indigo-600 to-violet-700 p-5 shadow-md hover:shadow-lg transition-all"
          >
            <div className="relative z-10">
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur-md">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <h3 className="font-bold text-white text-sm mb-1">
                Bibliothèque Standard
              </h3>
              <p className="text-xs text-indigo-100 leading-relaxed mb-3 opacity-90">
                Ne partez pas de zéro. Importez des packs complets.
              </p>
              <div className="flex items-center text-xs font-bold text-white uppercase tracking-wider">
                Explorer{" "}
                <ArrowRight className="ml-1 w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-2">
          {/* Typo augmentée : text-[10px] -> text-xs + text-zinc-500 -> text-zinc-600 */}
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3 px-2">
            Catégories
          </h2>
          <nav className="space-y-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "flex items-center justify-between w-full px-3 py-2.5 text-sm rounded-lg transition-all text-left",
                  selectedCategory === cat
                    ? "bg-white text-zinc-900 font-semibold shadow-sm border border-zinc-200"
                    : "text-zinc-600 hover:bg-zinc-200/50 hover:text-zinc-900"
                )}
              >
                <div className="flex items-center gap-3">
                  {cat === "All" ? (
                    <LayoutGrid
                      className={cn(
                        "w-4 h-4",
                        selectedCategory === cat
                          ? "text-black"
                          : "text-zinc-400"
                      )}
                    />
                  ) : (
                    <Box
                      className={cn(
                        "w-4 h-4",
                        selectedCategory === cat
                          ? "text-black"
                          : "text-zinc-400"
                      )}
                    />
                  )}
                  <span className="truncate max-w-[140px]">
                    {cat === "All" ? "Tout voir" : cat}
                  </span>
                </div>
                {selectedCategory === cat && (
                  <div className="w-2 h-2 rounded-full bg-green-600" />
                )}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 bg-white">
        {/* HEADER */}
        <header className="h-16 px-5 py-4 flex items-center justify-between border-b border-zinc-200 bg-white sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-zinc-100 rounded-lg text-zinc-700 border border-zinc-200">
                <Server className="w-5 h-5 text-black" />
              </div>
              <div>
                <h1 className="text-xl  font-semibold text-zinc-900 ">
                  Catalogue
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-64 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-indigo-600" />
              <Input
                placeholder="Filtrer par nom, référence..."
                className="pl-9 h-9 bg-zinc-50 border-zinc-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 text-sm rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              className="h-9 text-xs font-medium border-zinc-300 text-zinc-700 hover:bg-zinc-50"
              onClick={() => router.push("/explore")}
            >
              <Import className="w-4 h-4 mr-2" />
              Importer
            </Button>
            <Button
              onClick={() => setIsSheetOpen(true)}
              size="sm"
              className="h-9 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" /> Créer un service
            </Button>
          </div>
        </header>

        {/* TABLEAU */}
        <div className="flex-1 overflow-hidden relative bg-zinc-50 p-6 flex flex-col">
          {/* Guide visuel */}
          <div className="mb-3 flex items-center gap-2 px-1">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
            <p className="text-[13px] text-zinc-500 font-medium">
              Mode Édition Rapide : Cliquez directement sur une case pour
              modifier son contenu.
            </p>
          </div>

          <ServiceGridTable items={displayItems} onUpdate={handleUpdateItem} />
        </div>
      </main>

      <AddEditServiceSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onSave={(data) => handleCreateSuccess(data)}
        initialData={{
          title: "",
          description: "",
          unitPriceEuros: 0,
          defaultQuantity: 1,
          isTaxable: true,
          category: selectedCategory !== "All" ? selectedCategory : "Général",
        }}
        isNew={true}
      />
    </div>
  );
}
