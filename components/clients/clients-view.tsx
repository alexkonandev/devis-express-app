"use client";

import React, { useState, useTransition } from "react";
import {
  Search,
  MoreHorizontal,
  Mail,
  Trash2,
  PenLine,
  Loader2,
  CheckSquare,
  X,
  FileSpreadsheet,
  MapPin,
  Building2,
  ExternalLink,
  Check,
  AlertTriangle,
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
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { format } from "date-fns";
import { ClientListItem } from "@/types/client";
import { CreateClientDialog } from "../features/clients/create-client-dialog";

// Action nomenclature sans 's'
import { deleteClient, deleteManyClients } from "@/actions/client-action";

/**
 * UTILITAIRE DE NOTIFICATION DESIGN SYSTEM
 * Centralise l'esthétique industrielle pour tous les états.
 */
const notify = {
  success: (msg: string) =>
    toast.custom(() => (
      <div className="bg-slate-950 border-2 border-indigo-600 p-4 flex items-center gap-3 w-[300px] shadow-2xl rounded-none">
        <Check className="w-4 h-4 text-emerald-500" />
        <p className="text-[10px] font-black uppercase text-white tracking-widest">
          {msg}
        </p>
      </div>
    )),
  error: (msg: string) =>
    toast.custom(() => (
      <div className="bg-slate-950 border-2 border-rose-600 p-4 flex items-center gap-3 w-[300px] shadow-2xl rounded-none">
        <AlertTriangle className="w-4 h-4 text-rose-600" />
        <p className="text-[10px] font-black uppercase text-white tracking-widest">
          {msg}
        </p>
      </div>
    )),
};

interface ClientsViewProps {
  initialData: ClientListItem[];
}

export default function ClientsView({ initialData }: ClientsViewProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const filteredClients = initialData.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.siret?.includes(search)
  );

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  /**
   * SUPPRESSION INDIVIDUELLE (ALERTE CENTRALE)
   */
  const handleDeleteSingle = (id: string, name: string) => {
    toast.custom((t) => (
      <div className="bg-slate-950 border-2 border-indigo-600 p-5 flex flex-col gap-5 w-[320px] shadow-2xl rounded-none animate-in fade-in zoom-in duration-200">
        <div className="flex items-center gap-3">
          <div className="w-1 h-5 bg-rose-600" />
          <p className="text-[11px] font-black uppercase text-white tracking-[0.2em]">
            SUPPRIMER : {name.slice(0, 15)}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => toast.dismiss(t)}
            className="flex-1 bg-white/5 hover:bg-white/10 text-white text-[9px] font-black uppercase h-9 rounded-none border border-white/10"
          >
            ANNULER
          </Button>
          <Button
            onClick={() => {
              toast.dismiss(t);
              startTransition(async () => {
                const result = await deleteClient(id);
                if (result.success) notify.success("ACTIF ÉLIMINÉ");
                else notify.error("ÉCHEC OPÉRATION");
              });
            }}
            className="flex-1 bg-rose-600 hover:bg-rose-700 text-white text-[9px] font-black uppercase h-9 rounded-none transition-all active:scale-95"
          >
            CONFIRMER
          </Button>
        </div>
      </div>
    ));
  };

  /**
   * SUPPRESSION GROUPÉE (ALERTE CENTRALE)
   */
  const handleDeleteBulk = () => {
    toast.custom((t) => (
      <div className="bg-slate-950 border-2 border-indigo-600 p-5 flex flex-col gap-5 w-[320px] shadow-2xl rounded-none animate-in fade-in zoom-in duration-200">
        <div className="flex items-center gap-3">
          <div className="w-1 h-5 bg-rose-600" />
          <p className="text-[11px] font-black uppercase text-white tracking-[0.2em]">
            ÉLIMINER {selectedIds.length} ACTIFS ?
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => toast.dismiss(t)}
            className="flex-1 bg-white/5 hover:bg-white/10 text-white text-[9px] font-black uppercase h-9 rounded-none border border-white/10"
          >
            ANNULER
          </Button>
          <Button
            onClick={() => {
              toast.dismiss(t);
              startTransition(async () => {
                const result = await deleteManyClients(selectedIds);
                if (result.success) {
                  notify.success("LOT ÉLIMINÉ");
                  setSelectedIds([]);
                } else notify.error("ÉCHEC OPÉRATION");
              });
            }}
            className="flex-1 bg-rose-600 hover:bg-rose-700 text-white text-[9px] font-black uppercase h-9 rounded-none transition-all active:scale-95"
          >
            CONFIRMER
          </Button>
        </div>
      </div>
    ));
  };

  const handleExportCSV = () => {
    const data =
      selectedIds.length > 0
        ? initialData.filter((c) => selectedIds.includes(c.id))
        : filteredClients;

    if (data.length === 0) return notify.error("AUCUNE DONNÉE");

    const csv = [
      ["NOM", "EMAIL", "SIRET", "ADRESSE"].join(";"),
      ...data.map((c) =>
        [c.name, c.email || "", c.siret || "", c.address || ""].join(";")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `export-actifs-${format(new Date(), "yyyyMMdd")}.csv`;
    link.click();
    notify.success("EXPORT TERMINÉ");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2.5rem)] overflow-hidden bg-white p-0 m-0 border-t border-slate-200">
      {/* HEADER */}
      <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white z-10">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-6 bg-indigo-600" />
          <h1 className="text-[20px] font-black uppercase tracking-tighter text-slate-950">
            Répertoire Actifs
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={handleExportCSV}
            className="rounded-none border border-slate-200 h-9 px-4 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50"
          >
            <FileSpreadsheet className="w-4 h-4 mr-2 text-emerald-600" /> Export
          </Button>
          <CreateClientDialog />
        </div>
      </div>

      {/* RECHERCHE */}
      <div className="bg-slate-50 border-b border-slate-200 p-2 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="RECHERCHE GLOBALE..."
            className="w-full pl-10 pr-4 h-10 bg-white border border-slate-200 rounded-none text-[11px] font-bold uppercase tracking-wider outline-none focus:border-slate-950 transition-all"
          />
        </div>
        <div className="h-10 px-4 bg-white border border-slate-200 flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-default">
          <Building2 className="w-4 h-4" />
          <span>Filtres</span>
        </div>
      </div>

      {/* GRID */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30 custom-scrollbar relative">
        {isPending && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-50 flex items-center justify-center">
            <div className="bg-slate-950 text-white p-6 flex flex-col items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                Synchronisation...
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-slate-200 border border-slate-200">
          {filteredClients.map((client) => (
            <Card
              key={client.id}
              onClick={() => toggleSelect(client.id)}
              className={cn(
                "rounded-none border-none shadow-none hover:z-10 hover:ring-1 hover:ring-indigo-600 cursor-pointer group relative bg-white",
                selectedIds.includes(client.id) &&
                  "ring-1 ring-indigo-600 shadow-xl"
              )}
            >
              <CardHeader className="p-4 bg-slate-50 border-b border-slate-100 flex-row justify-between items-start space-y-0">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">
                    ID-{client.id.slice(0, 8)}
                  </span>
                  <h3 className="text-[13px] font-black text-slate-950 uppercase tracking-tight truncate max-w-[160px]">
                    {client.name}
                  </h3>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-none hover:bg-slate-950 hover:text-white"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="rounded-none border-slate-950 border p-0 w-48 shadow-2xl"
                  >
                    <DropdownMenuLabel className="text-[9px] font-black uppercase p-3 bg-slate-50 border-b">
                      Gestion Actif
                    </DropdownMenuLabel>
                    <DropdownMenuItem className="h-10 text-[10px] font-black uppercase rounded-none focus:bg-indigo-600 focus:text-white cursor-pointer transition-none">
                      <PenLine className="w-4 h-4 mr-3" /> Éditer
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="m-0" />
                    <DropdownMenuItem
                      onClick={() => handleDeleteSingle(client.id, client.name)}
                      className="h-10 text-[10px] font-black uppercase rounded-none text-rose-600 focus:bg-rose-600 focus:text-white cursor-pointer transition-none"
                    >
                      <Trash2 className="w-4 h-4 mr-3" /> Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="text-[11px] font-bold truncate lowercase">
                      {client.email || "---"}
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600 mt-0.5" />
                    <span className="text-[10px] font-bold uppercase italic truncate">
                      {client.address || "NON RÉPERTORIÉE"}
                    </span>
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-[9px] font-black text-slate-400 uppercase">
                    SIRET
                  </span>
                  <span className="font-mono text-[10px] bg-slate-100 text-slate-950 px-2 py-0.5 font-bold">
                    {client.siret || "---"}
                  </span>
                </div>
              </CardContent>
              {selectedIds.includes(client.id) && (
                <div className="absolute top-0 right-0 p-1 bg-indigo-600 text-white">
                  <CheckSquare className="w-3 h-3" />
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* BARRE FLOTTANTE */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4">
          <div className="bg-slate-950 border border-white/10 rounded-none p-1.5 pl-6 flex items-center gap-8 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-1 h-4 bg-indigo-600" />
              <p className="text-[11px] font-black uppercase text-white tracking-widest">
                {selectedIds.length} SÉLECTIONNÉS
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Button
                onClick={handleExportCSV}
                className="bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase h-10 px-6 rounded-none border border-white/10"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 mr-2 text-emerald-500" />{" "}
                EXPORT
              </Button>
              <Button
                onClick={handleDeleteBulk}
                className="bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black uppercase h-10 px-6 rounded-none border-none"
              >
                <Trash2 className="w-3.5 h-3.5 mr-2" /> SUPPRIMER
              </Button>
              <button
                onClick={() => setSelectedIds([])}
                className="p-3 text-white/30 hover:text-white border-l border-white/10 ml-2 outline-none"
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
