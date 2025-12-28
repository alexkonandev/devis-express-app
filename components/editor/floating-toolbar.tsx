"use client";

import React, { useState, useEffect } from "react";
import {
  Printer,
  Save,
  ZoomIn,
  ZoomOut,
  Loader2,
  Eye,
  Edit3,
  LayoutTemplate,
  Check,
  CheckCircle2,
  Cloud,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// --- TYPES ---
export interface MiniTheme {
  id: string;
  name: string;
  color: string;
  description?: string;
}

interface FloatingToolbarProps {
  zoom: number;
  setZoom: (zoom: number) => void;
  onPrint: () => void;
  onSave: () => void;
  isSaving: boolean;
  viewMode: "studio" | "preview";
  setViewMode: (mode: "studio" | "preview") => void;
  themes?: MiniTheme[];
  activeThemeId?: string;
  onThemeChange?: (id: string) => void;
}

// --- SOUS-COMPOSANT : BOUTON TOOLBAR ---
const ToolbarBtn = ({
  active = false,
  disabled = false,
  onClick,
  icon: Icon,
  title,
  className,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  icon: React.ElementType;
  title: string;
  className?: string;
}) => (
  <Button
    variant="ghost"
    size="icon"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={cn(
      "h-9 w-9 rounded-lg transition-all",
      active
        ? "bg-zinc-900 text-white shadow-md ring-1 ring-zinc-900"
        : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900",
      disabled && "opacity-50 cursor-not-allowed",
      className
    )}
  >
    <Icon className="w-4.5 h-4.5" strokeWidth={active ? 2.5 : 2} />
  </Button>
);

export const FloatingToolbar = ({
  zoom,
  setZoom,
  onPrint,
  onSave,
  isSaving,
  viewMode,
  setViewMode,
  themes = [],
  activeThemeId,
  onThemeChange,
}: FloatingToolbarProps) => {
  const MIN_ZOOM = 0.5;
  const MAX_ZOOM = 1.5;
  const STEP = 0.1;

  const [showThemeMenu, setShowThemeMenu] = useState(false);
  // Petit état local pour simuler le "Saved" feedback pendant 2s
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    if (!isSaving && justSaved === false) {
      // Rien à faire
    }
    if (isSaving) {
      setJustSaved(false);
    } else {
      // La sauvegarde vient de finir
      // On pourrait activer le check ici si on trackait l'état précédent
    }
  }, [isSaving]);

  return (
    <div className="flex flex-col items-center gap-2">
      {/* --- MENU THEMES (POP-UP) --- */}
      {showThemeMenu && themes.length > 0 && (
        <div className="mb-2 w-[280px] bg-white/95 backdrop-blur-xl border border-zinc-200/60 shadow-2xl rounded-2xl p-3 animate-in slide-in-from-bottom-2 fade-in duration-200 flex flex-col gap-2 z-50 ring-1 ring-black/5">
          <div className="flex items-center justify-between px-2 pb-2 border-b border-zinc-100">
            <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">
              Style du document
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">
              {themes.length}
            </span>
          </div>
          <div className="flex flex-col gap-1 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
            {themes.map((theme) => {
              const isActive = activeThemeId === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => {
                    onThemeChange && onThemeChange(theme.id);
                    // On ferme le menu après sélection pour cleaner l'UI
                    // setShowThemeMenu(false);
                  }}
                  className={cn(
                    "flex items-center gap-3 w-full text-left rounded-lg p-2 transition-all border group",
                    isActive
                      ? "bg-zinc-50 border-zinc-300 shadow-sm"
                      : "bg-transparent border-transparent hover:bg-zinc-50 hover:border-zinc-100"
                  )}
                >
                  <div
                    className="w-4 h-4 rounded-full shrink-0 shadow-sm ring-1 ring-black/5 flex items-center justify-center"
                    style={{ backgroundColor: theme.color }}
                  >
                    {isActive && (
                      <div className="w-1.5 h-1.5 bg-white rounded-full shadow-sm" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          "text-xs font-medium truncate",
                          isActive
                            ? "text-zinc-900 font-bold"
                            : "text-zinc-600 group-hover:text-zinc-900"
                        )}
                      >
                        {theme.name}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* --- BARRE PRINCIPALE --- */}
      <div className="relative flex items-center gap-1.5 p-1.5 bg-white/90 backdrop-blur-xl border border-zinc-200/80 shadow-2xl shadow-zinc-200/50 rounded-xl transition-all ring-1 ring-white/50">
        {/* SECTION 1 : MODES */}
        <div className="flex items-center bg-zinc-100/50 rounded-lg p-0.5 gap-0.5 border border-zinc-200/30">
          <ToolbarBtn
            icon={Edit3}
            title="Mode Studio (Édition)"
            active={viewMode === "studio"}
            onClick={() => setViewMode("studio")}
          />
          <ToolbarBtn
            icon={Eye}
            title="Mode Aperçu (Client)"
            active={viewMode === "preview"}
            onClick={() => setViewMode("preview")}
          />
        </div>

        <div className="w-px h-5 bg-zinc-200 mx-1" />

        {/* SECTION 2 : ZOOM */}
        <div className="flex items-center gap-0.5">
          <ToolbarBtn
            icon={ZoomOut}
            title="Zoom Arrière"
            onClick={() => setZoom(Math.max(zoom - STEP, MIN_ZOOM))}
            disabled={zoom <= MIN_ZOOM}
          />

          <button
            onClick={() => setZoom(0.85)} // Reset Standard A4 View
            title="Réinitialiser le zoom"
            className="w-10 h-9 flex items-center justify-center text-[10px] font-mono font-bold text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg cursor-pointer tabular-nums transition-colors"
          >
            {Math.round(zoom * 100)}%
          </button>

          <ToolbarBtn
            icon={ZoomIn}
            title="Zoom Avant"
            onClick={() => setZoom(Math.min(zoom + STEP, MAX_ZOOM))}
            disabled={zoom >= MAX_ZOOM}
          />
        </div>

        <div className="w-px h-5 bg-zinc-200 mx-1" />

        {/* SECTION 3 : STYLE */}
        <ToolbarBtn
          icon={LayoutTemplate}
          title="Changer l'identité visuelle"
          active={showThemeMenu}
          onClick={() => setShowThemeMenu(!showThemeMenu)}
          className={
            showThemeMenu
              ? "bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200"
              : ""
          }
        />

        <div className="w-px h-5 bg-zinc-200 mx-1" />

        {/* SECTION 4 : ACTIONS */}
        <div className="flex items-center gap-1">
          {/* BOUTON SAVE (AVEC FEEDBACK) */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onSave}
            disabled={isSaving}
            title="Sauvegarder (Ctrl+S)"
            className={cn(
              "h-9 w-9 rounded-lg transition-all relative overflow-hidden",
              isSaving
                ? "bg-zinc-50 text-zinc-400 cursor-wait"
                : "text-zinc-600 hover:text-emerald-600 hover:bg-emerald-50 hover:ring-1 hover:ring-emerald-200"
            )}
          >
            {isSaving ? (
              <Loader2 className="w-4.5 h-4.5 animate-spin" />
            ) : (
              <Cloud className="w-4.5 h-4.5" />
            )}

            {/* Petit indicateur d'état (dot) */}
            {!isSaving && (
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-emerald-500 rounded-full ring-2 ring-white opacity-0 transition-opacity group-hover:opacity-100" />
            )}
          </Button>

          {/* BOUTON PRINT (PRIMARY ACTION) */}
          <Button
            size="icon"
            onClick={onPrint}
            title="Imprimer / Exporter PDF"
            className="h-9 w-9 rounded-lg bg-zinc-900 hover:bg-black text-white shadow-lg shadow-zinc-300 hover:shadow-xl transition-all active:scale-95 ring-1 ring-zinc-900/10"
          >
            <Printer className="w-4.5 h-4.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
