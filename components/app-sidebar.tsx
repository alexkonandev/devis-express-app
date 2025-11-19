"use client";

import React, { useState } from "react";
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

// --- 1. IMPORT DU COMPOSANT COMMAND PALETTE ---
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
                {badge ? (
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

  // --- 2. ETAT POUR LA MODALE DE RECHERCHE ---
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  const checkActive = (path: string) => pathname.startsWith(path);

  return (
    <>
      {/* --- 3. INJECTION DE LA MODALE (Invisible par défaut) --- */}
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

        {/* 1. HEADER & TEAM */}
        <div
          className={`p-4 flex items-center ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <Link
              href="/"
              className="h-10 w-10 shrink-0 bg-neutral-900 rounded-xl flex items-center justify-center text-white font-bold font-mono shadow-lg shadow-neutral-500/20 cursor-pointer hover:bg-black transition-colors"
            >
              DE
            </Link>
            {!isCollapsed && (
              <div className="flex flex-col animate-in fade-in duration-300">
                <span className="text-sm font-bold text-neutral-900 truncate">
                  Devis Express
                </span>
                <span className="text-[10px] text-neutral-500 truncate">
                  Plan Gratuit
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 2. SEARCH BAR CONNECTÉE */}
        <div className="px-4 mb-4">
          {isCollapsed ? (
            <button
              onClick={() => setIsCommandOpen(true)} // <-- ACTION
              className="w-full h-10 flex items-center justify-center rounded-lg hover:bg-neutral-200/50 text-neutral-500 transition-colors"
              title="Rechercher (Ctrl+K)"
            >
              <Search className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => setIsCommandOpen(true)} // <-- ACTION
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

        {/* 3. NAVIGATION PRINCIPALE */}
        <ScrollArea className="flex-1 px-3 space-y-6">
          {/* Groupe: Application */}
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
              href="/notifications"
              icon={Bell}
              label="Notifications"
              isActive={checkActive("/notifications")}
              isCollapsed={isCollapsed}
              badge={2}
            />
          </div>

          {/* Groupe: Accès Rapide */}
          {!isCollapsed && <Separator className="my-4 bg-neutral-200/60" />}

          <div className="space-y-1">
            {!isCollapsed && (
              <div className="flex items-center justify-between px-2 mb-2 mt-2">
                <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  Accès Rapide
                </h4>
                <button className="text-neutral-400 hover:text-neutral-900 transition-colors">
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            )}

            <NavItem
              href="/mes-devis?folder=projets-2025"
              icon={Folder}
              label="Projets 2025"
              isActive={false}
              isCollapsed={isCollapsed}
            />
            <NavItem
              href="/mes-devis?folder=factures-payees"
              icon={Folder}
              label="Factures Payées"
              isActive={false}
              isCollapsed={isCollapsed}
            />
          </div>

          <div className="mt-auto"></div>
        </ScrollArea>

        {/* 4. FOOTER & PROFILE */}
        <div className="p-4 border-t border-neutral-200 bg-white/50">
          {/* Quota Widget */}
          {!isCollapsed && (
            <div className="mb-4 p-3 bg-neutral-100/50 rounded-xl border border-neutral-200/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span className="text-xs font-semibold text-neutral-900">
                    Devis Gratuits
                  </span>
                </div>
                <span className="text-[10px] font-medium text-neutral-500">
                  3/10
                </span>
              </div>
              <Progress
                value={30}
                className="h-1.5 bg-neutral-200"
                indicatorClassName="bg-neutral-900"
              />
              <Button
                variant="link"
                className="h-auto p-0 text-[10px] text-blue-600 mt-2 w-full justify-start"
              >
                Passer en illimité →
              </Button>
            </div>
          )}

          {/* Profile Menu */}
          <div
            className={`flex items-center gap-3 ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <div className="relative">
              <Avatar className="h-9 w-9 border border-neutral-200 cursor-pointer hover:ring-2 hover:ring-neutral-200 transition-all">
                <AvatarFallback className="bg-gradient-to-tr from-blue-600 to-purple-600 text-white text-xs font-bold">
                  AK
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
            </div>

            {!isCollapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-neutral-900 truncate">
                  Alex Konan
                </p>
                <p className="text-xs text-neutral-500 truncate">
                  Freelance Dev
                </p>
              </div>
            )}

            {!isCollapsed && (
              <Link href="/settings">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-neutral-400 hover:text-neutral-900"
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
