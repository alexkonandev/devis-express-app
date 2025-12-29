"use client";

import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!isLoaded) return null;

  // --- GOOGLE OAUTH STRATEGY ---
  const signUpWithGoogle = async () => {
    if (!isLoaded) return;
    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch (err: any) {
      console.error("Erreur Google OAuth:", err);
      setError("Erreur lors de la connexion Google.");
    }
  };

  // --- EMAIL/PASSWORD STRATEGY ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signUp.create({ emailAddress: email, password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      console.error(err);
      setError(err.errors[0]?.message || "Erreur lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/dashboard");
      } else {
        setError("Code invalide.");
      }
    } catch (err: any) {
      console.error(err);
      setError("Code incorrect.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
          Créer un compte
        </h2>
        <p className="mt-2 text-sm text-zinc-500">
          Standardisez vos offres. Dominez votre marché.
        </p>
      </div>

      {!pendingVerification ? (
        <div className="space-y-6 mt-8">
          {/* BOUTON GOOGLE */}
          <button
            onClick={signUpWithGoogle}
            type="button"
            className="w-full flex items-center justify-center gap-2 bg-white border border-zinc-200 rounded-md px-4 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition-all focus:outline-none focus:ring-2 focus:ring-zinc-200"
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
            Continuer avec Google
          </button>

          {/* SÉPARATEUR */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-zinc-400 font-medium">
                ou par email
              </span>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 sm:text-sm transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1.5">
                  Mot de passe
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 sm:text-sm transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded border border-red-100">
                {error}
              </div>
            )}

            {/* --- FIX DU BUG CAPTCHA : OBLIGATOIRE --- */}
            <div id="clerk-captcha" />

            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-zinc-800 disabled:opacity-70 transition-colors"
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                "S'inscrire"
              )}
            </button>
          </form>
        </div>
      ) : (
        // FORMULAIRE DE VALIDATION CODE
        <form className="mt-8 space-y-6" onSubmit={handleVerification}>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-1.5">
              Code de vérification
            </label>
            <p className="text-xs text-zinc-400 mb-3">Envoyé à {email}</p>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="block w-full rounded-md border border-zinc-200 bg-white px-3 py-3 text-zinc-900 text-center tracking-[0.5em] text-xl font-mono focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 transition-all"
              placeholder="123456"
              required
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded border border-red-100">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-zinc-800 disabled:opacity-70 transition-colors"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Valider"}
          </button>
        </form>
      )}

      {!pendingVerification && (
        <div className="text-center text-sm">
          <p className="text-zinc-500">
            Déjà un compte ?{" "}
            <Link
              href="/sign-in"
              className="font-semibold text-zinc-900 hover:underline"
            >
              Se connecter
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
