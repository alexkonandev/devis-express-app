"use client";

import React, { useState, useTransition, useMemo } from "react";
import {
  Search,
  Plus,
  Library,
  User,
  MoreHorizontal,
  Edit2,
  Package,
  Trash2,
  Loader2,
  Check,
  AlertTriangle,
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

/**
 * NOTIFICATIONS DESIGN SYSTEM (ADN INDUSTRIEL)
 */
const notify = {
  success: (msg: string) =>
    toast.custom(() => (
      <div className="bg-slate-950 border-2 border-indigo-600 p-4 flex items-center gap-3 w-[300px] shadow-2xl rounded-none animate-in slide-in-from-top-2">
        <Check className="w-4 h-4 text-emerald-500" />
        <p className="text-[10px] font-black uppercase text-white tracking-widest">
          {msg}
        </p>
      </div>
    )),
  error: (msg: string) =>
    toast.custom(() => (
      <div className="bg-slate-950 border-2 border-rose-600 p-4 flex items-center gap-3 w-[300px] shadow-2xl rounded-none animate-in slide-in-from-top-2">
        <AlertTriangle className="w-4 h-4 text-rose-600" />
        <p className="text-[10px] font-black uppercase text-white tracking-widest">
          {msg}
        </p>
      </div>
    )),
};

interface UnifiedCatalogViewProps {
  initialItems: CatalogListItem[];
}

export default function UnifiedCatalogView({
  initialItems,
}: UnifiedCatalogViewProps) {
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"personal" | "library">("personal");
  const [editingId, setEditingId] = useState<string | null>(null);

  // --- FILTRAGE PSYCHOLOGIE DE L'INVENTAIRE ---
  const filteredItems = useMemo(() => {
    return initialItems.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());
      const matchesTab = tab === "personal" ? !item.isPremium : item.isPremium;
      return matchesSearch && matchesTab;
    });
  }, [initialItems, search, tab]);

  // --- MUTATION PRIX (VITESSE D'EXÉCUTION) ---
  const handlePriceUpdate = async (item: CatalogListItem, newPrice: string) => {
    const price = parseFloat(newPrice);
    if (isNaN(price) || price === item.unitPriceEuros) {
      setEditingId(null);
      return;
    }

    startTransition(async () => {
      const res = await upsertCatalogOffer({
        ...item,
        unitPriceEuros: price,
      });

      if (res.success) notify.success("TARIF MIS À JOUR");
      else notify.error("ERREUR DE SYNCHRONISATION");
      setEditingId(null);
    });
  };

  return (
    <div className="h-[calc(100vh-2.5rem)] w-full bg-white flex flex-col overflow-hidden border-t border-slate-200">
      {/* HEADER : VISION DE L'INVENTAIRE */}
      <header className="shrink-0 bg-white border-b border-slate-200 p-6 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-indigo-600" />
              <h1 className="text-[20px] font-black uppercase tracking-tighter text-slate-950">
                Catalogue Services
              </h1>
            </div>

            {/* SELECTEUR DE FLUX (TABS) */}
            <div className="flex bg-slate-100 p-1 border border-slate-200">
              <button
                onClick={() => setTab("personal")}
                className={cn(
                  "flex items-center gap-2 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest transition-none",
                  tab === "personal"
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                )}
              >
                <User className="w-3.5 h-3.5" /> Mes Actifs
              </button>
              <button
                onClick={() => setTab("library")}
                className={cn(
                  "flex items-center gap-2 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest transition-none",
                  tab === "library"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                )}
              >
                <Library className="w-3.5 h-3.5" /> Bibliothèque
              </button>
            </div>
          </div>

          <Button className="bg-slate-950 hover:bg-black text-white font-black h-10 px-6 rounded-none text-[11px] uppercase tracking-widest transition-none">
            <Plus className="w-4 h-4 mr-2" /> Créer Service
          </Button>
        </div>

        {/* BARRE DE RECHERCHE INDUSTRIELLE */}
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="RECHERCHER RÉFÉRENCE OU CATÉGORIE..."
            className="h-11 w-full pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-none text-[11px] font-bold uppercase tracking-wider outline-none focus:border-slate-950 transition-all placeholder:text-slate-300"
          />
        </div>
      </header>

      {/* ZONE DATA : TABLEAU DENSE */}
      <main className="flex-1 overflow-y-auto relative custom-scrollbar">
        {isPending && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-50 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        )}

        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200">
            <tr>
              <th className="py-4 px-8 border-r border-slate-100">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Service / Nomenclature
                </span>
              </th>
              <th className="py-4 px-8 border-r border-slate-100">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Catégorie
                </span>
              </th>
              <th className="py-4 px-8 text-right border-r border-slate-100">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Prix HT (Mono)
                </span>
              </th>
              <th className="py-4 px-8 w-20 text-right bg-slate-50"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-32 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Package className="w-10 h-10 text-slate-200" />
                    <span className="text-[11px] font-black uppercase text-slate-300 tracking-[0.5em]">
                      Inventaire Vide
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className="group hover:bg-slate-50/80 transition-none border-b border-slate-100"
                >
                  <td className="py-5 px-8">
                    <div className="flex flex-col">
                      <span className="text-[13px] font-black text-slate-950 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">
                        {item.title}
                      </span>
                      {item.subtitle && (
                        <span className="text-[10px] text-slate-400 font-bold uppercase italic mt-1 tracking-tighter">
                          {"// "} {item.subtitle}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-5 px-8">
                    <span className="inline-flex items-center px-2.5 py-1 text-[9px] font-black uppercase bg-slate-100 text-slate-500 border border-slate-200 rounded-none">
                      {item.category}
                    </span>
                  </td>

                  <td className="py-5 px-8 text-right">
                    {editingId === item.id ? (
                      <div className="flex justify-end">
                        <input
                          autoFocus
                          type="number"
                          defaultValue={item.unitPriceEuros}
                          onBlur={(e) =>
                            handlePriceUpdate(item, e.target.value)
                          }
                          onKeyDown={(e) =>
                            e.key === "Enter" && e.currentTarget.blur()
                          }
                          className="w-32 text-right text-[13px] font-mono font-black bg-white border-2 border-slate-950 rounded-none px-3 py-1.5 outline-none shadow-[4px_4px_0px_rgba(0,0,0,0.1)]"
                        />
                      </div>
                    ) : (
                      <span
                        onClick={() => {
                          setTab("personal");
                          setEditingId(item.id);
                        }}
                        className="font-mono text-[14px] font-black text-slate-950 cursor-pointer hover:bg-slate-950 hover:text-white px-3 py-1.5 transition-none tabular-nums"
                      >
                        {new Intl.NumberFormat("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                        }).format(item.unitPriceEuros)}
                      </span>
                    )}
                  </td>

                  <td className="py-5 px-8 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none border border-slate-200 hover:bg-slate-950 hover:text-white transition-none opacity-0 group-hover:opacity-100"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-56 rounded-none border-2 border-slate-950 p-0 shadow-2xl"
                      >
                        <DropdownMenuLabel className="text-[9px] uppercase font-black text-slate-400 p-3 bg-slate-50 border-b">
                          Control Panel
                        </DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => setEditingId(item.id)}
                          className="h-11 text-[10px] font-black uppercase rounded-none focus:bg-indigo-600 focus:text-white cursor-pointer transition-none"
                        >
                          <Edit2 className="w-4 h-4 mr-3" /> Éditer Tarif
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="m-0" />
                        <DropdownMenuItem className="h-11 text-[10px] font-black uppercase text-rose-600 focus:bg-rose-600 focus:text-white rounded-none cursor-pointer transition-none">
                          <Trash2 className="w-4 h-4 mr-3" /> Écarter
                          l&apos;actif
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
