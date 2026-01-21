"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";

export default function SignInForm() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!isLoaded) return null;

  const signInWithGoogle = async () => {
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch (err: unknown) {
      // Changé de implicit any à unknown
      console.error(err);
      setError("ERREUR_SSO : ECHEC_IDENTIFICATION");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      } else {
        // Gère les cas comme 'needs_second_factor' sans any
        setError("AUTHENTIFICATION_MULTIF_REQUISE");
      }
    } catch (err: unknown) {
      // Changé de any à unknown
      if (isClerkAPIResponseError(err)) {
        // On récupère le message exact de Clerk ou un fallback
        setError(err.errors[0]?.message || "IDENTIFIANTS_INVALIDES");
      } else {
        setError("IDENTIFIANTS_INVALIDES_OU_INCONNUS");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* En-tête : Changement ici pour la différenciation visuelle */}
      <div className="space-y-2">
        <div className="text-[10px] font-mono font-black text-indigo-600 uppercase tracking-[0.3em]">
          Statut : Hors_Ligne
        </div>
        <h2 className="text-[24px] font-black uppercase tracking-tighter leading-none">
          Reprise_Session
        </h2>
        <p className="text-[12px] font-medium text-slate-500 uppercase tracking-tight">
          Récupération des paramètres de gestion.
        </p>
      </div>

      <div className="space-y-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                01_Identifiant
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-none border-2 border-slate-200 bg-white px-3 py-3 text-slate-950 font-mono text-sm focus:border-indigo-600 outline-none transition-colors"
                placeholder="admin@corp.ci"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                02_Pass_Key
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-none border-2 border-slate-200 bg-white px-3 py-3 text-slate-950 font-mono text-sm focus:border-indigo-600 outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-600 p-3 text-red-600 text-[10px] font-black uppercase tracking-tighter">
              {error}
            </div>
          )}

          {/* Bouton d'action reste Indigo pour le branding */}
          <Button
            disabled={loading}
            className="w-full h-12 bg-indigo-600 text-white rounded-none font-black uppercase text-[11px] tracking-[0.2em] hover:bg-slate-950 transition-all shadow-[6px_6px_0px_0px_rgba(79,70,229,0.15)] active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer"
          >
            {loading ? (
              <Loader2 className="animate-spin h-4 w-4" />
            ) : (
              "Lancer_Session"
            )}
          </Button>
        </form>

        <div className="space-y-6">
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-slate-100"></div>
            <span className="flex-shrink mx-4 text-[9px] font-black uppercase text-slate-300 tracking-[0.3em]">
              Sso_Alternatif
            </span>
            <div className="flex-grow border-t border-slate-100"></div>
          </div>

          <button
            onClick={signInWithGoogle}
            type="button"
            className="w-full flex items-center justify-center gap-3 h-12 border-2 border-slate-200 rounded-none font-black uppercase text-[11px] tracking-[0.1em] hover:bg-slate-50 transition-all cursor-pointer bg-white"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Se_Connecter_Via_Google
          </button>

          <div className="pt-2 flex justify-center">
            <Link
              href="/sign-up"
              className="text-[11px] font-bold text-slate-400 uppercase tracking-tight hover:text-indigo-600 transition-colors flex items-center gap-2 cursor-pointer"
            >
              Nouveau_Membre ?{" "}
              <span className="text-slate-950 underline decoration-indigo-600 underline-offset-4 flex items-center gap-1">
                Creer_Un_Compte <ArrowRight size={10} />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
