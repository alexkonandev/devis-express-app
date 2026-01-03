"use client";

import { useState, useMemo } from "react";
import {
  MoreHorizontal,
  Download,
  Edit3,
  Trash2,
  Plus,
  Search,
  ArrowUpRight,
  Calendar,
  FileText,
  TrendingUp,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteDevisAction } from "./actions";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

// --- TYPES ---
export type QuoteStatus =
  | "draft"
  | "sent"
  | "accepted"
  | "rejected"
  | "archived";

export interface Quote {
  id: string;
  client: string;
  projet: string;
  date_creation: string;
  date_validite: string;
  statut: QuoteStatus;
  montant_ht: number;
  email_client: string;
}

interface DashboardClientProps {
  initialQuotes: Quote[];
}

// --- HELPER UI : KPI CARD ---
const KpiCard = ({ label, amount, count, icon: Icon, trend }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm flex flex-col justify-between h-32 hover:border-neutral-300 transition-colors group">
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-2 text-neutral-500">
        <div className="p-1.5 bg-neutral-50 rounded-md group-hover:bg-neutral-900 group-hover:text-white transition-colors">
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider">
          {label}
        </span>
      </div>
      {trend && (
        <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full font-bold">
          +{trend}%
        </span>
      )}
    </div>
    <div>
      <div className="text-2xl font-mono font-bold text-neutral-900 tracking-tight">
        {new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "EUR",
          maximumFractionDigits: 0,
        }).format(amount)}
      </div>
      <div className="text-xs text-neutral-400 mt-1 font-medium">
        {count} devis concernés
      </div>
    </div>
  </div>
);

// --- COMPOSANT PRINCIPAL ---
export default function DashboardClient({
  initialQuotes,
}: DashboardClientProps) {
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<QuoteStatus | "all">("all");
  const router = useRouter();

  // 1. CALCULS (Memoized)
  const stats = useMemo(() => {
    return quotes.reduce(
      (acc, q) => {
        // Total Signé (Cash in)
        if (q.statut === "accepted") {
          acc.signed.amount += q.montant_ht;
          acc.signed.count++;
        }
        // Pipeline (Potentiel)
        if (q.statut === "sent") {
          acc.pipeline.amount += q.montant_ht;
          acc.pipeline.count++;
        }
        // Total Global
        acc.total.amount += q.montant_ht;
        acc.total.count++;
        return acc;
      },
      {
        signed: { amount: 0, count: 0 },
        pipeline: { amount: 0, count: 0 },
        total: { amount: 0, count: 0 },
      }
    );
  }, [quotes]);

  const filteredQuotes = useMemo(() => {
    return quotes
      .filter((q) => {
        const matchesSearch =
          q.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.projet.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
          statusFilter === "all" ? true : q.statut === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort(
        (a, b) =>
          new Date(b.date_creation).getTime() -
          new Date(a.date_creation).getTime()
      );
  }, [quotes, searchTerm, statusFilter]);

  // 2. ACTIONS
  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer définitivement ?")) return;
    const backup = [...quotes];
    setQuotes((prev) => prev.filter((q) => q.id !== id)); // Optimistic UI

    const res = await deleteDevisAction(id);
    if (!res.success) {
      setQuotes(backup);
      toast.error("Erreur lors de la suppression");
    } else {
      toast.success("Devis supprimé");
      router.refresh();
    }
  };

  // 3. UI HELPERS
  const getStatusBadge = (status: QuoteStatus) => {
    switch (status) {
      case "accepted":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
            Gagné
          </span>
        );
      case "sent":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
            Envoyé
          </span>
        );
      case "draft":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 text-neutral-600">
            Brouillon
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-600 line-through">
            Perdu
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 text-neutral-500">
            Archivé
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50/50 p-6  space-y-12">
      {/* 1. HEADER & KPI SECTION */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-neutral-900 tracking-tight">
              Tableau de Bord
            </h1>
            <p className="text-neutral-500">
              Vue d'ensemble de votre activité.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* SEARCH BAR COMPACTE */}
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-hover:text-neutral-900 transition-colors" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10 pl-9 pr-4 rounded-full border border-neutral-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 w-48 transition-all focus:w-64"
              />
            </div>
            <Button
              asChild
              className="rounded-full bg-neutral-900 hover:bg-black text-white px-6 h-10 shadow-lg shadow-neutral-900/20"
            >
              <Link href="/devis/new">
                <Plus className="w-4 h-4 mr-2" /> Nouveau Devis
              </Link>
            </Button>
          </div>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KpiCard
            label="Chiffre d'Affaires Signé"
            amount={stats.signed.amount}
            count={stats.signed.count}
            icon={TrendingUp}
            trend="12" // Exemple statique, à dynamiser plus tard
          />
          <KpiCard
            label="En attente (Pipeline)"
            amount={stats.pipeline.amount}
            count={stats.pipeline.count}
            icon={ArrowUpRight}
          />
          {/* Carte Action Rapide ou Alerte */}
          <div
            className="bg-neutral-900 p-6 rounded-2xl shadow-xl flex flex-col justify-between h-32 text-white relative overflow-hidden group cursor-pointer"
            onClick={() => router.push("/devis/new")}
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Plus className="w-24 h-24" />
            </div>
            <div className="flex items-center gap-2 text-neutral-400">
              <div className="p-1.5 bg-neutral-800 rounded-md">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider">
                Action Rapide
              </span>
            </div>
            <div>
              <div className="text-lg font-bold text-white tracking-tight">
                Créer un devis
              </div>
              <div className="text-xs text-neutral-400 mt-1">
                Vous avez {stats.total.count} devis au total.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DATA TABLE SECTION */}
      <section className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
        {/* TABLE TOOLBAR */}
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center gap-4 overflow-x-auto no-scrollbar">
          {/* TABS FILTRES */}
          <div className="flex p-1 bg-neutral-100 rounded-lg">
            {[
              { id: "all", label: "Tous" },
              { id: "draft", label: "Brouillons" },
              { id: "sent", label: "Envoyés" },
              { id: "accepted", label: "Signés" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as any)}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                  statusFilter === tab.id
                    ? "bg-white text-neutral-900 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="ml-auto text-xs text-neutral-400 font-medium">
            {filteredQuotes.length} résultats
          </div>
        </div>

        {/* TABLEAU */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-neutral-50/50 text-[10px] uppercase font-bold text-neutral-400">
              <tr>
                <th className="px-6 py-4">Référence</th>
                <th className="px-6 py-4">Client & Projet</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-center">Statut</th>
                <th className="px-6 py-4 text-right">Montant</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredQuotes.length > 0 ? (
                filteredQuotes.map((quote) => (
                  <tr
                    key={quote.id}
                    className="group hover:bg-neutral-50/80 transition-colors cursor-pointer"
                    onClick={() => router.push(`/devis/${quote.id}`)}
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-bold text-neutral-900">
                        #{quote.id.slice(0, 8)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-bold text-sm text-neutral-900">
                          {quote.client}
                        </div>
                        <div className="text-xs text-neutral-500">
                          {quote.projet}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs text-neutral-600">
                        <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                        {new Date(quote.date_creation).toLocaleDateString(
                          "fr-FR"
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(quote.statut)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-mono text-sm font-bold text-neutral-900">
                        {new Intl.NumberFormat("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                        }).format(quote.montant_ht)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div
                        className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-white hover:border border-neutral-200"
                          onClick={() => router.push(`/devis/${quote.id}`)}
                        >
                          <Edit3 className="w-3.5 h-3.5 text-neutral-600" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-white hover:border border-neutral-200"
                            >
                              <MoreHorizontal className="w-3.5 h-3.5 text-neutral-600" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => window.print()}>
                              <Download className="w-3.5 h-3.5 mr-2" />{" "}
                              Télécharger PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(quote.id)}
                            >
                              <Trash2 className="w-3.5 h-3.5 mr-2" /> Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-24 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                        <Search className="w-6 h-6 text-neutral-400" />
                      </div>
                      <h3 className="text-lg font-bold text-neutral-900 mb-1">
                        Aucun devis trouvé
                      </h3>
                      <p className="text-neutral-500 mb-6 max-w-sm mx-auto">
                        {searchTerm
                          ? "Essayez de modifier votre recherche."
                          : "Vous n'avez pas encore créé de devis avec ce statut."}
                      </p>
                      {/* EMPTY STATE ACTION */}
                      {!searchTerm && statusFilter === "all" && (
                        <Button
                          onClick={() => router.push("/devis/new")}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                        >
                          Créer mon premier devis
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
