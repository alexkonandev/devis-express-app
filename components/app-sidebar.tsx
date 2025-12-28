"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Users,
  Package,
  Settings,
  PlusSquare,
  FileText, // <--- NOUVEL IMPORT
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// LISTE DE NAVIGATION MISE À JOUR
const MAIN_NAV = [
  { label: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
  { label: "Mes Devis", href: "/devis", icon: FileText }, // <--- NOUVEAU LIEN
  { label: "Clients", href: "/clients", icon: Users },
  { label: "Catalogue", href: "/items", icon: Package },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <aside className="h-[calc(100vh-40px)] w-[60px] bg-white flex flex-col items-center py-4 gap-6 shrink-0 z-50 border-r border-zinc-200 text-zinc-900">
      {/* NAVIGATION PRINCIPALE */}
      <nav className="flex flex-col gap-3 w-full px-2">
        {MAIN_NAV.map((item) => {
          // Logique stricte : active si le path commence par le href,
          // sauf pour dashboard où on veut éviter que tout soit actif
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <TooltipProvider key={item.href} delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "w-full h-10 flex items-center justify-center rounded-lg transition-all duration-200 group relative",
                      isActive
                        ? "bg-zinc-100 text-zinc-900"
                        : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                    )}
                  >
                    <item.icon
                      className="w-5 h-5"
                      strokeWidth={isActive ? 2.5 : 2}
                    />

                    {/* Indicateur actif */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-indigo-600 rounded-r-full" />
                    )}
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="bg-zinc-900 text-white border-none font-medium text-xs"
                >
                  {item.label}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </nav>

      {/* ACTION CREATE */}
      <div className="w-full px-2 mt-auto pb-4 border-b border-zinc-100">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              {/* Le lien pointe vers /devis/new qui est la route logique pour créer */}
              <Link
                href="/editor"
                className="w-full h-10 flex items-center justify-center rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 transition-colors shadow-md shadow-zinc-200"
              >
                <PlusSquare className="w-5 h-5" strokeWidth={2.5} />
              </Link>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="bg-zinc-900 text-white font-bold text-xs border-none"
            >
              Nouveau Devis
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* SETTINGS & USER */}
      <div className="flex flex-col gap-4 items-center">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/settings"
                className="text-zinc-400 hover:text-zinc-900 transition-colors"
              >
                <Settings className="w-5 h-5" />
              </Link>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="bg-zinc-900 text-white border-none text-xs"
            >
              Paramètres
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => signOut(() => (window.location.href = "/"))}
                className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-transparent hover:ring-indigo-100 transition-all"
              >
                <Avatar className="w-full h-full border border-zinc-200">
                  <AvatarImage src={user?.imageUrl} />
                  <AvatarFallback className="bg-zinc-100 text-xs text-zinc-900 font-bold">
                    You
                  </AvatarFallback>
                </Avatar>
              </button>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="bg-zinc-900 text-white border-none text-xs"
            >
              <p className="font-bold">{user?.fullName}</p>
              <p className="text-[10px] text-zinc-400">Se déconnecter</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </aside>
  );
}
