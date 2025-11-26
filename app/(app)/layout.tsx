"use client";

import React from "react";
import { AppHeader } from "@/components/app-header";

interface SoftwareLayoutProps {
  children: React.ReactNode;
}

export default function SoftwareLayout({ children }: SoftwareLayoutProps) {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-neutral-50 font-sans text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* TOP BAR (Fixe en haut) */}
      <div className="flex-none z-50">
        <AppHeader />
      </div>

      {/* MAIN CONTENT (Pleine largeur) */}
      <main className="flex-1 flex flex-col min-h-0 w-full relative overflow-hidden">
        <div className="flex-1 overflow-y-auto scroll-smooth">
          {children}
        </div>
      </main>
    </div>
  );
}
