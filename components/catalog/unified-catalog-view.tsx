"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Library,
  User,
  MoreHorizontal,
  Edit2,
  Package,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { CatalogListItem } from "@/types/catalog";
import { upsertCatalogOffer } from "@/actions/catalog-action";

// --- MICRO COMPOSANTS STUDIO (Zéro Any) ---
const StudioLabel = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span
    className={cn(
      "text-[9px] font-bold uppercase tracking-widest text-zinc-400 select-none",
      className
    )}
  >
    {children}
  </span>
);

interface UnifiedCatalogViewProps {
  initialItems: CatalogListItem[];
}

export default function UnifiedCatalogView({
  initialItems,
}: UnifiedCatalogViewProps) {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"personal" | "library">("personal");
  const [editingId, setEditingId] = useState<string | null>(null);

  // --- FILTRAGE LOCAL ---
  const filteredItems = useMemo(() => {
    return initialItems.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());

      // Dans ton schéma actuel, tout est "personal" car lié à userId.
      // Si tu ajoutes isPremium ou un système de template, on filtrera ici.
      const matchesTab = tab === "personal" ? !item.isPremium : item.isPremium;
      return matchesSearch && matchesTab;
    });
  }, [initialItems, search, tab]);

  // --- ACTIONS ---
  const handlePriceUpdate = async (item: CatalogListItem, newPrice: string) => {
    const price = parseFloat(newPrice);
    if (isNaN(price)) {
      setEditingId(null);
      return;
    }

    if (price === item.unitPriceEuros) {
      setEditingId(null);
      return;
    }

    const res = await upsertCatalogOffer({
      id: item.id,
      title: item.title,
      subtitle: item.subtitle,
      unitPriceEuros: price,
      category: item.category,
      isPremium: item.isPremium,
    });

    if (res.success) {
      toast.success("Prix mis à jour");
    } else {
      toast.error("Erreur lors de la mise à jour");
    }
    setEditingId(null);
  };

  return (
    <div className="h-screen w-full bg-zinc-50/50 flex flex-col font-sans text-zinc-900 overflow-hidden">
      {/* HEADER FIXE */}
      <header className="shrink-0 bg-white border-b border-zinc-200 px-6 py-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-black tracking-tight text-zinc-900 uppercase">
              Catalogue
            </h1>

            {/* TABS SELECTOR */}
            <div className="flex bg-zinc-100 p-0.5 rounded-sm border border-zinc-200">
              <button
                onClick={() => setTab("personal")}
                className={cn(
                  "flex items-center gap-2 px-3 py-1 text-[10px] font-black uppercase tracking-wide rounded-[1px] transition-all",
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
                  "flex items-center gap-2 px-3 py-1 text-[10px] font-black uppercase tracking-wide rounded-[1px] transition-all",
                  tab === "library"
                    ? "bg-white text-amber-600 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-700"
                )}
              >
                <Library className="w-3 h-3" /> Premium
              </button>
            </div>
          </div>

          <Button className="bg-zinc-900 hover:bg-black text-white font-black h-8 px-4 rounded-sm text-[10px] uppercase shadow-sm active:scale-95 transition-all">
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
              placeholder="Rechercher par titre ou catégorie..."
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
              <th className="py-3 px-6 w-[45%]">
                <StudioLabel>Service</StudioLabel>
              </th>
              <th className="py-3 px-6 w-[20%]">
                <StudioLabel>Catégorie</StudioLabel>
              </th>
              <th className="py-3 px-6 w-[20%] text-right">
                <StudioLabel>Prix Unitaire HT</StudioLabel>
              </th>
              <th className="py-3 px-6 w-[15%] text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Package className="w-8 h-8 text-zinc-200" />
                    <span className="text-[10px] font-black uppercase text-zinc-300 tracking-[0.2em]">
                      Aucun service trouvé
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className="group hover:bg-zinc-50/50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-zinc-900 uppercase tracking-tight">
                        {item.title}
                      </span>
                      {item.subtitle && (
                        <span className="text-[10px] text-zinc-400 font-bold uppercase italic mt-0.5">
                          {item.subtitle}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-black uppercase bg-zinc-100 text-zinc-500 border border-zinc-200">
                      {item.category}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-right">
                    {editingId === item.id ? (
                      <input
                        autoFocus
                        type="number"
                        defaultValue={item.unitPriceEuros}
                        onBlur={(e) => handlePriceUpdate(item, e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && e.currentTarget.blur()
                        }
                        className="w-24 text-right text-xs font-mono font-black bg-white border border-zinc-900 rounded-sm px-2 py-1 focus:outline-none shadow-sm"
                      />
                    ) : (
                      <span
                        onClick={() => setEditingId(item.id)}
                        className="font-mono text-sm font-black text-zinc-900 cursor-pointer hover:bg-zinc-100 px-2 py-1 rounded transition-colors"
                      >
                        {new Intl.NumberFormat("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                        }).format(item.unitPriceEuros)}
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-6 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-zinc-300 hover:text-zinc-900 hover:bg-zinc-200 rounded-sm opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel className="text-[9px] uppercase font-black text-zinc-400">
                          Gestion
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setEditingId(item.id)}
                          className="text-xs font-bold uppercase cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5 mr-2" /> Modifier prix
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-xs font-bold uppercase text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer">
                          <Trash2 className="w-3.5 h-3.5 mr-2" /> Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
