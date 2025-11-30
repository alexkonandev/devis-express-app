"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  Zap,
  ShieldCheck,
  LayoutTemplate,
  FileText,
  Sparkles,
  MoveRight,
  Globe,
  Lock,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// --- UI HELPERS ---

const Section = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <section className={`py-24 px-6 relative overflow-hidden ${className}`}>
    {children}
  </section>
);

const Container = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`max-w-6xl mx-auto w-full ${className}`}>{children}</div>;

// --- MOCKUP DE L'INTERFACE (Le "Héros" visuel) ---
const InterfacePreview = () => (
  <div className="relative mt-16 group">
    {/* Glow Effect derrière */}
    <div className="absolute -inset-1 bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 rounded-xl blur-xl opacity-50 group-hover:opacity-75 transition duration-1000"></div>

    {/* Fenêtre App */}
    <div className="relative rounded-xl bg-white border border-neutral-200 shadow-2xl overflow-hidden aspect-[16/10]">
      {/* Fake Browser Header */}
      <div className="h-10 bg-neutral-50 border-b border-neutral-200 flex items-center px-4 gap-2">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-neutral-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-neutral-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-neutral-300" />
        </div>
        <div className="ml-4 h-5 w-64 bg-white border border-neutral-200 rounded-md flex items-center px-2">
          <div className="w-3 h-3 bg-neutral-100 rounded-full mr-2" />
          <div className="h-1.5 w-24 bg-neutral-100 rounded-full" />
        </div>
      </div>

      {/* Fake App Interface (Sidebar + Content) */}
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-56 bg-neutral-50 border-r border-neutral-200 p-4 hidden md:block space-y-4">
          <div className="h-8 w-8 bg-neutral-900 rounded-md mb-6" />
          <div className="space-y-2">
            <div className="h-8 w-full bg-white border border-neutral-200 rounded-md shadow-sm" />
            <div className="h-8 w-full bg-neutral-100 rounded-md" />
            <div className="h-8 w-full bg-neutral-100 rounded-md" />
          </div>
        </div>
        {/* Main */}
        <div className="flex-1 bg-white p-8">
          <div className="flex justify-between mb-8">
            <div className="space-y-2">
              <div className="h-6 w-48 bg-neutral-100 rounded-md" />
              <div className="h-3 w-32 bg-neutral-50 rounded-md" />
            </div>
            <div className="h-10 w-32 bg-neutral-900 rounded-md shadow-md" />
          </div>
          {/* Table rows simulating quotes */}
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 w-full border border-neutral-100 rounded-lg flex items-center px-4 justify-between"
              >
                <div className="flex gap-4">
                  <div className="h-8 w-8 bg-neutral-100 rounded-md" />
                  <div className="space-y-1">
                    <div className="h-2 w-24 bg-neutral-200 rounded-full" />
                    <div className="h-2 w-16 bg-neutral-100 rounded-full" />
                  </div>
                </div>
                <div className="h-2 w-12 bg-neutral-100 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overlay CTA on Hover */}
      <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Button className="bg-neutral-900 text-white hover:bg-black shadow-xl scale-110">
          Accéder à la démo live
        </Button>
      </div>
    </div>
  </div>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white">
      {/* --- HEADER (Minimaliste) --- */}
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Logo */}
            <div className="relative ">
              <img src="/logo.png" alt="Logo" className="object-contain  h-7" />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Button
              asChild
              size="sm"
              className="bg-neutral-900 hover:bg-black text-white shadow-md"
            >
              <Link href="/devis/new">
                Créer un devis
                <ArrowRight className="w-3.5 h-3.5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-16">
        {/* --- HERO SECTION (Le Pitch Gratuit) --- */}
        <Section className="pt-32 pb-10">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

          <Container className="relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-medium text-neutral-600 mb-8">
              <Sparkles className="w-3 h-3" />
              <span>Outil 100% Gratuit pour Freelances</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-neutral-900 mb-6 leading-[1.1]">
              Vos devis professionnels.
              <br />
              <span className="text-neutral-400">
                Sans inscription. Sans frais.
              </span>
            </h1>

            <p className="text-xl text-neutral-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Générez des devis élégants et conformes en quelques secondes. Nous
              avons supprimé toutes les barrières : pas de compte requis, pas de
              carte bancaire.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="h-14 px-8 text-lg bg-neutral-900 hover:bg-black text-white rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
              >
                <Link href="/devis/new">
                  Commencer maintenant
                  <MoveRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-14 px-8 text-lg rounded-full border-neutral-200 bg-white hover:bg-neutral-50 w-full sm:w-auto"
              >
                <Link href="#features">Voir un exemple PDF</Link>
              </Button>
            </div>

            {/* VISUEL D'INTERFACE */}
            <div
              className="mx-auto max-w-5xl"
              onClick={() => (window.location.href = "/devis/new")}
            >
              <InterfacePreview />
            </div>
          </Container>
        </Section>

        {/* --- WHY FREE? (L'argumentaire de confiance) --- */}
        <Section className="bg-neutral-50 border-y border-neutral-100">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-6">
                  Pourquoi est-ce gratuit ?
                </h2>
                <p className="text-lg text-neutral-600 mb-6 leading-relaxed">
                  Nous croyons que les outils essentiels ne devraient pas être
                  un frein au lancement de votre activité.
                </p>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-white border border-neutral-200 flex items-center justify-center flex-shrink-0">
                      <Lock className="w-5 h-5 text-neutral-900" />
                    </div>
                    <div>
                      <h3 className="font-bold text-neutral-900">
                        Données Privées
                      </h3>
                      <p className="text-sm text-neutral-500">
                        Vos devis sont stockés localement dans votre navigateur.
                        Nous ne vendons pas vos données.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-white border border-neutral-200 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 text-neutral-900" />
                    </div>
                    <div>
                      <h3 className="font-bold text-neutral-900">
                        Modèle Freemium
                      </h3>
                      <p className="text-sm text-neutral-500">
                        Les fonctionnalités de base sont gratuites à vie. Des
                        options premium (API, équipes) arriveront plus tard.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature Grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: FileText, label: "Devis Illimités" },
                  { icon: Download, label: "Export PDF HD" },
                  { icon: LayoutTemplate, label: "Modèles Pros" },
                  { icon: ShieldCheck, label: "Mentions Légales" },
                  { icon: Globe, label: "Multi-Devises" },
                  { icon: CheckCircle2, label: "Sans Filigrane" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm flex flex-col items-center text-center hover:border-neutral-400 transition-colors"
                  >
                    <item.icon className="w-6 h-6 mb-2 text-neutral-900" />
                    <span className="text-sm font-medium text-neutral-700">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </Section>

        {/* --- CTA FINAL --- */}
        <Section>
          <Container className="text-center max-w-3xl">
            <h2 className="text-4xl font-bold tracking-tight mb-6">
              Prêt à signer votre prochain client ?
            </h2>
            <p className="text-neutral-500 mb-10 text-lg">
              Rejoignez les freelances qui gagnent du temps avec Devis Express.
              Aucune carte de crédit requise.
            </p>
            <Button
              asChild
              size="lg"
              className="h-16 px-10 text-xl bg-neutral-900 hover:bg-black text-white rounded-full shadow-2xl"
            >
              <Link href="/devis/new">Créer un devis gratuitement</Link>
            </Button>
            <p className="mt-6 text-xs text-neutral-400">
              Temps estimé : moins de 2 minutes.
            </p>
          </Container>
        </Section>

        {/* --- FOOTER --- */}
        <footer className="border-t border-neutral-100 py-10 bg-white text-center">
          <Container>
            <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
              <div className="h-6 w-6 relative grayscale">
                <Image
                  src="/logo.png"
                  alt="logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-sm">Devis Express</span>
            </div>
            <p className="text-sm text-neutral-400">
              © 2024 Devis Express. Fait avec passion pour les entrepreneurs.
            </p>
          </Container>
        </footer>
      </main>
    </div>
  );
}
