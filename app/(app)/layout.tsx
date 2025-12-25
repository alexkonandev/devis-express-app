"use client";

import React from "react";
import { AppSidebar } from "@/components/app-sidebar"; // Assure-toi que le chemin est bon

interface SoftwareLayoutProps {
  children: React.ReactNode;
}

export default function SoftwareLayout({ children }: SoftwareLayoutProps) {
  return (
    // 1. CHANGEMENT MAJEUR : 'flex' (Row) au lieu de 'flex-col'
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-50 font-sans text-neutral-900 selection:bg-indigo-500 selection:text-white">
      {/* 2. LE RAIL LATÉRAL (Fixe à gauche) */}
      <AppSidebar />

      {/* 3. LE CONTENU PRINCIPAL (Prend toute la largeur restante) */}
      <main className="flex-1 flex flex-col h-full min-w-0 relative overflow-hidden">
        {/* Note : On garde un wrapper scrollable générique ici.
           Cependant, pour ton éditeur de devis qui a son propre scroll, 
           il prendra 100% de la hauteur de ce container.
        */}
        <div className="flex-1 h-full w-full overflow-y-auto scroll-smooth">
          {children}
        </div>
      </main>
    </div>
  );
}
