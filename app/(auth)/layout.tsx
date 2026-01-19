import React from "react";
import Link from "next/link";
import { CheckCircle2, TrendingUp, Lock, ArrowRight } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-white font-sans text-slate-950 overflow-hidden">
      {/* 1. COLONNE GAUCHE : SAS D'ACTION (VIDE) */}
      <div className="w-full lg:w-1/2 h-full flex flex-col relative bg-white">
        <div className="lg:hidden p-6 border-b border-slate-50">
          <Link href="/">
            <Logo variant="icon" className="h-10 w-10" />
          </Link>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center px-6">
          <div className="w-full max-w-[360px]">{children}</div>
        </div>

        <div className="p-8">
          <div className="flex items-center gap-2 opacity-10 grayscale">
            <Lock size={12} />
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest">
              Auth_Gateway_v3
            </span>
          </div>
        </div>
      </div>

      {/* 2. COLONNE DROITE : HUB DE MARQUE (TEXTES CENTRÉS, LOGO DÉCALÉ) */}
      <div className="hidden lg:flex lg:w-1/2 h-full bg-slate-50 relative flex-col justify-center p-20 overflow-hidden border-l-2 border-slate-100">
        {/* Background Blueprint */}
        <div className="absolute inset-0 opacity-[0.4] bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] [background-size:40px_40px]" />

        {/* LOGO DÉCALÉ EN HAUT À DROITE */}
        <div className="absolute top-12 right-12 z-20">
          <Link href="/">
            <Logo variant="full" className="h-8" />
          </Link>
          <div className="mt-2 flex justify-end">
            <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-[0.2em]">
              Système_Certifié
            </span>
          </div>
        </div>

        {/* BLOC TEXTE ET METRICS : Centré verticalement pour l'impact */}
        <div className="relative z-10 space-y-16">
          <div className="space-y-6">
            <div className="h-1.5 w-16 bg-indigo-600 mb-8" />
            <h2 className="text-[56px] font-black leading-[0.85] tracking-tighter uppercase text-slate-950">
              Arrêtez Le
              <br />
              <span className="text-indigo-600">Bricolage.</span>
            </h2>
            <p className="text-[16px] text-slate-600 leading-tight font-medium uppercase max-w-sm">
              DevisExpress n&apos;est pas un outil de facturation. C&apos;est
              une structure de profit pour bâtisseurs.
            </p>
          </div>

          <div className="grid gap-4 max-w-md">
            {[
              {
                label: "ROI_Immédiat",
                desc: "Optimisation du cycle de cashflow",
                icon: TrendingUp,
              },
              {
                label: "Cloud_Sync",
                desc: "Données souveraines et isolées",
                icon: CheckCircle2,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white border-2 border-slate-200 p-6 flex items-start gap-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.03)]"
              >
                <div className="p-2 bg-slate-50 border border-slate-100">
                  <item.icon className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="space-y-1">
                  <div className="text-[11px] font-black uppercase tracking-widest text-slate-950 flex items-center gap-2">
                    {item.label}{" "}
                    <ArrowRight size={10} className="text-indigo-600" />
                  </div>
                  <p className="text-[12px] font-medium text-slate-500 uppercase">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Discret */}
        <div className="absolute bottom-12 left-20 right-20 flex justify-between items-center opacity-40">
          <div className="h-[1px] flex-1 bg-slate-200 mr-8" />
          <span className="text-[9px] font-mono font-bold uppercase text-slate-400 tracking-tighter whitespace-nowrap">
            Infrastucture_Abidjan_2026
          </span>
        </div>
      </div>
    </div>
  );
}
