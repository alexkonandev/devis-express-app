import React from "react";
import { ChevronRight, Home, ZoomIn, ZoomOut, Eye, PenLine, Download, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
}

export const EditorHeader = ({
  activeQuote,
  folders,
  viewMode,
  setViewMode,
  onSave,
  isSaving,
  zoom,
  setZoom,
}: EditorHeaderProps) => {
  // Trouver le nom du dossier actuel
  const currentFolder = folders.find(f => f.id === activeQuote.meta.folderId);

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-neutral-200 px-6 flex items-center justify-between shrink-0 sticky top-0 z-40">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-neutral-500">
        <div className="flex items-center gap-1 hover:text-neutral-900 transition-colors cursor-pointer">
          <Home className="w-4 h-4" />
        </div>
        <ChevronRight className="w-4 h-4 text-neutral-300" />
        <span className={currentFolder ? "hover:text-neutral-900 cursor-pointer transition-colors" : "text-neutral-900 font-medium"}>
          {currentFolder ? currentFolder.name : "Mes Devis"}
        </span>
        {currentFolder && (
          <>
            <ChevronRight className="w-4 h-4 text-neutral-300" />
            <span className="font-medium text-neutral-900 truncate max-w-[200px]">
              {activeQuote.client.name || "Nouveau Devis"}
            </span>
          </>
        )}
      </div>

      {/* Center Controls */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
        <div className="flex items-center bg-neutral-100 rounded-lg p-1 border border-neutral-200">
          <button
            onClick={() => setViewMode("edit")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 transition-all ${
              viewMode === "edit"
                ? "bg-white shadow-sm text-neutral-900"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <PenLine className="w-3.5 h-3.5" /> Édition
          </button>
          <button
            onClick={() => setViewMode("preview")}
            className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 transition-all ${
              viewMode === "preview"
                ? "bg-white shadow-sm text-neutral-900"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Aperçu
          </button>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-neutral-50 rounded-md border border-neutral-200 p-1">
          <button 
            onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
            className="p-1 hover:bg-white hover:shadow-sm rounded text-neutral-500"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono w-12 text-center">{Math.round(zoom * 100)}%</span>
          <button 
            onClick={() => setZoom(Math.min(1.5, zoom + 0.1))}
            className="p-1 hover:bg-white hover:shadow-sm rounded text-neutral-500"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center gap-2 text-xs font-medium text-neutral-500">
            {isSaving ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            )}
            <span className="hidden xl:inline">{isSaving ? "Sauvegarde..." : "Enregistré"}</span>
        </div>

        <Button 
          onClick={onSave}
          size="sm" 
          className="bg-neutral-900 text-white hover:bg-black shadow-sm"
        >
          <Download className="w-4 h-4 mr-2" /> Exporter
        </Button>
      </div>
    </header>
  );
};
