"use client";

import React from "react";
import {
  ZoomIn,
  ZoomOut,
  Eye,
  PenLine,
  Download,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
// On n'a plus besoin du Popover pour l'export, car le sélecteur est ailleurs
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Quote } from "@/store/quote.store";

interface EditorHeaderProps {
  activeQuote: Quote;
  folders: { id: string; name: string }[];
  viewMode: "edit" | "preview";
  setViewMode: (mode: "edit" | "preview") => void;
  onSave: () => void;
  isSaving: boolean;
  zoom: number;
  setZoom: (zoom: number) => void;

  // NOUVELLE PROP : La fonction pour déclencher l'impression (passée par CreateQuoteClient)
  onPrint: () => void;
}

export const EditorHeader = ({
  activeQuote,
  viewMode,
  setViewMode,
  onSave,
  isSaving,
  zoom,
  setZoom,
  onPrint, // On récupère la fonction
}: EditorHeaderProps) => {
  // LOGIQUE SUPPRIMÉE : L'ancien handleExport Puppeteer n'est plus nécessaire.
  // const [exportingTheme, setExportingTheme] = useState<string | null>(null);
  // const handleExport = async (...) => { ... }

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-neutral-200 px-6 flex items-center justify-between shrink-0 sticky top-0 z-40 shadow-sm transition-all">
      {/* 1. GAUCHE : Zoom Controls */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 bg-neutral-50 rounded-md border border-neutral-200 p-1">
          <button
            onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
            className="p-1 hover:bg-white hover:shadow-sm rounded text-neutral-500 transition-all"
            title="Dézoomer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono w-12 text-center select-none text-neutral-600">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(Math.min(1.5, zoom + 0.1))}
            className="p-1 hover:bg-white hover:shadow-sm rounded text-neutral-500 transition-all"
            title="Zoomer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. CENTRE : Switch Edit/Preview */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
        <div className="flex items-center bg-neutral-100 rounded-lg p-1 border border-neutral-200">
          <button
            onClick={() => setViewMode("edit")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 transition-all ${
              viewMode === "edit"
                ? "bg-white shadow-sm text-neutral-900 ring-1 ring-black/5"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <PenLine className="w-3.5 h-3.5" /> Édition
          </button>
          <button
            onClick={() => setViewMode("preview")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 transition-all ${
              viewMode === "preview"
                ? "bg-white shadow-sm text-neutral-900 ring-1 ring-black/5"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Aperçu
          </button>
        </div>
      </div>

      {/* 3. DROITE : Actions & Export */}
      <div className="flex items-center gap-4">
        {/* Statut Sauvegarde */}
        <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
          {isSaving ? (
            <Loader2 className="w-3 h-3 animate-spin text-neutral-400" />
          ) : (
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          )}
          <span className="hidden xl:inline transition-opacity duration-300">
            {isSaving ? "Sauvegarde..." : "Enregistré"}
          </span>
        </div>

        {/* Le séparateur est maintenu */}
        <Separator orientation="vertical" className="h-6 bg-neutral-200" />

        {/* BOUTON EXPORT (Utilise la fonction onPrint du parent) */}
        <Button
          onClick={onPrint} // DÉCLENCHE LA FONCTION useReactToPrint
          size="sm"
          className="bg-neutral-900 text-white hover:bg-neutral-800 shadow-sm border border-neutral-900 transition-all active:scale-95"
        >
          <Download className="w-4 h-4 mr-2" />
          Exporter PDF
        </Button>
      </div>
    </header>
  );
};
