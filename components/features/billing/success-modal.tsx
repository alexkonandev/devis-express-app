"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Check, ShieldCheck, Cpu } from "lucide-react";
/**
 * PSYCHOLOGIE : VALIDATION D'ACCRÉDITATION
 * On remplace l'aspect "fête" par un aspect "activation de protocole".
 */
function SuccessModalContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const success = searchParams.get("success");

    if (success === "1") {
      const showTimeout = setTimeout(() => setShow(true), 100);

      const hideTimeout = setTimeout(() => {
        setShow(false);
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-none p-0 max-w-sm w-full border-2 border-slate-950 shadow-[16px_16px_0px_rgba(79,70,229,0.2)] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* HEADER DE VALIDATION */}
        <div className="bg-slate-950 p-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">
              Protocol-Update
            </span>
            <h2 className="text-[14px] font-black text-white uppercase tracking-widest">
              Accréditation Pro
            </h2>
          </div>
        </div>

        <div className="p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-16 h-16 border-2 border-slate-100 flex items-center justify-center">
                <Check className="w-8 h-8 text-emerald-500" />
              </div>
              <Cpu className="absolute -bottom-2 -right-2 w-5 h-5 text-indigo-600 bg-white" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-[16px] font-black uppercase tracking-tight text-slate-950">
              Système Opérationnel
            </h3>
            <p className="text-slate-500 text-[12px] font-bold uppercase leading-relaxed tracking-tight">
              Toutes les restrictions de flux ont été levées. Votre
              infrastructure Studio est désormais en capacité maximale.
            </p>
          </div>

          {/* BARRE DE PROGRESSION INDUSTRIELLE (COUNTDOWN) */}
          <div className="space-y-2">
            <div className="h-2 w-full bg-slate-100 rounded-none overflow-hidden p-[1px] border border-slate-200">
              <div className="h-full bg-indigo-600 animate-[progress_5s_linear_forwards]" />
            </div>
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">
              Finalisation de la synchronisation...
            </p>
          </div>
        </div>

        {/* FOOTER TECHNIQUE */}
        <div className="bg-slate-50 p-3 border-t border-slate-100 text-center">
          <span className="text-[8px] font-mono text-slate-400 uppercase">
            Auth-Key: PRO_SUBSCRIPTION_ACTIVE // Redirect: 05s
          </span>
        </div>
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

export const SuccessModal = () => {
  return (
    <Suspense fallback={null}>
      <SuccessModalContent />
    </Suspense>
  );
};
