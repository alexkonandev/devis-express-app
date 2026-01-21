"use client";

import Link from "next/link";
import {
  CheckIcon,
  LayoutIcon,
  ArrowUpRightIcon,
} from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Logo } from "./ui/logo";

interface LandingPageViewProps {
  userId: string | null;
}

export default function LandingPageView({ userId }: LandingPageViewProps) {
  const mainActionLink = userId ? "/quotes/new" : "/sign-up";

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
                  Mon Espace
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
                  className="bg-indigo-600 text-white rounded-none h-9 text-[11px] font-black uppercase tracking-widest px-6 shadow-[4px_4px_0px_rgba(79,70,229,0.2)]"
                >
                  <Link href="/sign-up">S&apos;inscrire</Link>
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
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] uppercase">
            Facturation <br />
            <span className="text-slate-300">Haute Précision.</span>
          </h1>

          <div className="flex flex-col items-center gap-8">
            <p className="text-xl md:text-2xl text-slate-500 font-medium leading-tight max-w-2xl uppercase italic">
              La plateforme de gestion conçue pour les entrepreneurs ivoiriens.
              Éliminez les erreurs, accélérez vos paiements, maximisez vos
              profits.
            </p>

            <div className="flex flex-wrap justify-center gap-6 pt-4">
              <Button
                asChild
                className="h-16 px-12 text-[14px] font-black uppercase tracking-widest bg-slate-950 text-white rounded-none shadow-[6px_6px_0px_#4f46e5] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
              >
                <Link href={mainActionLink}>
                  {userId ? "Créer un devis" : "Démarrer"}
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-20 border-t border-slate-100">
            {[
              { label: "RAPIDITÉ TOTALE", desc: "Devis prêts en 1 minute" },
              { label: "CONFORME DGI", desc: "Respect des normes CI" },
              { label: "DONNÉES SÉCURISÉES", desc: "Protection bancaire" },
            ].map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="text-indigo-600 text-[12px] font-bold tracking-[0.1em]">
                  {item.label}
                </div>
                <div className="text-slate-400 text-[11px] font-medium uppercase tracking-tight">
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 3. FONCTIONNALITÉS : GRID SYSTEM --- */}
      <section className="py-24 px-6 max-w-[1400px] mx-auto border-t border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-px bg-slate-200 border border-slate-200 shadow-sm">
          {/* BLOC 1 : MOTEUR (8/12 - HAUTEUR FIXE) */}
          <div className="md:col-span-8 bg-white p-12 md:p-20 flex flex-col justify-top h-[300px]">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 leading-[0.85]">
                Moteur de calcul <br />
                temps réel
              </h2>
              <p className="text-slate-500 font-medium text-lg leading-tight uppercase max-w-xl">
                Plus qu&apos;un éditeur, une console de contrôle. Saisissez vos
                items, le système recalcule la TVA et les marges instantanément.
                Zéro erreur, 100% de rentabilité.
              </p>
            </div>
          </div>

          {/* BLOC 2 : MOBILITÉ (4/12 - HAUTEUR FIXE) */}
          <div className="md:col-span-4 bg-slate-950 p-12 md:p-20 text-white flex flex-col justify-top h-[300px]">
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-4">
                Mobilité Absolue
              </h3>
              <p className="text-slate-400 text-sm font-medium uppercase leading-relaxed italic">
                Facturez depuis un chantier, un café ou un avion.
                L&apos;interface s&apos;adapte à la vitesse de votre business.
              </p>
            </div>
          </div>

          {/* BLOC 3 : SÉCURITÉ (4/12 - HAUTEUR FIXE) */}
          <div className="md:col-span-4 bg-slate-100 p-12 md:p-20 flex flex-col justify-top h-[250px]">
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-4">
                Sécurité Chiffrée
              </h3>
              <p className="text-slate-500 text-sm font-medium uppercase leading-relaxed">
                Chiffrement de bout en bout sur serveurs sécurisés. Votre
                patrimoine client est protégé.
              </p>
            </div>
          </div>

          {/* BLOC 4 : ARCHITECTURE (8/12 - HAUTEUR FIXE) */}
          <div className="md:col-span-8 bg-[#faf9f6] p-12 md:p-20 flex flex-col justify-top h-[250px]">
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-4">
                Architecture Pro
              </h3>
              <p className="text-slate-600 text-[15px] font-medium uppercase leading-tight max-w-md">
                Générez des PDF qui forcent le respect. Une mise en page étudiée
                pour accélérer la signature.
              </p>
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
              Tarifs Clairs
            </h2>
            <p className="text-indigo-400 font-mono text-sm tracking-widest uppercase font-bold">
              Zéro frais cachés. Uniquement de la performance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="border border-slate-900 bg-slate-950/50 p-10 flex flex-col h-full opacity-60 hover:opacity-100 transition-opacity duration-300">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-600 mb-8">
                Accès Gratuit
              </span>
              <h3 className="text-2xl font-bold uppercase mb-2 text-slate-400">
                Découverte
              </h3>
              <div className="text-5xl font-black font-mono mb-10 text-slate-500">
                0 FCFA
              </div>
              <ul className="space-y-4 mb-12 flex-1">
                {[
                  "3 Documents / mois",
                  "Export Standard",
                  "Base Client Limitée",
                ].map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-3 text-[11px] font-bold uppercase text-slate-600"
                  >
                    <CheckIcon size={14} className="text-slate-700" /> {f}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                variant="outline"
                className="rounded-none border-slate-700 bg-transparent text-slate-500 uppercase text-[11px] font-black h-12 hover:bg-slate-800 hover:text-white hover:border-white transition-all"
              >
                <Link href={mainActionLink}>Démarrer</Link>
              </Button>
            </div>

            <div className="bg-indigo-600 p-10 flex flex-col relative shadow-[20px_20px_0px_rgba(79,70,229,0.1)] h-full">
              <div className="absolute -top-4 right-10 bg-white text-indigo-600 px-4 py-1 text-[10px] font-black uppercase tracking-widest">
                Conseillé
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-indigo-100 mb-8">
                Usage Illimité
              </span>
              <h3 className="text-2xl font-bold uppercase mb-2 text-white">
                Indépendant Pro
              </h3>
              <div className="text-5xl font-black font-mono mb-10 text-white">
                5.000 FCFA{" "}
                <span className="text-sm font-normal opacity-99">/ MOIS</span>
              </div>
              <ul className="space-y-4 mb-12 flex-1 text-white">
                {[
                  "Documents Illimités",
                  "Thèmes Blueprint Exclusifs",
                  "Signature Électronique",
                  "Support Prioritaire",
                ].map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-3 text-[11px] font-bold uppercase"
                  >
                    <CheckIcon size={14} weight="bold" /> {f}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className="bg-white text-indigo-600 rounded-none uppercase text-[11px] font-black h-14 hover:bg-slate-950 hover:text-white transition-none"
              >
                <Link href={mainActionLink} className="flex items-center gap-2">
                  Choisir ce plan <ArrowUpRightIcon size={16} weight="bold" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER : MINIMALIST --- */}
      <footer className="bg-slate-50 border-t border-slate-200 pt-20 px-6">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-start gap-20">
          <div className="space-y-8">
            <Logo variant="icon" className="h-8 w-8 grayscale opacity-80" />
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500 leading-relaxed max-w-xs">
              L&apos;infrastructure de facturation pour l&apos;élite
              entrepreneuriale. Vitesse absolue. Rentabilité maximale.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-24">
            <div className="flex flex-col gap-6">
              <span className="text-[13px] font-bold uppercase tracking-[0.3em] text-slate-950">
                Système
              </span>
              <div className="flex flex-col gap-4">
                <Link
                  href="/dashboard"
                  className="text-[11px] text-slate-600 font-semibold uppercase hover:text-indigo-600 transition-colors"
                >
                  Tableau de bord
                </Link>
                <Link
                  href="/contact"
                  className="text-[11px] text-slate-600 font-semibold uppercase hover:text-indigo-600 transition-colors"
                >
                  Support technique
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <span className="text-[13px] font-bold uppercase tracking-[0.3em] text-slate-950">
                Légal
              </span>
              <div className="flex flex-col gap-4">
                <Link
                  href="/terms"
                  className="text-[11px] text-slate-600 font-semibold uppercase hover:text-indigo-600 transition-colors"
                >
                  Conditions d&apos;usage
                </Link>
                <Link
                  href="/privacy"
                  className="text-[11px] text-slate-600 font-semibold uppercase hover:text-indigo-600 transition-colors"
                >
                  Confidentialité
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto mt-24 py-4 border-t border-slate-200/60 flex justify-between items-center">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
            © 2026 DEVIS_EXPRESS_STUDIO // ABIDJAN_CI
          </span>
          <div className="flex items-center gap-3 bg-slate-100 px-3 py-1 border border-slate-200">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[9px] font-bold font-mono text-slate-600 uppercase tracking-tighter">
              Système Opérationnel
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}
