"use client";

import Link from "next/link";
import Image from "next/image";
import { Bell, CloudCheck } from "lucide-react";
import { AppBreadcrumb } from "@/components/layout/app-breadcrumb";

export function AppTopBar() {
  return (
    <div className="h-10 w-full border-b border-zinc-200 bg-white flex items-center justify-between px-4 shrink-0 select-none sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="shrink-0 transition-transform active:scale-95"
        >
          <Image
            src="/logo.png"
            alt="Logo"
            width={80}
            height={32}
            className="h-4 w-auto grayscale contrast-125"
            priority
          />
        </Link>
        <div className="w-px h-4 bg-zinc-200 mx-1" />
        <AppBreadcrumb />
      </div>

     

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-[9px] text-emerald-600 font-black tracking-widest">
          <CloudCheck className="w-3.5 h-3.5" />
          <span className="hidden sm:inline uppercase">Données à jour</span>
        </div>
        <button className="text-zinc-400 hover:text-zinc-900 transition-colors relative group">
          <Bell className="w-4 h-4" />
          <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-zinc-900 rounded-full border border-white group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </div>
  );
}
