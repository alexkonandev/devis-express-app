"use client";

import React, { useRef, useState, MouseEvent } from "react";
import { cn } from "@/lib/utils";

interface QuoteEditorLayoutProps {
  leftSidebar?: React.ReactNode; // Devenu optionnel pour le mode Preview
  rightSidebar?: React.ReactNode; // Devenu optionnel pour le mode Preview
  bottomToolbar: React.ReactNode;
  children: React.ReactNode;
}

export const QuoteEditorLayout = ({
  leftSidebar,
  rightSidebar,
  bottomToolbar,
  children,
}: QuoteEditorLayoutProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [scrollPos, setScrollPos] = useState({ left: 0, top: 0 });

  // Détection pour l'animation
  const showLeft = !!leftSidebar;
  const showRight = !!rightSidebar;

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartPos({ x: e.pageX, y: e.pageY });
    setScrollPos({
      left: scrollContainerRef.current.scrollLeft,
      top: scrollContainerRef.current.scrollTop,
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

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="flex h-full w-full bg-[#F5F5F5] overflow-hidden font-sans text-xs antialiased select-none">
      {/* --- GAUCHE : ANIMATION TIROIR --- */}
      <aside
        className={cn(
          "bg-white border-r border-zinc-200 flex flex-col z-20 overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
          showLeft
            ? "w-[300px] opacity-100 translate-x-0"
            : "w-0 opacity-0 -translate-x-10 border-none"
        )}
      >
        {/* Wrapper fixe pour éviter l'écrasement du contenu pendant l'anim */}
        <div className="w-[300px] h-full flex flex-col">{leftSidebar}</div>
      </aside>

      {/* --- CENTRE : EXPANSION AUTOMATIQUE (flex-1) --- */}
      <div className="flex-1 relative flex flex-col min-w-0 transition-all duration-300">
        <div
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={cn(
            "flex-1 overflow-auto bg-[#F5F5F5] flex justify-center items-start outline-none mt-2",
            isDragging ? "cursor-grabbing" : "cursor-grab",
            // Scrollbar styling conservé
            "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent hover:scrollbar-thumb-zinc-300 scrollbar-thumb-rounded-full [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-zinc-300 transition-colors"
          )}
        >
          {children}
        </div>

        {/* Toolbar reste au centre absolu du conteneur central */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
          {bottomToolbar}
        </div>
      </div>

      {/* --- DROITE : ANIMATION TIROIR --- */}
      <aside
        className={cn(
          "bg-white border-l border-zinc-200 flex flex-col z-20 overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
          showRight
            ? "w-[330px] opacity-100 translate-x-0"
            : "w-0 opacity-0 translate-x-10 border-none"
        )}
      >
        <div className="w-[330px] h-full flex flex-col">{rightSidebar}</div>
      </aside>
    </div>
  );
};
