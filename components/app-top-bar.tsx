"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image"; // Import Next.js Image
import { Search, Bell, CloudCheck } from "lucide-react";
import { AppBreadcrumb } from "@/components/layout/app-breadcrumb";

export function AppTopBar() {
  return (
    <div className="h-10 w-full border-b border-zinc-200 bg-white flex items-center justify-between px-4 shrink-0 select-none sticky top-0 z-30">
      {/* GAUCHE : Logo + Breadcrumbs Intelligent */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="shrink-0 transition-opacity hover:opacity-80 active:scale-95 flex items-center"
        >
          {/* Utilisation de Next/Image pour la performance LCP */}
          <Image
            src="/logo.png"
            alt="DevisExpress Logo"
            width={100} // Largeur intrinsèque (pour la qualité Retina)
            height={40} // Hauteur intrinsèque
            className="h-5 w-auto object-contain" // CSS force la hauteur visuelle
            priority // Chargement prioritaire car c'est le header
          />
        </Link>

        {/* Intégration du composant intelligent ici */}
        <AppBreadcrumb />
      </div>

      {/* CENTRE : Barre de recherche */}
      <div className="hidden md:flex items-center justify-center flex-1 max-w-md mx-4">
        <button className="w-full h-7 bg-zinc-50 border border-zinc-200 hover:border-zinc-300 rounded-md flex items-center px-3 gap-2 text-zinc-400 hover:bg-white transition-all group shadow-sm">
          <Search className="w-3.5 h-3.5 group-hover:text-zinc-600 transition-colors" />
          <span className="text-[10px] font-medium group-hover:text-zinc-500">
            Rechercher (Client, Devis...)
          </span>
          <kbd className="ml-auto text-[9px] font-mono bg-white px-1.5 py-0.5 rounded border border-zinc-200 text-zinc-400 group-hover:text-zinc-600">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* DROITE : Status & Notifications */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold tracking-tight">
          <CloudCheck className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">CLOUD SYNC</span>
        </div>

        <div className="w-px h-4 bg-zinc-200" />

        <button className="text-zinc-400 hover:text-zinc-900 transition-colors relative group">
          <Bell className="w-4 h-4" />
          <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-indigo-500 rounded-full border border-white group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
}
