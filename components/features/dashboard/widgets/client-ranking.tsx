import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClientRankingProps {
  clients: {
    id: string;
    name: string;
    totalSpent: number;
    quoteCount: number; 
  }[];
}

export function ClientRanking({ clients }: ClientRankingProps) {
  return (
    <div className="bg-white border border-zinc-200 rounded-sm flex flex-col h-full">
      <div className="px-4 py-3 border-b border-zinc-100 shrink-0 bg-zinc-50/30 flex justify-between items-center">
        <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">
          Top Clients
        </span>
        <Link
          href="/clients"
          className="text-[9px] font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
        >
          Tout voir <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>
      <div className="flex-1 overflow-auto p-2">
        {clients.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-zinc-400">
            Pas de données.
          </div>
        ) : (
          <div className="space-y-1">
            {clients.map((client, i) => (
              <div
                key={client.id}
                className="flex items-center justify-between p-2 hover:bg-zinc-50 rounded-sm group transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-5 h-5 rounded-[2px] flex items-center justify-center text-[10px] font-bold font-mono",
                      i === 0
                        ? "bg-zinc-900 text-white"
                        : "bg-zinc-100 text-zinc-500"
                    )}
                  >
                    {i + 1}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-zinc-700 group-hover:text-zinc-900 truncate max-w-30">
                      {client.name}
                    </span>
                    <span className="text-[9px] text-zinc-400">
                      {client.quoteCount} devis
                    </span>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-zinc-900">
                  {new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                    maximumFractionDigits: 0,
                  }).format(client.totalSpent)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
