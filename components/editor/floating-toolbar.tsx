"use client";

import React, { useState } from "react";
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
  Undo2, // Pour le reset zoom
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

// --- SOUS-COMPOSANT : BOUTON TOOLBAR (Pour éviter la répétition) ---
// Simule le style VS Code : Icone seule + Tooltip natif
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
    title={title} // L'astuce "VS Code" : Le titre natif au survol
    className={cn(
      "h-9 w-9 rounded-lg transition-all", // Rounded-lg fait plus "App moderne" que full round
      active
        ? "bg-zinc-900 text-white shadow-md ring-1 ring-zinc-900" // État Actif très visible
        : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900", // État Inactif discret
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

  return (
    <div className="relative flex items-center gap-1.5 p-1.5 bg-white/80 backdrop-blur-xl border border-zinc-200/60 shadow-2xl shadow-zinc-200/50 rounded-xl transition-all ring-1 ring-white/50">
      {/* --- MENU THEMES (POP-UP) --- */}
      {showThemeMenu && themes.length > 0 && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-[300px] bg-white/95 backdrop-blur-xl border border-zinc-200/60 shadow-2xl rounded-2xl p-3 animate-in slide-in-from-bottom-2 fade-in duration-200 flex flex-col gap-2 z-50">
          <div className="flex items-center justify-between px-2 pb-2 border-b border-zinc-100">
            <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">
              Identité
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">
              {themes.length} styles
            </span>
          </div>
          <div className="flex flex-col gap-1 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
            {themes.map((theme) => {
              const isActive = activeThemeId === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => onThemeChange && onThemeChange(theme.id)}
                  className={cn(
                    "flex items-center gap-3 w-full text-left rounded-lg p-2 transition-all border",
                    isActive
                      ? "bg-zinc-50 border-zinc-300"
                      : "bg-transparent border-transparent hover:bg-zinc-50"
                  )}
                >
                  <div
                    className="w-3 h-3 rounded-full shrink-0 shadow-sm ring-1 ring-black/5"
                    style={{ backgroundColor: theme.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          "text-xs font-medium truncate",
                          isActive ? "text-zinc-900" : "text-zinc-600"
                        )}
                      >
                        {theme.name}
                      </span>
                      {isActive && (
                        <Check className="w-3 h-3 text-indigo-600" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* --- SECTION 1 : MODES D'AFFICHAGE --- */}
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

      {/* --- SECTION 2 : ZOOM --- */}
      <div className="flex items-center gap-0.5">
        <ToolbarBtn
          icon={ZoomOut}
          title="Zoom Arrière"
          onClick={() => setZoom(Math.max(zoom - STEP, MIN_ZOOM))}
          disabled={zoom <= MIN_ZOOM}
        />

        {/* Indicateur de zoom cliquable pour reset */}
        <button
          onClick={() => setZoom(0.85)} // Reset zoom standard
          title="Réinitialiser le zoom"
          className="w-10 text-center text-[10px] font-mono font-bold text-zinc-500 hover:text-zinc-900 cursor-pointer tabular-nums"
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

      {/* --- SECTION 3 : STYLE (THEMES) --- */}
      <ToolbarBtn
        icon={LayoutTemplate}
        title="Changer l'identité visuelle"
        active={showThemeMenu}
        onClick={() => setShowThemeMenu(!showThemeMenu)}
        className={
          showThemeMenu ? "bg-indigo-50 text-indigo-600 ring-indigo-200" : ""
        }
      />

      <div className="w-px h-5 bg-zinc-200 mx-1" />

      {/* --- SECTION 4 : ACTIONS CRITIQUES --- */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onSave}
          disabled={isSaving}
          title="Sauvegarder (Ctrl+S)"
          className={cn(
            "h-9 w-9 rounded-lg transition-all",
            isSaving
              ? "bg-zinc-100 text-zinc-400"
              : "text-zinc-600 hover:text-emerald-600 hover:bg-emerald-50"
          )}
        >
          {isSaving ? (
            <Loader2 className="w-4.5 h-4.5 animate-spin" />
          ) : (
            <Save className="w-4.5 h-4.5" />
          )}
        </Button>

        <Button
          size="icon"
          onClick={onPrint}
          title="Imprimer / Exporter PDF"
          className="h-9 w-9 rounded-lg bg-zinc-900 hover:bg-black text-white shadow-lg shadow-zinc-300 hover:shadow-xl transition-all active:scale-95"
        >
          <Printer className="w-4.5 h-4.5" />
        </Button>
      </div>
    </div>
  );
};
