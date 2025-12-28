"use client";

import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { AppTopBar } from "@/components/app-top-bar";

interface SoftwareLayoutProps {
  children: React.ReactNode;
}

export default function SoftwareLayout({ children }: SoftwareLayoutProps) {
  const TOPBAR_HEIGHT = "40px";

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-white font-sans text-zinc-900">
      {/* 1. TOPBAR : Largeur Totale (W-FULL) */}
      <div style={{ height: TOPBAR_HEIGHT }} className="w-full shrink-0 z-50">
        <AppTopBar />
      </div>

      {/* 2. BODY : Sidebar + Main */}
      <div className="flex flex-1 w-full overflow-hidden">
        {/* SIDEBAR : Sa hauteur sera automatiquement calculée par le flex-1 du parent */}
        <aside className="h-full shrink-0">
          <AppSidebar />
        </aside>

        {/* CONTENU PRINCIPAL */}
        <main className="flex-1 relative overflow-hidden bg-zinc-50/50">
          {children}
        </main>
      </div>
    </div>
  );
}
