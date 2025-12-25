"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  LayoutGrid,
  Layers,
  X,
  Database,
  ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";

// Types & Actions
import { UIItem, UIDomain, UICategory } from "@/types/explorer";
import { upsertItemAction } from "@/app/actions/item.actions";

// Sub-Components
import { ExplorerSidebar } from "./ExplorerSidebar";
import { ServiceCard } from "./ServiceCard";
import { ImportSetBuilder } from "./ImportSetBuilder";
import { ServiceDetailsDialog } from "./ServiceDetailsDialog";

// UI Atoms
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// --- 1. HOOK DE CALCUL (LOGIQUE ROBUSTE) ---
// Ce hook encapsule toute la complexité mathématique et contextuelle.
// Il sort du JSX pour être testable et propre.
const useExplorerMetrics = (
  mappedDomains: UIDomain[],
  activeDomainId: string | null,
  searchQuery: string,
  importSet: UIItem[]
) => {
  return useMemo(() => {
    // A. Calcul du total global (Performance: O(n))
    const totalServicesCount = mappedDomains.reduce(
      (acc, domain) =>
        acc +
        domain.categories.reduce((acc2, cat) => acc2 + cat.items.length, 0),
      0
    );

    // B. Détermination du contexte actuel
    const currentDomain = mappedDomains.find((d) => d.id === activeDomainId);
    const isSearching = searchQuery.trim().length > 0;

    // C. Titre et Sous-titre dynamiques
    let viewTitle = "Catalogue";
    let viewSubtitle = "Explorateur de services";
    let viewIcon = Database;

    if (isSearching) {
      viewTitle = `Résultats pour "${searchQuery}"`;
      viewSubtitle = "Recherche globale";
      viewIcon = Search;
    } else if (currentDomain) {
      viewTitle = currentDomain.label;
      viewSubtitle = "Domaine d'expertise";
      viewIcon = Layers;
    }

    return {
      totalServicesCount,
      selectionCount: importSet.length,
      viewTitle,
      viewSubtitle,
      ViewIcon: viewIcon,
      isSearching,
    };
  }, [mappedDomains, activeDomainId, searchQuery, importSet.length]);
};

// --- 2. COMPOSANT HEADER (PRÉSENTATION PURE) ---
const ExplorerHeader = ({
  metrics,
  onClearSearch,
}: {
  metrics: ReturnType<typeof useExplorerMetrics>;
  onClearSearch: () => void;
}) => {
  const { ViewIcon } = metrics;

  return (
    <header className="h-18 px-8 py-8 flex items-center justify-between border-b border-zinc-200 bg-white/90 backdrop-blur-md z-10 shadow-sm">
      {/* BLOC GAUCHE : CONTEXTE */}
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-zinc-50 border border-zinc-200 shadow-sm text-zinc-500">
          <ViewIcon size={20} strokeWidth={2} />
        </div>
        <div className="flex flex-col">
          <h2 className="text-lg font-bold text-zinc-900 tracking-tight leading-none">
            {metrics.viewTitle}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
              {metrics.viewSubtitle}
            </span>
            {metrics.isSearching && (
              <button
                onClick={onClearSearch}
                className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full hover:bg-red-100 transition-colors"
              >
                <X size={10} /> EFFACER
              </button>
            )}
          </div>
        </div>
      </div>

      {/* BLOC DROITE : MÉTRIQUES (KPIs) */}
      <div className="flex items-center gap-6">
        {/* KPI 1 : Disponibilité */}
        <div className="hidden lg:flex flex-col items-end">
          <span className="text-2xl font-bold text-zinc-900 leading-none">
            {metrics.totalServicesCount}
          </span>
          <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wide">
            Services Indexés
          </span>
        </div>

        <Separator orientation="vertical" className="h-8 hidden lg:block" />

        {/* KPI 2 : Sélection (Panier) */}
        <div
          className={`
            flex items-center gap-3 px-4 py-2 rounded-xl border transition-all duration-300
            ${
              metrics.selectionCount > 0
                ? "bg-indigo-600 border-indigo-500 shadow-md shadow-indigo-200"
                : "bg-zinc-50 border-zinc-200 text-zinc-400"
            }
          `}
        >
          <div
            className={`p-1.5 rounded-lg ${
              metrics.selectionCount > 0
                ? "bg-white/20 text-white"
                : "bg-zinc-200/50"
            }`}
          >
            <ShoppingBag size={18} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span
              className={`text-sm font-bold leading-none ${
                metrics.selectionCount > 0 ? "text-white" : "text-zinc-500"
              }`}
            >
              {metrics.selectionCount} Item
              {metrics.selectionCount > 1 ? "s" : ""}
            </span>
            <span
              className={`text-[10px] font-medium uppercase tracking-wide leading-none mt-1 ${
                metrics.selectionCount > 0 ? "text-indigo-100" : "text-zinc-400"
              }`}
            >
              Sélectionnés
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

// --- 3. PAGE PRINCIPALE ---
interface ServiceExplorerPageProps {
  mappedDomains: UIDomain[];
}

export const ServiceExplorerPage = ({
  mappedDomains,
}: ServiceExplorerPageProps) => {
  const router = useRouter();

  // --- STATE ---
  const [activeDomainId, setActiveDomainId] = useState<string | null>(
    mappedDomains[0]?.id || null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [importSet, setImportSet] = useState<UIItem[]>([]);
  const [viewingItem, setViewingItem] = useState<UIItem | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  // --- CALCUL DES MÉTRIQUES (Appel du Hook) ---
  const metrics = useExplorerMetrics(
    mappedDomains,
    activeDomainId,
    searchQuery,
    importSet
  );

  // --- EFFECTS ---
  useEffect(() => {
    if (!activeDomainId && mappedDomains.length > 0) {
      setActiveDomainId(mappedDomains[0].id);
    }
  }, [mappedDomains, activeDomainId]);

  // --- LOGIQUE DE FILTRAGE (Reste identique pour l'affichage grille) ---
  const displayCategories = useMemo(() => {
    if (searchQuery.trim().length > 0) {
      const query = searchQuery.toLowerCase();
      const allResults: UICategory[] = [];
      mappedDomains.forEach((domain) => {
        domain.categories.forEach((cat) => {
          const matchingItems = cat.items.filter(
            (item) =>
              item.title.toLowerCase().includes(query) ||
              item.description.toLowerCase().includes(query)
          );
          if (matchingItems.length > 0) {
            allResults.push({
              ...cat,
              label: `${domain.label} • ${cat.label}`,
              items: matchingItems,
            });
          }
        });
      });
      return allResults;
    }
    const currentDomain = mappedDomains.find((d) => d.id === activeDomainId);
    return currentDomain ? currentDomain.categories : [];
  }, [searchQuery, activeDomainId, mappedDomains]);

  // --- HANDLERS ---
  const handleAddToSet = (item: UIItem) => {
    if (importSet.some((i) => i.id === item.id)) {
      toast.info("Déjà sélectionné");
      return;
    }
    setImportSet((prev) => [...prev, item]);
    toast.success("Ajouté", { description: item.title });
  };

  const handleRemoveFromSet = (id: string) => {
    setImportSet((prev) => prev.filter((item) => item.id !== id));
  };

  const handleImportAction = async () => {
    if (importSet.length === 0) return;
    setIsImporting(true);

    try {
      await Promise.allSettled(
        importSet.map((item) =>
          upsertItemAction({
            title: item.title,
            description: item.description,

            // TRANSFERT DE VALEUR : On prend le prix configuré du Dialog
            unitPriceEuros: item.defaultPrice,

            defaultQuantity: 1,
            isTaxable: true,
            category: item.category,

            // On n'oublie pas le moteur Ferrari
            pricing: item.pricing,
            technicalScope: item.technicalScope,
            salesCopy: item.salesCopy,
            marketContext: item.marketContext,
          })
        )
      );
      toast.success("Import terminé avec succès");
      setImportSet([]);
      router.push("/items"); // Ou /catalog selon ta route
    } catch (e) {
      toast.error("Erreur d'import");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-zinc-50 overflow-hidden font-sans text-zinc-900">
      <ExplorerSidebar
        domains={mappedDomains}
        activeDomainId={activeDomainId}
        onSelectDomain={(id) => {
          setSearchQuery("");
          setActiveDomainId(id);
        }}
      />

      <main className="flex-1 flex flex-col min-w-0 bg-zinc-50/50 relative z-0">
        {/* INSERTION DU NOUVEAU HEADER ROBUSTE */}
        <ExplorerHeader
          metrics={metrics}
          onClearSearch={() => setSearchQuery("")}
        />

        <div className="flex-1 overflow-hidden relative">
          <ScrollArea className="h-full w-full">
            {/* Barre de recherche interne */}
            <div className="py-6 px-8 sticky top-0 bg-zinc-50/95 backdrop-blur z-20 border-b border-dashed border-zinc-200">
              <div className="relative max-w-xl mx-auto group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" />
                <Input
                  placeholder="Rechercher un service par mot-clé..."
                  className="pl-10 h-11 bg-white border-zinc-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-base rounded-xl shadow-sm transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="p-8 pb-32 max-w-[1400px] mx-auto">
              {displayCategories.length > 0 ? (
                displayCategories.map((cat) => (
                  <div
                    key={cat.id}
                    className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700"
                  >
                    <div className="flex items-center gap-3 mb-5">
                      <div className="h-px flex-1 bg-zinc-200"></div>
                      <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">
                        {cat.label}
                      </h3>
                      <div className="h-px flex-1 bg-zinc-200"></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {cat.items.map((item) => (
                        <ServiceCard
                          key={item.id}
                          item={item}
                          onViewDetails={setViewingItem}
                          onAddToSet={handleAddToSet}
                          isInSet={importSet.some((i) => i.id === item.id)}
                        />
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-[40vh] text-zinc-400">
                  <LayoutGrid className="w-16 h-16 mb-4 opacity-10" />
                  <p className="text-lg font-medium text-zinc-600">
                    Aucun résultat
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </main>

      <ImportSetBuilder
        importSet={importSet}
        onRemoveItem={handleRemoveFromSet}
        onDropItem={handleAddToSet}
        onImport={handleImportAction}
        isImporting={isImporting}
      />

      <ServiceDetailsDialog
        item={viewingItem}
        isOpen={!!viewingItem}
        onClose={() => setViewingItem(null)}
        onAddToSet={handleAddToSet}
        isInSet={
          viewingItem ? importSet.some((i) => i.id === viewingItem.id) : false
        }
      />
    </div>
  );
};
