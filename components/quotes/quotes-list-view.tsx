"use client";

import React, { useState, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Plus,
  Search,
  Download,
  Trash2,
  Send,
  FileText,
  User,
  Calendar,
  ArrowUpRight,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/features/dashboard/status-badge";
import { QuoteFilters, PaginatedQuotes } from "@/types/quote";

interface QuotesListViewProps {
  initialData: PaginatedQuotes;
  currentFilters: QuoteFilters;
}

/**
 * @view QuotesListView v5.0 - Industrial OS
 * Psychologie : Flux Séquentiel (Master-Detail).
 * Technique : h-screen overflow-hidden, p-0, rounded-none.
 */
export function QuotesListView({
  initialData,
  currentFilters,
}: QuotesListViewProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState(currentFilters.search || "");
  const [selectedId, setSelectedId] = useState<string | null>(
    initialData.items[0]?.id || null
  );

  const quotes = initialData.items;
  const selectedQuote = useMemo(
    () => quotes.find((q) => q.id === selectedId),
    [selectedId, quotes]
  );

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

  return (
    <div className="flex h-[calc(100vh-2.5rem)] overflow-hidden bg-white p-0 m-0 border-t border-slate-200">
      {/* --- MASTER SIDEBAR : PSYCHOLOGIE DU FLUX (400px) --- */}
      <div className="w-[400px] border-r border-slate-200 flex flex-col bg-slate-50/20 relative">
        {/* Header Master : Densité & Action Rapide */}
        <div className="p-4 bg-white border-b border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-indigo-600" />
              <h1 className="text-[14px] font-black uppercase tracking-widest text-slate-950">
                Flux Devis
              </h1>
            </div>
            <Button
              onClick={() => router.push("/quotes/editor")}
              className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white rounded-none h-8 text-[10px] font-black uppercase tracking-widest px-3"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" /> Nouveau
            </Button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateUrl({ search: searchTerm, page: 1 });
            }}
            className="relative"
          >
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="RÉFÉRENCE, CLIENT..."
              className="pl-8 h-9 rounded-none border-slate-200 text-[11px] font-bold uppercase tracking-wider bg-slate-50 focus-visible:bg-white focus-visible:ring-0 focus-visible:border-slate-950 transition-all"
            />
          </form>
        </div>

        {/* List Body : Scroll Localisé */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
          {isPending && (
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
            </div>
          )}

          {quotes.map((quote) => (
            <div
              key={quote.id}
              onClick={() => setSelectedId(quote.id)}
              className={cn(
                "p-4 cursor-pointer transition-none relative border-l-[3px]",
                selectedId === quote.id
                  ? "bg-white border-l-indigo-600 shadow-sm"
                  : "bg-transparent border-l-transparent hover:bg-slate-100/50"
              )}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-mono text-[10px] font-bold text-slate-400">
                  {quote.number}
                </span>
                <StatusBadge status={quote.status} />
              </div>
              <h3 className="text-[12px] font-black text-slate-950 uppercase truncate">
                {quote.clientName}
              </h3>
              <div className="flex justify-between items-baseline mt-2">
                <span className="text-[14px] font-mono font-bold text-slate-950 tabular-nums">
                  {new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  }).format(quote.totalAmount)}
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">
                  {format(new Date(quote.updatedAt), "dd.MM.yy")}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Master */}
        <div className="p-3 border-t border-slate-200 bg-white flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            className="rounded-none h-7 px-3 text-[9px] font-black uppercase border-slate-200"
            disabled={currentFilters.page <= 1}
            onClick={() => updateUrl({ page: currentFilters.page - 1 })}
          >
            Prev
          </Button>
          <span className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">
            {currentFilters.page} / {initialData.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="rounded-none h-7 px-3 text-[9px] font-black uppercase border-slate-200"
            disabled={currentFilters.page >= initialData.totalPages}
            onClick={() => updateUrl({ page: currentFilters.page + 1 })}
          >
            Next
          </Button>
        </div>
      </div>

      {/* --- DETAIL : ZONE DE TRAVAIL (SCROLL LOCAL) --- */}
      <div className="flex-1 bg-white overflow-y-auto relative custom-scrollbar">
        {selectedQuote ? (
          <div className="max-w-5xl mx-auto p-10 space-y-10">
            {/* Header Detail : Précis, Non-Massif */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">
                    Dossier Actif
                  </span>
                  <span className="text-[11px] font-mono text-slate-300">
                    ID: {selectedQuote.id}
                  </span>
                </div>
                <h2 className="text-[24px] font-black text-slate-950 uppercase tracking-tighter italic leading-none">
                  {selectedQuote.clientName}
                </h2>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="rounded-none border-slate-950 border text-[10px] font-black uppercase h-9 px-4"
                >
                  <Download className="w-3.5 h-3.5 mr-2" /> PDF
                </Button>
                <Button className="bg-indigo-600 text-white rounded-none h-9 px-6 text-[10px] font-black uppercase tracking-widest shadow-none">
                  <Send className="w-3.5 h-3.5 mr-2" /> Envoyer
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-none text-rose-600 hover:bg-rose-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-12 gap-8">
              {/* Colonne Gauche : Finances & Data */}
              <div className="col-span-7 space-y-8">
                <div className="border border-slate-200 rounded-none overflow-hidden">
                  <div className="bg-slate-50 p-3 border-b border-slate-200 flex items-center gap-2">
                    <div className="w-1 h-3 bg-indigo-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-950">
                      Analyse Financière
                    </span>
                  </div>
                  <div className="p-8 flex justify-between items-center">
                    <div className="space-y-1">
                      <StudioLabel>Base HT</StudioLabel>
                      <p className="text-[20px] font-mono font-bold text-slate-950 tabular-nums">
                        {new Intl.NumberFormat("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                        }).format(selectedQuote.totalAmount / 1.2)}
                      </p>
                    </div>
                    <div className="h-10 w-[1px] bg-slate-100" />
                    <div className="text-right space-y-1">
                      <StudioLabel>Total TTC</StudioLabel>
                      <p className="text-[32px] font-mono font-black text-indigo-600 tracking-tighter leading-none tabular-nums">
                        {new Intl.NumberFormat("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                        }).format(selectedQuote.totalAmount)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 border border-slate-200 space-y-2 bg-white">
                    <StudioLabel>Émission</StudioLabel>
                    <div className="flex items-center gap-2 font-bold text-[13px] text-slate-950 uppercase">
                      <Calendar className="w-4 h-4 text-indigo-600" />
                      {format(
                        new Date(selectedQuote.updatedAt),
                        "dd MMMM yyyy",
                        { locale: fr }
                      )}
                    </div>
                  </div>
                  <div className="p-5 border border-slate-200 space-y-2 bg-white">
                    <StudioLabel>Référent</StudioLabel>
                    <div className="flex items-center gap-2 font-bold text-[13px] text-slate-950 uppercase">
                      <User className="w-4 h-4 text-indigo-600" />
                      Admin System
                    </div>
                  </div>
                </div>
              </div>

              {/* Colonne Droite : Tension & Psychologie */}
              <div className="col-span-5 space-y-6">
                {/* Bloc de Tension Noir */}
                <div className="bg-slate-950 p-6 text-white space-y-6">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 italic">
                      Vision Business
                    </span>
                    <p className="text-[13px] font-medium leading-relaxed">
                      Dossier à haut potentiel. Marge estimée à{" "}
                      <span className="text-indigo-400 font-black">35%</span>.
                      Signature attendue sous 48h.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/quotes/${selectedQuote.id}`)}
                    className="w-full border-white/20 hover:bg-white/10 text-white rounded-none h-11 text-[11px] font-black uppercase tracking-widest"
                  >
                    <FileText className="w-4 h-4 mr-2" /> Accéder à
                    l&apos;Éditeur
                  </Button>
                </div>

                {/* Secondaire */}
                <Button
                  variant="outline"
                  className="w-full justify-between h-14 border-slate-200 rounded-none px-4 hover:border-slate-950 group transition-all"
                >
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-950 italic">
                    Full Screen View
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-slate-950 transition-colors" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center bg-slate-50/20">
            <div className="w-12 h-[1px] bg-slate-200 mb-6" />
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 animate-pulse">
              Sélectionner une entité
            </p>
            <div className="w-12 h-[1px] bg-slate-200 mt-6" />
          </div>
        )}
      </div>
    </div>
  );
}

const StudioLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-1">
    {children}
  </span>
);
