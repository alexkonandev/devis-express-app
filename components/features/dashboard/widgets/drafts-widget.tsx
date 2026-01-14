import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { PenLine, ArrowRight } from "lucide-react";
import { QuoteStatus } from "@/types/quote";

interface DraftsWidgetProps {
  drafts: {
    id: string;
    amount: number;
    status: QuoteStatus; 
    clientName: string;
    quoteNumber: string;
    date: Date | string;
  }[];
}

export function DraftsWidget({ drafts }: DraftsWidgetProps) {
  const pendingDrafts = drafts.slice(0, 3);

  return (
    <div className="bg-white border border-zinc-200 rounded-sm flex flex-col h-full">
      <div className="px-4 py-3 border-b border-zinc-100 shrink-0 bg-zinc-50/30">
        <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">
          Brouillons en cours
        </span>
      </div>
      <div className="p-2 flex-1 overflow-auto">
        {pendingDrafts.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center mb-2">
              <PenLine className="w-4 h-4 text-zinc-300" />
            </div>
            <span className="text-xs text-zinc-400">Aucun brouillon.</span>
            <Link
              href="/devis/new"
              className="text-[10px] font-bold text-indigo-600 mt-2 hover:underline"
            >
              Créer un devis
            </Link>
          </div>
        ) : (
          <div className="space-y-1">
            {pendingDrafts.map((draft) => (
              <Link key={draft.id} href={`/devis/${draft.id}`}>
                <div className="group flex items-center justify-between p-2 hover:bg-zinc-50 rounded-sm border border-transparent hover:border-zinc-100 transition-all cursor-pointer">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-zinc-700 group-hover:text-zinc-900 truncate max-w-30">
                      {draft.clientName}
                    </span>
                    <span className="text-[9px] text-zinc-400 font-mono">
                      {draft.quoteNumber} •{" "}
                      {format(new Date(draft.date), "d MMM", { locale: fr })}
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-300 group-hover:text-zinc-900 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
