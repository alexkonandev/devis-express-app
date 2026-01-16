"use client";

import Link from "next/link";
import {
 
  CheckIcon,
  LightningIcon,
  FileTextIcon,
  DeviceMobileIcon,
  ShieldCheckIcon,

  LayoutIcon,

  ArrowUpRightIcon,
} from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Logo } from "./ui/logo";

interface LandingPageViewProps {
  userId: string | null;
}

export default function LandingPageView({ userId }: LandingPageViewProps) {
  const mainActionLink = userId ? "/dashboard" : "/sign-up";



  return (
    <main className="min-h-screen bg-white text-slate-950 font-sans selection:bg-indigo-600 selection:text-white overflow-x-hidden">
      {/* --- 1. NAVIGATION : OS STYLE --- */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-none">
            <Logo variant="full" className="h-6 w-auto" />
          </Link>

          <div className="flex items-center gap-2">
            {userId ? (
              <Button
                asChild
                className="bg-slate-950 text-white rounded-none h-9 text-[11px] font-black uppercase tracking-widest px-6"
              >
                <Link href="/dashboard" className="flex items-center gap-2">
                  <LayoutIcon size={16} weight="bold" />
                  Terminal_Dashboard
                </Link>
              </Button>
            ) : (
              <>
                <Button
                  asChild
                  variant="ghost"
                  className="rounded-none text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-950"
                >
                  <Link href="/sign-in">Connexion</Link>
                </Button>
                <Button
                  asChild
                  className="bg-indigo-600 text-white rounded-none h-9 text-[11px] font-black uppercase tracking-widest px-6"
                >
                  <Link href="/sign-up">Start_Engine</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* --- 2. HERO : THE BLUEPRINT --- */}
      {/* --- 2. SECTION HÉRO : IMPACT MAXIMAL --- */}
      <section className="py-32 px-6 max-w-[1400px] mx-auto flex flex-col items-center text-center">
        <div className="max-w-4xl space-y-10">
        

          <h1 className="text-6xl md:text-[120px] font-black tracking-tighter leading-[0.8] uppercase">
            Facturation <br />
            <span className="text-slate-200">Sans Compromis.</span>
          </h1>

          <div className="flex flex-col items-center gap-8">
            <p className="text-xl md:text-2xl text-slate-500 font-medium leading-tight max-w-2xl uppercase italic">
              L'outil de contrôle conçu pour l'élite des entrepreneurs
              ivoiriens. Précision chirurgicale. Conformité totale. Profit
              optimisé.
            </p>

            <div className="flex flex-wrap justify-center gap-6 pt-4">
              <Button
                asChild
                className="h-16 px-12 text-[13px] font-black uppercase tracking-widest bg-slate-950 text-white rounded-none shadow-[6px_6px_0px_#4f46e5] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
              >
                <Link href={mainActionLink}>
                  {userId ? "Accéder au Terminal" : "Déployer le Système"}
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-20 border-t border-slate-100">
            {[
              { label: "LATENCE_ZÉRO", desc: "Calculs instantanés" },
              { label: "STANDARD_DGI", desc: "100% Conforme CI" },
              { label: "FLUX_SÉCURISÉ", desc: "Chiffrement AES-256" },
            ].map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="text-indigo-600 text-[11px] font-black tracking-widest">
                  {item.label}
                </div>
                <div className="text-slate-400 text-[10px] font-bold uppercase tracking-tight">
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 3. FONCTIONNALITÉS : GRID SYSTEM --- */}
      <section className="py-24 px-6 max-w-[1400px] mx-auto border-t border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-px bg-slate-200 border border-slate-200">
          <div className="md:col-span-8 bg-white p-12">
            <LightningIcon
              size={32}
              weight="fill"
              className="text-indigo-600 mb-8"
            />
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-6">
              Moteur de calcul temps réel
            </h2>
            <p className="text-slate-500 font-medium text-lg leading-tight uppercase max-w-xl">
              Plus qu'un éditeur, une console de contrôle. Saisissez vos items,
              le système recalcule la TVA et les marges instantanément. Zéro
              erreur, 100% de rentabilité.
            </p>
          </div>

          <div className="md:col-span-4 bg-slate-950 p-12 text-white">
            <DeviceMobileIcon
              size={32}
              weight="bold"
              className="text-indigo-500 mb-8"
            />
            <h3 className="text-xl font-black uppercase tracking-tight mb-4 text-white">
              Mobilité_Absolue
            </h3>
            <p className="text-slate-400 text-sm font-medium uppercase leading-tight">
              Facturez depuis un chantier, un café ou un avion. L'interface
              s'adapte à la vitesse de votre business.
            </p>
          </div>

          <div className="md:col-span-4 bg-white p-12">
            <ShieldCheckIcon
              size={32}
              weight="bold"
              className="text-slate-900 mb-8"
            />
            <h3 className="text-xl font-black uppercase tracking-tight mb-4">
              Sécurité_Chiffrée
            </h3>
            <p className="text-slate-500 text-sm font-medium uppercase">
              Chiffrement de bout en bout sur serveurs sécurisés. Votre
              patrimoine client est protégé.
            </p>
          </div>

          <div className="md:col-span-8 bg-slate-50 p-12">
            <div className="flex gap-10">
              <div className="flex-1">
                <h3 className="text-xl font-black uppercase tracking-tight mb-4">
                  Architecture_Pro
                </h3>
                <p className="text-slate-500 text-sm font-medium uppercase">
                  Générez des PDF qui forcent le respect. Une mise en page
                  étudiée pour accélérer la signature.
                </p>
              </div>
              <FileTextIcon
                size={48}
                weight="thin"
                className="text-slate-200"
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- 4. PRICING : PURE ROI --- */}
      <section
        id="tarifs"
        className="py-32 px-6 bg-slate-950 text-white overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <span className="text-[300px] font-black leading-none select-none tracking-tighter">
            ROI
          </span>
        </div>

        <div className="max-w-[1000px] mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">
              Tarification_Directe
            </h2>
            <p className="text-indigo-400 font-mono text-sm tracking-widest uppercase font-bold">
              Zéro frais cachés. Uniquement de la performance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Free */}
            <div className="border border-slate-800 p-10 flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-8">
                ENTRY_LEVEL
              </span>
              <h3 className="text-2xl font-black uppercase mb-2">Découverte</h3>
              <div className="text-5xl font-black font-mono mb-10">0 FCFA</div>
              <ul className="space-y-4 mb-12 flex-1">
                {[
                  "3 Documents / mois",
                  "Export Standard",
                  "Base Client Limitée",
                ].map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-3 text-[11px] font-bold uppercase text-slate-400"
                  >
                    <CheckIcon size={14} className="text-indigo-500" /> {f}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                variant="outline"
                className="rounded-none border-slate-700 text-white uppercase text-[11px] font-black h-12 hover:bg-white hover:text-slate-950 transition-none"
              >
                <Link href={mainActionLink}>Get_Started</Link>
              </Button>
            </div>

            {/* Pro */}
            <div className="bg-indigo-600 p-10 flex flex-col relative shadow-[20px_20px_0px_rgba(79,70,229,0.1)]">
              <div className="absolute -top-4 right-10 bg-white text-indigo-600 px-4 py-1 text-[10px] font-black uppercase tracking-widest">
                RECOMMENDED
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-200 mb-8">
                POWER_USER
              </span>
              <h3 className="text-2xl font-black uppercase mb-2">
                Indépendant Pro
              </h3>
              <div className="text-5xl font-black font-mono mb-10 text-white">
                5.000 FCFA{" "}
                <span className="text-sm font-normal opacity-60">/MO</span>
              </div>
              <ul className="space-y-4 mb-12 flex-1 text-white">
                {[
                  "Documents Illimités",
                  "Thèmes Blueprint Exclusifs",
                  "Signature Électronique",
                  "Support Prioritaire 24/7",
                ].map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-3 text-[11px] font-black uppercase"
                  >
                    <CheckIcon size={14} weight="bold" /> {f}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className="bg-white text-indigo-600 rounded-none uppercase text-[11px] font-black h-14 hover:bg-slate-950 hover:text-white transition-none"
              >
                <Link href={mainActionLink}>
                  Upgrade_Now{" "}
                  <ArrowUpRightIcon size={16} className="ml-2" weight="bold" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER : MINIMALIST --- */}
      <footer className="bg-white border-t border-slate-200 py-20 px-6">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-start gap-20">
          <div className="space-y-6">
            <Logo variant="icon" className="h-10 w-10" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-relaxed max-w-xs">
              L'infrastructure de facturation leader pour l'élite
              entrepreneuriale ivoirienne. Built for speed. Built for profit.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-20">
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-950">
                System
              </span>
              <Link
                href="/dashboard"
                className="text-[11px] font-bold text-slate-500 uppercase hover:text-indigo-600 transition-none"
              >
                Tableau de bord
              </Link>
              <Link
                href="/contact"
                className="text-[11px] font-bold text-slate-500 uppercase hover:text-indigo-600 transition-none"
              >
                Support
              </Link>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-950">
                Légal
              </span>
              <Link
                href="/privacy"
                className="text-[11px] font-bold text-slate-500 uppercase hover:text-indigo-600 transition-none"
              >
                Confidentialité
              </Link>
              <Link
                href="/terms"
                className="text-[11px] font-bold text-slate-500 uppercase hover:text-indigo-600 transition-none"
              >
                Conditions
              </Link>
            </div>
          </div>
        </div>
        <div className="max-w-[1400px] mx-auto mt-20 pt-8 border-t border-slate-100 flex justify-between items-center">
          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">
            © 2026 DEVIS_EXPRESS_STUDIO // ABIDJAN_CI
          </span>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-emerald-500 rounded-full" />
            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">
              Operational
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}
