"use client";

import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { PenLine, ArrowRight, Clock } from "lucide-react";
import { QuoteStatus } from "@/types/quote";

// Règle #4 : Intégration Shadcn
import { Card, CardContent, CardHeader  } from "@/components/ui/card";

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

/**
 * @description DraftsWidget v3.0 - Industrial Blueprint
 * Application stricte : rounded-none, shadow-none, pure Tailwind classes.
 */
export function DraftsWidget({ drafts }: DraftsWidgetProps) {
  // Focus sur le top 3 pour maximiser la vitesse d'exécution
  const pendingDrafts = drafts.slice(0, 3);

  return (
    <Card className="bg-white border-slate-200 rounded-none flex flex-col h-full shadow-none overflow-hidden font-sans">
      {/* HEADER : Règle #4 (bg-slate-50 + Ligne de force) */}
      <CardHeader className="p-0 border-b border-slate-200 shrink-0 bg-slate-50">
        <div className="px-5 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-4 bg-slate-400" />{" "}
            {/* Ligne neutre pour brouillons */}
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
              Brouillons en cours
            </span>
          </div>
          {drafts.length > 0 && (
            <div className="bg-slate-950 text-white text-[9px] font-black h-5 px-2 flex items-center justify-center rounded-none">
              {drafts.length}
            </div>
          )}
        </div>
      </CardHeader>

      {/* BODY : Règle #2 (Zéro arrondi) + Règle #3 (Data font-mono) */}
      <CardContent className="p-0 flex-1">
        {pendingDrafts.length === 0 ? (
          <div className="h-44 flex flex-col items-center justify-center text-center p-6">
            <div className="w-12 h-12 bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 rounded-none">
              <PenLine className="w-5 h-5 text-slate-300" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
              File d&apos;attente vide
            </span>
            <Link href="/devis/new" className="w-full">
              <button className="w-full py-3 border-2 border-slate-950 text-slate-950 text-[10px] font-black uppercase tracking-widest hover:bg-slate-950 hover:text-white transition-all rounded-none">
                Créer un devis
              </button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {pendingDrafts.map((draft) => (
              <Link
                key={draft.id}
                href={`/devis/${draft.id}`}
                className="group block bg-white hover:bg-slate-50 transition-colors"
              >
                <div className="p-4 flex items-center justify-between">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[14px] font-bold text-slate-950 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">
                      {draft.clientName}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[11px] font-medium text-slate-400 uppercase">
                        {draft.quoteNumber}
                      </span>
                      <div className="w-1 h-1 bg-slate-200 rounded-full" />
                      <span className="text-[11px] font-bold text-slate-400 uppercase">
                        {format(new Date(draft.date), "dd MMM", { locale: fr })}
                      </span>
                    </div>
                  </div>

                  {/* Valeur Monétaire : Règle #3 */}
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-[13px] font-bold text-slate-950 tabular-nums">
                      {new Intl.NumberFormat("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                        maximumFractionDigits: 0,
                      }).format(draft.amount)}
                    </span>
                    <div className="w-8 h-8 flex items-center justify-center border border-slate-100 group-hover:border-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all rounded-none">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>

      {/* FOOTER : Règle #1 (bg-slate-50) */}
      {drafts.length > 3 && (
        <Link
          href="/devis?status=DRAFT"
          className="px-5 py-4 bg-slate-50 border-t border-slate-200 block hover:bg-slate-100 transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
              Voir {drafts.length - 3} autres dossiers
            </span>
            <Clock className="w-3 h-3 text-slate-300" />
          </div>
        </Link>
      )}
    </Card>
  );
}
