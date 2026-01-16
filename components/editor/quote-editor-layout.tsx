"use client";

import React, { useRef, useState, MouseEvent } from "react";
import { cn } from "@/lib/utils";

interface QuoteEditorLayoutProps {
  leftSidebar?: React.ReactNode;
  rightSidebar?: React.ReactNode;
  bottomToolbar: React.ReactNode;
  children: React.ReactNode;
  // Ajout des props de contrôle pour éviter la double enveloppe
  viewMode: "studio" | "preview";
  zoom: number;
}

export const QuoteEditorLayout = ({
  leftSidebar,
  rightSidebar,
  bottomToolbar,
  children,
  viewMode,
  zoom,
}: QuoteEditorLayoutProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [scrollPos, setScrollPos] = useState({ left: 0, top: 0 });

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    setIsDragging(true);
    setStartPos({ x: e.pageX, y: e.pageY });
    setScrollPos({
      left: scrollContainerRef.current?.scrollLeft || 0,
      top: scrollContainerRef.current?.scrollTop || 0,
    });
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - startPos.x;
    const y = e.pageY - startPos.y;
    scrollContainerRef.current.scrollLeft = scrollPos.left - x;
    scrollContainerRef.current.scrollTop = scrollPos.top - y;
  };

  return (
    <div className="flex h-full w-full bg-white overflow-hidden font-sans text-[13px] antialiased select-none">
      {/* SIDEBAR GAUCHE */}
      <aside
        className={cn(
          "bg-white border-r border-slate-200 z-20 transition-all duration-300 overflow-hidden",
          leftSidebar ? "w-[300px]" : "w-0"
        )}
      >
        <div className="w-[300px] h-full">{leftSidebar}</div>
      </aside>

      {/* CANVAS CENTRAL */}
      <main className="flex-1 relative flex flex-col min-w-0">
        <div
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          className={cn(
            "flex-1 overflow-auto flex justify-center items-start pt-12 pb-32 transition-colors duration-300",
            isDragging ? "cursor-grabbing" : "cursor-grab",
            viewMode === "preview" ? "bg-slate-200" : "bg-slate-50",
            "scrollbar-none"
          )}
        >
          {/* L'UNIQUE CONTENEUR DE LA FEUILLE A4 */}
          <div
            id="printable-content"
            className={cn(
              "bg-white border border-slate-200 shadow-sm transition-transform duration-200 origin-top",
              viewMode === "preview" && "shadow-xl border-none"
            )}
            style={{
              transform: viewMode === "studio" ? `scale(${zoom})` : undefined,
            }}
          >
            {children}
          </div>
        </div>

        {/* TOOLBAR */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50">
          {bottomToolbar}
        </div>
      </main>

      {/* SIDEBAR DROITE */}
      <aside
        className={cn(
          "bg-white border-l border-slate-200 z-20 transition-all duration-300 overflow-hidden",
          rightSidebar ? "w-[340px]" : "w-0"
        )}
      >
        <div className="w-[340px] h-full">{rightSidebar}</div>
      </aside>
    </div>
  );
};
