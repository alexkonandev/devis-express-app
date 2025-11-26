"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  LogOut,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Devis",
    href: "/devis",
    icon: FileText,
  },
  {
    label: "Clients",
    href: "/clients",
    icon: Users,
  },
  {
    label: "Paramètres",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col h-full fixed left-0 top-0 z-40 hidden md:flex">
      {/* LOGO */}
      <div className="h-16 flex items-center px-6 border-b border-neutral-100">
        <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <div className="w-8 h-8 bg-neutral-900 text-white rounded-lg flex items-center justify-center font-mono text-sm">
            DE
          </div>
          <span>Devis Express</span>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-neutral-900 text-white shadow-md shadow-neutral-900/10"
                  : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* USER PROFILE */}
      <div className="p-4 border-t border-neutral-100">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer group">
          <Avatar className="w-9 h-9 border border-neutral-200">
            <AvatarFallback className="bg-neutral-100 text-neutral-600 font-bold text-xs">
              AK
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-neutral-900 truncate">
              Alex Konan
            </p>
            <p className="text-xs text-neutral-500 truncate">
              alex@devis-express.com
            </p>
          </div>
          <LogOut className="w-4 h-4 text-neutral-400 group-hover:text-red-500 transition-colors" />
        </div>
      </div>
    </aside>
  );
}
