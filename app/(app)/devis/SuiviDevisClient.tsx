"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  MoreHorizontal,
  Download,
  Edit3,
  Trash2,
  Briefcase,
  ArrowUpRight,
  SlidersHorizontal,
  LayoutList,
  LayoutGrid,
  ArrowUpDown,
  CheckCircle2,
  Calendar,
  User,
  FileText,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { deleteDevisAction } from "./actions";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ============================================================================
// 1. TYPES MIS À JOUR (Compatible Store & DB)
// ============================================================================

export type QuoteStatus =
  | "draft"
  | "sent"
  | "accepted"
  | "rejected"
  | "archived";

// Dictionnaire de traduction pour l'affichage
const STATUS_LABELS: Record<QuoteStatus, string> = {
  draft: "Brouillon",
  sent: "Envoyé",
  accepted: "Accepté",
  rejected: "Refusé",
  archived: "Archivé",
};

type SortField =
  | "montant"
  | "date_creation"
  | "date_validite"
  | "client"
  | "id";
type SortDirection = "asc" | "desc";

export interface Quote {
  id: string;
  client: string;
  projet: string;
  date_creation: string;
  date_validite: string;
  statut: QuoteStatus; // Utilise maintenant les clés anglaises
  montant_ht: number;
  email_client: string;
}

interface SuiviDevisClientProps {
  initialQuotes: Quote[];
}

// ============================================================================
// 2. COMPOSANT
// ============================================================================

export default function SuiviDevisClient({
  initialQuotes,
}: SuiviDevisClientProps) {
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes);
  const [activeFilter, setActiveFilter] = useState<QuoteStatus | "Tous">(
    "Tous"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState<{
    field: SortField;
    direction: SortDirection;
  }>({
    field: "date_creation",
    direction: "desc",
  });

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const router = useRouter();

  // --- ACTIONS ---

  const handleDelete = async (id: string) => {
    if (
      !confirm("Êtes-vous sûr de vouloir supprimer définitivement ce devis ?")
    )
      return;

    const previousQuotes = [...quotes];
    setQuotes((prev) => prev.filter((q) => q.id !== id));
    setOpenMenuId(null);

    const result = await deleteDevisAction(id);

    if (!result.success) {
      alert("Erreur lors de la suppression.");
      setQuotes(previousQuotes);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        openMenuId &&
        actionMenuRef.current &&
        !actionMenuRef.current.contains(event.target as Node)
      ) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  // --- LOGIQUE MÉTIER ---

  const getValidityStatus = (dateStr: string, status: QuoteStatus) => {
    // Si c'est signé ou refusé, la date n'importe plus
    if (status === "accepted" || status === "rejected") return "closed";

    const today = new Date();
    const limit = new Date(dateStr);
    const diffTime = limit.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "expired";
    if (diffDays <= 3) return "urgent";
    return "ok";
  };

  const processedQuotes = useMemo(() => {
    let data = [...quotes];

    // Filtrage par Statut
    if (activeFilter !== "Tous") {
      data = data.filter((q) => q.statut === activeFilter);
    }

    // Recherche
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      data = data.filter(
        (q) =>
          q.client.toLowerCase().includes(lower) ||
          q.id.toLowerCase().includes(lower) ||
          q.projet.toLowerCase().includes(lower)
      );
    }

    // Tri
    data.sort((a, b) => {
      let comparison = 0;
      if (sort.field === "montant") comparison = a.montant_ht - b.montant_ht;
      else if (sort.field === "date_creation")
        comparison =
          new Date(a.date_creation).getTime() -
          new Date(b.date_creation).getTime();
      else if (sort.field === "date_validite")
        comparison =
          new Date(a.date_validite).getTime() -
          new Date(b.date_validite).getTime();
      else if (sort.field === "client")
        comparison = a.client.localeCompare(b.client);
      else if (sort.field === "id") comparison = a.id.localeCompare(b.id);
      return sort.direction === "asc" ? comparison : -comparison;
    });
    return data;
  }, [quotes, activeFilter, searchTerm, sort]);

  // Calcul des KPI (Mis à jour avec les clés anglaises)
  const kpis = useMemo(() => {
    return quotes.reduce(
      (acc, q) => {
        if (q.statut === "accepted") {
          acc.won.count++;
          acc.won.amount += q.montant_ht;
        }
        if (q.statut === "sent") {
          acc.pipeline.count++;
          acc.pipeline.amount += q.montant_ht;
        }

        const validity = getValidityStatus(q.date_validite, q.statut);
        // Alertes sur les devis envoyés qui expirent
        if (
          q.statut === "sent" &&
          (validity === "expired" || validity === "urgent")
        ) {
          acc.alerts.count++;
          acc.alerts.amount += q.montant_ht;
        }
        return acc;
      },
      {
        won: { count: 0, amount: 0 },
        pipeline: { count: 0, amount: 0 },
        alerts: { count: 0, amount: 0 },
      }
    );
  }, [quotes]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(amount);

  // Badge Status (Mapping Clé Anglaise -> Affichage)
  const getStatusBadge = (status: QuoteStatus) => {
    const styles = {
      draft: "text-neutral-500 bg-neutral-100 border-neutral-200",
      sent: "text-blue-700 bg-blue-50 border-blue-100",
      accepted: "text-emerald-700 bg-emerald-50 border-emerald-100",
      rejected:
        "text-neutral-400 bg-neutral-50 decoration-line-through border-transparent",
      archived: "text-orange-700 bg-orange-50 border-orange-100",
    };

    return (
      <span
        className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider border ${styles[status]}`}
      >
        {STATUS_LABELS[status]}
      </span>
    );
  };

  const handleSort = (field: SortField) => {
    setSort((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "desc" ? "asc" : "desc",
    }));
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-white text-neutral-900 font-sans overflow-hidden">
      {/* ZONE PRINCIPALE */}
      <main className="flex-1 flex flex-col min-w-0 bg-white">
        {/* HEADER TOP BAR */}
        <header className="h-14 bg-white/80 backdrop-blur-md border-b border-neutral-200 px-6 flex items-center justify-between shrink-0 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-neutral-100 rounded-md">
                <Briefcase className="w-4 h-4 text-neutral-600" />
              </div>
              <h1 className="text-base text-neutral-900 tracking-tight">
                Mes Devis
              </h1>
            </div>
            <div className="h-4 w-px bg-neutral-200" />
            <div className="flex items-center gap-2 bg-neutral-50 px-2.5 py-1 rounded-md border border-neutral-200/60">
              <span className="text-xs font-medium text-neutral-600">
                {activeFilter === "Tous"
                  ? "Vue d'ensemble"
                  : STATUS_LABELS[activeFilter]}
              </span>
              <span className="bg-neutral-200 text-neutral-600 text-[10px] font-mono font-bold px-1.5 rounded-sm">
                {processedQuotes.length}
              </span>
            </div>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
            <div className="flex items-center bg-neutral-100 rounded-lg p-1 border border-neutral-200">
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 transition-all ${
                  viewMode === "list"
                    ? "bg-white shadow-sm text-neutral-900"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                <LayoutList className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">Liste</span>
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 transition-all ${
                  viewMode === "grid"
                    ? "bg-white shadow-sm text-neutral-900"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">Grille</span>
              </button>
              <div className="w-px h-4 bg-neutral-300 mx-1" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 text-neutral-500 hover:text-neutral-900 hover:bg-white/50 transition-all">
                    <ArrowUpDown className="w-3.5 h-3.5" />
                    <span>Trier</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-48">
                  <DropdownMenuLabel>Critère de tri</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleSort("date_creation")}>
                    Date (Récent)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort("montant")}>
                    Montant
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort("client")}>
                    Client (A-Z)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/devis/new">
              <button className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-1.5 rounded-md text-xs font-bold transition-colors">
                <div className="w-3 h-3 flex items-center justify-center">
                  +
                </div>
                Nouveau
              </button>
            </Link>
          </div>
        </header>

        {/* CONTAINER DE CONTENU (SCROLLABLE) */}
        <div className="flex-1 overflow-auto bg-neutral-50/50 p-6">
          {/* VUE LISTE */}
          {viewMode === "list" && (
            <div className="bg-white border border-neutral-200 rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-neutral-50 border-b border-neutral-200">
                    <tr>
                      <th className="px-6 py-4 min-w-[120px] text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                        Réf
                      </th>
                      <th
                        onClick={() => handleSort("client")}
                        className="px-6 py-4 min-w-[240px] text-[10px] font-bold uppercase tracking-wider text-neutral-500 cursor-pointer hover:text-neutral-900"
                      >
                        Client / Projet
                      </th>
                      <th
                        onClick={() => handleSort("date_creation")}
                        className="px-6 py-4 min-w-[140px] text-right text-[10px] font-bold uppercase tracking-wider text-neutral-500 cursor-pointer hover:text-neutral-900"
                      >
                        Date
                      </th>
                      <th
                        onClick={() => handleSort("date_validite")}
                        className="px-6 py-4 min-w-[140px] text-right text-[10px] font-bold uppercase tracking-wider text-neutral-500 cursor-pointer hover:text-neutral-900"
                      >
                        Échéance
                      </th>
                      <th className="px-6 py-4 min-w-[140px] text-center text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                        Statut
                      </th>
                      <th
                        onClick={() => handleSort("montant")}
                        className="px-6 py-4 min-w-[160px] text-right text-[10px] font-bold uppercase tracking-wider text-neutral-500 cursor-pointer hover:text-neutral-900"
                      >
                        Total TTC
                      </th>
                      <th className="px-6 py-4 w-16"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 bg-white">
                    {processedQuotes.map((quote) => {
                      const validity = getValidityStatus(
                        quote.date_validite,
                        quote.statut
                      );
                      return (
                        <tr
                          key={quote.id}
                          className="group hover:bg-neutral-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <span className="font-mono text-xs font-medium text-neutral-600 group-hover:text-neutral-900">
                              #{quote.id.slice(-6).toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <User className="w-3 h-3 text-neutral-400" />
                                <span className="text-sm font-bold text-neutral-900">
                                  {quote.client}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-neutral-500">
                                <FileText className="w-3 h-3 text-neutral-300" />
                                <span className="truncate max-w-[300px]">
                                  {quote.projet}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-xs font-mono text-neutral-600">
                              {new Date(quote.date_creation).toLocaleDateString(
                                "fr-FR"
                              )}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex flex-col items-end">
                              <span
                                className={`text-xs font-mono ${
                                  validity === "expired"
                                    ? "text-red-400 line-through"
                                    : "text-neutral-600"
                                }`}
                              >
                                {new Date(
                                  quote.date_validite
                                ).toLocaleDateString("fr-FR")}
                              </span>
                              {validity === "urgent" && (
                                <span className="text-[9px] font-bold text-red-600 uppercase tracking-wide mt-0.5">
                                  Urgent
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            {getStatusBadge(quote.statut)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-sm font-mono font-bold text-neutral-900">
                              {formatCurrency(quote.montant_ht)}
                            </span>
                          </td>
                          <td className="px-6 py-4 relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenMenuId(
                                  openMenuId === quote.id ? null : quote.id
                                );
                              }}
                              className={`p-2 rounded-md transition-all ${
                                openMenuId === quote.id
                                  ? "bg-neutral-900 text-white shadow-md"
                                  : "text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100"
                              }`}
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                            {openMenuId === quote.id && (
                              <div
                                ref={actionMenuRef}
                                className="absolute right-12 top-2 w-40 bg-white border border-neutral-200 rounded-lg shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100 p-1"
                              >
                                <Link
                                  href={`/devis/${quote.id}`}
                                  className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 rounded-md"
                                >
                                  <Edit3 className="w-3.5 h-3.5" /> Éditer
                                </Link>
                                <button className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 rounded-md">
                                  <Download className="w-3.5 h-3.5" /> PDF
                                </button>
                                <div className="h-px bg-neutral-100 my-1" />
                                <button
                                  onClick={() => handleDelete(quote.id)}
                                  className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> Supprimer
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VUE GRILLE */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {processedQuotes.map((quote) => {
                return (
                  <div
                    key={quote.id}
                    className="group bg-white border border-neutral-200 rounded-xl p-5 hover:shadow-lg hover:border-neutral-300 transition-all relative flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-1">
                        {getStatusBadge(quote.statut)}
                        <div className="text-[10px] font-mono text-neutral-400 mt-1">
                          Ref: {quote.id.slice(-6).toUpperCase()}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(
                            openMenuId === quote.id ? null : quote.id
                          );
                        }}
                        className={`p-1.5 rounded-md transition-all ${
                          openMenuId === quote.id
                            ? "bg-neutral-900 text-white"
                            : "text-neutral-300 hover:text-neutral-900 hover:bg-neutral-50"
                        }`}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {/* Menu Contextuel Grille */}
                      {openMenuId === quote.id && (
                        <div
                          ref={actionMenuRef}
                          className="absolute right-4 top-10 w-40 bg-white border border-neutral-200 rounded-lg shadow-xl z-50 p-1"
                        >
                          <Link
                            href={`/devis/${quote.id}`}
                            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 rounded-md"
                          >
                            <Edit3 className="w-3.5 h-3.5" /> Éditer
                          </Link>
                          <button
                            onClick={() => handleDelete(quote.id)}
                            className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Supprimer
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 mb-6">
                      <h3
                        className="font-bold text-neutral-900 text-lg line-clamp-1"
                        title={quote.client}
                      >
                        {quote.client}
                      </h3>
                      <p className="text-xs text-neutral-500 line-clamp-2 mt-1 min-h-[2.5em]">
                        {quote.projet}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-dashed border-neutral-100 flex items-end justify-between">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] uppercase font-bold text-neutral-400">
                          Date
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-mono">
                          <Calendar className="w-3 h-3" />
                          {new Date(quote.date_creation).toLocaleDateString(
                            "fr-FR"
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-neutral-400">
                          Total TTC
                        </span>
                        <div className="text-xl font-mono font-bold text-neutral-900">
                          {formatCurrency(quote.montant_ht)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {processedQuotes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
              <p className="text-sm font-medium">
                Aucun devis trouvé pour ces critères.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* SIDEBAR KPI & FILTRES */}
      <aside className="w-80 border-l border-neutral-200 bg-neutral-50 flex flex-col z-20 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.02)] hidden 2xl:flex">
        {/* KPI */}
        <div className="p-6 border-b border-neutral-200 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Performance
            </h3>
            <ArrowUpRight className="w-3 h-3 text-neutral-300" />
          </div>
          <div className="space-y-4">
            <div className="p-3 bg-neutral-900 rounded-lg text-white shadow-md">
              <div className="flex justify-between items-start mb-2 opacity-80">
                <span className="text-[10px] uppercase font-bold tracking-wide">
                  Signé (CA)
                </span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div className="text-2xl font-mono font-bold tracking-tight">
                {formatCurrency(kpis.won.amount)}
              </div>
              <div className="text-[10px] mt-1 text-neutral-400">
                {kpis.won.count} contrats validés
              </div>
            </div>
            {/* ... Autres KPI inchangés ... */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white border border-neutral-200 rounded-lg">
                <p className="text-[9px] uppercase font-bold text-neutral-400 mb-1">
                  En cours
                </p>
                <p className="text-lg font-mono font-bold text-neutral-900">
                  {formatCurrency(kpis.pipeline.amount)}
                </p>
              </div>
              <div className="p-3 bg-white border border-neutral-200 rounded-lg">
                <p className="text-[9px] uppercase font-bold text-neutral-400 mb-1">
                  Alertes
                </p>
                <p className="text-lg font-mono font-bold text-red-600">
                  {kpis.alerts.count}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtres Mis à jour avec les IDs anglais */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center gap-2 mb-4 text-neutral-500">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Affichage
            </h3>
          </div>
          <div className="space-y-1">
            {[
              { id: "Tous", label: "Vue d'ensemble", count: quotes.length },
              {
                id: "draft",
                label: "Brouillons",
                count: quotes.filter((q) => q.statut === "draft").length,
              },
              {
                id: "sent",
                label: "Envoyés",
                count: quotes.filter((q) => q.statut === "sent").length,
              },
              {
                id: "accepted",
                label: "Gagnés",
                count: quotes.filter((q) => q.statut === "accepted").length,
              },
              {
                id: "rejected",
                label: "Perdus",
                count: quotes.filter((q) => q.statut === "rejected").length,
              },
              {
                id: "archived",
                label: "Archivés",
                count: quotes.filter((q) => q.statut === "archived").length,
              },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() =>
                  setActiveFilter(filter.id as QuoteStatus | "Tous")
                }
                className={`w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-md transition-all ${
                  activeFilter === filter.id
                    ? "bg-white border border-neutral-200 text-neutral-900 shadow-sm font-medium"
                    : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 border border-transparent"
                }`}
              >
                <span>{filter.label}</span>
                <span
                  className={`text-[10px] font-mono ${
                    activeFilter === filter.id
                      ? "text-neutral-900"
                      : "text-neutral-400"
                  }`}
                >
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
