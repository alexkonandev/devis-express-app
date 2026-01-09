"use client";

import { useState } from "react";
import { completeOnboardingAction } from "@/actions/onboarding-action"; // Vérifie l'import kebab-case
import Image from "next/image";
import {
  Code2,
  Palette,
  BarChart3,
  PenTool,
  Briefcase,
  Rocket,
  Clock,
  RefreshCw,
  Layers,
  Loader2,
} from "lucide-react";

// Types stricts pour éviter le any
type ProfessionId =
  | "TECH"
  | "CREATIVE"
  | "MARKETING"
  | "CONTENT"
  | "CONSULTING";
type ModelId = "PROJECT" | "TIME" | "RECURRING" | "UNIT";

interface OnboardingSelection {
  profession: ProfessionId | "";
  businessModel: ModelId | "";
}

const PROFESSIONS = [
  { id: "TECH", label: "Tech & Dev", icon: Code2 },
  { id: "CREATIVE", label: "Design & Creative", icon: Palette },
  { id: "MARKETING", label: "Marketing & Ads", icon: BarChart3 },
  { id: "CONTENT", label: "Content & Copy", icon: PenTool },
  { id: "CONSULTING", label: "Consulting", icon: Briefcase },
] as const;

const MODELS = [
  { id: "PROJECT", label: "Au Projet", desc: "Prix fixe", icon: Rocket },
  { id: "TIME", label: "Au Temps", desc: "TJM / Heure", icon: Clock },
  { id: "RECURRING", label: "Récurrence", desc: "Mensuel", icon: RefreshCw },
  { id: "UNIT", label: "À l'unité", desc: "Au livrable", icon: Layers },
] as const;

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selection, setSelection] = useState<OnboardingSelection>({
    profession: "",
    businessModel: "",
  });

  const handleFinish = async () => {
    if (!selection.businessModel || !selection.profession) return;

    setLoading(true);
    setError("");

    try {
      const result = await completeOnboardingAction({
        profession: selection.profession,
        businessModel: selection.businessModel,
      });

      if (result?.success) {
        window.location.assign("/dashboard");
      } else {
        setError(result?.error || "Erreur lors de la configuration.");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError("Une erreur critique est survenue. Veuillez réessayer.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-666 bg-white flex flex-col items-center justify-between py-12 px-6 overflow-hidden">
      {/* Header Logo */}
      <div className="h-10 flex items-center justify-center">
        <Image
          src="/logo.png"
          alt="Logo"
          width={110}
          height={36}
          className="h-7 w-auto object-contain"
          priority
        />
      </div>

      <div className="w-full max-w-[680px] flex-1 flex flex-col justify-center">
        {/* Progress Stepper */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black tracking-tighter uppercase italic text-zinc-900">
            Configuration
          </h1>
          <div className="flex justify-center gap-1.5 mt-4">
            <div
              className={`h-1 w-12 rounded-full transition-all duration-500 ${
                step >= 1 ? "bg-zinc-900" : "bg-zinc-100"
              }`}
            />
            <div
              className={`h-1 w-12 rounded-full transition-all duration-500 ${
                step >= 2 ? "bg-zinc-900" : "bg-zinc-100"
              }`}
            />
          </div>
        </div>

        <div className="min-h-[420px]">
          {step === 1 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 animate-in fade-in zoom-in-95 duration-500">
              {PROFESSIONS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelection({ ...selection, profession: p.id });
                    setStep(2);
                  }}
                  className="flex flex-col items-center justify-center gap-4 p-8 rounded-xl border border-zinc-100 hover:border-zinc-900 transition-all bg-zinc-50/50 group"
                >
                  <p.icon className="w-8 h-8 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
                  <span className="font-bold text-xs uppercase tracking-tight text-zinc-600 group-hover:text-zinc-900 text-center">
                    {p.label}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-center font-bold text-zinc-400 text-xs uppercase tracking-widest mb-2">
                Modèle de facturation
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {MODELS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() =>
                      setSelection({ ...selection, businessModel: m.id })
                    }
                    className={`flex flex-col items-start p-5 rounded-xl border-2 transition-all ${
                      selection.businessModel === m.id
                        ? "border-zinc-900 bg-zinc-900 text-white shadow-md"
                        : "border-zinc-100 bg-zinc-50/50 hover:border-zinc-300 text-zinc-900"
                    }`}
                  >
                    <m.icon
                      className={`w-5 h-5 mb-2 ${
                        selection.businessModel === m.id
                          ? "text-white"
                          : "text-zinc-400"
                      }`}
                    />
                    <p className="font-bold text-sm uppercase italic">
                      {m.label}
                    </p>
                    <p
                      className={`text-[10px] uppercase font-medium ${
                        selection.businessModel === m.id
                          ? "text-zinc-400"
                          : "text-zinc-500"
                      }`}
                    >
                      {m.desc}
                    </p>
                  </button>
                ))}
              </div>

              <div className="flex flex-col items-center gap-4 mt-6">
                <button
                  onClick={handleFinish}
                  disabled={loading || !selection.businessModel}
                  className="w-full max-w-xs bg-zinc-900 text-white py-3.5 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-zinc-800 disabled:opacity-20 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
                >
                  {loading ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : (
                    "Générer l'espace"
                  )}
                </button>
                <button
                  onClick={() => setStep(1)}
                  disabled={loading}
                  className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest hover:text-zinc-900 transition-colors"
                >
                  ← Retour au métier
                </button>
              </div>
              {error && (
                <p className="text-red-600 text-[11px] text-center font-bold uppercase mt-2">
                  {error}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer Branding */}
      <div className="text-[10px] font-bold text-zinc-300 uppercase tracking-[0.2em] h-10 flex items-center">
        © {new Date().getFullYear()} DevisExpress — Focus on results.
      </div>
    </div>
  );
}
