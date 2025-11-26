"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  MoreHorizontal,
  Mail,
  Phone,
  Building,
  Filter,
  ArrowDownWideNarrow,
  Download,
  Users,
  Briefcase,
  Settings,
  Zap,
  ChevronRight,
  TrendingUp,
  UserPlus,
  Tags,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ============================================================================
// 1. STATS TOOLBAR (Barre technique du haut - Clone Dashboard)
// ============================================================================
const StatsToolbar = () => {
  const Stat = ({
    label,
    value,
    trend,
  }: {
    label: string;
    value: string;
    trend?: string;
  }) => (
    <div className="flex items-center gap-3 px-4 py-2 border-r border-neutral-200 last:border-r-0 h-full">
      <span className="text-[11px] font-medium text-neutral-500 whitespace-nowrap">
        {label}
      </span>
      <div className="flex items-baseline gap-2">
        <span className="text-sm font-mono font-bold text-neutral-900 tracking-tight">
          {value}
        </span>
        {trend && (
          <span className="text-[10px] font-medium text-emerald-600">
            {trend}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex-none h-10 border-b border-neutral-200 bg-white flex items-center overflow-x-auto no-scrollbar z-20">
      <div className="px-3 flex items-center justify-center border-r border-neutral-200 h-full bg-neutral-50/50">
        <Users className="w-3.5 h-3.5 text-neutral-400" />
      </div>
      <Stat label="Total Clients" value="124" trend="+4" />
      <Stat label="Actifs" value="98" />
      <Stat label="Entreprises" value="45" />
      <div className="flex-1" /> {/* Spacer */}
      <div className="px-4 text-[10px] font-mono text-neutral-400 hidden sm:block">
        CRM SYNC: OK
      </div>
    </div>
  );
};

// ============================================================================
// 2. CLIENTS GRID (Tableau Dense - Clone RecentQuotesGrid)
// ============================================================================
const ClientsGrid = ({ onNewClient }: { onNewClient: () => void }) => {
  // Mock Data
  const clients = [
    {
      id: "CLI-001",
      name: "Jean Dupont",
      email: "jean@dupont.com",
      company: "Dupont & Co",
      phone: "06 12 34 56 78",
      status: "active",
      type: "B2B",
    },
    {
      id: "CLI-002",
      name: "Sarah Connor",
      email: "sarah@skynet.com",
      company: "Tech Noir",
      phone: "07 89 12 34 56",
      status: "inactive",
      type: "B2C",
    },
    {
      id: "CLI-003",
      name: "Marc Zuckerberg",
      email: "marc@meta.com",
      company: "Meta Inc.",
      phone: "06 00 00 00 00",
      status: "lead",
      type: "B2B",
    },
    {
      id: "CLI-004",
      name: "Elon Musk",
      email: "elon@tesla.com",
      company: "Tesla Motors",
      phone: "06 99 88 77 66",
      status: "active",
      type: "B2B",
    },
    {
      id: "CLI-005",
      name: "Sophie Martin",
      email: "sophie@freelance.fr",
      company: "--",
      phone: "06 55 44 33 22",
      status: "active",
      type: "B2C",
    },
    {
      id: "CLI-006",
      name: "Lucas Arts",
      email: "lucas@film.com",
      company: "LucasFilm",
      phone: "01 23 45 67 89",
      status: "lead",
      type: "B2B",
    },
  ];

  const StatusBadge = ({ status }: { status: string }) => {
    const styles: any = {
      active: "bg-emerald-50 text-emerald-700 border-emerald-100",
      inactive: "bg-neutral-100 text-neutral-500 border-neutral-200",
      lead: "bg-blue-50 text-blue-700 border-blue-100",
    };
    const labels: any = {
      active: "Actif",
      inactive: "Inactif",
      lead: "Prospect",
    };
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ${styles[status]}`}
      >
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="min-w-full inline-block align-middle">
      {/* BARRE DE RECHERCHE INTEGREE (STICKY) */}
      <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-2 flex items-center gap-2 sticky top-0 z-10">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-1.5 w-3.5 h-3.5 text-neutral-400" />
          <input
            type="text"
            placeholder="Rechercher un client (Nom, Email, SIRET)..."
            className="w-full h-7 pl-8 pr-2 bg-white border border-neutral-200 rounded text-xs focus:outline-none focus:border-neutral-400 placeholder:text-neutral-400 transition-colors"
          />
        </div>
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs border-neutral-200 text-neutral-600 gap-1 bg-white hover:bg-neutral-50"
              >
                <ArrowDownWideNarrow className="w-3 h-3" />
                <span className="hidden sm:inline">Trier</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Nom (A-Z)</DropdownMenuItem>
              <DropdownMenuItem>Plus récents</DropdownMenuItem>
              <DropdownMenuItem>Statut</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs border-neutral-200 text-neutral-600 gap-1 bg-white hover:bg-neutral-50"
          >
            <Filter className="w-3 h-3" />
            <span className="hidden sm:inline">Filtres</span>
          </Button>

          <Button
            className="h-7 text-xs bg-neutral-900 text-white hover:bg-black ml-2 shadow-sm gap-1.5"
            onClick={onNewClient}
          >
            <Plus className="w-3 h-3" />{" "}
            <span className="hidden sm:inline">Nouveau</span>
          </Button>
        </div>
      </div>

      {/* TABLEAU */}
      <table className="min-w-full divide-y divide-neutral-100">
        <thead className="bg-white sticky top-[45px] z-10 shadow-sm">
          <tr>
            <th className="px-4 py-2 text-left text-[10px] font-bold text-neutral-400 uppercase tracking-wider w-[240px]">
              Client
            </th>
            <th className="px-4 py-2 text-left text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              Entreprise
            </th>
            <th className="px-4 py-2 text-left text-[10px] font-bold text-neutral-400 uppercase tracking-wider w-[140px]">
              Contact
            </th>
            <th className="px-4 py-2 text-left text-[10px] font-bold text-neutral-400 uppercase tracking-wider w-[100px]">
              Statut
            </th>
            <th className="w-[40px] px-4 py-2"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-neutral-100">
          {clients.map((client) => (
            <tr
              key={client.id}
              className="group hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              {/* Identité */}
              <td className="px-4 py-2 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded bg-neutral-100 flex items-center justify-center text-[10px] font-bold text-neutral-600 border border-neutral-200">
                    {client.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-neutral-900">
                      {client.name}
                    </div>
                    <div className="text-[10px] text-neutral-400">
                      {client.email}
                    </div>
                  </div>
                </div>
              </td>

              {/* Entreprise */}
              <td className="px-4 py-2 whitespace-nowrap">
                {client.company !== "--" ? (
                  <div className="flex items-center gap-1.5">
                    <Building className="w-3 h-3 text-neutral-400" />
                    <span className="text-xs font-medium text-neutral-700">
                      {client.company}
                    </span>
                  </div>
                ) : (
                  <span className="text-[10px] text-neutral-300 italic">
                    Particulier
                  </span>
                )}
              </td>

              {/* Contact (Tel) */}
              <td className="px-4 py-2 whitespace-nowrap">
                <div className="flex items-center gap-1.5 text-neutral-500">
                  <Phone className="w-3 h-3" />
                  <span className="text-xs font-mono">{client.phone}</span>
                </div>
              </td>

              {/* Statut */}
              <td className="px-4 py-2 whitespace-nowrap">
                <StatusBadge status={client.status} />
              </td>

              {/* Actions */}
              <td className="px-4 py-2 whitespace-nowrap text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="w-3.5 h-3.5 text-neutral-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Voir la fiche</DropdownMenuItem>
                    <DropdownMenuItem>Éditer</DropdownMenuItem>
                    <DropdownMenuItem>Créer un devis</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ============================================================================
// 3. RIGHT INSPECTOR (Sidebar de droite - Clone Dashboard)
// ============================================================================
const RightInspector = ({ onNewClient }: { onNewClient: () => void }) => {
  const QuickAction = ({ icon: Icon, label, desc, onClick }: any) => (
    <button
      onClick={onClick}
      className="w-full flex items-start gap-3 p-3 rounded-md hover:bg-neutral-100 border border-transparent hover:border-neutral-200 transition-all group text-left"
    >
      <Icon className="w-4 h-4 text-neutral-500 mt-0.5 group-hover:text-neutral-900" />
      <div>
        <div className="text-xs font-semibold text-neutral-900">{label}</div>
        <div className="text-[10px] text-neutral-500 leading-tight mt-0.5">
          {desc}
        </div>
      </div>
    </button>
  );

  return (
    <div className="h-full flex flex-col bg-neutral-50/50">
      {/* Header Sidebar */}
      <div className="p-4 border-b border-neutral-200 bg-white">
        <h2 className="text-xs font-bold text-neutral-900 flex items-center gap-2">
          <Briefcase className="w-3.5 h-3.5" />
          Gestion CRM
        </h2>
        <p className="text-[10px] text-neutral-500 mt-1">
          Base de données clients
        </p>

        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-[10px] font-medium text-neutral-500">
            <span>Taux de complétion</span>
            <span>45%</span>
          </div>
          <div className="h-1 w-full bg-neutral-100 rounded-full overflow-hidden">
            <div className="h-full bg-neutral-900 w-[45%]" />
          </div>
        </div>
      </div>

      {/* Liste Actions */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-1">
          <div className="px-2 py-2 text-[10px] font-bold uppercase text-neutral-400 tracking-wider">
            Actions Rapides
          </div>
          <QuickAction
            icon={UserPlus}
            label="Nouveau Client"
            desc="Ajouter une fiche contact"
            onClick={onNewClient}
          />
          <QuickAction
            icon={Download}
            label="Importer CSV"
            desc="Depuis Excel ou Outlook"
          />
        </div>

        <div className="p-2 space-y-1 mt-4">
          <div className="px-2 py-2 text-[10px] font-bold uppercase text-neutral-400 tracking-wider">
            Organisation
          </div>
          <QuickAction
            icon={Tags}
            label="Gérer les tags"
            desc="Segmentation clients"
          />
          <QuickAction
            icon={Settings}
            label="Champs personnalisés"
            desc="Configurer les fiches"
          />
        </div>
      </div>

      {/* Footer Sidebar */}
      <div className="p-3 border-t border-neutral-200 bg-white">
        <Button
          variant="outline"
          className="w-full justify-between h-8 text-xs border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600"
        >
          Aide CRM <ChevronRight className="w-3 h-3 opacity-50" />
        </Button>
      </div>
    </div>
  );
};

// ============================================================================
// 4. MAIN PAGE (App Shell Architecture)
// ============================================================================
export default function ClientsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNewClient = () => {
    console.log("Open New Client Modal");
  };

  if (!mounted) return null;

  return (
    // CONTENEUR PRINCIPAL (100% Hauteur, Pas de scroll global)
    <div className="flex flex-col h-full w-full bg-white overflow-hidden">
      {/* 1. HEADER SECONDAIRE (Stats Toolbar) - Fixe */}
      <StatsToolbar />

      {/* 2. ZONE DE CONTENU SPLIT (Grid Flex) */}
      <div className="flex flex-1 min-h-0">
        {/* A. COLONNE PRINCIPALE (Tableau) - Scrollable */}
        <main className="flex-1 flex flex-col min-w-0 bg-white relative overflow-hidden">
          <div className="flex-1 overflow-y-auto scroll-smooth">
            <ClientsGrid onNewClient={handleNewClient} />

            {/* Footer de liste intégré */}
            <div className="p-4 border-t border-neutral-100 flex justify-center pb-20">
              <span className="text-xs text-neutral-400">Fin de la liste</span>
            </div>
          </div>
        </main>

        {/* B. SIDEBAR DROITE (Inspecteur) - Fixe */}
        <aside className="w-72 border-l border-neutral-200 flex-none hidden lg:block bg-neutral-50/30 z-20">
          <RightInspector onNewClient={handleNewClient} />
        </aside>
      </div>
    </div>
  );
}
