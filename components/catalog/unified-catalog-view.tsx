"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Filter,
  Download,
  Library,
  User,
  MoreHorizontal,
  ArrowRight,
  Copy,
  Edit2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CatalogItem,
  quickUpdateItemAction,
  copyLibraryItemAction,
} from "@/app/actions/item.actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

// --- MICRO COMPOSANTS STUDIO ---
const StudioLabel = ({ children, className }: any) => (
  <span
    className={cn(
      "text-[9px] font-bold uppercase tracking-widest text-zinc-400 select-none",
      className
    )}
  >
    {children}
  </span>
);

export default function UnifiedCatalogView({
  initialItems,
}: {
  initialItems: CatalogItem[];
}) {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"personal" | "library">("personal");
  const [editingId, setEditingId] = useState<string | null>(null);

  // --- FILTRAGE LOCAL ---
  const filteredItems = useMemo(() => {
    return initialItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());
      const matchesTab =
        tab === "personal" ? !item.isStandard : item.isStandard;
      return matchesSearch && matchesTab;
    });
  }, [initialItems, search, tab]);

  // --- ACTIONS ---

  const handleCopyFromLib = async (item: CatalogItem) => {
    const res = await copyLibraryItemAction(item);
    if (res.success) toast.success(`${item.name} ajouté à vos services`);
    else toast.error("Erreur copie");
  };

  const handlePriceUpdate = async (id: string, newPrice: string) => {
    const price = parseFloat(newPrice);
    if (isNaN(price)) return;

    const res = await quickUpdateItemAction(id, "unitPriceEuros", price);
    if (res.success) toast.success("Prix mis à jour");
    setEditingId(null);
  };

  return (
    <div className="h-screen w-full bg-zinc-50/50 flex flex-col font-sans text-zinc-900 overflow-hidden">
      {/* HEADER FIXE */}
      <header className="shrink-0 bg-white border-b border-zinc-200 px-6 py-4 flex flex-col gap-4">
        {/* Titre + Tabs */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-black tracking-tight text-zinc-900">
              CATALOGUE SERVICES
            </h1>

            {/* TABS SELECTOR */}
            <div className="flex bg-zinc-100 p-0.5 rounded-sm border border-zinc-200">
              <button
                onClick={() => setTab("personal")}
                className={cn(
                  "flex items-center gap-2 px-3 py-1 text-[10px] font-bold uppercase tracking-wide rounded-[1px] transition-all",
                  tab === "personal"
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-700"
                )}
              >
                <User className="w-3 h-3" /> Mes Services
              </button>
              <button
                onClick={() => setTab("library")}
                className={cn(
                  "flex items-center gap-2 px-3 py-1 text-[10px] font-bold uppercase tracking-wide rounded-[1px] transition-all",
                  tab === "library"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-700"
                )}
              >
                <Library className="w-3 h-3" /> Bibliothèque Standard
              </button>
            </div>
          </div>

          <Button className="bg-zinc-900 hover:bg-black text-white font-bold h-8 px-4 rounded-sm text-xs shadow-sm">
            <Plus className="w-3.5 h-3.5 mr-2" /> Nouveau Service
          </Button>
        </div>

        {/* Toolbar Recherche */}
        <div className="flex items-center gap-2 max-w-lg">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                tab === "personal"
                  ? "Rechercher dans mes services..."
                  : "Rechercher dans la bibliothèque..."
              }
              className="h-9 w-full pl-9 pr-3 bg-white border border-zinc-200 rounded-sm text-xs font-medium focus:outline-none focus:ring-1 focus:ring-zinc-900"
            />
          </div>
        </div>
      </header>

      {/* TABLEAU DATA GRID */}
      <main className="flex-1 overflow-auto bg-white">
        <table className="w-full text-left border-collapse">
          <thead className="bg-zinc-50 sticky top-0 z-10 border-b border-zinc-200 shadow-sm">
            <tr>
              <th className="py-3 px-6 w-[40%]">
                <StudioLabel>Nom du service</StudioLabel>
              </th>
              <th className="py-3 px-6 w-[20%]">
                <StudioLabel>Catégorie</StudioLabel>
              </th>
              <th className="py-3 px-6 w-[20%] text-right">
                <StudioLabel>Prix Unitaire HT</StudioLabel>
              </th>
              <th className="py-3 px-6 w-[20%] text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {filteredItems.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-20 text-center text-xs text-zinc-400"
                >
                  Aucun service trouvé.
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className="group hover:bg-zinc-50 transition-colors"
                >
                  {/* COLONNE NOM */}
                  <td className="py-3 px-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-zinc-900">
                        {item.name}
                      </span>
                      {item.description && (
                        <span className="text-[10px] text-zinc-400 truncate max-w-[300px]">
                          {item.description}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* COLONNE CATEGORIE */}
                  <td className="py-3 px-6">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-zinc-100 text-zinc-600 border border-zinc-200">
                      {item.category}
                    </span>
                  </td>

                  {/* COLONNE PRIX (Editable) */}
                  <td className="py-3 px-6 text-right">
                    {editingId === item.id ? (
                      <input
                        autoFocus
                        defaultValue={item.price}
                        onBlur={(e) =>
                          handlePriceUpdate(item.id, e.target.value)
                        }
                        onKeyDown={(e) =>
                          e.key === "Enter" && e.currentTarget.blur()
                        }
                        className="w-20 text-right text-sm font-mono font-bold bg-white border border-indigo-500 rounded-sm px-1 focus:outline-none"
                      />
                    ) : (
                      <span
                        onClick={() =>
                          !item.isStandard && setEditingId(item.id)
                        }
                        className={cn(
                          "font-mono text-sm font-bold text-zinc-900",
                          !item.isStandard &&
                            "cursor-pointer hover:underline decoration-dashed decoration-zinc-300"
                        )}
                      >
                        {new Intl.NumberFormat("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                        }).format(item.price)}
                      </span>
                    )}
                  </td>

                  {/* COLONNE ACTIONS */}
                  <td className="py-3 px-6 text-right">
                    {item.isStandard ? (
                      <Button
                        onClick={() => handleCopyFromLib(item)}
                        size="sm"
                        variant="ghost"
                        className="h-7 text-[10px] font-bold uppercase bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700"
                      >
                        <Copy className="w-3 h-3 mr-1.5" /> Ajouter
                      </Button>
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-zinc-300 hover:text-zinc-900 rounded-sm"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel className="text-[9px] uppercase font-bold text-zinc-400">
                            Actions
                          </DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => setEditingId(item.id)}
                          >
                            <Edit2 className="w-3.5 h-3.5 mr-2 text-zinc-400" />{" "}
                            Modifier prix
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600 focus:text-red-700 focus:bg-red-50">
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </main>
    </div>
  );
}
