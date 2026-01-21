import { redirect } from "next/navigation";
import { getClerkUserId } from "@/lib/auth";
import { checkSubscription } from "@/lib/subscription";
import { getApiLimitCount } from "@/lib/api-limit";
import {
  ShieldCheck,
  CreditCard,
  Receipt,
  ExternalLink,
  Zap,
  BarChart3,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Icon } from "@phosphor-icons/react";

export const metadata = {
  title: "GESTION_FINANCIERE | STUDIO",
};

export default async function BillingPage() {
  const userId = await getClerkUserId();
  if (!userId) redirect("/sign-in");

  const estPro = await checkSubscription();
  const quotaUtilise = await getApiLimitCount();
  const LIMITE_GRATUITE = 5;

  return (
    <div className="flex flex-col h-[calc(100vh-2.5rem)] bg-white border-t border-slate-200">
      {/* HEADER INDUSTRIEL DISCRET */}
      <header className="h-16 border-b border-slate-100 px-8 flex items-center justify-between bg-white shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-1 h-6 bg-slate-950" />
          <h1 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-950">
            Contrôle_Facturation
          </h1>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 px-4 py-1.5 border border-slate-100">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-nowrap">
            État_Système:
          </span>
          <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />{" "}
            Opérationnel
          </span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto bg-[radial-gradient(#f1f5f9_1px,transparent_1px)] bg-[size:20px_20px] p-8 lg:p-12">
        <div className="max-w-6xl mx-auto grid grid-cols-12 gap-10">
          {/* SECTION LICENCE & ACCRÉDITATION */}
          <div className="col-span-12 lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-slate-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Niveau_D_Accréditation
                </span>
              </div>

              {/* CARTE D'ABONNEMENT (DESIGN ADOUCI) */}
              <div className="bg-white border border-slate-200 p-10 relative overflow-hidden group shadow-sm">
                <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
                  <Zap size={140} className="text-slate-950" />
                </div>

                <div className="relative z-10 space-y-8">
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">
                      Plan_Actif
                    </span>
                    <h2 className="text-[40px] font-black uppercase tracking-tighter leading-none italic text-slate-950">
                      {estPro ? "Licence_Entreprise" : "Accès_Standard"}
                    </h2>
                    <p className="text-[12px] font-medium text-slate-500 max-w-md leading-relaxed">
                      {estPro
                        ? "Votre infrastructure est dégroupée. Profitez d'une génération de devis illimitée et d'un support prioritaire."
                        : "Votre capacité actuelle est limitée. Augmentez votre puissance de frappe pour débloquer l'automatisation totale."}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-4">
                    <Button
                      className={cn(
                        "h-12 px-10 rounded-none font-black uppercase tracking-widest text-[11px] transition-all border shadow-sm",
                        estPro
                          ? "bg-white border-slate-200 text-slate-950 hover:bg-slate-50 hover:border-slate-300"
                          : "bg-slate-950 text-white hover:bg-slate-800 border-transparent"
                      )}
                    >
                      {estPro
                        ? "Gérer l'Abonnement"
                        : "Passer à la version Pro"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* UNITÉ DE MESURE DE CHARGE */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <BarChart3 size={14} className="text-slate-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Mesure_De_Charge_Système
                </span>
              </div>

              <div className="bg-white border border-slate-100 p-8 shadow-sm">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">
                      Devis_Générés
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-mono font-black text-slate-950">
                        {quotaUtilise}
                      </span>
                      <span className="text-[12px] font-bold text-slate-300 uppercase">
                        / {estPro ? "∞" : LIMITE_GRATUITE}
                      </span>
                    </div>
                  </div>
                  {!estPro && (
                    <span className="text-[10px] font-black text-amber-600 uppercase bg-amber-50 px-2 py-1">
                      Charge_Critique
                    </span>
                  )}
                </div>
                <div className="h-1.5 w-full bg-slate-50 overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all duration-1000",
                      estPro ? "bg-indigo-500" : "bg-slate-950"
                    )}
                    style={{
                      width: estPro
                        ? "100%"
                        : `${(quotaUtilise / LIMITE_GRATUITE) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ADMINISTRATION & ARCHIVES (ZONE DROITE) */}
          <div className="col-span-12 lg:col-span-5 space-y-10">
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Receipt size={14} className="text-slate-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Archives_Fiscales
                </span>
              </div>

              <div className="bg-white border border-slate-200 divide-y divide-slate-100 shadow-sm">
                <BoutonPortail
                  titre="Portail de Facturation"
                  sousTitre="Récupérer vos reçus officiels"
                  icon={ExternalLink}
                />
                <BoutonPortail
                  titre="Historique des Flux"
                  sousTitre="Consulter les dernières transactions"
                  icon={ChevronRight}
                />
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <CreditCard size={14} className="text-slate-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Source_De_Prélèvement
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-8 flex justify-between items-center group cursor-pointer hover:bg-white transition-all">
                <div className="space-y-2">
                  <span className="block text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Carte_Enregistrée
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-6 bg-slate-200 rounded-sm flex items-center justify-center">
                      <div className="w-6 h-1 bg-slate-300 opacity-50" />
                    </div>
                    <span className="text-[14px] font-mono font-bold tracking-widest text-slate-600 italic">
                      {estPro ? "•••• 4242" : "---- ----"}
                    </span>
                  </div>
                </div>
                <ArrowUpRight
                  size={18}
                  className="text-slate-300 group-hover:text-slate-950 transition-colors"
                />
              </div>
            </section>

            <div className="p-6 border-l-2 border-slate-900 bg-slate-50">
              <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase italic">
                {"//"} Les transactions sont opérées par Lemon Squeezy Inc.
                Aucun stockage de données bancaires n&apos;est effectué sur nos
                serveurs.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="h-10 bg-white border-t border-slate-100 px-8 flex items-center justify-between shrink-0">
        <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em]">
          Terminal_Financier_V2.1
        </span>
        <div className="flex gap-8">
          <span className="text-[8px] font-black text-slate-400 uppercase cursor-help hover:text-slate-950 transition-colors">
            Support_Prioritaire
          </span>
          <span className="text-[8px] font-black text-slate-400 uppercase cursor-help hover:text-slate-950 transition-colors">
            Politique_Confidentialité
          </span>
        </div>
      </footer>
    </div>
  );
}

/**
 * COMPOSANT INTERNE : Bouton de navigation portail
 */
function BoutonPortail({
  titre,
  sousTitre,
  icon: Icon,
}: {
  titre: string;
  sousTitre: string;
  icon: Icon;
}) {
  return (
    <button className="w-full p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
      <div className="text-left">
        <span className="block text-[11px] font-black uppercase text-slate-950 tracking-tight">
          {titre}
        </span>
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
          {sousTitre}
        </span>
      </div>
      <Icon
        size={14}
        className="text-slate-300 group-hover:text-slate-950 transition-colors"
      />
    </button>
  );
}
