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
    /* On garde h-screen ici pour fixer la structure globale */
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-white font-sans text-zinc-900">
      {/* 1. TOPBAR */}
      <div
        style={{ height: TOPBAR_HEIGHT }}
        className="w-full shrink-0 z-50 border-b border-zinc-100"
      >
        <AppTopBar />
      </div>

      {/* 2. BODY */}
      <div className="flex flex-1 w-full overflow-hidden">
        {/* SIDEBAR : Fixe à gauche */}
        <aside className="h-full shrink-0 border-r border-zinc-100">
          <AppSidebar />
        </aside>

        {/* CONTENU PRINCIPAL : LA CLÉ EST ICI */}
        {/* On remplace overflow-hidden par overflow-y-auto */}
        <main className="flex-1 relative overflow-y-auto bg-zinc-50/50 scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  );
}
