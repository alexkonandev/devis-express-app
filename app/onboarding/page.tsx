"use client";

import { useState } from "react";
import { completeOnboardingAction } from "@/actions/onboarding-action";
import {
  Code2,
  Palette,
  BarChart3,
  PenTool,
  Briefcase,
  Clock,
  RefreshCw,
  Layers,
  Loader2,
  ArrowRight,
  Target,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { useSession } from "@clerk/nextjs";
import { OnboardingData } from "@/actions/onboarding-action";

const PROFESSIONS = [
  { id: "TECH", label: "DÉVELOPPEMENT & TECH", icon: Code2 },
  { id: "CREATIVE", label: "DESIGN & CRÉATION", icon: Palette },
  { id: "MARKETING", label: "MARKETING & VENTE", icon: BarChart3 },
  { id: "CONTENT", label: "RÉDACTION & CONTENU", icon: PenTool },
  { id: "CONSULTING", label: "CONSEIL & EXPERTISE", icon: Briefcase },
];

const MODELS = [
  {
    id: "PROJECT",
    label: "FORFAIT PAR PROJET",
    desc: "Prix fixe défini à l'avance",
    icon: Target,
  },
  {
    id: "TIME",
    label: "TARIF JOURNALIER",
    desc: "Facturation au temps passé",
    icon: Clock,
  },
  {
    id: "RECURRING",
    label: "ABONNEMENT",
    desc: "Revenus mensuels réguliers",
    icon: RefreshCw,
  },
  {
    id: "UNIT",
    label: "À L'UNITÉ",
    desc: "Prix par livrable précis",
    icon: Layers,
  },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
 const [selection, setSelection] = useState<OnboardingData>({
   profession: "TECH", // On initialise avec des valeurs par défaut valides
   businessModel: "PROJECT",
 });
  const { session } = useSession(); // Récupère la session active

  const handleFinish = async () => {
    if (!session) return;

    setLoading(true);

    try {
      const res = await completeOnboardingAction(selection);

      if (res.success) {
        // ÉTAPE CRUCIALE : On force Clerk à rafraîchir le jeton de session
        // pour inclure les nouvelles publicMetadata avant la redirection.
        await session.reload();

        // Utilise replace pour éviter que l'utilisateur ne revienne en arrière
        // sur l'onboarding avec le bouton "précédent" du navigateur.
        window.location.replace("/dashboard");
      } else {
        setLoading(false);
        // Optionnel : ajouter une notification d'erreur ici
      }
    } catch (error) {
      setLoading(false);
      console.error("Erreur lors de la finalisation:", error);
    }
  };

  return (
    <div className="h-screen w-full bg-white flex flex-col overflow-hidden select-none font-sans">
      {/* BARRE SUPÉRIEURE */}
      <header className="h-20 border-b border-slate-200 flex items-center justify-between px-10 bg-white">
        <div className="flex items-center gap-8">
          <Logo variant="full" className="h-8 w-auto grayscale contrast-125" />
          <div className="h-6 w-[1px] bg-slate-200" />
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            CONFIGURATION DU COMPTE // ÉTAPE 0{step}
          </span>
        </div>
        <div className="flex gap-2">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`h-1.5 w-12 transition-all duration-500 ${
                step === s ? "bg-indigo-600" : "bg-slate-100"
              }`}
            />
          ))}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50/30">
        <div className="w-full max-w-5xl space-y-10">
          {/* TITRES CLAIRS */}
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-[36px] font-black uppercase tracking-tighter leading-none text-slate-950 italic">
              {step === 1 ? "VOTRE MÉTIER" : "VOTRE FACTURATION"}
            </h2>
            <p className="text-[13px] font-bold text-slate-500 uppercase tracking-tight">
              {step === 1
                ? "Sélectionnez votre domaine d'expertise principal"
                : "Choisissez comment vous facturez vos clients par défaut"}
            </p>
          </div>

          {/* GRILLE DE SÉLECTION PROFESSIONNELLE */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 bg-slate-200 border border-slate-200">
            {step === 1
              ? PROFESSIONS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      // On précise que p.id est du type spécifique attendu par l'interface
                      setSelection({
                        ...selection,
                        profession: p.id as OnboardingData["profession"],
                      });
                      setStep(2);
                    }}
                    className="group bg-white p-10 flex flex-col items-start gap-6 hover:bg-slate-50 transition-all cursor-pointer rounded-none border-none outline-none"
                  >
                    <p.icon className="w-8 h-8 text-slate-400 group-hover:text-indigo-600 transition-all" />
                    <span className="font-black text-[15px] uppercase tracking-tight text-slate-900 leading-tight">
                      {p.label}
                    </span>
                  </button>
                ))
              : MODELS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() =>
                      setSelection({
                        ...selection,
                        businessModel: m.id as OnboardingData["businessModel"],
                      })
                    }
                    className={`group p-10 flex flex-col gap-5 transition-all cursor-pointer border-none rounded-none outline-none ${
                      selection.businessModel === m.id
                        ? "bg-slate-950 text-white"
                        : "bg-white hover:bg-slate-50 text-slate-900"
                    }`}
                  >
                    <m.icon
                      className={`w-6 h-6 ${
                        selection.businessModel === m.id
                          ? "text-indigo-400"
                          : "text-slate-400"
                      }`}
                    />
                    <div>
                      <p className="text-[16px] font-black uppercase italic tracking-tighter">
                        {m.label}
                      </p>
                      <p
                        className={`text-[11px] font-bold uppercase mt-1 ${
                          selection.businessModel === m.id
                            ? "text-slate-400"
                            : "text-slate-500"
                        }`}
                      >
                        {m.desc}
                      </p>
                    </div>
                  </button>
                ))}
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-10 border-t border-slate-200">
            <div className="hidden md:block">
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">
                SÉCURISÉ & PRIVÉ // 256-BIT ENCRYPTION
              </span>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              {step === 2 && (
                <button
                  onClick={() => setStep(1)}
                  className="px-8 py-5 text-[12px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-950 transition-colors cursor-pointer rounded-none"
                >
                  RETOUR
                </button>
              )}
              <button
                disabled={loading || (step === 2 && !selection.businessModel)}
                onClick={step === 1 ? undefined : handleFinish}
                className={`flex-1 md:flex-none flex items-center justify-center gap-6 px-12 py-5 bg-slate-950 text-white font-black uppercase text-[12px] tracking-[0.2em] transition-all cursor-pointer hover:bg-indigo-600 disabled:opacity-10 rounded-none ${
                  step === 1 ? "invisible" : "visible"
                }`}
              >
                {loading ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  <>
                    CRÉER MON ESPACE <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER SIMPLE */}
      <footer className="h-12 border-t border-slate-200 bg-white px-10 flex items-center justify-between z-10">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          © 2026 DEVIS EXPRESS — TOUS DROITS RÉSERVÉS
        </div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          FACILITER LA FACTURATION, ACCÉLÉRER LES REVENUS
        </div>
      </footer>
    </div>
  );
}
