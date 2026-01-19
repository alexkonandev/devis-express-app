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

/**
 * COMPOSANT : ToolbarBtn
 * MISSION : Bouton industriel haute précision
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
        ? "bg-slate-950 text-white"
        : "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
      disabled && "opacity-30 cursor-not-allowed",
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
        <div className="mb-0 w-64 bg-white border border-slate-950 border-b-0 p-0 z-50 animate-in slide-in-from-bottom-1 duration-150">
          <div className="px-3 py-2 bg-slate-50 border-b border-slate-200">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
              System_Themes
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
                      isActive ? "text-indigo-600" : "text-slate-600"
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
      <div className="flex items-center bg-white border border-slate-950  rounded-none p-0 overflow-hidden">
        {/* SECTION 1 : ENGINE MODES */}
        <div className="flex items-center border-r border-slate-200">
          <ToolbarBtn
            icon={PencilSimpleIcon}
            title="Studio Mode"
            active={viewMode === "studio"}
            onClick={() => setViewMode("studio")}
          />
          <ToolbarBtn
            icon={EyeIcon}
            title="Client Preview"
            active={viewMode === "preview"}
            onClick={() => setViewMode("preview")}
          />
        </div>

        {/* SECTION 2 : OPTICS (ZOOM) */}
        <div className="flex items-center border-r border-slate-200">
          <ToolbarBtn
            icon={MagnifyingGlassMinusIcon}
            title="Out"
            onClick={() => setZoom(Math.max(zoom - STEP, MIN_ZOOM))}
            disabled={zoom <= MIN_ZOOM}
          />
          <div className="w-14 text-center">
            <span className="text-[10px] font-mono font-black text-slate-900 tabular-nums">
              {Math.round(zoom * 100)}%
            </span>
          </div>
          <ToolbarBtn
            icon={MagnifyingGlassPlusIcon}
            title="In"
            onClick={() => setZoom(Math.min(zoom + STEP, MAX_ZOOM))}
            disabled={zoom >= MAX_ZOOM}
          />
        </div>

        {/* SECTION 3 : STYLE ENGINE */}
        <div className="border-r border-slate-200">
          <ToolbarBtn
            icon={LayoutIcon}
            title="Themes"
            active={showThemeMenu}
            onClick={() => setShowThemeMenu(!showThemeMenu)}
          />
        </div>

        {/* SECTION 4 : DEPLOYMENT (SAVE & PRINT) */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onSave}
            disabled={isSaving}
            className="h-10 w-10 rounded-none text-slate-500 hover:bg-slate-100 transition-none"
          >
            {isSaving ? (
              <CircleNotchIcon className="w-4 h-4 animate-spin text-indigo-600" />
            ) : (
              <CloudCheckIcon size={18} weight="bold" />
            )}
          </Button>

          <Button
            onClick={onPrint}
            className="h-10 px-4 rounded-none bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 transition-none border-l border-slate-950/10"
          >
            <PrinterIcon size={18} weight="bold" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Print
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};
