"use client";

import React, { useState } from "react";
import {
  PrinterIcon,
  MagnifyingGlassMinusIcon,
  MagnifyingGlassPlusIcon,
  CircleNotchIcon,
  EyeIcon,
  PencilSimpleIcon,
  LayoutIcon,
  CloudCheckIcon,
  Icon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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

/**
 * COMPOSANT : ToolbarBtn
 * MISSION : Bouton industriel haute précision avec feedback visuel noir/indigo
 */
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
  icon: Icon;
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
      "h-10 w-10 rounded-none transition-none border-none",
      active
        ? "bg-slate-900 text-white"
        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
      disabled && "opacity-20 cursor-not-allowed",
      className
    )}
  >
    <Icon size={18} weight={active ? "fill" : "bold"} />
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
    <div className="flex flex-col items-center">
      {/* --- MENU THEMES (Industrial Pop-over) --- */}
      {showThemeMenu && (
        <div className="mb-0 w-64 bg-white border border-slate-200 p-0 z-50 shadow-[4px_4px_0_0_rgba(15,23,42,0.1)] animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="px-3 py-2 bg-slate-50 border-b border-slate-200">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">
              SYSTEME_DE_STYLES
            </span>
          </div>
          <div className="flex flex-col max-h-60 overflow-y-auto scrollbar-none">
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
                    "flex items-center gap-3 w-full text-left p-3 border-b border-slate-50 last:border-0 transition-none",
                    isActive ? "bg-indigo-50/50" : "hover:bg-slate-50"
                  )}
                >
                  <div
                    className="w-3 h-3 rounded-none shrink-0 border border-slate-900/10"
                    style={{ backgroundColor: theme.color }}
                  />
                  <span
                    className={cn(
                      "text-[10px] uppercase font-bold tracking-tight",
                      isActive ? "text-indigo-600" : "text-slate-500"
                    )}
                  >
                    {theme.name}
                  </span>
                  {isActive && (
                    <div className="ml-auto w-1 h-1 bg-indigo-600" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* --- BARRE PRINCIPALE (Industrial Frame) --- */}
      <div className="flex items-center bg-white border border-slate-200 rounded-none p-0 overflow-hidden shadow-[8px_8px_0_0_rgba(15,23,42,0.05)]">
        {/* SECTION 1 : MODES D'ENGINE */}
        <div className="flex items-center border-r border-slate-100">
          <ToolbarBtn
            icon={PencilSimpleIcon}
            title="Mode Studio"
            active={viewMode === "studio"}
            onClick={() => setViewMode("studio")}
          />
          <ToolbarBtn
            icon={EyeIcon}
            title="Aperçu Client"
            active={viewMode === "preview"}
            onClick={() => setViewMode("preview")}
          />
        </div>

        {/* SECTION 2 : OPTIQUES (ZOOM) */}
        <div className="flex items-center border-r border-slate-100 bg-slate-50/30">
          <ToolbarBtn
            icon={MagnifyingGlassMinusIcon}
            title="Zoom Arrière"
            onClick={() => setZoom(Math.max(zoom - STEP, MIN_ZOOM))}
            disabled={zoom <= MIN_ZOOM}
          />
          <div className="w-14 text-center">
            <span className="text-[11px] font-mono font-black text-slate-900 tabular-nums">
              {Math.round(zoom * 100)}%
            </span>
          </div>
          <ToolbarBtn
            icon={MagnifyingGlassPlusIcon}
            title="Zoom Avant"
            onClick={() => setZoom(Math.min(zoom + STEP, MAX_ZOOM))}
            disabled={zoom >= MAX_ZOOM}
          />
        </div>

        {/* SECTION 3 : MOTEUR DE STYLE */}
        <div className="border-r border-slate-100">
          <ToolbarBtn
            icon={LayoutIcon}
            title="Thèmes"
            active={showThemeMenu}
            onClick={() => setShowThemeMenu(!showThemeMenu)}
          />
        </div>

        {/* SECTION 4 : DEPLOIEMENT (SAUVEGARDE & PRINT) */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onSave}
            disabled={isSaving}
            className="h-10 w-10 rounded-none text-slate-500 hover:bg-slate-50 transition-none"
          >
            {isSaving ? (
              <CircleNotchIcon className="w-4 h-4 animate-spin text-indigo-600" />
            ) : (
              <CloudCheckIcon size={18} weight="bold" />
            )}
          </Button>

          <Button
            onClick={onPrint}
            className="h-10 px-5 rounded-none bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 transition-none border-l border-slate-200"
          >
            <PrinterIcon size={18} weight="bold" />
            <span className="text-[10px] font-black uppercase tracking-[0.15em]">
              IMPRIMER
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};
