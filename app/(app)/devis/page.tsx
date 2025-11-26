"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  FileText,
  CheckCircle2,
  AlertOctagon,
  MoreHorizontal,
  Download,
  Edit3,
  Trash2,
  Search,
  Mail,
  XCircle,
  Briefcase,
  Filter,
  Plus,
  ArrowUpRight,
  SlidersHorizontal,
  Cloud,
  LayoutList,
  LayoutGrid,
  ArrowUpDown,
  ChevronRight,
  Home, // Ajout pour le fil d'ariane
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ============================================================================
// 1. TYPES ET DONNÉES
// ============================================================================

type QuoteStatus = "Brouillon" | "Envoyé" | "Accepté" | "Refusé" | "Expiré";
type SortField =
  | "montant"
  | "date_creation"
  | "date_validite"
  | "client"
  | "id";
type SortDirection = "asc" | "desc";

interface Quote {
  id: string;
  client: string;
  projet: string;
  date_creation: string;
  date_validite: string;
  statut: QuoteStatus;
  montant_ht: number;
  email_client: string;
}

const mockQuotes: Quote[] = [
  {
    id: "DEV-24-042",
    client: "TechFlow SAS",
    projet: "Refonte UX Application Mobile",
    date_creation: "2024-11-25",
    date_validite: "2024-12-25",
    statut: "Brouillon",
    montant_ht: 4500,
    email_client: "contact@techflow.io",
  },
  {
    id: "DEV-24-041",
    client: "Boulangerie Ange",
    projet: "Site Vitrine & Click&Collect",
    date_creation: "2024-11-22",
    date_validite: "2024-12-22",
    statut: "Envoyé",
    montant_ht: 2800,
    email_client: "direction@ange-lyon.fr",
  },
  {
    id: "DEV-24-040",
    client: "Cabinet Dupuis",
    projet: "Audit SEO & Optimisation",
    date_creation: "2024-11-20",
    date_validite: "2024-12-05",
    statut: "Envoyé",
    montant_ht: 1200,
    email_client: "info@avocats-dupuis.com",
  },
  {
    id: "DEV-24-039",
    client: "StartUp Nation",
    projet: "Développement MVP React Native",
    date_creation: "2024-11-15",
    date_validite: "2024-11-30",
    statut: "Accepté",
    montant_ht: 12500,
    email_client: "ceo@startupnation.com",
  },
  {
    id: "DEV-24-038",
    client: "Mairie de Lyon",
    projet: "Maintenance Portail Citoyen",
    date_creation: "2024-11-10",
    date_validite: "2024-12-10",
    statut: "Accepté",
    montant_ht: 3600,
    email_client: "webmaster@lyon.fr",
  },
  {
    id: "DEV-24-037",
    client: "Green Energy",
    projet: "Landing Page Campagne Hiver",
    date_creation: "2024-11-01",
    date_validite: "2024-11-15",
    statut: "Expiré",
    montant_ht: 1800,
    email_client: "marketing@green-energy.com",
  },
  {
    id: "DEV-24-036",
    client: "Restaurant Le Gourmet",
    projet: "Menu Digital QR Code",
    date_creation: "2024-10-28",
    date_validite: "2024-11-28",
    statut: "Envoyé",
    montant_ht: 850,
    email_client: "chef@legourmet.fr",
  },
  {
    id: "DEV-24-035",
    client: "Auto-École Drive",
    projet: "Refonte Identité Visuelle",
    date_creation: "2024-10-15",
    date_validite: "2024-11-15",
    statut: "Refusé",
    montant_ht: 2200,
    email_client: "contact@drive-ecole.com",
  },
  {
    id: "DEV-24-034",
    client: "Consulting & Co",
    projet: "Support Technique Mensuel",
    date_creation: "2024-10-10",
    date_validite: "2024-11-10",
    statut: "Accepté",
    montant_ht: 500,
    email_client: "it@consulting-co.com",
  },
  {
    id: "DEV-24-033",
    client: "Yoga Studio",
    projet: "Système de Réservation en ligne",
    date_creation: "2024-10-05",
    date_validite: "2024-10-20",
    statut: "Brouillon",
    montant_ht: 3200,
    email_client: "namaste@yogastudio.com",
  },
];

// ============================================================================
// 2. LOGIQUE MÉTIER
// ============================================================================

export default function SuiviDevisPage() {
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

  const getValidityStatus = (dateStr: string, status: QuoteStatus) => {
    if (status === "Accepté" || status === "Refusé") return "closed";
    const today = new Date();
    const limit = new Date(dateStr);
    const diffTime = limit.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return "expired";
    if (diffDays <= 3) return "urgent";
    return "ok";
  };

  const processedQuotes = useMemo(() => {
    let data = [...mockQuotes];
    if (activeFilter !== "Tous") {
      data = data.filter((q) => q.statut === activeFilter);
    }
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      data = data.filter(
        (q) =>
          q.client.toLowerCase().includes(lower) ||
          q.id.toLowerCase().includes(lower) ||
          q.projet.toLowerCase().includes(lower)
      );
    }
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
  }, [activeFilter, searchTerm, sort]);

  const kpis = useMemo(() => {
    return mockQuotes.reduce(
      (acc, q) => {
        if (q.statut === "Accepté") {
          acc.won.count++;
          acc.won.amount += q.montant_ht;
        }
        if (q.statut === "Envoyé") {
          acc.pipeline.count++;
          acc.pipeline.amount += q.montant_ht;
        }
        const validity = getValidityStatus(q.date_validite, q.statut);
        if (
          (q.statut === "Envoyé" || q.statut === "Expiré") &&
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
  }, []);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(amount);

  const getStatusBadge = (status: QuoteStatus) => {
    const styles = {
      Brouillon: "text-neutral-500",
      Envoyé: "text-neutral-900 bg-neutral-100",
      Accepté: "text-white bg-neutral-900",
      Refusé: "text-neutral-400 decoration-line-through",
      Expiré: "text-red-600 bg-red-50",
    };
    return (
      <span
        className={`inline-flex items-center justify-center px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider ${styles[status]}`}
      >
        {status}
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

  // État de vue (Grid/List) - Local au composant
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // ============================================================================
  // 3. LAYOUT PRINCIPAL
  // ============================================================================

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-white text-neutral-900 font-sans overflow-hidden">
      {/* ----------------------------------------------------------- */}
      {/* ZONE GAUCHE : TABLEAU DE DONNÉES (Max Espace) */}
      {/* ----------------------------------------------------------- */}
      <main className="flex-1 flex flex-col min-w-0 bg-white">
        {/* === HEADER AMÉLIORÉ === */}
        <header className="h-14 bg-white/80 backdrop-blur-md border-b border-neutral-200 px-6 flex items-center justify-between shrink-0 sticky top-0 z-40">
          {/* 1. GAUCHE : Titre & Contexte (Plus de faux breadcrumb) */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-neutral-100 rounded-md">
                <Briefcase className="w-4 h-4 text-neutral-600" />
              </div>
              <h1 className="text-base  text-neutral-900 tracking-tight">
                Mes Devis
              </h1>
            </div>

            {/* Séparateur vertical discret */}
            <div className="h-4 w-px bg-neutral-200" />

            {/* Badge de Contexte Actif */}
            <div className="flex items-center gap-2 bg-neutral-50 px-2.5 py-1 rounded-md border border-neutral-200/60">
              <span className="text-xs font-medium text-neutral-600">
                {activeFilter === "Tous" ? "Vue d'ensemble" : activeFilter}
              </span>
              <span className="bg-neutral-200 text-neutral-600 text-[10px] font-mono font-bold px-1.5 rounded-sm">
                {processedQuotes.length}
              </span>
            </div>
          </div>

          {/* 2. CENTRE : Contrôles d'Affichage (Console "Pill") */}
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

          {/* 3. DROITE : Indicateur Statut (Confiance) */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 bg-white px-3 py-1.5 rounded-full border border-neutral-100 shadow-sm">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </div>
              <span className="text-[10px] uppercase tracking-wide font-bold text-neutral-400">
                Sync
              </span>
            </div>
          </div>
        </header>

        {/* Tableau avec Scroll Indépendant */}
        <div className="flex-1 overflow-auto bg-neutral-50/30">
          <table className="w-full text-left border-collapse">
            <thead className="bg-neutral-50 border-b border-neutral-200 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 w-24 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                  Réf
                </th>
                <th
                  onClick={() => handleSort("client")}
                  className="px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-neutral-500 cursor-pointer hover:text-neutral-900"
                >
                  Client
                </th>
                <th
                  onClick={() => handleSort("date_creation")}
                  className="px-6 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-neutral-500 cursor-pointer hover:text-neutral-900"
                >
                  Date
                </th>
                <th
                  onClick={() => handleSort("date_validite")}
                  className="px-6 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-neutral-500 cursor-pointer hover:text-neutral-900"
                >
                  Échéance
                </th>
                <th className="px-6 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                  Statut
                </th>
                <th
                  onClick={() => handleSort("montant")}
                  className="px-6 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-neutral-500 cursor-pointer hover:text-neutral-900"
                >
                  Total HT
                </th>
                <th className="px-6 py-3 w-12"></th>
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
                    <td className="px-6 py-3">
                      <span className="font-mono text-xs text-neutral-400 group-hover:text-neutral-900">
                        #{quote.id.split("-")[1]}-{quote.id.split("-")[2]}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-neutral-900">
                          {quote.client}
                        </span>
                        <span className="text-[11px] text-neutral-500 truncate max-w-[250px]">
                          {quote.projet}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <span className="text-xs font-mono text-neutral-600">
                        {new Date(quote.date_creation).toLocaleDateString(
                          "fr-FR"
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex flex-col items-end">
                        <span
                          className={`text-xs font-mono ${
                            validity === "expired"
                              ? "text-red-400 line-through"
                              : "text-neutral-600"
                          }`}
                        >
                          {new Date(quote.date_validite).toLocaleDateString(
                            "fr-FR"
                          )}
                        </span>
                        {validity === "urgent" && (
                          <span className="text-[9px] font-bold text-red-600 uppercase tracking-wide">
                            Urgent
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3 text-center">
                      {getStatusBadge(quote.statut)}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <span className="text-sm font-mono font-medium text-neutral-900">
                        {formatCurrency(quote.montant_ht)}
                      </span>
                    </td>
                    <td className="px-6 py-3 relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(
                            openMenuId === quote.id ? null : quote.id
                          );
                        }}
                        className={`p-1.5 rounded text-neutral-300 hover:text-neutral-900 hover:bg-neutral-100 ${
                          openMenuId === quote.id
                            ? "text-neutral-900 bg-neutral-100"
                            : ""
                        }`}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {/* Menu Contextuel */}
                      {openMenuId === quote.id && (
                        <div
                          ref={actionMenuRef}
                          className="absolute right-8 top-0 w-40 bg-white border border-neutral-200 rounded shadow-lg z-50 animate-in fade-in zoom-in-95 duration-100"
                        >
                          <div className="p-1">
                            <a
                              href={`/editor/${quote.id}`}
                              className="flex items-center gap-2 px-3 py-2 text-xs text-neutral-700 hover:bg-neutral-50 rounded-sm"
                            >
                              <Edit3 className="w-3.5 h-3.5" /> Éditer
                            </a>
                            <button className="flex w-full items-center gap-2 px-3 py-2 text-xs text-neutral-700 hover:bg-neutral-50 rounded-sm">
                              <Download className="w-3.5 h-3.5" /> PDF
                            </button>
                            <div className="h-px bg-neutral-100 my-1" />
                            <button className="flex w-full items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-sm">
                              <Trash2 className="w-3.5 h-3.5" /> Supprimer
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {processedQuotes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
              <p className="text-sm">Aucune donnée.</p>
            </div>
          )}
        </div>
      </main>

      {/* ----------------------------------------------------------- */}
      {/* SIDEBAR DROITE : FILTRES & KPI (Fixe) */}
      {/* ----------------------------------------------------------- */}
      <aside className="w-80 border-l border-neutral-200 bg-neutral-50 flex flex-col z-20 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.02)]">
        {/* Section 1: KPI (Performance) */}
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

        {/* Section 2: Filtres (Status) */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center gap-2 mb-4 text-neutral-500">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Affichage
            </h3>
          </div>

          <div className="space-y-1">
            {[
              { id: "Tous", label: "Vue d'ensemble", count: mockQuotes.length },
              {
                id: "Brouillon",
                label: "Brouillons",
                count: mockQuotes.filter((q) => q.statut === "Brouillon")
                  .length,
              },
              {
                id: "Envoyé",
                label: "Envoyés",
                count: mockQuotes.filter((q) => q.statut === "Envoyé").length,
              },
              {
                id: "Accepté",
                label: "Gagnés",
                count: mockQuotes.filter((q) => q.statut === "Accepté").length,
              },
              {
                id: "Refusé",
                label: "Perdus",
                count: mockQuotes.filter((q) => q.statut === "Refusé").length,
              },
              {
                id: "Expiré",
                label: "Expirés",
                count: mockQuotes.filter((q) => q.statut === "Expiré").length,
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

        {/* Footer Sidebar (Total) */}
        <div className="p-6 border-t border-neutral-200 bg-neutral-100/50">
          <div className="flex justify-between items-center text-xs text-neutral-500 font-mono">
            <span>Total dossiers</span>
            <span>{mockQuotes.length}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
