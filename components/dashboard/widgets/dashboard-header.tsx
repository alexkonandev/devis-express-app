import React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const StudioLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 select-none">
    {children}
  </span>
);

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-zinc-200 h-14 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-4">
        <h1 className="text-sm font-black tracking-tight text-zinc-900">
          DASHBOARD
        </h1>
        <div className="h-4 w-px bg-zinc-200" />
        <StudioLabel>
          {format(new Date(), "EEEE d MMMM", { locale: fr })}
        </StudioLabel>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative group">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
          <input
            placeholder="Rechercher..."
            className="h-8 w-48 pl-8 pr-3 bg-zinc-100 border-transparent rounded-sm text-xs font-bold focus:bg-white focus:border-zinc-200 focus:outline-none transition-all placeholder:text-zinc-400"
          />
        </div>
        <div className="h-4 w-px bg-zinc-200 mx-2" />
        <Link href="/devis/new">
          <Button className="h-8 bg-zinc-900 hover:bg-black text-white font-bold text-[10px] uppercase tracking-wide px-4 rounded-sm shadow-sm active:scale-95 transition-all">
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Nouveau Projet
          </Button>
        </Link>
      </div>
    </header>
  );
}
