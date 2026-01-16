"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Zap,
  Loader2,
  Target,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/**
 * NOTIFICATIONS DESIGN SYSTEM (ADN INDUSTRIEL)
 */
const notify = {
  info: (msg: string) =>
    toast.custom(() => (
      <div className="bg-slate-950 border-2 border-indigo-600 p-4 flex items-center gap-3 w-[300px] shadow-2xl rounded-none">
        <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
        <p className="text-[10px] font-black uppercase text-white tracking-widest">
          {msg}
        </p>
      </div>
    )),
  error: (msg: string) =>
    toast.custom(() => (
      <div className="bg-slate-950 border-2 border-rose-600 p-4 flex items-center gap-3 w-[300px] shadow-2xl rounded-none">
        <ShieldCheck className="w-4 h-4 text-rose-600" />
        <p className="text-[10px] font-black uppercase text-white tracking-widest">
          {msg}
        </p>
      </div>
    )),
};

interface SubscriptionCardProps {
  isPro: boolean;
}

export function SubscriptionCard({ isPro }: SubscriptionCardProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const PRICE_XOF = "5.000";

  const handleUpgrade = async (): Promise<void> => {
    setLoading(true);
    notify.info("INITIALISATION PAIEMENT");
    try {
      // Simulation logique business - Prêt pour intégration Server Action
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } catch (err: unknown) {
      notify.error("ÉCHEC DE CONNEXION GATEWAY");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "relative rounded-none border transition-none h-full flex flex-col",
        isPro
          ? "border-emerald-500 bg-emerald-50/10 shadow-none"
          : "border-slate-400 bg-white shadow-[8px_8px_0px_rgba(2,6,23,1)]"
      )}
    >
      {/* BADGE D'ÉTAT */}
      <div
        className={cn(
          "absolute top-0 right-0 px-5 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] z-10",
          isPro ? "bg-emerald-500 text-white" : "bg-slate-950 text-white"
        )}
      >
        {isPro ? "Accès Pro" : "Upgrade Disponible"}
      </div>

      <div className="p-8 flex-1 flex flex-col justify-between min-h-0 overflow-hidden">
        {/* HEADER */}
        <div className="flex flex-col gap-1.5 shrink-0">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600">
            {isPro ? "Infrastructure Déployée" : "Optimisation de Flux"}
          </span>
          <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-950">
            {isPro ? "Empire / Pro Edition" : "Standard / Baseline"}
          </h2>
          <p className="text-[12px] text-slate-400 font-bold uppercase tracking-tight max-w-sm">
            {isPro
              ? "Votre environnement est configuré pour un volume illimité."
              : "Configuration de base. Débloquez les outils d'élite pour scaler."}
          </p>
        </div>

        {/* SECTION 1: SPÉCIFICATIONS TECHNIQUES */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 my-6 shrink-0">
          {[
            {
              label: "Capacité Mensuelle",
              value: isPro ? "ILLIMITÉE" : "05 DEVIS",
              icon: Target,
            },
            {
              label: "Branding Client",
              value: isPro ? "WHI-LABEL" : "BRANDÉ STUDIO",
              icon: TrendingUp,
            },
            {
              label: "Outils Signature",
              value: isPro ? "PRO-SIGN" : "NON DISPO",
              icon: BarChart3,
            },
            {
              label: "Export Data",
              value: isPro ? "RAW / PDF +" : "PDF STANDARD",
              icon: Zap,
            },
          ].map((spec, i) => (
            <div
              key={i}
              className="flex flex-col border-l-2 border-slate-100 pl-5 py-1"
            >
              <div className="flex items-center gap-2 mb-1">
                <spec.icon className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">
                  {spec.label}
                </span>
              </div>
              <span
                className={cn(
                  "text-[14px] font-black uppercase font-mono tracking-tighter",
                  isPro ? "text-emerald-600" : "text-slate-950"
                )}
              >
                {spec.value}
              </span>
            </div>
          ))}
        </div>

        {/* ZONE D'ACTION COMPACTE */}
        <div className="shrink-0 space-y-3">
          {!isPro ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between bg-slate-50 px-5 py-3 border border-slate-400 border-dashed">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">
                    Investissement Mensuel
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-xl font-black font-mono text-slate-950 leading-none">
                      {PRICE_XOF}
                    </span>
                    <span className="text-[10px] font-black text-slate-950">
                      FCFA
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black text-slate-950 uppercase tracking-tighter bg-white px-2 py-1 border border-slate-200">
                    ROI IMMÉDIAT
                  </span>
                </div>
              </div>

              <Button
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none font-black uppercase tracking-[0.2em] text-[10px] transition-none shadow-none"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Acquérir la licence Pro"
                )}
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full h-10 border-slate-950 border-2 text-slate-950 rounded-none font-black uppercase tracking-[0.2em] text-[10px] hover:bg-slate-950 hover:text-white transition-none"
            >
              Paramètres de facturation
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
