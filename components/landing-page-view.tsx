"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Check,
  Zap,
  FileText,
  Smartphone,
  ShieldCheck,
  Server,
  Lock,
} from "lucide-react";

// --- UI COMPONENTS ---

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-zinc-200 bg-white text-[11px] font-bold uppercase tracking-wider text-zinc-600">
    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
    {children}
  </span>
);

const Button = ({
  href,
  variant = "primary",
  children,
}: {
  href: string;
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}) => {
  const base =
    "inline-flex items-center justify-center h-12 px-8 rounded-lg text-sm font-bold transition-all duration-200";
  const styles = {
    primary:
      "bg-zinc-900 text-white hover:bg-black hover:scale-105 active:scale-95 shadow-xl shadow-zinc-900/10",
    secondary:
      "bg-white text-zinc-900 border border-zinc-200 hover:border-zinc-900 hover:bg-zinc-50",
  };
  return (
    <Link href={href} className={`${base} ${styles[variant]}`}>
      {children}
    </Link>
  );
};

// --- VIEW COMPONENT ---

export default function LandingPageView() {
  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900 selection:bg-black selection:text-white font-sans overflow-x-hidden">
      {/* 1. NAVBAR (Minimalist) */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-zinc-200/50">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="DE"
              width={90}
              height={30}
              className="h-5 w-auto object-contain"
              priority
            />
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/sign-in"
              className="text-xs font-bold uppercase tracking-wide text-zinc-500 hover:text-black transition-colors"
            >
              Login
            </Link>
            <Link
              href="/sign-up"
              className="bg-black text-white text-xs font-bold uppercase tracking-wide px-4 py-2 rounded hover:bg-zinc-800 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION (Split & Asymmetric) */}
      <section className="pt-32 pb-20 px-6 max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: Content */}
        <div className="max-w-xl space-y-8">
          <Badge>Early Access V2.0</Badge>{" "}
          {/* Honnêteté : C'est une V2 en accès anticipé */}
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
            FACTURATION <br />
            <span className="text-zinc-400">SANS FRICTION.</span>
          </h1>
          <p className="text-xl text-zinc-500 font-medium leading-relaxed max-w-md">
            L'architecture de facturation pensée pour l'ère digitale.
            Standardisez vos processus. Sécurisez vos revenus.
            <span className="block mt-2 text-black underline decoration-2 decoration-zinc-300 underline-offset-4">
              Conçu pour l'efficacité pure.
            </span>
          </p>
          <div className="flex flex-wrap gap-4">
            <Button href="/sign-up" variant="primary">
              Créer un compte
            </Button>
            <Button href="#demo" variant="secondary">
              Voir la Démo
            </Button>
          </div>
          {/* Remplacement des Fake Stats par des Garanties Techniques */}
          <div className="pt-8 flex flex-wrap gap-6 text-xs font-bold uppercase tracking-wider text-zinc-400">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500" /> Auto-Entrepreneur
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500" /> Sociétés (SAS/SARL)
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500" /> TVA Gérée
            </div>
          </div>
        </div>

        {/* Right: The Product (CSS Mockup with Perspective) */}
        <div className="relative h-[500px] w-full hidden lg:block perspective-1000">
          <div className="absolute inset-0 bg-gradient-to-tr from-zinc-200 to-zinc-50 rounded-3xl transform rotate-y-12 rotate-x-6 shadow-2xl border border-white/50 p-4 transition-transform duration-700 hover:rotate-y-6 hover:rotate-x-3">
            {/* Abstract Dashboard UI - Clean & Technical */}
            <div className="h-full w-full bg-white rounded-xl shadow-inner p-6 flex flex-col gap-4 overflow-hidden relative">
              {/* Header UI */}
              <div className="flex justify-between items-center border-b border-zinc-100 pb-4">
                <div className="space-y-1">
                  <div className="w-32 h-4 bg-zinc-100 rounded" />
                  <div className="w-20 h-2 bg-zinc-50 rounded" />
                </div>
                <div className="w-8 h-8 bg-zinc-900 rounded-full" />
              </div>
              {/* Body UI */}
              <div className="grid grid-cols-3 gap-4">
                <div className="h-24 bg-zinc-50 rounded-lg border border-zinc-100 flex items-center justify-center">
                  <Zap className="text-zinc-200 w-8 h-8" />
                </div>
                <div className="h-24 bg-zinc-50 rounded-lg border border-zinc-100" />
                <div className="h-24 bg-black rounded-lg shadow-lg flex flex-col items-center justify-center text-white">
                  <span className="text-xs opacity-50">Total</span>
                  <span className="font-bold text-lg">---,00 €</span>
                </div>
              </div>
              {/* List UI */}
              <div className="flex-1 bg-zinc-50 rounded-lg border border-zinc-100 mt-4 p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="w-1/3 h-3 bg-zinc-200 rounded-full opacity-50" />
                  <div className="w-10 h-3 bg-emerald-100 rounded-full" />
                </div>
                <div className="w-3/4 h-3 bg-zinc-200 rounded-full opacity-30" />
                <div className="w-5/6 h-3 bg-zinc-200 rounded-full opacity-40" />
                <div className="w-full h-1 bg-zinc-200 mt-4 opacity-20" />
              </div>

              {/* Floating Badge */}
              <div className="absolute bottom-6 right-6 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">
                READY TO SEND
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BENTO GRID FEATURES */}
      <section className="py-24 px-6 max-w-[1400px] mx-auto">
        <div className="mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            L'Arsenal Complet.
          </h2>
          <p className="text-zinc-500 max-w-lg">
            Une suite d'outils conçue pour la performance, pas pour la
            décoration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-auto md:h-[600px]">
          {/* Card 1: Editor */}
          <div className="md:col-span-2 md:row-span-2 bg-white rounded-3xl p-8 border border-zinc-200 shadow-sm relative overflow-hidden group hover:border-zinc-400 transition-colors">
            <div className="relative z-10">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-6">
                <Zap className="text-white w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Éditeur Temps Réel</h3>
              <p className="text-zinc-500 max-w-sm">
                Le moteur de facturation le plus rapide du marché. Conception
                atomique, validation instantanée.
              </p>
            </div>
            <div className="absolute right-0 bottom-0 w-2/3 h-2/3 bg-zinc-50 rounded-tl-3xl border-t border-l border-zinc-100 group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">
              <div className="text-zinc-200 font-black text-6xl opacity-20 select-none">
                UI v2
              </div>
            </div>
          </div>

          {/* Card 2: Mobile */}
          <div className="bg-zinc-900 text-white rounded-3xl p-8 border border-zinc-800 shadow-sm relative overflow-hidden group">
            <Smartphone className="w-8 h-8 mb-4 text-zinc-400" />
            <h3 className="text-xl font-bold mb-2">Mobile First</h3>
            <p className="text-zinc-400 text-sm">
              Responsive par essence. Votre bureau est dans votre poche.
            </p>
          </div>

          {/* Card 3: PDF */}
          <div className="bg-white rounded-3xl p-8 border border-zinc-200 shadow-sm relative overflow-hidden group hover:border-zinc-400 transition-colors">
            <FileText className="w-8 h-8 mb-4 text-zinc-900" />
            <h3 className="text-xl font-bold mb-2">Moteur PDF/A</h3>
            <p className="text-zinc-500 text-sm">
              Standard d'archivage longue durée. Impression haute fidélité.
            </p>
          </div>
        </div>
      </section>

      {/* 4. TECHNICAL TRUST STRIP (Remplacement des Fake Stats) */}
      <section className="border-y border-zinc-200 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
          {[
            {
              icon: ShieldCheck,
              title: "Conformité",
              desc: "Mentions légales à jour & calculs TVA rigoureux.",
            },
            {
              icon: Lock,
              title: "Sécurité",
              desc: "Authentification forte & Chiffrement des données.",
            },
            {
              icon: Server,
              title: "Cloud Sync",
              desc: "Sauvegarde automatique redondante.",
            },
            {
              icon: Zap,
              title: "Performance",
              desc: "Architecture Next.js pour une vitesse éclair.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center md:items-start text-center md:text-left"
            >
              <item.icon className="w-6 h-6 mb-4 text-zinc-900" />
              <h4 className="font-bold text-zinc-900 mb-1">{item.title}</h4>
              <p className="text-sm text-zinc-500 leading-snug">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. PRICING */}
      <section className="py-24 px-6 max-w-5xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">
          Simple. Transparent.
        </h2>
        <p className="text-zinc-500 text-lg mb-12">
          Des outils professionnels, accessibles à tous.
        </p>

        <div className="grid md:grid-cols-2 gap-6 items-start">
          {/* Free Tier */}
          <div className="p-8 rounded-3xl bg-transparent border border-zinc-200 text-left hover:bg-white transition-colors">
            <h3 className="font-bold text-xl mb-2">Découverte</h3>
            <div className="text-4xl font-black tracking-tighter mb-6">0€</div>
            <ul className="space-y-4 mb-8">
              <li className="flex gap-3 text-sm text-zinc-600">
                <Check className="w-4 h-4" /> 3 Devis / mois
              </li>
              <li className="flex gap-3 text-sm text-zinc-600">
                <Check className="w-4 h-4" /> Export PDF Standard
              </li>
              <li className="flex gap-3 text-sm text-zinc-400">
                <Lock className="w-4 h-4" /> Pas de sauvegarde Cloud
              </li>
            </ul>
            <Link
              href="/sign-up"
              className="block w-full py-3 rounded-xl border border-zinc-200 font-bold text-center hover:bg-zinc-50 text-zinc-900"
            >
              Créer un compte
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="p-8 rounded-3xl bg-black text-white text-left relative overflow-hidden shadow-2xl transform md:-translate-y-4">
            <div className="absolute top-0 right-0 p-4">
              <div className="bg-white text-black text-[10px] font-bold uppercase px-2 py-1 rounded">
                Populaire
              </div>
            </div>
            <h3 className="font-bold text-xl mb-2">Freelance Pro</h3>
            <div className="text-5xl font-black tracking-tighter mb-1">
              9€{" "}
              <span className="text-lg font-medium text-zinc-500">/mois</span>
            </div>
            <p className="text-zinc-400 text-sm mb-8">
              Pour ceux qui passent à la vitesse supérieure.
            </p>

            <ul className="space-y-4 mb-8">
              <li className="flex gap-3 text-sm">
                <Check className="w-4 h-4 text-white" />{" "}
                <strong>Illimité</strong> (Clients & Devis)
              </li>
              <li className="flex gap-3 text-sm">
                <Check className="w-4 h-4 text-white" /> Sauvegarde Cloud
              </li>
              <li className="flex gap-3 text-sm">
                <Check className="w-4 h-4 text-white" /> Branding White-Label
              </li>
              <li className="flex gap-3 text-sm">
                <Check className="w-4 h-4 text-white" /> Support Prioritaire
              </li>
            </ul>
            <Link
              href="/sign-up"
              className="block w-full py-4 rounded-xl bg-white text-black font-bold text-center hover:bg-zinc-200 transition-colors"
            >
              Passer Pro
            </Link>
          </div>
        </div>
      </section>

      {/* 6. BIG CTA FOOTER */}
      <footer className="bg-black text-white pt-24 pb-12 px-6">
        <div className="max-w-[1400px] mx-auto text-center mb-24">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-none">
            PRÊT À <br />
            <span className="text-zinc-600">STRUCTURER VOTRE BUSINESS ?</span>
          </h2>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 bg-white text-black px-10 py-5 rounded-full text-xl font-bold hover:scale-105 transition-transform"
          >
            Lancer l'App <ArrowRight className="w-6 h-6" />
          </Link>
        </div>

        <div className="max-w-[1400px] mx-auto border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-zinc-500 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white rounded flex items-center justify-center text-black font-black text-[10px]">
              DE
            </div>
            <span>DevisExpress © 2025</span>
          </div>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white">
              Legal
            </Link>
            <Link href="#" className="hover:text-white">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
