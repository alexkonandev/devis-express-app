import { checkSubscription } from "@/lib/subscription";
import { getApiLimitCount } from "@/lib/api-limit";
import { SubscriptionCard } from "@/components/features/billing/subscription-card";
import { UsageMetrics } from "@/components/features/billing/usage-metrics";
import { ShieldCheck, CreditCard, Terminal, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "FINANCIAL-TERMINAL | STUDIO",
};

export default async function BillingPage() {
  const isPro = await checkSubscription();
  const apiLimitCount = await getApiLimitCount();

  return (
    <div className="flex flex-col h-[calc(100vh-2.5rem)] overflow-hidden bg-white border-t border-slate-200">
      {/* HEADER MINIMALISTE */}
      <header className="shrink-0 h-14 border-b border-slate-200 bg-white px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-1 h-4 bg-slate-950" />
          <h1 className="text-[14px] font-black uppercase tracking-widest text-slate-950">
            Gestion Financière
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "w-1.5 h-1.5 rounded-full",
              isPro ? "bg-emerald-500" : "bg-amber-500"
            )}
          />
          <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">
            {isPro ? "Licence: Enterprise" : "Licence: Standard"}
          </span>
        </div>
      </header>

      {/* VIEWPORT PRINCIPAL */}
      <main className="flex-1 p-6 bg-slate-50/30 overflow-hidden flex flex-col gap-6">
        <div className="flex-1 flex flex-col h-full max-w-[1400px] mx-auto w-full gap-6">
          {/* ZONE SUPÉRIEURE : PILOTAGE (CÔTE À CÔTE) */}
          <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
            {/* GAUCHE : ABONNEMENT (7 COL) */}
            <div className="col-span-12 lg:col-span-7 flex flex-col min-h-0">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Accréditation
                </span>
              </div>
              <div className="flex-1 bg-white border border-slate-200 shadow-sm overflow-hidden">
                <SubscriptionCard isPro={isPro} />
              </div>
            </div>

            {/* DROITE : METRICS (5 COL) */}
            <div className="col-span-12 lg:col-span-5 flex flex-col min-h-0">
              <div className="flex items-center gap-2 mb-3">
                <Terminal className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Statistiques d&apos;usage
                </span>
              </div>
              <div className="flex-1 bg-white border border-slate-200 shadow-sm overflow-hidden">
                <UsageMetrics count={apiLimitCount} isPro={isPro} />
              </div>
            </div>
          </div>

          {/* ZONE INFÉRIEURE : INFRASTRUCTURE & SÉCURITÉ (PLEINE LARGEUR) */}
          <div className="shrink-0 bg-white border border-slate-200 p-5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-950 text-white">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-950">
                    Architecture de Paiement
                  </h3>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tight leading-tight">
                    Transactions sécurisées via{" "}
                    <span className="text-slate-950 underline decoration-indigo-500 underline-offset-2">
                      Lemon Squeezy
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Lock className="w-3 h-3 text-emerald-500" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  PCI-DSS Level 1
                </span>
              </div>
              <div className="h-8 w-px bg-slate-100" />
              <div className="flex flex-col text-right">
                <span className="text-[8px] font-black text-slate-300 uppercase">
                  Protocole
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-tighter text-nowrap">
                  AES-256 BIT ENCRYPTION
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER / STATUSBAR */}
      <footer className="shrink-0 h-8 bg-white border-t border-slate-200 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-[8px] font-mono text-slate-400 uppercase">
            System: Operational
          </span>
          <span className="text-[8px] font-mono text-slate-400 uppercase text-indigo-500 font-bold">
            Encrypted Connection
          </span>
        </div>
        {!isPro && (
          <span className="text-[8px] font-black text-indigo-600 uppercase tracking-[0.2em]">
            Scaling-Limit: Active
          </span>
        )}
      </footer>
    </div>
  );
}
