"use client";

import React from "react";
import { AppSidebar } from "@/components/app-sidebar";

interface SoftwareLayoutProps {
  children: React.ReactNode;
}

export default function SoftwareLayout({ children }: SoftwareLayoutProps) {
  return (
    /**
     * CONTAINER PRINCIPAL
     * h-screen : Force la hauteur à 100% du viewport
     * overflow-hidden : Empêche le scroll sur le body entier (comportement app native)
     */
    <div className="flex h-screen w-screen overflow-hidden bg-neutral-50 font-sans text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* ZONE 1 : RAIL DE NAVIGATION (Fixe à gauche) */}
      <AppSidebar />

      {/* ZONE 2 : ESPACE DE TRAVAIL (Le reste de l'écran) */}
      <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
        {/* Ombre portée subtile pour séparer le rail du contenu */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-transparent shadow-[4px_0_24px_rgba(0,0,0,0.04)] z-40 pointer-events-none" />

        {/* C'est ici que les pages (page.tsx) sont injectées */}
        {children}
      </main>
    </div>
  );
}
