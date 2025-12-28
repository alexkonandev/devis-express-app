"use client";

import React, { useState } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  Mail,
  Phone,
  Trash2,
  PenLine,
  Loader2,
  Building2,
  CheckSquare,
  MinusSquare,
  X,
  FileSpreadsheet,
  MapPin,
  Globe,
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

import { useClientManager, Client } from "@/hooks/useClientManager";
import { ClientFormDialog } from "@/components/clients/client-form-dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { format } from "date-fns";

// --- MICRO-COMPOSANT STUDIO ---
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

export default function ClientsView() {
  const manager = useClientManager();

  // États locaux
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // États Bulk Actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeletingBulk, setIsDeletingBulk] = useState(false);

  // --- ACTIONS UNITAIRES ---
  const handleOpenCreate = () => {
    setEditingClient(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (client: Client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Supprimer ce client définitivement ?")) {
      await manager.removeClient(id);
      toast.success("Client supprimé");
    }
  };

  // --- ACTIONS DE MASSE (BULK) ---
  const toggleSelectAll = () => {
    if (selectedIds.length === manager.clients.length) setSelectedIds([]);
    else setSelectedIds(manager.clients.map((c) => c.id));
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Supprimer ${selectedIds.length} clients ?`)) return;
    setIsDeletingBulk(true);

    // On boucle sur la suppression (Idéalement, il faudrait une Server Action deleteManyClients)
    try {
      await Promise.all(selectedIds.map((id) => manager.removeClient(id)));
      toast.success(`${selectedIds.length} clients supprimés`);
      setSelectedIds([]);
    } catch (e) {
      toast.error("Erreur lors de la suppression de masse");
    }
    setIsDeletingBulk(false);
  };

  const handleExportCSV = () => {
    const dataToExport =
      selectedIds.length > 0
        ? manager.clients.filter((c) => selectedIds.includes(c.id))
        : manager.clients;

    if (dataToExport.length === 0) {
      toast.error("Aucune donnée à exporter");
      return;
    }

    const headers = [
      "Nom",
      "Email",
      "Téléphone",
      "Adresse",
      "SIRET",
      "Créé le",
    ];
    const rows = dataToExport.map((c) => [
      c.name,
      c.email || "",
      c.phone || "",
      c.address || "",
      c.siret || "",
      c.createdAt ? format(new Date(c.createdAt), "dd/MM/yyyy") : "",
    ]);

    const csvContent = [
      headers.join(";"),
      ...rows.map((r) => r.join(";")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `clients_export_${format(new Date(), "yyyyMMdd")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Export terminé");
  };

  return (
    <div className="h-screen w-full bg-zinc-50/50 flex flex-col font-sans text-zinc-900 overflow-hidden relative">
      {/* 1. HEADER FIXE */}
      <header className="shrink-0 bg-white border-b border-zinc-200 px-6 py-4 flex flex-col gap-4">
        {/* Titre + Action */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-black tracking-tight text-zinc-900">
              CLIENTS
            </h1>
            <div className="px-2 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 text-[10px] font-bold text-zinc-500">
              {manager.totalCount} CONTACTS
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleExportCSV}
              variant="outline"
              className="h-8 px-3 rounded-sm text-xs font-bold border-zinc-200 text-zinc-600 hover:bg-zinc-50"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 mr-2" /> EXPORT
            </Button>
            <Button
              onClick={handleOpenCreate}
              className="bg-zinc-900 hover:bg-black text-white font-bold h-8 px-4 rounded-sm text-xs shadow-sm active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5 mr-2" /> NOUVEAU
            </Button>
          </div>
        </div>

        {/* Toolbar Recherche */}
        <div className="flex items-center gap-2 max-w-lg">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, email, siret..."
              value={manager.searchQuery}
              onChange={(e) => manager.setSearchQuery(e.target.value)}
              className="h-9 w-full pl-9 pr-3 bg-white border border-zinc-200 rounded-sm text-xs font-medium focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-all placeholder:text-zinc-400"
            />
          </div>
        </div>
      </header>

      {/* 2. TABLEAU DATA GRID */}
      <main className="flex-1 overflow-auto bg-white relative">
        {manager.isLoading && (
          <div className="absolute inset-0 bg-white/60 z-10 flex items-start justify-center pt-20">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
          </div>
        )}

        {manager.clients.length === 0 && !manager.isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center mb-3">
              <Building2 className="w-5 h-5 text-zinc-300" />
            </div>
            <p className="text-sm font-bold text-zinc-900">
              Aucun client trouvé
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              Commencez par ajouter votre premier client.
            </p>
            <Button
              onClick={handleOpenCreate}
              variant="link"
              className="text-xs font-bold text-indigo-600 mt-2"
            >
              Créer un client
            </Button>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-zinc-50 sticky top-0 z-10 shadow-[0_1px_2px_rgba(0,0,0,0.03)] border-b border-zinc-200">
              <tr>
                {/* CHECKBOX MASTER */}
                <th className="py-3 px-6 w-[40px]">
                  <button
                    onClick={toggleSelectAll}
                    className="text-zinc-400 hover:text-zinc-900 transition-colors"
                  >
                    {selectedIds.length > 0 &&
                    selectedIds.length === manager.clients.length ? (
                      <CheckSquare className="w-4 h-4 text-zinc-900" />
                    ) : (
                      <MinusSquare className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-6 w-[35%]">
                  <StudioLabel>Identité</StudioLabel>
                </th>
                <th className="py-3 px-6 w-[30%]">
                  <StudioLabel>Coordonnées</StudioLabel>
                </th>
                <th className="py-3 px-6 w-[20%]">
                  <StudioLabel>Info Légales</StudioLabel>
                </th>
                <th className="py-3 px-6 w-[10%] text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {manager.clients.map((client) => {
                const isSelected = selectedIds.includes(client.id);
                return (
                  <tr
                    key={client.id}
                    className={cn(
                      "group transition-colors border-l-2 cursor-pointer",
                      isSelected
                        ? "bg-zinc-50 border-zinc-900"
                        : "hover:bg-zinc-50 border-transparent hover:border-zinc-200"
                    )}
                    onClick={() => handleOpenEdit(client)}
                  >
                    {/* CHECKBOX ROW */}
                    <td
                      className="py-4 px-6"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(client.id)}
                        className="w-4 h-4 rounded border-zinc-300 cursor-pointer accent-zinc-900"
                      />
                    </td>

                    {/* IDENTITÉ */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-sm bg-zinc-100 border border-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-700 shadow-sm">
                          {client.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-zinc-900">
                            {client.name}
                          </div>
                          {client.address && (
                            <div className="flex items-center gap-1 text-[10px] text-zinc-400 mt-0.5">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate max-w-[200px]">
                                {client.address}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* CONTACT */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1">
                        {client.email ? (
                          <div className="flex items-center gap-2 text-xs text-zinc-600 font-medium">
                            <Mail className="w-3 h-3 text-zinc-300" />{" "}
                            {client.email}
                          </div>
                        ) : (
                          <span className="text-[10px] text-zinc-300 italic">
                            Pas d'email
                          </span>
                        )}

                        {client.phone && (
                          <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
                            <Phone className="w-3 h-3 text-zinc-300" />{" "}
                            {client.phone}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* LEGAL */}
                    <td className="py-4 px-6">
                      {client.siret ? (
                        <span className="font-mono text-[10px] text-zinc-600 bg-zinc-50 border border-zinc-200 px-1.5 py-0.5 rounded-sm">
                          {client.siret}
                        </span>
                      ) : (
                        <span className="text-[10px] text-zinc-300 italic">
                          Particulier
                        </span>
                      )}
                    </td>

                    {/* ACTIONS */}
                    <td
                      className="py-4 px-6 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
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
                          <DropdownMenuItem
                            onClick={() => handleOpenEdit(client)}
                            className="cursor-pointer text-xs font-medium"
                          >
                            <PenLine className="w-3.5 h-3.5 mr-2 text-zinc-400" />{" "}
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(client.id)}
                            className="cursor-pointer text-xs font-medium text-red-600 focus:text-red-700 focus:bg-red-50"
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-2" /> Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </main>

      {/* 3. BARRE D'ACTIONS FLOTTANTE (BULK) */}
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
              <Button
                onClick={handleExportCSV}
                className="h-7 bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-bold uppercase px-3 rounded-sm border border-zinc-700"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 mr-2 text-emerald-500" />{" "}
                CSV
              </Button>

              <Button
                onClick={handleBulkDelete}
                disabled={isDeletingBulk}
                className="h-7 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase px-3 rounded-sm border border-red-500"
              >
                {isDeletingBulk ? (
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

      {/* FORM MODAL */}
      <ClientFormDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={manager.saveClient}
        clientToEdit={editingClient}
      />
    </div>
  );
}
