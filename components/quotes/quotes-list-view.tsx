"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  ArrowUpRight,
  Download,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
  CheckSquare,
  MinusSquare,
  FileSpreadsheet, // Icone pour CSV
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  deleteQuotesAction,
  QuoteListResult,
} from "@/app/actions/quote-list.actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/dashboard/status-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

// --- MICRO-COMPOSANTS STUDIO ---

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

const StudioValue = ({ value }: { value: number }) => (
  <span className="font-mono font-bold text-zinc-900 tracking-tighter text-sm">
    {new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(value)}
  </span>
);

// --- COMPOSANT PRINCIPAL ---

export default function QuotesListView({
  initialData,
}: {
  initialData: QuoteListResult;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // DONNÉES & ÉTATS
  const quotes = initialData.data || [];
  const meta = initialData.meta || { total: 0, page: 1, totalPages: 1 };

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [isPending, setIsPending] = useState(false);

  // États Bulk Actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- 1. LOGIQUE FILTRES & TRI (Restaurée) ---

  const updateFilters = (key: string, value: string | null) => {
    setIsPending(true);
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    if (key !== "page") params.set("page", "1"); // Reset page si on filtre

    router.push(`/devis?${params.toString()}`);
  };

  // Debounce Recherche
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== searchParams.get("search")) {
        updateFilters("search", search || null);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset loading quand data arrive
  useEffect(() => {
    setIsPending(false);
  }, [initialData]);

  // Gestion du Tri
  const currentSort = searchParams.get("sortBy") || "updatedAt";
  const currentDir = searchParams.get("sortDir") || "desc";

  const handleSort = (col: string) => {
    const newDir =
      currentSort === col && currentDir === "desc" ? "asc" : "desc";
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", col);
    params.set("sortDir", newDir);
    router.push(`/devis?${params.toString()}`);
  };

  // --- 2. LOGIQUE BULK ACTIONS (Selection & Delete) ---

  const toggleSelectAll = () => {
    if (selectedIds.length === quotes.length) setSelectedIds([]);
    else setSelectedIds(quotes.map((q) => q.id));
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Supprimer définitivement ${selectedIds.length} devis ?`))
      return;
    setIsDeleting(true);
    const result = await deleteQuotesAction(selectedIds);
    if (result.success) {
      toast.success(`${selectedIds.length} devis supprimés.`);
      setSelectedIds([]);
    } else {
      toast.error(result.error || "Erreur lors de la suppression");
    }
    setIsDeleting(false);
  };

  // --- 3. LOGIQUE EXPORT CSV (Nouvelle feature) ---

  const handleExportCSV = () => {
    // On exporte soit la sélection, soit toute la page courante
    const dataToExport =
      selectedIds.length > 0
        ? quotes.filter((q) => selectedIds.includes(q.id))
        : quotes;

    if (dataToExport.length === 0) {
      toast.error("Aucune donnée à exporter");
      return;
    }

    // Création du contenu CSV
    const headers = [
      "Reference",
      "Client",
      "Date",
      "Statut",
      "Montant HT",
      "TVA",
      "Total TTC",
    ];
    const rows = dataToExport.map((q) => [
      q.number,
      q.client.name,
      format(new Date(q.updatedAt), "dd/MM/yyyy"),
      q.status,
      (q.totalTTC / (1 + q.vatRatePercent / 100)).toFixed(2), // Calcul HT rapide
      q.vatRatePercent + "%",
      q.totalTTC.toFixed(2),
    ]);

    const csvContent = [
      headers.join(";"),
      ...rows.map((r) => r.join(";")),
    ].join("\n");

    // Déclenchement du téléchargement
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `export_devis_${format(new Date(), "yyyyMMdd_HHmm")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`${rows.length} lignes exportées.`);
  };

  return (
    <div className="h-screen w-full bg-zinc-50/50 flex flex-col font-sans text-zinc-900 overflow-hidden relative">
      {/* --- HEADER FIXE --- */}
      <header className="shrink-0 bg-white border-b border-zinc-200 px-6 py-4 flex flex-col gap-4">
        {/* Ligne 1: Titre & Nouveau */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-black tracking-tight text-zinc-900">
              GESTION DES DEVIS
            </h1>
            <div className="px-2 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 text-[10px] font-bold text-zinc-500">
              {meta.total} DOSSIERS
            </div>
          </div>
          <Link href="/devis/new">
            <Button className="bg-zinc-900 hover:bg-black text-white font-bold h-8 px-4 rounded-sm text-xs shadow-sm active:scale-95 transition-all">
              <Plus className="w-3.5 h-3.5 mr-2" />
              Nouveau
            </Button>
          </Link>
        </div>

        {/* Ligne 2: Toolbar Filtres */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-1 max-w-lg">
            {/* Input Recherche */}
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher..."
                className="h-9 w-full pl-9 pr-3 bg-white border border-zinc-200 rounded-sm text-xs font-medium focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-all placeholder:text-zinc-400"
              />
            </div>

            {/* Onglets Statuts */}
            <div className="flex bg-zinc-100 p-0.5 rounded-sm border border-zinc-200">
              {["all", "draft", "sent", "accepted"].map((status) => {
                const isActive =
                  (searchParams.get("status") || "all") === status;
                return (
                  <button
                    key={status}
                    onClick={() => updateFilters("status", status)}
                    className={cn(
                      "px-3 py-1 text-[10px] font-bold uppercase tracking-wide rounded-[1px] transition-all",
                      isActive
                        ? "bg-white text-zinc-900 shadow-sm"
                        : "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200/50"
                    )}
                  >
                    {status === "all"
                      ? "Tous"
                      : status === "accepted"
                      ? "Signés"
                      : status === "sent"
                      ? "Envoyés"
                      : "Brouillons"}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-sm border-zinc-200 disabled:opacity-30"
              disabled={meta.page <= 1}
              onClick={() => updateFilters("page", String(meta.page - 1))}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </Button>
            <span className="text-[10px] font-bold text-zinc-500 w-12 text-center">
              {meta.page} / {meta.totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-sm border-zinc-200 disabled:opacity-30"
              disabled={meta.page >= meta.totalPages}
              onClick={() => updateFilters("page", String(meta.page + 1))}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </header>

      {/* --- MAIN TABLE --- */}
      <main className="flex-1 overflow-auto bg-white relative">
        {isPending && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-start justify-center pt-20">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
          </div>
        )}

        <table className="w-full text-left border-collapse">
          <thead className="bg-zinc-50 sticky top-0 z-10 shadow-[0_1px_2px_rgba(0,0,0,0.03)] border-b border-zinc-200">
            <tr>
              {/* Checkbox Master */}
              <th className="py-3 px-6 w-[40px]">
                <button
                  onClick={toggleSelectAll}
                  className="text-zinc-400 hover:text-zinc-900"
                >
                  {selectedIds.length > 0 &&
                  selectedIds.length === quotes.length ? (
                    <CheckSquare className="w-4 h-4 text-zinc-900" />
                  ) : (
                    <MinusSquare className="w-4 h-4" />
                  )}
                </button>
              </th>

              {/* Colonnes Triables */}
              <th
                className="py-3 px-6 w-[15%] cursor-pointer hover:bg-zinc-100 group"
                onClick={() => handleSort("number")}
              >
                <div className="flex items-center gap-1">
                  <StudioLabel className="group-hover:text-zinc-700">
                    Référence
                  </StudioLabel>
                  <ArrowUpDown
                    className={cn(
                      "w-3 h-3 text-zinc-300",
                      currentSort === "number" && "text-zinc-900"
                    )}
                  />
                </div>
              </th>
              <th
                className="py-3 px-6 w-[30%] cursor-pointer hover:bg-zinc-100 group"
                onClick={() => handleSort("client")}
              >
                <div className="flex items-center gap-1">
                  <StudioLabel className="group-hover:text-zinc-700">
                    Client / Projet
                  </StudioLabel>
                  <ArrowUpDown
                    className={cn(
                      "w-3 h-3 text-zinc-300",
                      currentSort === "client" && "text-zinc-900"
                    )}
                  />
                </div>
              </th>
              <th
                className="py-3 px-6 w-[15%] cursor-pointer hover:bg-zinc-100 group"
                onClick={() => handleSort("updatedAt")}
              >
                <div className="flex items-center gap-1">
                  <StudioLabel className="group-hover:text-zinc-700">
                    Mise à jour
                  </StudioLabel>
                  <ArrowUpDown
                    className={cn(
                      "w-3 h-3 text-zinc-300",
                      currentSort === "updatedAt" && "text-zinc-900"
                    )}
                  />
                </div>
              </th>
              <th className="py-3 px-6 w-[15%]">
                <StudioLabel>Statut</StudioLabel>
              </th>
              <th
                className="py-3 px-6 w-[15%] text-right cursor-pointer hover:bg-zinc-100 group"
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center justify-end gap-1">
                  <ArrowUpDown
                    className={cn(
                      "w-3 h-3 text-zinc-300",
                      currentSort === "amount" && "text-zinc-900"
                    )}
                  />
                  <StudioLabel className="group-hover:text-zinc-700">
                    Montant TTC
                  </StudioLabel>
                </div>
              </th>
              <th className="py-3 px-6 w-[5%]"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-100">
            {quotes.length === 0 ? (
              // EMPTY STATE RESTAURÉ
              <tr>
                <td colSpan={7} className="py-24 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center">
                      <Search className="w-5 h-5 text-zinc-300" />
                    </div>
                    <p className="text-sm font-bold text-zinc-900">
                      Aucun résultat
                    </p>
                    <p className="text-xs text-zinc-500">
                      Essayez de modifier vos filtres ou créez un devis.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              quotes.map((quote) => {
                const items = quote.itemsData as any;
                const projectTitle =
                  items?.projectTitle ||
                  (Array.isArray(items?.items) && items.items[0]?.title) ||
                  "Projet standard";
                const isSelected = selectedIds.includes(quote.id);

                return (
                  <tr
                    key={quote.id}
                    className={cn(
                      "group transition-colors border-l-2",
                      isSelected
                        ? "bg-zinc-50 border-zinc-900"
                        : "hover:bg-zinc-50 border-transparent hover:border-zinc-200"
                    )}
                  >
                    <td className="py-4 px-6">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(quote.id)}
                        className="w-4 h-4 rounded border-zinc-300 cursor-pointer accent-zinc-900"
                      />
                    </td>
                    <td className="py-4 px-6">
                      <Link
                        href={`/devis/${quote.id}`}
                        className="font-mono text-xs font-bold text-zinc-600 group-hover:text-zinc-900 group-hover:underline"
                      >
                        {quote.number}
                      </Link>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-bold text-zinc-900">
                          {quote.client.name}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-medium truncate max-w-[250px]">
                          {projectTitle}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-zinc-700">
                          {format(new Date(quote.updatedAt), "d MMM yyyy", {
                            locale: fr,
                          })}
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          {format(new Date(quote.updatedAt), "HH:mm", {
                            locale: fr,
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={quote.status} />
                    </td>
                    <td className="py-4 px-6 text-right">
                      <StudioValue value={quote.totalTTC} />
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
                        <DropdownMenuContent
                          align="end"
                          className="w-48 rounded-sm border-zinc-200"
                        >
                          <DropdownMenuLabel className="text-[9px] uppercase font-bold text-zinc-400">
                            Actions
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <Link href={`/devis/${quote.id}`}>
                            <DropdownMenuItem className="cursor-pointer text-xs font-medium">
                              <ArrowUpRight className="w-3.5 h-3.5 mr-2 text-zinc-400" />{" "}
                              Ouvrir l'éditeur
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem className="cursor-pointer text-xs font-medium">
                            <Download className="w-3.5 h-3.5 mr-2 text-zinc-400" />{" "}
                            Télécharger PDF
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer text-xs font-medium text-red-600 focus:text-red-700 focus:bg-red-50">
                            <Trash2 className="w-3.5 h-3.5 mr-2" /> Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </main>

      {/* --- BARRE D'ACTIONS FLOTTANTE (BULK) --- */}
      {selectedIds.length > 0 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-zinc-900 text-white px-4 py-2.5 rounded-lg shadow-2xl flex items-center gap-6 border border-zinc-800 ring-1 ring-black/5">
            <div className="flex items-center gap-3 border-r border-zinc-700 pr-4">
              <span className="flex items-center justify-center bg-white text-zinc-900 text-[10px] font-black w-5 h-5 rounded-full">
                {selectedIds.length}
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                Sélectionnés
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Export CSV Button */}
              <Button
                onClick={handleExportCSV}
                className="h-7 bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-bold uppercase px-3 rounded-sm border border-zinc-700"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 mr-2 text-emerald-500" />{" "}
                Exporter CSV
              </Button>

              {/* Delete Button */}
              <Button
                onClick={handleBulkDelete}
                disabled={isDeleting}
                className="h-7 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase px-3 rounded-sm border border-red-500"
              >
                {isDeleting ? (
                  <Loader2 className="animate-spin w-3 h-3" />
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5 mr-2" /> Supprimer
                  </>
                )}
              </Button>
            </div>

            <button
              onClick={() => setSelectedIds([])}
              className="hover:bg-zinc-800 p-1 rounded-sm text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
