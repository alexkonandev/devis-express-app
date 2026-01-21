// @/features/quotes/components/quotes-layout.tsx
import React from "react";

interface QuotesLayoutProps {
  explorer: React.ReactNode; // Le Radar (Gauche)
  inspector: React.ReactNode; // Le Focus (Centre)
  intelligence: React.ReactNode; // Le Cerveau (Droite)
}

export function QuotesLayout({
  explorer,
  inspector,
  intelligence,
}: QuotesLayoutProps) {
  return (
    <div className="flex h-[calc(100vh-2.5rem)] w-full overflow-hidden bg-white border-t border-slate-200">
      {/* 1. RADAR (380px) - DENSITÉ & FLUX */}
      <aside className="w-[380px] shrink-0 border-r border-slate-200 flex flex-col bg-slate-50/20">
        {explorer}
      </aside>

      {/* 2. FOCUS - ZONE DE TRAVAIL CHIRURGICALE */}
      <main className="flex-1 min-w-0 flex flex-col bg-white overflow-y-auto custom-scrollbar">
        {inspector}
      </main>

      {/* 3. CERVEAU (320px) - PROFIT & DÉCISION */}
      <aside className="w-80 shrink-0 border-l border-slate-200 flex flex-col bg-slate-50/30">
        {intelligence}
      </aside>
    </div>
  );
}
