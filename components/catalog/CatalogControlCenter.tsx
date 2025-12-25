"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Sparkles,
  LayoutGrid,
  Box,
  Server,
  ArrowRight,
  Import,
} from "lucide-react";
import { toast } from "sonner";

// Types & Actions (Assurez-vous que ServiceItem et ItemInput sont corrects)
// NOTE: J'utilise le type UIItem pour la cohérence avec le reste du projet
import { UIItem as ServiceItem, ItemInput } from "@/types/explorer";
import { upsertItemAction } from "@/app/actions/item.actions";
import { useServiceSearch } from "@/hooks/useServiceSearch"; // Assurez-vous que ce hook est robuste

// UI Imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Sub-components
import { ServiceGridTable } from "./ServiceGridTable";
import { AddEditServiceSheet } from "./AddEditServiceSheet";

interface CatalogControlCenterProps {
  initialItems: ServiceItem[];
  mappedDomains: any[]; // Gardé pour la compatibilité, mais devrait être typé
}

export default function CatalogControlCenter({
  initialItems,
}: CatalogControlCenterProps) {
  const router = useRouter();

  // --- STATE ---
  const [items, setItems] = useState<ServiceItem[]>(initialItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // ===========================================================================
  // 1. LOGIQUE DE FILTRAGE (Défense contre les undefined)
  // ===========================================================================
  const searchedItems = useServiceSearch(items, searchQuery);

  // **Correction Anti-undefined (1) :** Filtrage sur la catégorie
  const displayItems = useMemo(() => {
    if (selectedCategory === "All") return searchedItems;
    // On utilise `i.category || "Uncategorized"` pour s'assurer qu'on ne filtre jamais sur undefined
    return searchedItems.filter(
      (i) => (i.category || "Uncategorized") === selectedCategory
    );
  }, [searchedItems, selectedCategory]);

  // **Correction Anti-undefined (2) :** Génération des catégories
  const categories = useMemo(() => {
    // On map en utilisant `i.category || "Uncategorized"` pour éviter de passer `undefined` à `Set`
    const cats = new Set(items.map((i) => i.category || "Uncategorized"));
    return ["All", ...Array.from(cats)].sort();
  }, [items]);

  // ===========================================================================
  // 2. ACTIONS CRUD (Optimistic UI & Gestion d'Erreur)
  // ===========================================================================

  // Handler d'Update (Utilise useCallback pour la stabilité)
  const handleUpdateItem = useCallback(
    async (id: string, field: keyof ItemInput, value: any) => {
      const targetItem = items.find((i) => i.id === id);
      if (!targetItem) {
        console.warn(`Item ID ${id} non trouvé pour la mise à jour.`);
        return;
      }

      const previousItems = [...items]; // Sauvegarde pour Rollback
      const updatedData = { ...targetItem, [field]: value };

      // 1. Mise à jour Optimiste (Vitesse d'exécution > Vente !)
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        )
      );

      try {
        // NOTE: On passe ItemInput, donc on doit s'assurer que targetItem + le champ mis à jour
        // correspondent bien aux propriétés attendues par ItemInput (titre, prix, etc.)
        const res = await upsertItemAction(updatedData as ItemInput, id);
        if (!res.success) throw new Error(res.error);

        toast.success("Service sauvegardé", { description: targetItem.title });
      } catch (error) {
        // 2. Rollback en cas d'échec serveur
        setItems(previousItems);
        toast.error("Erreur de sauvegarde", {
          description: `Raison: ${
            error instanceof Error ? error.message : "Inconnue"
          }`,
        });
      }
    },
    [items] // Dépend de `items` pour trouver `targetItem`
  );

  // Handler de Création (Plus propre et défensif)
  const handleCreateSuccess = useCallback(
    async (newItem: ItemInput) => {
      setIsSheetOpen(false); // Fermeture immédiate pour réduire la friction

      // Tentative d'appel serveur
      const res = await upsertItemAction(newItem);

      if (res.success) {
        toast.success("Service ajouté au catalogue");

        // Construction de l'objet complet pour l'UI
        const createdItem: ServiceItem = {
          id: res.data?.id || `temp-${Date.now()}`,
          ...newItem,
          // Ajout de champs de ServiceItem qui pourraient être manquants dans ItemInput
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: "current-user",
          description: newItem.description || "", // Sécurité
          // ... ajoutez d'autres champs si UIItem/ServiceItem en requièrent
        } as ServiceItem;

        // Mise à jour Locale Immédiate
        setItems((prev) => [createdItem, ...prev]);

        // Refonte des données en arrière-plan (Nettoyage)
        router.refresh();
      } else {
        toast.error("Impossible de créer le service", {
          description: res.error,
        });
      }
    },
    [router]
  );

  // ===========================================================================
  // 3. RENDU
  // ===========================================================================

  return (
    <div className="flex h-screen w-full bg-white text-zinc-900 font-sans overflow-hidden">
      {/* SIDEBAR : Navigation & PROMO EXPLORER */}
      <aside className="w-64 shrink-0 border-r border-zinc-200 bg-zinc-50 flex flex-col z-10">
        {/* ZONE PROMO : Monétisation */}
        <div className="p-4">
          <div
            onClick={() => router.push("/explore")}
            className="group cursor-pointer relative overflow-hidden rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-600 to-violet-700 p-5 shadow-md hover:shadow-lg transition-all"
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

        {/* NAVIGATION CATÉGORIES */}
        <div className="px-4 py-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3 px-2">
            Catégories ({items.length} items)
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
                    {cat === "All" ? `Tout voir (${items.length})` : cat}
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
                <h1 className="text-xl font-semibold text-zinc-900">
                  Catalogue Personnel
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
              Mode Édition Rapide : **Gagnez du temps** en modifiant directement
              le tableau.
            </p>
          </div>

          <ServiceGridTable items={displayItems} onUpdate={handleUpdateItem} />
        </div>
      </main>

      {/* MODALE D'AJOUT/ÉDITION */}
      <AddEditServiceSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onSave={handleCreateSuccess}
        initialData={{
          title: "",
          description: "",
          unitPriceEuros: 0,
          defaultQuantity: 1,
          isTaxable: true,
          // Définit la catégorie par défaut à la sélection actuelle ou "Général"
          category: selectedCategory !== "All" ? selectedCategory : "Général",
        }}
        isNew={true}
      />
    </div>
  );
}
