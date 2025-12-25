import React from "react";
import { ZoomIn, ZoomOut, Download, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { THEME_REGISTRY } from "@/components/pdf/themes/registry";
import PrintableQuote from "@/components/pdf/PrintableQuote";

interface QuotePreviewPaneProps {
  activeQuote: any;
  currentTheme: string;
  onThemeChange: (theme: string) => void;
  zoom: number;
  setZoom: (z: number) => void;
  onPrint: () => void;
  isSaving: boolean;
  printRef: React.RefObject<HTMLDivElement>;
}

export const QuotePreviewPane = ({
  activeQuote,
  currentTheme,
  onThemeChange,
  zoom,
  setZoom,
  onPrint,
  isSaving,
  printRef,
}: QuotePreviewPaneProps) => {
  return (
    <div className="flex flex-col h-full w-full">
      {/* TOOLBAR (Sticky Top) - Z-Index élevé pour rester au dessus */}
      <div className="h-14 bg-white border-b border-zinc-200 px-4 flex items-center justify-between shrink-0 z-20 relative">
        {/* LEFT: THEME SELECTOR */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mr-2 flex items-center gap-1 shrink-0">
            <Palette className="w-3 h-3" /> Thème
          </span>
          <div className="flex bg-zinc-100 p-1 rounded-lg">
            {Object.values(THEME_REGISTRY).map((theme) => (
              <button
                key={theme.key}
                onClick={() => onThemeChange(theme.key)}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap",
                  currentTheme === theme.key
                    ? "bg-white text-zinc-900 shadow-sm ring-1 ring-black/5"
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/50"
                )}
              >
                {theme.name}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: ACTIONS */}
        <div className="flex items-center gap-2 shrink-0 ml-4">
          <div className="flex items-center border border-zinc-200 rounded-md bg-white">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-none hover:bg-zinc-50"
              onClick={() => setZoom(Math.max(0.4, zoom - 0.1))}
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </Button>
            <span className="text-[10px] font-mono w-9 text-center text-zinc-500 border-x border-zinc-100 h-7 flex items-center justify-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-none hover:bg-zinc-50"
              onClick={() => setZoom(Math.min(1.5, zoom + 0.1))}
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </Button>
          </div>

          <Button
            onClick={onPrint}
            size="sm"
            disabled={isSaving}
            className="h-8 bg-zinc-900 text-white hover:bg-black font-semibold text-xs shadow-sm px-3"
          >
            {isSaving ? (
              "Export..."
            ) : (
              <>
                <Download className="w-3.5 h-3.5 mr-2" />
                PDF
              </>
            )}
          </Button>
        </div>
      </div>

      {/* PREVIEW CANVAS - SCROLL AREA */}
      {/* flex-1 et overflow-auto permettent le scroll ICI uniquement */}
      <div className="flex-1 overflow-auto bg-zinc-100/50 p-8 flex justify-center items-start">
        <div
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "top center",
            transition: "transform 0.15s ease-out",
            marginBottom: "40px", // Marge pour scroller jusqu'en bas
          }}
          className="shadow-xl ring-1 ring-black/5 bg-white shrink-0 origin-top"
        >
          {/* Composant Visible */}
          <PrintableQuote quote={activeQuote} themeName={currentTheme} />

          {/* Version Invisible pour l'impression */}
          <div style={{ display: "none" }}>
            <div ref={printRef}>
              <PrintableQuote quote={activeQuote} themeName={currentTheme} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
