"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Plus,
  Settings,
  Search,
  LayoutDashboard,
  LogOut,
  FilePlus2,
} from "lucide-react";
// Import des hooks Clerk pour les vraies données
import { useUser, useClerk } from "@clerk/nextjs";
import { SearchCommand } from "@/components/search-command";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Composant de navigation "Style Logiciel" (Icon only)
const NavTool = ({
  href,
  label,
  icon: Icon,
  isActive,
  isPrimary = false,
}: any) => (
  <TooltipProvider delayDuration={300}>
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href={href}>
          <div
            className={`
              h-9 w-9 flex items-center justify-center rounded-md transition-all duration-200
              ${
                isActive
                  ? "bg-neutral-900 text-white shadow-md scale-105" // État Actif fort
                  : isPrimary
                  ? "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 hover:scale-105" // Action principale (Créer)
                  : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100" // Navigation standard
              }
            `}
          >
            <Icon className="w-4.5 h-4.5" strokeWidth={isActive ? 2.5 : 2} />
          </div>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs font-bold">
        {label}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const SearchButton = ({
  onClick,
  isOmnibox = false,
}: {
  onClick: () => void;
  isOmnibox?: boolean;
}) => {
  if (isOmnibox) {
    return (
      <button
        onClick={onClick}
        className="w-full h-9 bg-neutral-50/50 border border-neutral-200 hover:border-neutral-300 hover:bg-white text-neutral-400 rounded-lg px-3 flex items-center justify-between transition-all group"
      >
        <div className="flex items-center gap-2 text-xs font-medium">
          <Search className="w-3.5 h-3.5 group-hover:text-neutral-600 transition-colors" />
          <span className="group-hover:text-neutral-600 transition-colors">
            Rechercher...
          </span>
        </div>
        <kbd className="hidden group-hover:inline-flex h-5 items-center gap-1 rounded border border-neutral-200 bg-white px-1.5 font-mono text-[10px] font-bold text-neutral-500 shadow-sm">
          ⌘K
        </kbd>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="md:hidden p-2 text-neutral-500 hover:bg-neutral-100 rounded-md"
    >
      <Search className="w-5 h-5" />
    </button>
  );
};

export function AppHeader() {
  const pathname = usePathname();
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  // --- 1. INTÉGRATION CLERK (VRAIES DONNÉES) ---
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  // Données utilisateur (avec Fallback propre pendant le chargement)
  const userName =
    isLoaded && user ? user.fullName || user.username || "Utilisateur" : "...";
  const userEmail =
    isLoaded && user ? user.primaryEmailAddress?.emailAddress : "";
  const userImage = isLoaded && user ? user.imageUrl : undefined;
  const userInitials = userName.substring(0, 2).toUpperCase();

  return (
    <>
      <SearchCommand open={isCommandOpen} setOpen={setIsCommandOpen} />

      <header className="h-14 bg-white/80 backdrop-blur-md border-b border-neutral-200 sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 w-full ">
        {/* GAUCHE : Logo + Toolbar Navigation */}
        <div className="flex items-center gap-6">
            {/* ACTION LANDING PAGE : Le logo pointe maintenant vers la racine "/" */}
            <Link
              href="/"
              className="flex items-center gap-2 group"
              title="Retour à l'accueil"
            >
              <img src="/logo.png" alt="logo" className="h-6" />
            </Link>
          {/* Séparateur vertical style logiciel */}
          <div className="h-6 w-px bg-neutral-200 hidden sm:block" />

          {/* Toolbar de Navigation (Icones pures) */}
          <nav className="flex items-center gap-2">
            <NavTool
              href="/devis"
              label="Tableau de bord"
              icon={LayoutDashboard}
              isActive={pathname === "/devis"}
            />
            <NavTool
              href="/devis/new"
              label="Nouveau Devis"
              icon={FilePlus2} // Icône plus spécifique qu'un simple "Plus"
              isActive={pathname === "/devis/new"}
              isPrimary={true} // Style différent pour l'action de création
            />
          </nav>
        </div>

        {/* CENTRE : Omnibox (Barre de commande) */}
        <div className="hidden md:flex flex-1 max-w-sm mx-8 transition-all focus-within:max-w-md">
          <SearchButton
            onClick={() => setIsCommandOpen(true)}
            isOmnibox={true}
          />
        </div>

        {/* DROITE : User & Settings */}
        <div className="flex items-center gap-2">
          <SearchButton
            onClick={() => setIsCommandOpen(true)}
            isOmnibox={false}
          />

          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/settings"
                  className="text-neutral-500 hover:text-neutral-900 transition-colors p-2 hover:bg-neutral-100 rounded-md hidden sm:block"
                >
                  <Settings className="w-4.5 h-4.5" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                Paramètres
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Profil Utilisateur (Clerk Data) */}
          <div className="flex items-center gap-3 pl-2 border-l border-neutral-200 ml-2">
            <div className="flex items-center gap-3 group cursor-default">
              <div className="hidden lg:flex flex-col items-end space-y-0.5">
                <p className="text-xs font-bold leading-none text-neutral-900">
                  {userName}
                </p>
                <p className="text-[10px] leading-none text-neutral-400 font-mono">
                  {userEmail}
                </p>
              </div>
              <Avatar className="h-8 w-8 border border-neutral-200 transition-transform group-hover:scale-105">
                <AvatarImage src={userImage} />
                <AvatarFallback className="bg-neutral-100 text-neutral-700 text-xs font-bold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => signOut(() => (window.location.href = "/"))}
                    className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="text-xs text-red-500 font-bold bg-red-50 border-red-100"
                >
                  Déconnexion
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </header>
    </>
  );
}
