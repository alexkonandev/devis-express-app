import { checkSubscription } from "@/lib/subscription";
import { getApiLimitCount } from "@/lib/api-limit";
import { BillingHeader } from "@/components/features/billing/billing-header";
import { SubscriptionCard } from "@/components/features/billing/subscription-card";
import { UsageMetrics } from "@/components/features/billing/usage-metrics";

export const metadata = {
  title: "Facturation & Subscription | Studio",
};

export default async function BillingPage() {
  // Données fetchées côté serveur pour un rendu instantané (SEO & UX)
  const isPro = await checkSubscription();
  const apiLimitCount = await getApiLimitCount();

  return (
    <div className="flex flex-col gap-8 w-full p-8 animate-in fade-in duration-700">
      {/* Header avec focus sur la rentabilité */}
      <BillingHeader />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        {/* Colonne Principale : L'offre et l'abonnement */}
        <div className="xl:col-span-2 space-y-6">
          <SubscriptionCard isPro={isPro} />

          {/* Section Historique / Factures (Placeholder stratégique) */}
          <div className="bg-white border border-zinc-200 rounded-xl p-6">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4">
              Gestion des paiements
            </h3>
            <p className="text-xs text-zinc-500 font-medium italic">
              Tes factures et modes de paiement sont sécurisés et gérés par
              Lemon Squeezy.
            </p>
          </div>
        </div>

        {/* Colonne Latérale : Metrics d'utilisation (Limites API/Devis) */}
        <div className="space-y-6">
          <UsageMetrics count={apiLimitCount} isPro={isPro} />
        </div>
      </div>
    </div>
  );
}
