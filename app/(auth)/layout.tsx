import React from "react";
import Link from "next/link";
import { CheckCircle2, TrendingUp } from "lucide-react";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-white font-sans text-zinc-900 overflow-hidden">
      {/* 1. COLONNE GAUCHE : FORMULAIRE (Light Mode) */}
      <div className="w-full lg:w-1/2 h-full flex flex-col relative overflow-y-auto scrollbar-hide bg-white">
        {/* Logo Mobile */}
        <div className="lg:hidden absolute top-6 left-6 z-20">
          <Link href="/">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="DevisExpress Logo"
                width={100}
                height={40}
                className="h-6 w-auto object-contain" // J'ai mis h-6 pour un tout petit peu plus de présence sur mobile
                priority
              />
            </div>
          </Link>
        </div>

        {/* Zone d'injection du formulaire (Centré) */}
        <div className="w-full flex-1 flex flex-col justify-center items-center p-6">
          <div className="w-full max-w-[400px]">{children}</div>
        </div>

        {/* Footer */}
        <div className="py-6 text-[10px] text-zinc-400 font-medium text-center w-full">
          © {new Date().getFullYear()} DevisExpress Studio. Tous droits
          réservés.
        </div>
      </div>

      {/* 2. COLONNE DROITE : BRANDING (Dark Mode pour le contraste) */}
      <div className="hidden lg:flex w-1/2 h-full bg-black relative flex-col justify-between p-16 text-white overflow-hidden border-l border-zinc-800">
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* Logo Branding */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3">
            {/* LOGO INVERSÉ POUR LE DARK MODE */}
            <Image
              src="/logo.png"
              alt="DevisExpress Logo"
              width={120} // Légèrement plus grand sur desktop pour l'impact
              height={40}
              className="h-7 w-auto object-contain invert" // AJOUT DE 'invert' ICI
              priority
            />
          </Link>
        </div>

        {/* Manifeste */}
        <div className="relative z-10 space-y-8 max-w-lg mt-auto mb-20">
          <div className="w-12 h-1 bg-white/20 rounded-full" />
          <h2 className="text-3xl font-medium leading-tight tracking-tight">
            Arrêtez de bricoler.
            <br />
            <span className="text-zinc-400">Passez à l'échelle.</span>
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed font-medium max-w-md">
            DevisExpress n'est pas juste un outil de facturation. C'est votre
            structure mentale d'entrepreneur.
            <span className="text-white font-bold">
              {" "}
              Focus sur la vente et la production.
            </span>
          </p>
        </div>

        {/* Features */}
        <div className="relative z-10 flex gap-8 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> ROI Immédiat
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Cloud Sync
          </div>
        </div>
      </div>
    </div>
  );
}
