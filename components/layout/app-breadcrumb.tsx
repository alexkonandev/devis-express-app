"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

const PATH_MAP: Record<string, string> = {
  dashboard: "Tableau de bord",
  clients: "Clients",
  catalog: "Catalogue",
  quotes: "Devis",
  new: "Nouveau",
  settings: "Paramètres",
  editor: "Éditeur",
  billing: "Abonnement",
};

export function AppBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1">
      <Link
        href="/dashboard"
        className="text-zinc-400 hover:text-zinc-900 transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>

      {segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join("/")}`;
        const isLast = index === segments.length - 1;

        // Priorité au dictionnaire, sinon formatage de l'ID ou du segment
        const label =
          PATH_MAP[segment] ||
          (segment.length > 15
            ? `#${segment.slice(-6).toUpperCase()}`
            : segment);

        return (
          <div key={href} className="flex items-center gap-1">
            <ChevronRight className="w-3 h-3 text-zinc-300" />
            {isLast ? (
              <span className="text-[10px] font-black uppercase tracking-wider text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                {label}
              </span>
            ) : (
              <Link
                href={href}
                className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
