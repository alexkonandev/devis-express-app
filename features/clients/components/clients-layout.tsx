// @/features/clients/components/clients-layout.tsx
import React from "react";

interface ClientsLayoutProps {
  explorer: React.ReactNode;
  inspector: React.ReactNode;
  intelligence: React.ReactNode;
}

export function ClientsLayout({
  explorer,
  inspector,
  intelligence,
}: ClientsLayoutProps) {
  return (
    <div className="flex h-[calc(100vh-2.5rem)] w-full overflow-hidden bg-white">
      {/* COL GAUCHE : EXPLORATEUR (RADAR) */}
      <aside className="w-80 shrink-0 border-r border-slate-200 flex flex-col bg-slate-50/30">
        {explorer}
      </aside>

      {/* COL CENTRALE : INSPECTEUR (FOCUS) */}
      <main className="flex-1 min-w-0 flex flex-col bg-white">{inspector}</main>

      {/* COL DROITE : INTELLIGENCE (STRATÉGIE) */}
      <aside className="w-80 shrink-0 border-l border-slate-200 flex flex-col bg-slate-50/30">
        {intelligence}
      </aside>
    </div>
  );
}
