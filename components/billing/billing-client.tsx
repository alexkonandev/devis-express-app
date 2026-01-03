"use client";

import { useState } from "react";
import {
  Check,
  CreditCard,
  Loader2,
  Zap,
  ShieldCheck,
  History,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { SuccessModal } from "./success-modal";

// --- UI HELPERS ---
const BentoCard = ({
  children,
  className,
  title,
  icon: Icon,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: any;
}) => (
  <div
    className={cn(
      "bg-white border border-zinc-200 flex flex-col p-5 shadow-sm rounded-sm", // Style identique aux Settings
      className
    )}
  >
    {title && Icon && (
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-zinc-100">
        <Icon className="w-3.5 h-3.5 text-zinc-400" />
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
          {title}
        </span>
      </div>
    )}
    <div className="flex-1 flex flex-col gap-4">{children}</div>
  </div>
);

interface BillingClientProps {
  isPro: boolean;
  apiLimitCount: number;
}

export const BillingClient = ({ isPro, apiLimitCount }: BillingClientProps) => {
  const [loading, setLoading] = useState(false);

  const onSubscribe = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/stripe");
      if (!response.ok) throw new Error("Erreur serveur");
      const data = await response.json();
      window.location.href = data.url;
    } catch (error) {
      console.error(error);
      toast.error("Erreur de redirection. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // CONTENEUR PLEIN ÉCRAN (Sans scroll global si possible, comme Settings)
    <div className="h-full w-full bg-[#FAFAFA] flex flex-col overflow-hidden text-zinc-900 font-sans">
      <SuccessModal />
      {/* 1. HEADER MINIMALISTE (Identique aux Settings) */}
      <header className="h-14 border-b border-zinc-200 bg-white px-6 flex items-center justify-between shrink-0">
        <h1 className="text-sm font-black uppercase tracking-widest text-zinc-900">
          Abonnement & Facturation
        </h1>

        {/* Badge Statut */}
        <div
          className={cn(
            "px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 border",
            isPro
              ? "bg-black text-white border-black"
              : "bg-white text-zinc-500 border-zinc-200"
          )}
        >
          {isPro ? (
            <>
              <Zap className="w-3 h-3 fill-current" /> Plan Empire
            </>
          ) : (
            <>Plan Gratuit</>
          )}
        </div>
      </header>

      {/* 2. THE GRID (Remplissage de l'espace restant) */}
      <main className="flex-1 p-6">
        <div className="grid grid-cols-12 grid-rows-6 gap-4 h-full max-h-[800px] mx-auto max-w-[1600px]">
          {/* A. OFFRE PRINCIPALE (Prend la majorité de l'espace à gauche) */}
          <BentoCard
            title={isPro ? "Votre Abonnement" : "Mise à Niveau"}
            icon={CreditCard}
            className="col-span-12 md:col-span-8 row-span-6 relative overflow-hidden"
          >
            <div className="flex flex-col h-full z-10">
              <div className="mb-6">
                <h2 className="text-3xl font-black tracking-tight mb-2">
                  {isPro
                    ? "Vous êtes au top."
                    : "Passez à la vitesse supérieure."}
                </h2>
                <p className="text-zinc-500 max-w-lg text-sm leading-relaxed">
                  {isPro
                    ? "Votre Plan Empire est actif. Vous bénéficiez de toutes les fonctionnalités sans aucune limite. Merci de faire partie de l'élite."
                    : "Débloquez la création illimitée de devis, le mode Marque Blanche et le support prioritaire pour supprimer toutes les frictions de votre business."}
                </p>
              </div>

              {/* Liste des features stylisée */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-auto">
                {[
                  "Devis Illimités & Clients Illimités",
                  "Marque Blanche (White Label)",
                  "Sauvegarde Cloud Sécurisée",
                  "Support Client Prioritaire 24/7",
                  "Export PDF/A Haute Qualité",
                  "Accès API (Bientôt disponible)",
                ].map((feat, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 text-xs font-medium text-zinc-700"
                  >
                    <div
                      className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        isPro ? "bg-emerald-500" : "bg-zinc-300"
                      )}
                    />
                    {feat}
                  </div>
                ))}
              </div>

              {/* Zone Prix & Action */}
              <div className="mt-8 pt-8 border-t border-zinc-100 flex items-center justify-between">
                {!isPro && (
                  <div>
                    <span className="text-4xl font-black tracking-tighter">
                      9€
                    </span>
                    <span className="text-xs font-bold text-zinc-400 uppercase ml-1">
                      / mois
                    </span>
                  </div>
                )}

                <button
                  onClick={onSubscribe}
                  disabled={loading}
                  className={cn(
                    "h-12 px-8 rounded-sm flex items-center gap-2 font-black uppercase tracking-widest text-xs transition-all",
                    isPro
                      ? "bg-zinc-100 hover:bg-zinc-200 text-zinc-900 ml-auto"
                      : "bg-black hover:bg-zinc-800 text-white shadow-xl hover:scale-[1.02]"
                  )}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isPro ? (
                    <>
                      Gérer sur Stripe <CreditCard className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Débloquer l'accès <Zap className="w-4 h-4 fill-current" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Décoration d'arrière plan (Subtile) */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-zinc-50 rounded-full blur-3xl opacity-50 pointer-events-none" />
          </BentoCard>

          {/* B. UTILISATION (Haut Droite) */}
          <BentoCard
            title="Consommation Mensuelle"
            icon={History}
            className={cn(
              "col-span-12 md:col-span-4 row-span-3",
              !isPro && "bg-zinc-900 text-white border-zinc-800"
            )}
          >
            <div className="flex-1 flex flex-col justify-center items-center">
              <div className="text-6xl font-black tracking-tighter mb-2">
                {apiLimitCount}
                <span
                  className={cn(
                    "text-2xl font-medium",
                    !isPro ? "text-zinc-600" : "text-zinc-300"
                  )}
                >
                  {isPro ? " / ∞" : " / 3"}
                </span>
              </div>
              <p
                className={cn(
                  "text-[10px] uppercase tracking-widest font-bold",
                  !isPro ? "text-zinc-500" : "text-zinc-400"
                )}
              >
                Devis Générés
              </p>
            </div>

            {!isPro && (
              <div className="w-full bg-zinc-800 h-1 mt-4 rounded-full overflow-hidden">
                <div
                  className="bg-white h-full transition-all duration-500"
                  style={{ width: `${(apiLimitCount / 3) * 100}%` }}
                />
              </div>
            )}
          </BentoCard>

          {/* C. SECURITÉ & INFO (Bas Droite) */}
          <BentoCard
            title="Sécurité & Factures"
            icon={ShieldCheck}
            className="col-span-12 md:col-span-4 row-span-3"
          >
            <div className="flex flex-col gap-4 h-full justify-center">
              <div className="flex gap-3 items-start p-3 bg-zinc-50 rounded-sm border border-zinc-100">
                <Info className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                <p className="text-[10px] leading-relaxed text-zinc-500">
                  Les paiements sont sécurisés par l'infrastructure bancaire de{" "}
                  <strong>Stripe</strong>. Aucune donnée bancaire n'est stockée
                  sur nos serveurs.
                </p>
              </div>
              <div className="flex gap-3 items-start p-3 bg-zinc-50 rounded-sm border border-zinc-100">
                <Check className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                <p className="text-[10px] leading-relaxed text-zinc-500">
                  Vous pouvez annuler votre abonnement à tout moment en un clic.
                  L'accès reste actif jusqu'à la fin de la période.
                </p>
              </div>
            </div>
          </BentoCard>
        </div>
      </main>
    </div>
  );
};
