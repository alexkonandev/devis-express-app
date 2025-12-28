"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Zap,
  Check,
  X,
  Terminal,
  PenTool,
  Briefcase,
  ChevronRight,
  Star,
  ShieldCheck,
  Timer,
  MousePointerClick,
} from "lucide-react";
import { Button } from "@/components/ui/button"; // Assumes you have a Button component or use standard html button if not

// --- UI PRIMITIVES (Simulation Shadcn pour la portabilité) ---
const Badge = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
  >
    {children}
  </span>
);

const Separator = ({ className }: { className?: string }) => (
  <div className={`h-[1px] w-full bg-neutral-200 ${className}`} />
);

// --- SECTIONS ---

// 1. HEADER (Ultra Minimalist)
const Header = () => (
  <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-neutral-100">
    <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-4 min-w-fit">
        <Link
          href="/"
          className="flex-shrink-0 transition-transform hover:scale-105 active:scale-95"
        >
          <img
            src="/logo.png"
            alt="DevisExpress Logo"
            className="h-7 w-auto object-contain"
          />
        </Link>
      </div>
      <div className="flex items-center gap-6">
        <Link
          href="/login"
          className="text-sm font-medium text-neutral-500 hover:text-neutral-950 transition-colors hidden md:block"
        >
          Connexion
        </Link>
        <Link
          href="/editor"
          className="bg-neutral-950 hover:bg-neutral-800 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-all flex items-center gap-2"
        >
          Créer un devis <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  </header>
);

// 2. HERO (Impact Visuel Fort)
const Hero = () => (
  <section className="pt-32 pb-20 md:pt-48 md:pb-32 px-6 max-w-6xl mx-auto text-center relative overflow-hidden">
    {/* Background Grid Subtle */}
    <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>

    <Badge className="bg-neutral-100 text-neutral-600 border border-neutral-200 mb-8">
      <Star className="w-3 h-3 mr-1 fill-emerald-500 text-emerald-500" /> V2.0 :
      Le Standard Freelance
    </Badge>

    <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-neutral-950 mb-8 leading-[0.9]">
      FACTURATION <br className="hidden md:block" />
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400">
        INSTANTANÉE.
      </span>
    </h1>

    <p className="text-xl md:text-2xl text-neutral-500 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
      Arrêtez de perdre des heures sur Excel. <br />
      Créez des devis qui{" "}
      <span className="text-neutral-950 underline decoration-emerald-500 underline-offset-4 decoration-2">
        signent tout seuls
      </span>
      .
    </p>

    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
      <Link
        href="/devis/new"
        className="w-full md:w-auto h-14 px-8 rounded-full bg-neutral-950 text-white font-semibold text-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-2xl shadow-neutral-950/20"
      >
        <Zap className="w-5 h-5 fill-white" /> Créer mon premier devis
      </Link>
      <Link
        href="#demo"
        className="w-full md:w-auto h-14 px-8 rounded-full bg-white text-neutral-950 border border-neutral-300 font-semibold text-lg flex items-center justify-center hover:bg-neutral-50 transition-colors"
      >
        Voir la démo
      </Link>
    </div>

    {/* Abstract UI Preview */}
    <div className="mt-20 p-2 rounded-2xl bg-neutral-100/50 border border-neutral-200 mx-auto max-w-4xl shadow-2xl">
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden aspect-[16/9] relative group">
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-50/50">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-lg border border-neutral-100 flex items-center justify-center mx-auto">
              <Zap className="w-8 h-8 text-emerald-500" />
            </div>
            <p className="text-neutral-400 font-medium">
              Interface de Facturation V2
            </p>
          </div>
        </div>
        {/* Overlay Hover */}
        <div className="absolute inset-0 bg-neutral-950/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
          <span className="bg-neutral-950 text-white px-4 py-2 rounded-full text-sm font-bold">
            Essayer maintenant
          </span>
        </div>
      </div>
    </div>
  </section>
);

// 3. COMPARISON (Dark Mode Immersion)
const Comparison = () => (
  <section className="bg-neutral-950 text-white py-24 px-6">
    <div className="max-w-6xl mx-auto">
      <div className="mb-16 md:text-center max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
          Le Choc des Méthodes.
        </h2>
        <p className="text-neutral-400 text-lg">
          Pourquoi continuer à creuser avec une cuillère quand vous avez une
          pelleteuse ?
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* OLD WAY */}
        <div className="space-y-8 opacity-50 hover:opacity-100 transition-opacity duration-500">
          <h3 className="text-xl font-bold text-neutral-500 border-b border-neutral-800 pb-4">
            L'Enfer (Excel/Word)
          </h3>
          <ul className="space-y-6">
            <li className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-red-900/30 flex items-center justify-center shrink-0 text-red-500">
                <X className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-red-400">Mise en page instable</p>
                <p className="text-sm text-neutral-500">
                  Une touche et tout explose. Vous passez 20min à réaligner des
                  cellules.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-red-900/30 flex items-center justify-center shrink-0 text-red-500">
                <X className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-red-400">Risque Juridique</p>
                <p className="text-sm text-neutral-500">
                  Erreur de TVA ? Oubli du SIRET ? C'est une amende potentielle.
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-red-900/30 flex items-center justify-center shrink-0 text-red-500">
                <X className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-red-400">Image "Amateur"</p>
                <p className="text-sm text-neutral-500">
                  Envoyer un Excel converti en PDF crie "Débutant".
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* NEW WAY */}
        <div className="bg-neutral-900 rounded-3xl p-8 border border-neutral-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>

          <h3 className="text-xl font-bold text-emerald-400 border-b border-emerald-500/20 pb-4 mb-8 flex items-center gap-2">
            <Zap className="w-5 h-5" /> La Méthode Devis Express
          </h3>

          <ul className="space-y-6 relative z-10">
            <li className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white">Design Bloqué & Pro</p>
                <p className="text-sm text-neutral-400">
                  Impossible de rater la mise en page. C'est propre, tout le
                  temps.
                </p>
              </div>
            </li>
            <li className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white">Sécurité Juridique</p>
                <p className="text-sm text-neutral-400">
                  Calculs automatisés. Mentions légales obligatoires incluses.
                </p>
              </div>
            </li>
            <li className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white">Justifiez vos Tarifs</p>
                <p className="text-sm text-neutral-400">
                  Un devis premium prépare psychologiquement le client à payer
                  plus cher.
                </p>
              </div>
            </li>
          </ul>

          <div className="mt-8 pt-6 border-t border-neutral-800">
            <Link
              href="/devis/new"
              className="block w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-center rounded-xl font-bold text-white transition-colors"
            >
              Passer dans la cour des grands
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// 4. PERSONAS (Grid Minimaliste)
const Personas = () => (
  <section className="py-24 px-6 max-w-6xl mx-auto">
    <div className="grid md:grid-cols-3 gap-8">
      {[
        {
          icon: Terminal,
          label: "Développeurs",
          quote: "Vous écrivez du code propre.",
          sub: "Pourquoi vos factures seraient sales ?",
        },
        {
          icon: PenTool,
          label: "Designers",
          quote: "Le devis est la 1ère UX.",
          sub: "Ne ratez pas l'onboarding de votre client.",
        },
        {
          icon: Briefcase,
          label: "Consultants",
          quote: "Vendez de la vitesse.",
          sub: "Facturez pendant que le client est chaud.",
        },
      ].map((p, i) => (
        <div
          key={i}
          className="group p-8 rounded-2xl border border-neutral-100 bg-neutral-50 hover:bg-white hover:border-neutral-200 hover:shadow-xl transition-all duration-300 cursor-default"
        >
          <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <p.icon className="w-6 h-6 text-neutral-900" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-2">
            {p.label}
          </h3>
          <p className="text-xl font-bold text-neutral-900 mb-2">"{p.quote}"</p>
          <p className="text-neutral-500">{p.sub}</p>
        </div>
      ))}
    </div>
  </section>
);

// 5. PRICING (L'Ancre de Prix)
const Pricing = () => (
  <section
    id="pricing"
    className="py-24 px-6 bg-neutral-50 border-y border-neutral-200"
  >
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-black text-neutral-950 mb-4">
          Investissement Rentable
        </h2>
        <p className="text-neutral-500">
          Un seul devis signé couvre 10 ans d'abonnement.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-stretch">
        {/* FREE */}
        <div className="p-8 rounded-3xl bg-white border border-neutral-200 text-neutral-500 flex flex-col">
          <div className="mb-4">
            <span className="text-sm font-bold uppercase tracking-wider">
              Découverte
            </span>
          </div>
          <div className="mb-8">
            <span className="text-6xl font-black text-neutral-900 tracking-tighter">
              0€
            </span>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3">
              <Check className="w-4 h-4 text-neutral-900" /> Devis illimités
            </li>
            <li className="flex items-center gap-3">
              <Check className="w-4 h-4 text-neutral-900" /> 3 Clients max
            </li>
            <li className="flex items-center gap-3">
              <Check className="w-4 h-4 text-neutral-900" /> Export PDF Standard
            </li>
            <li className="flex items-center gap-3 opacity-50">
              <X className="w-4 h-4" /> Pas de sauvegarde Cloud
            </li>
          </ul>
          <Link
            href="/devis/new"
            className="block w-full py-3 rounded-xl border border-neutral-200 text-neutral-900 font-bold text-center hover:bg-neutral-50 transition-colors"
          >
            Tester gratuitement
          </Link>
        </div>

        {/* PRO - FOCUS */}
        <div className="p-8 rounded-3xl bg-neutral-950 text-white shadow-2xl scale-105 relative flex flex-col">
          <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl">
            POPULAIRE
          </div>
          <div className="mb-4">
            <span className="text-sm font-bold uppercase tracking-wider text-emerald-400">
              Pro Freelance
            </span>
          </div>
          <div className="mb-8 flex items-baseline gap-1">
            <span className="text-6xl font-black tracking-tighter">9€</span>
            <span className="text-neutral-500 font-medium">/mois</span>
          </div>
          <p className="text-sm text-neutral-400 mb-8 border-l-2 border-emerald-500 pl-4">
            Rentabilisé dès la première 30min économisée.
          </p>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3">
              <Check className="w-4 h-4 text-emerald-400" />{" "}
              <strong>Clients Illimités</strong>
            </li>
            <li className="flex items-center gap-3">
              <Check className="w-4 h-4 text-emerald-400" />{" "}
              <strong>Export PDF HD</strong> (Pro)
            </li>
            <li className="flex items-center gap-3">
              <Check className="w-4 h-4 text-emerald-400" /> Sauvegarde &
              Historique
            </li>
            <li className="flex items-center gap-3">
              <Check className="w-4 h-4 text-emerald-400" /> Auto-completion
              intelligente
            </li>
          </ul>
          <Link
            href="/sign-up"
            className="block w-full py-4 rounded-xl bg-emerald-600 text-white font-bold text-center hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-900/20"
          >
            Passer Pro (9€/mois)
          </Link>
          <p className="text-xs text-center text-neutral-500 mt-4">
            Sans engagement. Annulation en 1 clic.
          </p>
        </div>
      </div>
    </div>
  </section>
);

// 6. FAQ (Accordion Style Simple)
const FAQ = () => (
  <section className="py-24 px-6 max-w-3xl mx-auto">
    <h2 className="text-2xl font-bold text-neutral-950 mb-8">
      Questions de Rentabilité
    </h2>
    <div className="space-y-4">
      {[
        {
          q: "Pourquoi 9€ quand Excel est gratuit ?",
          a: "Parce que votre temps vaut de l'argent. À 50€/h, si vous passez 1h à vous battre avec Excel, vous avez perdu 50€. Devis Express coûte 9€ et vous rend cette heure.",
        },
        {
          q: "Puis-je récupérer mes données ?",
          a: "Oui. Tous vos devis sont exportables en PDF. Vous restez propriétaire de votre base client.",
        },
        {
          q: "Est-ce conforme pour la France ?",
          a: "100%. TVA, SIRET, Mentions obligatoires, Totaux HT/TTC. Tout est calibré pour l'administration française.",
        },
      ].map((item, i) => (
        <div
          key={i}
          className="border border-neutral-200 rounded-lg p-6 hover:border-neutral-950 transition-colors"
        >
          <h4 className="font-bold text-neutral-900 mb-2 flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-emerald-600" /> {item.q}
          </h4>
          <p className="text-neutral-500 text-sm ml-6">{item.a}</p>
        </div>
      ))}
    </div>
  </section>
);

// 7. FOOTER
const Footer = () => (
  <footer className="bg-neutral-950 text-neutral-500 py-12 px-6 border-t border-neutral-900">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-neutral-800 rounded flex items-center justify-center text-white text-[10px]">
          DE
        </div>
        <span className="text-neutral-300 font-bold">Devis Express</span>
      </div>
      <div className="flex gap-6 text-sm">
        <Link href="#" className="hover:text-white transition-colors">
          Mentions Légales
        </Link>
        <Link href="#" className="hover:text-white transition-colors">
          CGV
        </Link>
        <Link href="#" className="hover:text-white transition-colors">
          Contact
        </Link>
      </div>
      <p className="text-xs">© 2025. Construit pour le profit.</p>
    </div>
  </footer>
);

export default function LandingPageV2() {
  return (
    <main className="bg-white min-h-screen selection:bg-emerald-500 selection:text-white font-sans">
      <Header />
      <Hero />
      <Separator />
      <Personas />
      <Comparison />
      <Pricing />
      <FAQ />
      <Footer />
    </main>
  );
}
