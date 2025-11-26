"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, Settings, Search, FileText, LogOut } from "lucide-react";
import { useQuoteStore } from "@/store/quote.store";
import { SearchCommand } from "@/components/search-command";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const NavLink = ({ href, label, icon: Icon, isActive, isCta = false }: any) => (
  <Link
    href={href}
    className={`
      flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200
      ${
        isActive
          ? "bg-neutral-900 text-white shadow-sm"
          : isCta
          ? "text-neutral-900 bg-neutral-100 hover:bg-neutral-200"
          : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
      }
    `}
  >
    <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-current"}`} />
    <span className="hidden sm:inline">{label}</span>
  </Link>
);

const SearchButton = ({
  onClick,
  isOmnibox = false,
}: {
  onClick: () => void;
  isOmnibox?: boolean;
}) => {
  const searchLabel = "Rechercher (Ctrl+K)...";

  if (isOmnibox) {
    return (
      <button
        onClick={onClick}
        className="w-full h-9 bg-neutral-50 border border-neutral-200 hover:border-neutral-300 hover:bg-white text-neutral-400 rounded-lg px-3 flex items-center justify-between transition-all group"
      >
        <div className="flex items-center gap-2 text-xs font-medium">
          <Search className="w-3.5 h-3.5 group-hover:text-neutral-600" />
          <span className="group-hover:text-neutral-600">{searchLabel}</span>
        </div>
        <div className="flex items-center gap-1">
          <kbd className="hidden group-hover:inline-flex h-5 items-center gap-1 rounded border border-neutral-200 bg-neutral-100 px-1.5 font-mono text-[10px] font-medium text-neutral-500">
            ⌘K
          </kbd>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="md:hidden p-2 text-neutral-500 hover:bg-neutral-100 rounded-md"
      aria-label="Rechercher"
    >
      <Search className="w-5 h-5" />
    </button>
  );
};

export function AppHeader() {
  const pathname = usePathname();
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const { activeQuote } = useQuoteStore();

  const userName = activeQuote?.company?.name || "Alex Konan";
  const userInitials = useMemo(
    () => userName.substring(0, 2).toUpperCase(),
    [userName]
  );

  const isNewQuoteActive = pathname === "/devis/new";

  return (
    <>
      <SearchCommand open={isCommandOpen} setOpen={setIsCommandOpen} />

      <header className="h-16 bg-white/80 backdrop-blur-md border-b border-neutral-200 sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 w-full">
        {/* 1. GAUCHE : Logo + Nav */}
        <div className="flex items-center gap-6 md:gap-8">
          {/* ACTION LANDING PAGE : Le logo pointe maintenant vers la racine "/" */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
            title="Retour à l'accueil"
          >
            <span className="font-bold text-xl tracking-tight hidden md:block group-hover:opacity-80 transition-opacity">
              Devis Express
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            <NavLink
              href="/devis"
              label="Mes Devis"
              icon={FileText}
              isActive={
                pathname.startsWith("/devis") && pathname !== "/devis/new"
              }
            />
            <NavLink
              href="/devis/new"
              label="Créer Devis"
              icon={Plus}
              isActive={isNewQuoteActive}
              isCta={true}
            />
          </nav>
        </div>

        {/* 2. CENTRE : Recherche */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <SearchButton
            onClick={() => setIsCommandOpen(true)}
            isOmnibox={true}
          />
        </div>

        {/* 3. DROITE : Actions + Profil */}
        <div className="flex items-center gap-3">
          <SearchButton
            onClick={() => setIsCommandOpen(true)}
            isOmnibox={false}
          />

          <Link
            href="/settings"
            className="text-neutral-500 hover:text-neutral-900 transition-colors p-1.5 hover:bg-neutral-100 rounded-md hidden sm:block"
            title="Paramètres"
          >
            <Settings className="w-4 h-4" />
          </Link>

          <div className="h-4 w-px bg-neutral-200 hidden sm:block"></div>

          {/* Profil Compact + Déconnexion */}
          <div className="flex items-center gap-3 pl-1">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 border border-neutral-200">
                <AvatarFallback className="bg-neutral-900 text-white text-xs font-bold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden lg:flex flex-col space-y-0.5">
                <p className="text-xs font-bold leading-none text-neutral-900">
                  {userName}
                </p>
                <p className="text-[10px] leading-none text-neutral-500">
                  alex@exemple.com
                </p>
              </div>
            </div>

            <button
              onClick={() => console.log("Logout triggered")}
              className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="Se déconnecter"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
