"use client";

import React, { useState } from "react";
import {
  Printer,
  ZoomIn,
  ZoomOut,
  Loader2,
  Eye,
  Edit3,
  LayoutTemplate,
  Cloud,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// --- TYPES CENTRALISÉS ---
import { EditorTheme } from "@/types/editor";

interface FloatingToolbarProps {
  zoom: number;
  setZoom: (zoom: number) => void;
  onPrint: () => void;
  onSave: () => void;
  isSaving: boolean;
  viewMode: "studio" | "preview";
  setViewMode: (mode: "studio" | "preview") => void;
  themes: EditorTheme[];
  activeThemeId: string;
  onThemeChange: (id: string) => void;
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
    <Icon className="w-4 h-4" strokeWidth={active ? 2.5 : 2} />
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
  themes,
  activeThemeId,
  onThemeChange,
}: FloatingToolbarProps) => {
  const MIN_ZOOM = 0.5;
  const MAX_ZOOM = 1.5;
  const STEP = 0.1;

  const [showThemeMenu, setShowThemeMenu] = useState(false);

  return (
    <div className="flex flex-col items-center gap-2">
      {/* --- MENU THEMES (Pop-up Stratégique) --- */}
      {showThemeMenu && (
        <div className="mb-2 w-60 bg-white border border-zinc-200 shadow-2xl rounded-xl p-2 animate-in slide-in-from-bottom-2 fade-in duration-200 z-50">
          <div className="px-2 py-1.5 border-b border-zinc-100 mb-1">
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
              Identité Visuelle
            </span>
          </div>
          <div className="flex flex-col gap-0.5 max-h-50 overflow-y-auto">
            {themes.map((theme) => {
              const isActive = activeThemeId === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => {
                    onThemeChange(theme.id);
                    setShowThemeMenu(false);
                  }}
                  className={cn(
                    "flex items-center gap-3 w-full text-left rounded-md p-2 transition-all group",
                    isActive ? "bg-zinc-100" : "hover:bg-zinc-50"
                  )}
                >
                  <div
                    className="w-3 h-3 rounded-full shrink-0 shadow-sm border border-black/5"
                    style={{ backgroundColor: theme.color }}
                  />
                  <span
                    className={cn(
                      "text-[11px] uppercase tracking-tight font-bold truncate",
                      isActive
                        ? "text-zinc-900"
                        : "text-zinc-500 group-hover:text-zinc-900"
                    )}
                  >
                    {theme.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* --- BARRE PRINCIPALE --- */}
      <div className="flex items-center gap-1 p-1.5 bg-white border border-zinc-200 shadow-2xl rounded-xl ring-1 ring-black/5">
        {/* SECTION 1 : MODES D'ÉDITION */}
        <div className="flex items-center bg-zinc-100 rounded-lg p-0.5 gap-0.5">
          <ToolbarBtn
            icon={Edit3}
            title="Studio"
            active={viewMode === "studio"}
            onClick={() => setViewMode("studio")}
          />
          <ToolbarBtn
            icon={Eye}
            title="Aperçu Client"
            active={viewMode === "preview"}
            onClick={() => setViewMode("preview")}
          />
        </div>

        <div className="w-px h-4 bg-zinc-200 mx-1" />

        {/* SECTION 2 : CONTRÔLE DU ZOOM */}
        <div className="flex items-center gap-0.5">
          <ToolbarBtn
            icon={ZoomOut}
            title="Zoom Out"
            onClick={() => setZoom(Math.max(zoom - STEP, MIN_ZOOM))}
            disabled={zoom <= MIN_ZOOM}
          />
          <button
            onClick={() => setZoom(0.85)}
            className="w-12 text-[10px] font-mono font-black text-zinc-600 hover:text-zinc-900 tabular-nums"
          >
            {Math.round(zoom * 100)}%
          </button>
          <ToolbarBtn
            icon={ZoomIn}
            title="Zoom In"
            onClick={() => setZoom(Math.min(zoom + STEP, MAX_ZOOM))}
            disabled={zoom >= MAX_ZOOM}
          />
        </div>

        <div className="w-px h-4 bg-zinc-200 mx-1" />

        {/* SECTION 3 : STYLE (THEMES) */}
        <ToolbarBtn
          icon={LayoutTemplate}
          title="Thèmes"
          active={showThemeMenu}
          onClick={() => setShowThemeMenu(!showThemeMenu)}
        />

        <div className="w-px h-4 bg-zinc-200 mx-1" />

        {/* SECTION 4 : SAUVEGARDE & EXPORT */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onSave}
            disabled={isSaving}
            className={cn(
              "h-9 w-9 rounded-lg transition-all",
              isSaving
                ? "animate-pulse"
                : "hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900"
            )}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin text-zinc-900" />
            ) : (
              <Cloud className="w-4 h-4" />
            )}
          </Button>

          <Button
            size="icon"
            onClick={onPrint}
            className="h-9 w-9 rounded-lg bg-zinc-900 hover:bg-black text-white shadow-lg transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
