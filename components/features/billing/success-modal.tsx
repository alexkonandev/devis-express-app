"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Check, Sparkles } from "lucide-react";

// --- COMPOSANT INTERNE POUR GÉRER LA LOGIQUE ---
function SuccessModalContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // On initialise l'état à true seulement si le paramètre est présent dès le début
  const [show, setShow] = useState(false);

  useEffect(() => {
    // On vérifie le paramètre dans un effet
    const success = searchParams.get("success");

    if (success === "1") {
      // Un petit délai pour éviter le conflit de rendu synchrone
      const showTimeout = setTimeout(() => setShow(true), 100);

      const hideTimeout = setTimeout(() => {
        setShow(false);
        // On nettoie l'URL proprement
        router.replace("/billing");
      }, 5000);

      return () => {
        clearTimeout(showTimeout);
        clearTimeout(hideTimeout);
      };
    }
  }, [searchParams, router]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-500">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl border border-zinc-200 text-center animate-in zoom-in-95 duration-300">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
          <Check className="w-10 h-10 text-emerald-600" />
          <div className="absolute -top-2 -right-2 bg-yellow-400 p-1.5 rounded-full animate-bounce">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>

        <h2 className="text-2xl font-black tracking-tight mb-2">
          Bienvenue dans l&apos;Élite !
        </h2>
        <p className="text-zinc-500 text-sm mb-6 leading-relaxed">
          Votre Plan Empire est activé. Vous avez désormais un accès illimité à
          tous nos outils de production.
        </p>

        <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 animate-[progress_5s_linear_forwards]" />
        </div>
        <p className="text-[10px] text-zinc-400 mt-4 uppercase font-bold tracking-widest">
          Redirection automatique...
        </p>
      </div>

      <style jsx>{`
        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}

// --- EXPORT AVEC SUSPENSE (Obligatoire pour useSearchParams dans Next.js) ---
export const SuccessModal = () => {
  return (
    <Suspense fallback={null}>
      <SuccessModalContent />
    </Suspense>
  );
};
