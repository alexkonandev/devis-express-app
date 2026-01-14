"use client";

import Link from "next/link";
import {
  ArrowRight,
  Check,
  Zap,
  FileText,
  Smartphone,
  ShieldCheck,
  Server,
  Lock,
  LayoutDashboard,
  CreditCard,
  ArrowUpRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Logo } from "./ui/logo";

interface LandingPageViewProps {
  userId: string | null;
}

export default function LandingPageView({ userId }: LandingPageViewProps) {
  const mainActionLink = userId ? "/dashboard" : "/sign-up";
  const billingUrl = userId ? "/billing" : "/sign-up";

  const formatFCFA = (amount: number) =>
    new Intl.NumberFormat("fr-CI", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
    }).format(amount);

  return (
    <main className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
      {/* --- 1. BARRE DE NAVIGATION --- */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-350 mx-auto px-6 h-16 flex items-center justify-between">
          {/* Remplacement du div + Image par ton nouveau composant Logo */}
          <Link href="/" className="hover:opacity-90 transition-opacity">
            <Logo className="h-7 w-32" />
          </Link>

          <div className="flex items-center gap-4">
            {userId ? (
              <Button asChild variant="default" size="sm" className="gap-2">
                <Link href="/dashboard">
                  <LayoutDashboard className="w-4 h-4" />
                  Tableau de bord
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/sign-in">Connexion</Link>
                </Button>
                <Button asChild variant="default" size="sm">
                  <Link href="/sign-up">Essai Gratuit</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* --- 2. SECTION HÉRO --- */}
      <section className="pt-32 pb-20 px-6 max-w-350 mx-auto grid lg:grid-cols-2 gap-(--gap-sections) items-center">
        <div className="max-w-xl space-y-8">
          <h1 className="text-4xl md:text-6xl  font-extrabold tracking-tighter leading-[1.1]">
            VOTRE FACTURATION <br />
            <span className="text-muted-foreground text-3xl md:text-5xl ">
              ENFIN PROFESSIONNELLE.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-md">
            L&apos;outil de gestion conçu pour les entrepreneurs ivoiriens.
            Émettez des documents conformes, sécurisez vos paiements et
            automatisez votre croissance.
          </p>

          <div className="flex flex-wrap gap-(--gap-elements)">
            <Button
              asChild
              size="lg"
              className="h-14 px-8 text-base font-bold shadow-lg shadow-primary/20"
            >
              <Link href={mainActionLink}>
                {userId ? "Accéder à mes devis" : "Commencer maintenant"}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-14 px-8 text-base font-bold"
            >
              <Link href="#tarifs">Nos solutions</Link>
            </Button>
          </div>

          <div className="pt-8 flex flex-wrap gap-6 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" /> Auto-Entrepreneurs
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" /> PME & Sociétés
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" /> Conforme DGI
            </div>
          </div>
        </div>

        {/* Visuel Produit */}
        <div className="relative h-125 w-full hidden lg:block perspective-1000">
          <div className="absolute inset-0 bg-secondary rounded-lg transform rotate-y-12 rotate-x-6 shadow-2xl border border-border p-4 transition-transform duration-700 hover:rotate-0">
            <div className="h-full w-full bg-background rounded-sm shadow-inner p-8 flex flex-col gap-6 overflow-hidden relative">
              <div className="flex justify-between items-center border-b border-border/50 pb-4">
                <div className="space-y-1">
                  <div className="w-32 h-4 bg-muted rounded" />
                  <div className="w-20 h-2 bg-muted/50 rounded" />
                </div>
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <FileText className="text-primary w-5 h-5" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-32 bg-muted/20 rounded-lg border border-border p-4 flex flex-col justify-end">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">
                    Client
                  </span>
                  <div className="w-full h-2 bg-muted rounded-full mt-2" />
                </div>
                <div className="h-32 bg-primary rounded-lg shadow-lg flex flex-col items-center justify-center text-primary-foreground">
                  <span className="text-xs opacity-70">Total Net</span>
                  <span className="font-mono font-bold text-2xl">
                    {formatFCFA(1250000).replace("XOF", "")}
                  </span>
                  <span className="text-[10px] font-bold">FCFA</span>
                </div>
              </div>
              <div className="space-y-3 mt-4">
                <div className="w-full h-2 bg-muted rounded-full" />
                <div className="w-5/6 h-2 bg-muted rounded-full opacity-50" />
              </div>
              <div className="absolute bottom-6 right-6 bg-primary text-primary-foreground text-[10px] font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                DOC_CONFORME.PDF <ArrowUpRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 3. FONCTIONNALITÉS CLÉS --- */}
      <section className="py-24 px-6 max-w-350 mx-auto">
        <h2 className="text-3xl font-bold tracking-tight mb-4">
          L&apos;Efficacité au Service de Votre Croissance.
        </h2>
        <p className="text-muted-foreground text-lg max-w-lg mb-12">
          Plus qu&apos;un simple éditeur, un véritable levier de crédibilité
          pour vos prospects.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
          {/* BLOC PRINCIPAL - Prend 2 colonnes */}
          <Card className="md:col-span-2 border-border bg-card p-8 group hover:border-primary transition-all duration-300 flex flex-col h-full">
            <div className="flex-1">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <Zap className="text-primary w-6 h-6" />
              </div>
              <CardTitle className="text-3xl font-bold mb-4">
                Génération Instantanée
              </CardTitle>
              <CardDescription className="text-muted-foreground text-lg leading-relaxed max-w-xl">
                Émettez vos documents certifiés en moins de 60 secondes. Le
                moteur intelligent gère automatiquement la TVA, les remises et
                les calculs complexes pour vous.
              </CardDescription>
            </div>
            <div className="mt-8">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:underline"
              >
                Tester l&apos;éditeur <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Card>

          {/* COLONNE DE DROITE - Contient les deux petits blocs */}
          <div className="flex flex-col gap-6 h-full">
            <Card className="flex-1 bg-foreground text-background p-6 border-none flex flex-col justify-center">
              <Smartphone className="w-8 h-8 mb-4 text-primary" />
              <CardTitle className="text-xl mb-2 text-background">
                Gestion Mobile
              </CardTitle>
              <CardDescription className="text-background/70 text-sm">
                Pilotez votre business depuis votre smartphone, où que vous
                soyez.
              </CardDescription>
            </Card>

            <Card className="flex-1 border-border bg-card p-6 group hover:border-primary transition-colors duration-300 flex flex-col justify-center">
              <ShieldCheck className="w-8 h-8 mb-4 text-primary" />
              <CardTitle className="text-xl mb-2">Sécurité Totale</CardTitle>
              <CardDescription className="text-muted-foreground text-sm">
                Données cryptées et sauvegardées quotidiennement.
              </CardDescription>
            </Card>
          </div>
        </div>
      </section>

      {/* --- 4. RÉASSURANCE TECHNIQUE --- */}
      <section className="border-y border-border bg-card">
        <div className="max-w-350 mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
          {[
            {
              icon: ShieldCheck,
              title: "Conformité Fiscale",
              desc: "Calculs précis et mentions obligatoires selon la législation.",
            },
            {
              icon: Lock,
              title: "Sécurité Bancaire",
              desc: "Protection de vos données et de celles de vos clients.",
            },
            {
              icon: Server,
              title: "Cloud Ivoirien",
              desc: "Accédez à vos documents partout, tout le temps.",
            },
            {
              icon: Zap,
              title: "Support Réactif",
              desc: "Une équipe locale pour vous accompagner au quotidien.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex flex-col items-center md:items-start text-center md:text-left"
            >
              <item.icon className="w-6 h-6 mb-4 text-primary" />
              <h4 className="font-bold text-foreground mb-1">{item.title}</h4>
              <p className="text-sm text-muted-foreground leading-snug">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* --- 5. TARIFS --- */}
      <section id="tarifs" className="py-24 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black tracking-tighter mb-4">
            Investissement Transparent.
          </h2>
          <p className="text-muted-foreground text-lg">
            Choisissez la solution adaptée à votre volume d&apos;activité.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Gratuit */}
          <Card className="border-border p-6 hover:bg-muted/10 transition-all">
            <CardHeader>
              <CardTitle className="text-xl">Formule Découverte</CardTitle>
              <div className="text-4xl font-black py-4 font-mono">
                {formatFCFA(0)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-primary" /> 3 Documents par mois
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Check className="w-4 h-4 text-primary" /> Export PDF Haute
                Qualité
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href={mainActionLink}>Essayer gratuitement</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Professionnel */}
          <Card className="border-primary bg-foreground text-background p-6 shadow-2xl md:-translate-y-4 relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <Badge className="bg-primary text-primary-foreground border-none">
                RECOMMANDÉ
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-xl text-background">
                Indépendant Pro
              </CardTitle>
              <div className="text-5xl font-black py-4 font-mono text-background">
                {formatFCFA(5000)}{" "}
                <span className="text-sm font-normal opacity-60">/mois</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-background/90">
              <div className="flex items-center gap-3 text-sm">
                <Check className="w-4 h-4 text-primary" />{" "}
                <strong>Illimité</strong> (Devis & Factures)
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Check className="w-4 h-4 text-primary" /> Signature
                Électronique
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Check className="w-4 h-4 text-primary" /> Suivi des paiements
                en temps réel
              </div>
            </CardContent>
            <CardFooter>
              <Button
                asChild
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground border-none font-bold"
              >
                <Link href={billingUrl}>
                  Devenir Professionnel <CreditCard className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* --- 6. PIED DE PAGE --- */}
      <footer className="border-t border-border bg-card py-16 px-6">
        <div className="max-w-350 mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <Link href="/" className="hover:opacity-90 transition-opacity">
              {/* Utilisation de la variante icône pour le footer comme discuté */}
              <Logo variant="icon" className="h-10 w-10" />
            </Link>

            <p className="text-xs text-muted-foreground max-w-50 text-center md:text-left">
              La plateforme de facturation leader pour les entrepreneurs en Côte
              d&apos;Ivoire.
            </p>
          </div>

          <div className="flex gap-16 text-sm text-muted-foreground font-medium">
            <div className="flex flex-col gap-3">
              <span className="text-foreground font-bold">Légal</span>
              <Link
                href="/conditions-generales"
                className="hover:text-primary transition-colors"
              >
                Conditions Générales
              </Link>
              <Link
                href="/confidentialite"
                className="hover:text-primary transition-colors"
              >
                Confidentialité
              </Link>
              <Link
                href="/mentions-legales"
                className="hover:text-primary transition-colors"
              >
                Mentions Légales
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-foreground font-bold">Assistance</span>
              <Link
                href="/aide"
                className="hover:text-primary transition-colors"
              >
                Centre d&apos;aide
              </Link>
              <Link
                href="/contact"
                className="hover:text-primary transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-350 mx-auto mt-12 pt-8 border-t border-border text-center text-[10px] text-muted-foreground uppercase tracking-widest">
          © 2026 DevisExpress — Abidjan, CI.
        </div>
      </footer>
    </main>
  );
}
