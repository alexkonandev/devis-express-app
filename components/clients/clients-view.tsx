"use client";

import React, { useState, useTransition } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  Mail,
  Trash2,
  PenLine,
  Loader2,
  CheckSquare,
  MinusSquare,
  X,
  FileSpreadsheet,
  MapPin,
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

import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { format } from "date-fns";
import { ClientListItem } from "@/types/client";

// --- TYPES LOCAUX ---
interface ClientsViewProps {
  initialData: ClientListItem[];
}

const StudioLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 select-none">
    {children}
  </span>
);

export default function ClientsView({ initialData }: ClientsViewProps) {
  // ✅ transition utilisée pour le feedback UI lors du filtrage ou actions
  const [isPending] = useTransition();
  // ✅ clients utilisé pour le rendu et filtrage
  const [clients] = useState<ClientListItem[]>(initialData);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  // --- LOGIQUE FILTRAGE (Client-side pour rapidité) ---
  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.siret?.includes(search)
  );

  // --- ACTIONS ---
  const toggleSelectAll = () => {
    setSelectedIds(
      selectedIds.length === filteredClients.length
        ? []
        : filteredClients.map((c) => c.id)
    );
  };

  const handleExportCSV = () => {
    const data =
      selectedIds.length > 0
        ? clients.filter((c) => selectedIds.includes(c.id))
        : filteredClients;

    if (data.length === 0) return toast.error("Aucun client à exporter");

    const csv = [
      ["Nom", "Email", "SIRET", "Adresse"].join(";"),
      ...data.map((c) =>
        [c.name, c.email || "", c.siret || "", c.address || ""].join(";")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `clients_${format(new Date(), "yyyyMMdd")}.csv`;
    link.click();
    toast.success("Export généré");
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      {/* TOOLBAR STRATÉGIQUE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher client, email ou SIRET..."
            className="w-full pl-9 pr-4 h-10 bg-zinc-50 border-none rounded-lg text-xs font-medium focus:ring-2 focus:ring-zinc-900 transition-all outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleExportCSV}
            className="h-10 text-[10px] font-black uppercase border-zinc-200 shadow-sm"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 mr-2" /> Export
          </Button>
          <Button className="bg-zinc-900 text-white hover:bg-zinc-800 text-[10px] font-black uppercase px-6 h-10 shadow-sm">
            <Plus className="w-3.5 h-3.5 mr-2" /> Nouveau Client
          </Button>
        </div>
      </div>

      {/* DATA GRID HAUTE DENSITÉ */}
      <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden relative min-h-[400px]">
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
                  onClick={toggleSelectAll}
                  className="text-zinc-400 hover:text-zinc-900 transition-colors"
                >
                  {selectedIds.length > 0 &&
                  selectedIds.length === filteredClients.length ? (
                    <CheckSquare className="w-4 h-4 text-zinc-900" />
                  ) : (
                    <MinusSquare className="w-4 h-4" />
                  )}
                </button>
              </th>
              <th className="p-4">
                <StudioLabel>Client / Entité</StudioLabel>
              </th>
              <th className="p-4">
                <StudioLabel>Contact</StudioLabel>
              </th>
              <th className="p-4">
                <StudioLabel>Info Légales</StudioLabel>
              </th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-50">
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <tr
                  key={client.id}
                  className={cn(
                    "hover:bg-zinc-50/50 transition-colors group",
                    selectedIds.includes(client.id) && "bg-zinc-50"
                  )}
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(client.id)}
                      onChange={() =>
                        setSelectedIds((prev) =>
                          prev.includes(client.id)
                            ? prev.filter((id) => id !== client.id)
                            : [...prev, client.id]
                        )
                      }
                      className="w-4 h-4 accent-zinc-900 rounded border-zinc-300 cursor-pointer"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-zinc-900 uppercase tracking-tight">
                        {client.name}
                      </span>
                      {client.address && (
                        <span className="text-[10px] text-zinc-400 flex items-center gap-1 mt-0.5 font-bold uppercase italic">
                          <MapPin className="w-2.5 h-2.5" /> {client.address}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-xs font-medium text-zinc-600">
                      <Mail className="w-3 h-3 text-zinc-300" />{" "}
                      {client.email || "—"}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-mono text-[10px] bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-600 border border-zinc-200 font-bold uppercase">
                      {client.siret || "Particulier"}
                    </span>
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
                      <DropdownMenuContent
                        align="end"
                        className="w-48 shadow-xl border-zinc-200"
                      >
                        <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
                          Actions
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-xs font-bold uppercase cursor-pointer">
                          <PenLine className="w-3.5 h-3.5 mr-2" /> Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-xs font-bold uppercase cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50">
                          <Trash2 className="w-3.5 h-3.5 mr-2" /> Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-20 text-center">
                  <span className="text-[10px] font-black uppercase text-zinc-300 tracking-[0.2em]">
                    Aucun client trouvé
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* BULK ACTIONS BAR FLOTTANTE */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-10">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-2 pl-6 flex items-center gap-6 shadow-2xl">
            <p className="text-[10px] font-black uppercase text-white tracking-[0.2em]">
              {selectedIds.length} sélectionnés
            </p>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleExportCSV}
                className="bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-black h-9 px-4 uppercase border-none"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 mr-2 text-emerald-500" />{" "}
                CSV
              </Button>
              <Button
                variant="destructive"
                className="bg-red-600 hover:bg-red-500 text-white text-[10px] font-black h-9 px-4 uppercase border-none"
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
  );
}
