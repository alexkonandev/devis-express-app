"use client";

import { CreditCard, History } from "lucide-react";

export function BillingHeader() {
  return (
    <div className="flex flex-col gap-1 border-b border-zinc-200 pb-6">
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-zinc-900 rounded-md">
          <CreditCard className="w-4 h-4 text-white" />
        </div>
        <h1 className="text-2xl font-black uppercase tracking-tighter text-zinc-900">
          Facturation & Billing
        </h1>
      </div>
      <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
        <History className="w-3 h-3" />
        Historique des transactions et gestion du plan Lemon Squeezy
      </p>
    </div>
  );
}
