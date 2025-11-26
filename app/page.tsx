"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Zap,
  ShieldCheck,
  LayoutDashboard,
  FileText,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// --- COMPOSANTS UI LANDING ---

const Section = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <section className={`py-24 px-6 ${className}`}>{children}</section>;

const Container = ({ children }: { children: React.ReactNode }) => (
  <div className="max-w-6xl mx-auto w-full">{children}</div>
);

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600 mb-6 border border-neutral-200">
    {children}
  </span>
);

// --- MOCKUPS CSS (Pour la performance et le style) ---

const DashboardMockup = () => (
  <div className="relative rounded-xl bg-white border border-neutral-200 shadow-2xl shadow-neutral-200/50 overflow-hidden aspect-[16/10] group select-none">
    {/* Sidebar */}
    <div className="absolute left-0 top-0 bottom-0 w-48 bg-neutral-50 border-r border-neutral-100 p-4 hidden sm:block">
      <div className="h-6 w-6 bg-neutral-900 rounded-md mb-6" />
      <div className="space-y-2">
        <div className="h-2 w-24 bg-neutral-200 rounded-full" />
        <div className="h-2 w-32 bg-neutral-200 rounded-full" />
        <div className="h-2 w-20 bg-neutral-200 rounded-full" />
      </div>
    </div>
    {/* Header */}
    <div className="absolute top-0 left-0 sm:left-48 right-0 h-14 bg-white border-b border-neutral-100 flex items-center px-6 justify-between">
      <div className="h-2 w-32 bg-neutral-100 rounded-full" />
      <div className="flex gap-2">
        <div className="h-8 w-20 bg-neutral-900 rounded-md shadow-sm" />
      </div>
    </div>
    {/* Content */}
    <div className="absolute top-14 left-0 sm:left-48 right-0 bottom-0 bg-neutral-50/30 p-6 space-y-6">
      <div className="flex gap-4">
        <div className="h-24 flex-1 bg-white rounded-lg border border-neutral-100 shadow-sm p-4">
          <div className="h-2 w-12 bg-neutral-100 rounded-full mb-2" />
          <div className="h-6 w-24 bg-neutral-900/10 rounded-md" />
        </div>
        <div className="h-24 flex-1 bg-white rounded-lg border border-neutral-100 shadow-sm p-4">
          <div className="h-2 w-12 bg-neutral-100 rounded-full mb-2" />
          <div className="h-6 w-24 bg-neutral-900/10 rounded-md" />
        </div>
        <div className="h-24 flex-1 bg-white rounded-lg border border-neutral-100 shadow-sm p-4 hidden md:block">
          <div className="h-2 w-12 bg-neutral-100 rounded-full mb-2" />
          <div className="h-6 w-24 bg-neutral-900/10 rounded-md" />
        </div>
      </div>
      <div className="h-full bg-white rounded-lg border border-neutral-100 shadow-sm p-4 space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-neutral-100 rounded-md" />
              <div className="space-y-1">
                <div className="h-2 w-24 bg-neutral-100 rounded-full" />
                <div className="h-1.5 w-16 bg-neutral-50 rounded-full" />
              </div>
            </div>
            <div className="h-2 w-12 bg-neutral-100 rounded-full" />
          </div>
        ))}
      </div>
    </div>
    
    {/* Floating Editor Card (Overlay) */}
    <div className="absolute bottom-[-20px] right-[-20px] w-2/3 h-3/4 bg-white rounded-tl-2xl border-l border-t border-neutral-200 shadow-2xl p-6 transform transition-transform duration-700 group-hover:-translate-y-4 group-hover:-translate-x-4">
        <div className="flex justify-between items-center mb-6">
            <div className="h-4 w-32 bg-neutral-100 rounded-full" />
            <div className="h-8 w-24 bg-neutral-900 rounded-md" />
        </div>
        <div className="space-y-4">
            <div className="h-2 w-full bg-neutral-50 rounded-full" />
            <div className="h-2 w-5/6 bg-neutral-50 rounded-full" />
            <div className="h-2 w-4/6 bg-neutral-50 rounded-full" />
        </div>
        <div className="mt-8 p-4 bg-neutral-50 rounded-lg border border-neutral-100">
            <div className="flex justify-between">
                <div className="h-2 w-16 bg-neutral-200 rounded-full" />
                <div className="h-2 w-12 bg-neutral-200 rounded-full" />
            </div>
        </div>
    </div>
  </div>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">
      {/* HEADER / NAV */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <div className="w-8 h-8 bg-neutral-900 text-white rounded-lg flex items-center justify-center font-mono text-sm">
              DE
            </div>
            <span>Devis Express</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors hidden sm:block"
            >
              Se connecter
            </Link>
            <Button asChild className="bg-neutral-900 hover:bg-black text-white shadow-lg shadow-neutral-900/20">
              <Link href="/devis/new">
                Créer un devis
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-16">
        {/* HERO SECTION */}
        <Section className="pt-32 pb-20 overflow-hidden">
          <Container>
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16">
              <Badge>
                <Star className="w-3 h-3 mr-1 fill-neutral-400 text-neutral-400" />
                v2.0 Maintenant disponible
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-neutral-900 mb-8 leading-[1.1]">
                Arrêtez de perdre du temps. <br className="hidden md:block" />
                <span className="text-neutral-400">Facturez 3x plus vite.</span>
              </h1>
              <p className="text-xl text-neutral-600 max-w-2xl leading-relaxed mb-10">
                L'outil de facturation minimaliste conçu pour les freelances qui
                veulent des devis impeccables sans la complexité des logiciels
                comptables.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto h-14 px-8 text-lg bg-neutral-900 hover:bg-black text-white rounded-full shadow-xl shadow-neutral-900/20 hover:scale-105 transition-all duration-300"
                >
                  <Link href="/devis/new">
                    Créer mon premier devis
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <p className="text-xs text-neutral-400 mt-4 sm:mt-0">
                  Gratuit • Pas d'inscription requise
                </p>
              </div>
            </div>

            {/* HERO VISUAL */}
            <div className="relative mx-auto max-w-5xl">
              <div className="absolute -inset-1 bg-gradient-to-r from-neutral-200 to-neutral-100 rounded-2xl blur opacity-30" />
              <DashboardMockup />
            </div>

            {/* SOCIAL PROOF */}
            <div className="mt-20 pt-10 border-t border-neutral-100 flex flex-col items-center gap-6">
              <p className="text-sm font-medium text-neutral-400 uppercase tracking-widest">
                Ils nous font confiance
              </p>
              <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                {["Acme Corp", "Global Tech", "Studio Design", "Freelance Collective"].map((logo) => (
                  <span key={logo} className="text-xl font-bold font-mono text-neutral-800">
                    {logo}
                  </span>
                ))}
              </div>
            </div>
          </Container>
        </Section>

        {/* VALUE PILLARS */}
        <Section className="bg-neutral-50/50 border-y border-neutral-100">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-white rounded-xl border border-neutral-200 flex items-center justify-center shadow-sm">
                  <Zap className="w-6 h-6 text-neutral-900" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900">
                  Vitesse Éclair
                </h3>
                <p className="text-neutral-500 leading-relaxed">
                  Notre éditeur est conçu pour la rapidité. Pas de clics inutiles.
                  Tout se passe sur une seule page. Vos devis sont prêts en moins
                  de 2 minutes.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-white rounded-xl border border-neutral-200 flex items-center justify-center shadow-sm">
                  <ShieldCheck className="w-6 h-6 text-neutral-900" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900">
                  Professionnalisme
                </h3>
                <p className="text-neutral-500 leading-relaxed">
                  Ne laissez pas un devis amateur vous faire perdre un client.
                  Nos modèles PDF sont stricts, élégants et inspirent confiance
                  dès le premier coup d'œil.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-white rounded-xl border border-neutral-200 flex items-center justify-center shadow-sm">
                  <LayoutDashboard className="w-6 h-6 text-neutral-900" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900">
                  Suivi Simplifié
                </h3>
                <p className="text-neutral-500 leading-relaxed">
                  Gardez un œil sur votre pipeline. Sachez exactement qui a signé,
                  qui est en attente, et combien vous allez encaisser ce mois-ci.
                </p>
              </div>
            </div>
          </Container>
        </Section>

        {/* PRICING */}
        <Section>
          <Container>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Tarification Simple
              </h2>
              <p className="text-neutral-500">
                Commencez gratuitement. Payez uniquement quand vous grandissez.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* FREE */}
              <div className="p-8 rounded-2xl border border-neutral-200 bg-white hover:border-neutral-300 transition-colors">
                <div className="mb-4">
                  <span className="text-sm font-bold text-neutral-500 uppercase tracking-wider">
                    Découverte
                  </span>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-neutral-900">0€</span>
                    <span className="text-neutral-500">/mois</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-sm text-neutral-600">
                    <CheckCircle2 className="w-4 h-4 text-neutral-900" />
                    3 Devis par mois
                  </li>
                  <li className="flex items-center gap-2 text-sm text-neutral-600">
                    <CheckCircle2 className="w-4 h-4 text-neutral-900" />
                    Export PDF
                  </li>
                  <li className="flex items-center gap-2 text-sm text-neutral-600">
                    <CheckCircle2 className="w-4 h-4 text-neutral-900" />
                    Stockage local
                  </li>
                </ul>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/devis/new">Commencer</Link>
                </Button>
              </div>

              {/* PRO */}
              <div className="p-8 rounded-2xl border border-neutral-900 bg-neutral-900 text-white relative shadow-2xl shadow-neutral-900/20 transform md:-translate-y-4">
                <div className="absolute top-0 right-0 bg-white text-neutral-900 text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">
                  POPULAIRE
                </div>
                <div className="mb-4">
                  <span className="text-sm font-bold text-neutral-400 uppercase tracking-wider">
                    Freelance
                  </span>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">9€</span>
                    <span className="text-neutral-400">/mois</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-sm text-neutral-300">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    Devis illimités
                  </li>
                  <li className="flex items-center gap-2 text-sm text-neutral-300">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    Personnalisation avancée
                  </li>
                  <li className="flex items-center gap-2 text-sm text-neutral-300">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    Support prioritaire
                  </li>
                </ul>
                <Button className="w-full bg-white text-neutral-900 hover:bg-neutral-100" asChild>
                  <Link href="/devis/new">Essayer Pro</Link>
                </Button>
              </div>

              {/* ENTERPRISE */}
              <div className="p-8 rounded-2xl border border-neutral-200 bg-white hover:border-neutral-300 transition-colors">
                <div className="mb-4">
                  <span className="text-sm font-bold text-neutral-500 uppercase tracking-wider">
                    Agence
                  </span>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-neutral-900">29€</span>
                    <span className="text-neutral-500">/mois</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-sm text-neutral-600">
                    <CheckCircle2 className="w-4 h-4 text-neutral-900" />
                    Multi-utilisateurs
                  </li>
                  <li className="flex items-center gap-2 text-sm text-neutral-600">
                    <CheckCircle2 className="w-4 h-4 text-neutral-900" />
                    API Access
                  </li>
                  <li className="flex items-center gap-2 text-sm text-neutral-600">
                    <CheckCircle2 className="w-4 h-4 text-neutral-900" />
                    Marque blanche
                  </li>
                </ul>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="#">Nous contacter</Link>
                </Button>
              </div>
            </div>
          </Container>
        </Section>

        {/* FOOTER */}
        <footer className="bg-neutral-50 border-t border-neutral-200 py-12">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-2 font-bold text-lg tracking-tight mb-4">
                  <div className="w-6 h-6 bg-neutral-900 text-white rounded-md flex items-center justify-center font-mono text-xs">
                    DE
                  </div>
                  <span>Devis Express</span>
                </div>
                <p className="text-sm text-neutral-500 max-w-xs">
                  La solution de facturation préférée des freelances modernes.
                  Simple, rapide, efficace.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-sm mb-4">Produit</h4>
                <ul className="space-y-2 text-sm text-neutral-500">
                  <li><Link href="#" className="hover:text-neutral-900">Fonctionnalités</Link></li>
                  <li><Link href="#" className="hover:text-neutral-900">Tarifs</Link></li>
                  <li><Link href="#" className="hover:text-neutral-900">Mises à jour</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-sm mb-4">Légal</h4>
                <ul className="space-y-2 text-sm text-neutral-500">
                  <li><Link href="#" className="hover:text-neutral-900">Confidentialité</Link></li>
                  <li><Link href="#" className="hover:text-neutral-900">CGU</Link></li>
                  <li><Link href="#" className="hover:text-neutral-900">Mentions légales</Link></li>
                </ul>
              </div>
            </div>
            <div className="pt-8 border-t border-neutral-200 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-xs text-neutral-400">
                © {new Date().getFullYear()} Devis Express. Tous droits réservés.
              </p>
              <div className="flex gap-4">
                {/* Social icons placeholder */}
              </div>
            </div>
          </Container>
        </footer>
      </main>
    </div>
  );
}
