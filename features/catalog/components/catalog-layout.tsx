// @/features/catalog/components/catalog-layout.tsx
import React from "react";

interface CatalogLayoutProps {
  explorer: React.ReactNode; // Inventaire & Filtres
  inspector: React.ReactNode; // Studio de l'Actif
  intelligence: React.ReactNode; // Analyse de Rentabilité
}

export function CatalogLayout({
  explorer,
  inspector,
  intelligence,
}: CatalogLayoutProps) {
  return (
    <div className="flex h-[calc(100vh-2.5rem)] w-full overflow-hidden bg-white border-t border-slate-200">
      {/* RADAR D'INVENTAIRE */}
      <aside className="w-[380px] shrink-0 border-r border-slate-200 flex flex-col bg-slate-50/20">
        {explorer}
      </aside>

      {/* ZONE DE FOCUS (ÉDITION) */}
      <main className="flex-1 min-w-0 flex flex-col bg-white overflow-y-auto custom-scrollbar">
        {inspector}
      </main>

      {/* ANALYSE & SIMULATION */}
      <aside className="w-80 shrink-0 border-l border-slate-200 flex flex-col bg-slate-50/30">
        {intelligence}
      </aside>
    </div>
  );
}
