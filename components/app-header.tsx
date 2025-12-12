"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Tag,
  Search,
  Settings,
  LogOut,
  ChevronRight,
  CreditCard,
  Command,
  HelpCircle,
  PenLine,
  Sparkles,
} from "lucide-react";
import { useUser, useClerk } from "@clerk/nextjs";

// --- COMPOSANTS UI ---
import { SearchCommand } from "@/components/search-command";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button"; // Assurez-vous d'avoir ce composant
import { Separator } from "@/components/ui/separator";

// --- 1. LOGIQUE BREADCRUMBS ---
const useBreadcrumbs = () => {
  const pathname = usePathname();

  const crumbs = useMemo(() => {
    const segments = pathname.split("/").filter((p) => p !== "");
    const routeMap: Record<string, string> = {
      devis: "Tableau de bord",
      clients: "Clients",
      items: "Catalogue",
      settings: "Paramètres",
      new: "Nouveau",
      edit: "Édition",
    };

    let currentPath = "";
    return segments.map((segment) => {
      currentPath += `/${segment}`;
      const label =
        routeMap[segment] ||
        (segment.length > 8 ? `#${segment.slice(0, 6)}...` : segment);
      return { href: currentPath, label };
    });
  }, [pathname]);

  return crumbs;
};

// --- 2. NAV ITEM ---
const NavItem = ({ href, icon: Icon, label, isActive }: any) => (
  <Link href={href}>
    <div
      className={`
        relative group flex items-center justify-center h-9 w-9 rounded-lg transition-all duration-200 border
        ${
          isActive
            ? "bg-neutral-900 border-neutral-900 text-white shadow-md"
            : "bg-white border-transparent text-neutral-500 hover:border-neutral-200 hover:bg-neutral-50 hover:text-neutral-900"
        }
      `}
    >
      <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
      {isActive && (
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-neutral-900 rounded-full opacity-0" />
      )}
      <div className="absolute top-full mt-2 hidden group-hover:block z-50 whitespace-nowrap">
        <div className="bg-neutral-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg animate-in fade-in slide-in-from-top-1">
          {label}
        </div>
      </div>
    </div>
  </Link>
);

// --- 3. APP HEADER ---
export function AppHeader() {
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const breadcrumbs = useBreadcrumbs();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  const userInitials =
    isLoaded && user
      ? (user.firstName?.[0] || "") + (user.lastName?.[0] || "")
      : "??";
  const userEmail = user?.primaryEmailAddress?.emailAddress;

  return (
    <>
      <SearchCommand open={isCommandOpen} setOpen={setIsCommandOpen} />

      <header className="sticky top-0 z-40 w-full h-16 border-b border-neutral-200/80 bg-white/90 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
        <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* --- GAUCHE : LOGO & BREADCRUMBS --- */}
          <div className="flex items-center gap-4 min-w-fit">
            <Link
              href="/"
              className="flex-shrink-0 transition-transform hover:scale-105 active:scale-95"
            >
              <img
                src="/logo.png"
                alt="DevisExpress Logo"
                className="h-7 w-auto object-contain"
              />
            </Link>

           
          </div>

          {/* --- CENTRE : COCKPIT (Navigation + Action) --- */}
          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-1 p-1 bg-neutral-100/50 rounded-xl border border-neutral-200/50 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] backdrop-blur-sm">
              {/* Onglets de Consultation */}
              <NavItem
                href="/devis"
                icon={LayoutDashboard}
                label="Vue d'ensemble"
                isActive={usePathname() === "/devis"}
              />
              <NavItem
                href="/clients"
                icon={Users}
                label="Gestion Clients"
                isActive={usePathname().startsWith("/clients")}
              />
              <NavItem
                href="/items"
                icon={Tag}
                label="Catalogue Services"
                isActive={usePathname().startsWith("/items")}
              />

              {/* Séparateur Subtil */}
              <div className="w-px h-5 bg-neutral-300 mx-1 opacity-50" />

              {/* ACTION PRINCIPALE : L'ÉDITEUR */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/devis/new">
                      <div className="h-9 px-3 flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg shadow-sm hover:shadow transition-all cursor-pointer group">
                        <PenLine
                          size={14}
                          className="group-hover:rotate-12 transition-transform"
                        />
                        <span className="text-xs font-bold hidden sm:inline">
                          Éditeur
                        </span>
                      </div>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs font-bold">
                    Créer un nouveau document
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Bouton Commandes */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setIsCommandOpen(true)}
                      className="h-9 w-9 flex items-center justify-center rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-white transition-colors"
                      aria-label="Command Bar"
                    >
                      <Command className="w-4 h-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs font-mono">
                    ⌘K
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* --- DROITE : IDENTITÉ UTILISATEUR --- */}
          <div className="flex items-center justify-end min-w-fit">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-neutral-50 border border-transparent hover:border-neutral-200 transition-all group outline-none">
                  {/* Info Texte (Nom + Rôle) */}
                  <div className="hidden md:flex flex-col items-end mr-1">
                    <span className="text-xs font-bold text-neutral-900 leading-none">
                      {isLoaded ? user?.fullName : "..."}
                    </span>
                    <span className="text-[10px] text-neutral-500 font-medium leading-none mt-1 group-hover:text-blue-600 transition-colors">
                      Freelance Pro
                    </span>
                  </div>

                  {/* Avatar */}
                  <Avatar className="h-8 w-8 border border-neutral-200 group-hover:scale-105 transition-transform">
                    <AvatarImage src={user?.imageUrl} />
                    <AvatarFallback className="bg-neutral-900 text-white text-[10px] font-bold">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56" sideOffset={8}>
                <div className="px-2 py-1.5 text-xs text-neutral-500 font-mono border-b border-neutral-100 mb-1">
                  {userEmail}
                </div>

                <DropdownMenuGroup>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4 text-neutral-500" />
                      <span>Paramètres</span>
                      <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/billing">
                      <CreditCard className="mr-2 h-4 w-4 text-neutral-500" />
                      <span>Abonnement</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                  onClick={() => signOut(() => (window.location.href = "/"))}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Se déconnecter</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </>
  );
}
