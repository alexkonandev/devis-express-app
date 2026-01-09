import { ShieldCheck, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
// Import de l'action pour générer le lien de checkout Lemon Squeezy
// import { createCheckoutLink } from "@/actions/lemon-squeezy";

export function SubscriptionCard({ isPro }: { isPro: boolean }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border-2 transition-all ${
        isPro
          ? "border-emerald-500 bg-white"
          : "border-zinc-900 bg-zinc-900 text-white"
      }`}
    >
      <div className="p-8">
        <div className="flex justify-between items-start mb-8">
          <div className="space-y-2">
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                isPro
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-zinc-800 text-zinc-400"
              }`}
            >
              {isPro ? "Plan Studio Pro" : "Plan Free"}
            </span>
            <h2 className="text-3xl font-black uppercase tracking-tighter">
              {isPro ? "Accès Illimité" : "Booste ton Business"}
            </h2>
          </div>
          <div
            className={`p-4 rounded-2xl ${
              isPro ? "bg-emerald-50" : "bg-zinc-800"
            }`}
          >
            {isPro ? (
              <ShieldCheck className="w-8 h-8 text-emerald-500" />
            ) : (
              <Zap className="w-8 h-8 text-yellow-400" />
            )}
          </div>
        </div>

        <ul className="space-y-4 mb-10">
          {[
            "Devis & Factures illimités",
            "Suppression du branding DevisExpress",
            "Signature électronique (Pro)",
            "Export PDF Premium",
          ].map((feature, i) => (
            <li
              key={i}
              className="flex items-center gap-3 text-sm font-bold uppercase tracking-tight"
            >
              <ArrowRight
                className={`w-4 h-4 ${
                  isPro ? "text-emerald-500" : "text-zinc-600"
                }`}
              />
              <span className={isPro ? "text-zinc-700" : "text-zinc-300"}>
                {feature}
              </span>
            </li>
          ))}
        </ul>

        {/* Action Button */}
        {!isPro ? (
          <Button className="w-full h-14 bg-white text-zinc-900 hover:bg-zinc-100 font-black uppercase tracking-widest text-sm shadow-xl transition-transform active:scale-95">
            Passer à la vitesse supérieure — 19€/mois
          </Button>
        ) : (
          <Button
            variant="outline"
            className="w-full h-14 border-zinc-200 text-zinc-500 font-black uppercase tracking-widest text-sm hover:bg-zinc-50"
          >
            Gérer mon abonnement
          </Button>
        )}
      </div>
    </div>
  );
}
