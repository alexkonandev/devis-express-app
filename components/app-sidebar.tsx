"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Settings,
  LogOut,
  LucideIcon,
  Search,
  ChevronLeft,
  ChevronRight,
  Folder,
  Plus,
  User,
  Sparkles,
  Bell,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

// 1. IMPORT DU STORE
import { useQuoteStore } from "@/store/quote.store";
import { SearchCommand } from "@/components/search-command";

// --- TYPES ---
interface NavItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  isCollapsed: boolean;
  shortcut?: string;
  badge?: number;
}

// --- COMPOSANT ITEM NAVIGATION ---
const NavItem = ({
  href,
  icon: Icon,
  label,
  isActive,
  isCollapsed,
  shortcut,
  badge,
}: NavItemProps) => {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={href}
            className={`
              flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative
              ${
                isActive
                  ? "bg-neutral-900 text-white shadow-md"
                  : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
              }
              ${isCollapsed ? "justify-center" : ""}
            `}
          >
            <Icon
              className={`h-5 w-5 shrink-0 ${
                isActive
                  ? "text-white"
                  : "text-neutral-500 group-hover:text-neutral-900"
              }`}
            />

            {!isCollapsed && (
              <span className="text-sm font-medium truncate flex-1 transition-all">
                {label}
              </span>
            )}

            {!isCollapsed && (
              <>
                {/* Badge dynamique */}
                {badge !== undefined && badge > 0 ? (
                  <span className="bg-neutral-200 text-neutral-600 text-[10px] px-1.5 py-0.5 rounded-md font-mono">
                    {badge}
                  </span>
                ) : shortcut ? (
                  <span
                    className={`text-[10px] border px-1.5 rounded py-0.5 opacity-0 group-hover:opacity-100 transition-opacity ${
                      isActive
                        ? "border-neutral-700 text-neutral-400"
                        : "border-neutral-200 text-neutral-400"
                    }`}
                  >
                    {shortcut}
                  </span>
                ) : null}
              </>
            )}

            {isCollapsed && isActive && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full bg-neutral-900" />
            )}
          </Link>
        </TooltipTrigger>
        {isCollapsed && (
          <TooltipContent
            side="right"
            className="font-medium bg-neutral-900 text-white border-none ml-2 flex items-center gap-2"
          >
            {label}{" "}
            {shortcut && (
              <span className="text-neutral-400 bg-neutral-800 px-1 rounded text-[10px]">
                {shortcut}
              </span>
            )}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

// --- COMPOSANT PRINCIPAL ---
export function AppSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  // 2. RECUPERATION DES DONNÉES RÉELLES
  const { quotes, userFolders, activeQuote, createFolder } = useQuoteStore();

  // 3. CALCULS DYNAMIQUES
  const draftCount = useMemo(() => quotes.filter(q => q.meta.status === 'draft').length, [quotes]);
  const usageCount = quotes.length;
  const usageLimit = 10; // Limite arbitraire pour l'exemple "Freemium"
  const usagePercent = Math.min((usageCount / usageLimit) * 100, 100);
  
  // Nom de l'entreprise (Fallback sur "Moi" si vide)
  const userName = activeQuote?.company?.name || "Mon Entreprise";
  const userInitials = userName.substring(0, 2).toUpperCase();

  const checkActive = (path: string) => {
      if (path === "/mes-devis" && pathname === "/mes-devis" && !window.location.search) return true;
      return pathname.startsWith(path);
  }

  return (
    <>
      <SearchCommand open={isCommandOpen} setOpen={setIsCommandOpen} />

      <aside
        className={`
            flex flex-col h-screen border-r border-neutral-200 bg-neutral-50/50 backdrop-blur-xl z-50 transition-all duration-300 ease-in-out shrink-0 relative
            ${isCollapsed ? "w-20" : "w-72"}
        `}
      >
        {/* BOUTON TOGGLE */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-8 h-6 w-6 bg-white border border-neutral-200 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-900 hover:scale-110 transition-all shadow-sm z-50"
        >
          {isCollapsed ? (
            <ChevronRight className="w-3 h-3" />
          ) : (
            <ChevronLeft className="w-3 h-3" />
          )}
        </button>

        {/* HEADER */}
        <div
          className={`p-4 flex items-center ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          <Link href="/" className="flex items-center gap-3 overflow-hidden group">
            <div className="h-10 w-10 shrink-0 bg-neutral-900 rounded-xl flex items-center justify-center text-white font-bold font-mono shadow-lg shadow-neutral-500/20 cursor-pointer group-hover:bg-black transition-colors">
              DE
            </div>
            {!isCollapsed && (
              <div className="flex flex-col animate-in fade-in duration-300">
                <span className="font-bold text-neutral-900 truncate">
                  Devis Express
                </span>
                <span className="text-[10px] text-neutral-500 truncate bg-neutral-200/50 px-1.5 rounded-sm w-fit">
                  v1.0.0
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* SEARCH */}
        <div className="px-4 mb-4">
          {isCollapsed ? (
            <button
              onClick={() => setIsCommandOpen(true)}
              className="w-full h-10 flex items-center justify-center rounded-lg hover:bg-neutral-200/50 text-neutral-500 transition-colors"
              title="Rechercher (Ctrl+K)"
            >
              <Search className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => setIsCommandOpen(true)}
              className="w-full h-9 bg-white border border-neutral-200 rounded-lg px-3 flex items-center justify-between text-neutral-400 hover:border-neutral-300 hover:text-neutral-600 transition-all shadow-sm group"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                <span className="text-sm">Rechercher...</span>
              </div>
              <kbd className="hidden group-hover:inline-flex h-5 items-center gap-1 rounded border border-neutral-200 bg-neutral-100 px-1.5 font-mono text-[10px] font-medium text-neutral-500 opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>
          )}
        </div>

        {/* NAVIGATION */}
        <ScrollArea className="flex-1 px-3 space-y-6">
          
          <div className="space-y-1">
            {!isCollapsed && (
              <h4 className="px-2 text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2 mt-2">
                Application
              </h4>
            )}
            <NavItem
              href="/mes-devis"
              icon={LayoutDashboard}
              label="Tableau de bord"
              isActive={checkActive("/mes-devis")}
              isCollapsed={isCollapsed}
              shortcut="D"
            />
            <NavItem
              href="/creer"
              icon={FileText}
              label="Éditeur"
              isActive={checkActive("/creer")}
              isCollapsed={isCollapsed}
              shortcut="E"
            />
            <NavItem
              href="/mes-devis?folder=brouillons" // Lien vers filtre brouillon (à gérer dans la page list)
              icon={Bell}
              label="Brouillons"
              isActive={false}
              isCollapsed={isCollapsed}
              badge={draftCount} // VRAI COMPTEUR
            />
          </div>

          {!isCollapsed && <Separator className="my-4 bg-neutral-200/60" />}

          <div className="space-y-1">
            {!isCollapsed && (
              <div className="flex items-center justify-between px-2 mb-2 mt-2">
                <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  Vos Dossiers
                </h4>
                {/* Bouton création rapide dossier */}
                <button onClick={() => createFolder("Nouveau dossier", null)} className="text-neutral-400 hover:text-neutral-900 transition-colors p-1 hover:bg-white rounded-md">
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* VRAIE LISTE DES DOSSIERS */}
            {userFolders.map(folder => (
                <NavItem
                    key={folder.id}
                    href={`/mes-devis?folder=${folder.name}`} // Lien réel vers le filtre
                    icon={Folder}
                    label={folder.name}
                    isActive={false} // À améliorer si tu veux highlighter le dossier courant
                    isCollapsed={isCollapsed}
                />
            ))}

            {userFolders.length === 0 && !isCollapsed && (
                <p className="px-2 text-[10px] text-neutral-400 italic">Aucun dossier</p>
            )}
          </div>

          <div className="mt-auto"></div>
        </ScrollArea>

        {/* FOOTER & PROFILE */}
        <div className="p-4 border-t border-neutral-200 bg-white/50">
          
          {/* VRAI WIDGET STATS */}
          {!isCollapsed && (
            <div className="mb-4 p-3 bg-neutral-100/50 rounded-xl border border-neutral-200/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span className="text-xs font-semibold text-neutral-900">
                    Utilisation
                  </span>
                </div>
                <span className="text-[10px] font-medium text-neutral-500">
                  {usageCount}/{usageLimit}
                </span>
              </div>
              <Progress
                value={usagePercent}
                className="h-1.5 bg-neutral-200"
                indicatorClassName={usagePercent >= 100 ? "bg-red-500" : "bg-neutral-900"}
              />
              <div className="mt-2 text-[10px] text-neutral-400 text-center">
                  {usageCount} devis créés
              </div>
            </div>
          )}

          {/* VRAI PROFIL (Basé sur les réglages) */}
          <div
            className={`flex items-center gap-3 ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <div className="relative group">
              <Avatar className="h-9 w-9 border border-neutral-200 cursor-pointer hover:ring-2 hover:ring-neutral-200 transition-all">
                <AvatarFallback className="bg-neutral-900 text-white text-xs font-bold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>

            {!isCollapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-neutral-900 truncate">
                  {userName}
                </p>
                <p className="text-[10px] text-neutral-500 truncate">
                  Compte Local
                </p>
              </div>
            )}

            {!isCollapsed && (
              <Link href="/settings">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-neutral-400 hover:text-neutral-900 hover:bg-white"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

// --- Utilitaires UI Locaux ---
const ScrollArea = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => <div className={`overflow-y-auto ${className}`}>{children}</div>;

const Progress = ({ value, className, indicatorClassName }: any) => (
  <div className={`w-full rounded-full overflow-hidden ${className}`}>
    <div
      className={`h-full transition-all duration-500 ${indicatorClassName}`}
      style={{ width: `${value}%` }}
    ></div>
  </div>
);