"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Plus,
  Search,
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
  FileSpreadsheet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/features/dashboard/status-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

// ✅ Importations depuis les contrats uniques (Langue Unique)
import { QuoteFilters, PaginatedQuotes, QuoteListItem } from "@/types/quote";

interface QuotesListViewProps {
  initialData: PaginatedQuotes;
  currentFilters: QuoteFilters;
}

// --- SOUS-COMPOSANTS UI ---

const StudioLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[9px] font-black uppercase tracking-[0.15em] text-zinc-400 select-none">
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

export function QuotesListView({
  initialData,
  currentFilters,
}: QuotesListViewProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState(currentFilters.search || "");

  // On utilise 'items' provenant de notre structure PaginatedQuotes
const quotes: QuoteListItem[] = initialData.items;
  // --- NAVIGATION & FILTRES ---

  const updateUrl = (newFilters: Partial<QuoteFilters>) => {
    const params = new URLSearchParams();
    const merged = { ...currentFilters, ...newFilters };

    Object.entries(merged).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.set(key, String(value));
      }
    });

    startTransition(() => {
      router.push(`/quotes?${params.toString()}`);
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl({ search: searchTerm, page: 1 });
  };

  const toggleSort = (field: QuoteFilters["sortBy"]) => {
    const isAsc =
      currentFilters.sortBy === field && currentFilters.sortDir === "asc";
    updateUrl({ sortBy: field, sortDir: isAsc ? "desc" : "asc" });
  };

  // --- ACTIONS ---

  const handleExportCSV = () => {
    const dataToExport =
      selectedIds.length > 0
        ? quotes.filter((q) => selectedIds.includes(q.id))
        : quotes;

    const headers = ["Référence", "Client", "Statut", "Date", "Montant"];
    const rows = dataToExport.map((q) => [
      q.number,
      q.clientName,
      q.status,
      format(new Date(q.updatedAt), "dd/MM/yyyy"),
      q.totalAmount,
    ]);

    const content = [headers.join(","), ...rows.map((r) => r.join(","))].join(
      "\n"
    );
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `export-devis-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    toast.success("Export CSV généré");
  };

  return (
    <div className="p-6 md:p-10 max-w-400 mx-auto w-full">
      <div className="flex flex-col gap-6 animate-in fade-in duration-500">
        {/* TOOLBAR STRATÉGIQUE */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
          <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Référence ou nom client..."
              className="w-full pl-9 pr-4 h-10 bg-zinc-50 border-none rounded-lg text-xs font-medium focus:ring-2 focus:ring-zinc-900 transition-all outline-none"
            />
          </form>

          <div className="flex items-center gap-3">
            <div className="flex bg-zinc-100 p-1 rounded-lg">
              {["all", "DRAFT", "SENT", "PAID"].map((s) => (
                <button
                  key={s}
                  onClick={() =>
                    updateUrl({ status: s as QuoteFilters["status"], page: 1 })
                  }
                  className={cn(
                    "px-4 py-1.5 text-[10px] font-black uppercase tracking-tight rounded-md transition-all",
                    currentFilters.status === s
                      ? "bg-white text-zinc-900 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-700"
                  )}
                >
                  {s === "all" ? "Tous" : s}
                </button>
              ))}
            </div>
            <Link href="/quotes/new">
              <Button
                size="sm"
                className="bg-zinc-900 text-white hover:bg-zinc-800 text-[10px] font-black uppercase px-6 h-10"
              >
                <Plus className="w-3.5 h-3.5 mr-2" /> Créer
              </Button>
            </Link>
          </div>
        </div>

        {/* TABLEAU HAUTE DENSITÉ */}
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden relative min-h-100">
          {isPending && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-20 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-zinc-900" />
            </div>
          )}

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-100">
                <th className="p-4 w-10">
                  <button
                    onClick={() =>
                      setSelectedIds(
                        selectedIds.length === quotes.length &&
                          quotes.length > 0
                          ? []
                          : quotes.map((q) => q.id)
                      )
                    }
                    className="text-zinc-400 hover:text-zinc-900 transition-colors"
                  >
                    {selectedIds.length > 0 &&
                    selectedIds.length === quotes.length ? (
                      <CheckSquare className="w-4 h-4 text-zinc-900" />
                    ) : (
                      <MinusSquare className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th
                  className="p-4 cursor-pointer group"
                  onClick={() => toggleSort("number")}
                >
                  <div className="flex items-center gap-2">
                    <StudioLabel>Référence</StudioLabel>
                    <ArrowUpDown
                      className={cn(
                        "w-3 h-3 transition-colors",
                        currentFilters.sortBy === "number"
                          ? "text-zinc-900"
                          : "text-zinc-300 group-hover:text-zinc-500"
                      )}
                    />
                  </div>
                </th>
                <th className="p-4">
                  <StudioLabel>Client / Entité</StudioLabel>
                </th>
                <th className="p-4">
                  <StudioLabel>Statut</StudioLabel>
                </th>
                <th
                  className="p-4 text-right cursor-pointer group"
                  onClick={() => toggleSort("totalAmount")}
                >
                  <div className="flex items-center justify-end gap-2">
                    <StudioLabel>Montant TTC</StudioLabel>
                    <ArrowUpDown
                      className={cn(
                        "w-3 h-3 transition-colors",
                        currentFilters.sortBy === "totalAmount"
                          ? "text-zinc-900"
                          : "text-zinc-300 group-hover:text-zinc-500"
                      )}
                    />
                  </div>
                </th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {quotes.length > 0 ? (
                quotes.map((quote) => (
                  <tr
                    key={quote.id}
                    className={cn(
                      "hover:bg-zinc-50/50 transition-colors group",
                      selectedIds.includes(quote.id) && "bg-zinc-50"
                    )}
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(quote.id)}
                        onChange={() =>
                          setSelectedIds((prev) =>
                            prev.includes(quote.id)
                              ? prev.filter((id) => id !== quote.id)
                              : [...prev, quote.id]
                          )
                        }
                        className="w-4 h-4 accent-zinc-900 rounded border-zinc-300 cursor-pointer"
                      />
                    </td>
                    <td className="p-4">
                      <Link
                        href={`/quotes/${quote.id}`}
                        className="font-mono text-[11px] font-bold text-zinc-500 hover:text-zinc-900 hover:underline underline-offset-4 uppercase"
                      >
                        {quote.number}
                      </Link>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-zinc-900 uppercase tracking-tight">
                          {quote.clientName}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">
                          Mis à jour :{" "}
                          {format(new Date(quote.updatedAt), "dd MMM yyyy", {
                            locale: fr,
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={quote.status} />
                    </td>
                    <td className="p-4 text-right">
                      <StudioValue value={quote.totalAmount} />
                    </td>
                    <td className="p-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="w-4 h-4 text-zinc-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel className="text-[10px] font-black uppercase">
                            Actions
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => router.push(`/quotes/${quote.id}`)}
                            className="text-xs font-bold uppercase cursor-pointer"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5 mr-2" /> Editer
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-xs font-bold uppercase cursor-pointer">
                            <Download className="w-3.5 h-3.5 mr-2" /> PDF
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-xs font-bold uppercase cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                            <Trash2 className="w-3.5 h-3.5 mr-2" /> Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-[10px] font-black uppercase text-zinc-300 tracking-[0.2em]">
                        Aucun dossier trouvé
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* PAGINATION HAUTE PERFORMANCE */}
          <div className="p-4 bg-zinc-50/50 border-t border-zinc-100 flex items-center justify-between">
            <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">
              Page {currentFilters.page} sur {initialData.totalPages} —{" "}
              {initialData.totalCount} dossiers
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentFilters.page <= 1 || isPending}
                onClick={() => updateUrl({ page: currentFilters.page - 1 })}
                className="h-8 px-3 text-[10px] font-black uppercase border-zinc-200"
              >
                <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Précédent
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={
                  currentFilters.page >= initialData.totalPages || isPending
                }
                onClick={() => updateUrl({ page: currentFilters.page + 1 })}
                className="h-8 px-3 text-[10px] font-black uppercase border-zinc-200"
              >
                Suivant <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </div>
        </div>

        {/* BARRE D'ACTIONS FLOTTANTE */}
        {selectedIds.length > 0 && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-10">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-2 pl-6 flex items-center gap-6 shadow-2xl">
              <p className="text-[10px] font-black uppercase text-white tracking-[0.2em]">
                {selectedIds.length} sélectionnés
              </p>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleExportCSV}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-black uppercase h-9 px-4 border-none"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 mr-2 text-emerald-500" />{" "}
                  Export CSV
                </Button>
                <Button
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-500 text-white text-[10px] font-black uppercase h-9 px-4 border-none"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-2" /> Supprimer
                </Button>
                <button
                  onClick={() => setSelectedIds([])}
                  className="p-2 text-zinc-500 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
