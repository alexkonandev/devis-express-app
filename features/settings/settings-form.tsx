"use client";

import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { settingsSchema, SettingsFormValues } from "@/lib/validations/settings";
import { updateSettings } from "@/actions/settings-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Save,
  ShieldCheck,
  Building2,
  ReceiptEuro,
  FileText,
  Lock,
  Terminal,
} from "lucide-react";

interface SettingsFormProps {
  initialData: SettingsFormValues;
  isPro: boolean;
}

export function SettingsForm({ initialData, isPro }: SettingsFormProps) {
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: initialData,
  });

  async function onSubmit(data: SettingsFormValues) {
    const result = await updateSettings(data);
    if (result.success) {
      toast.success("SYSTÈME MIS À JOUR");
    } else {
      toast.error("ERREUR DE SYNCHRONISATION");
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col h-[calc(100vh-2.5rem)] w-full overflow-hidden bg-white animate-in fade-in duration-300"
    >
      {/* HEADER FIXE */}
      <header className="shrink-0 h-16 border-b border-slate-200 px-6 flex items-center justify-between bg-white">
        <div className="flex items-center gap-4">
          <div className="w-1 h-5 bg-indigo-600" />
          <div className="flex flex-col">
            <h1 className="text-[18px] font-black uppercase tracking-tighter text-slate-950 leading-none">
              Console de Configuration
            </h1>
            <span className="text-[9px] text-slate-400 font-black uppercase tracking-[0.3em] mt-1">
              Kernel / Identité & Fiscalité
            </span>
          </div>
        </div>

        <Button
          type="submit"
          className="bg-slate-950 text-white hover:bg-indigo-600 rounded-none text-[10px] font-black uppercase tracking-widest px-8 h-10 transition-none shadow-none"
        >
          <Save className="w-4 h-4 mr-2" />
          Commit Changes
        </Button>
      </header>

      {/* VIEWPORT SANS SCROLL : GRID RIGIDE */}
      <main className="flex-1 grid grid-cols-12 gap-0 overflow-hidden">
        {/* COLONNE GAUCHE : FLUX OPÉRATIONNELS (8 COL) */}
        <div className="col-span-8 border-r border-slate-200 flex flex-col overflow-hidden">
          {/* SECTION IDENTITÉ (HAUTEUR FIXE) */}
          <section className="flex-1 flex flex-col border-b border-slate-200">
            <div className="px-8 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                Identité Légale
              </span>
            </div>
            <div className="p-8 grid grid-cols-2 gap-x-12 gap-y-6 content-center flex-1">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">
                  Nom Commercial
                </label>
                <Input
                  {...form.register("companyName")}
                  className="rounded-none border-slate-200 font-mono text-[13px] h-10"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">
                  Email Facturation
                </label>
                <Input
                  {...form.register("companyEmail")}
                  className="rounded-none border-slate-200 font-mono text-[13px] h-10"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">
                  Numéro SIRET
                </label>
                <Input
                  {...form.register("companySiret")}
                  className="rounded-none border-slate-200 font-mono text-[13px] h-10"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">
                  Interface Web
                </label>
                <Input
                  {...form.register("companyWebsite")}
                  className="rounded-none border-slate-200 font-mono text-[13px] h-10"
                />
              </div>
            </div>
          </section>

          {/* SECTION LOGISTIQUE (HAUTEUR FIXE) */}
          <section className="flex-1 flex flex-col">
            <div className="px-8 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <ReceiptEuro className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                Séquençage Flux & TVA
              </span>
            </div>
            <div className="p-8 grid grid-cols-3 gap-12 content-center flex-1">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">
                  Préfixe
                </label>
                <Input
                  {...form.register("quotePrefix")}
                  className="rounded-none border-slate-200 font-mono text-[13px] h-10 uppercase"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">
                  Incrémentation
                </label>
                <Input
                  type="number"
                  {...form.register("nextQuoteNumber", { valueAsNumber: true })}
                  className="rounded-none border-slate-200 font-mono text-[13px] h-10"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">
                  TVA Défaut (%)
                </label>
                <Input
                  type="number"
                  {...form.register("defaultVatRate", { valueAsNumber: true })}
                  className="rounded-none border-slate-200 font-mono text-[13px] h-10"
                />
              </div>
            </div>
          </section>
        </div>

        {/* COLONNE DROITE : CLAUSES & UPGRADE (4 COL) */}
        <div className="col-span-4 flex flex-col overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-8 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                Mentions & Clauses
              </span>
            </div>
            <div className="p-8 flex-1 flex flex-col overflow-hidden">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-3">
                Clauses Standards (PDF)
              </label>
              <Textarea
                {...form.register("defaultTerms")}
                className="flex-1 rounded-none border-slate-200 font-mono text-[11px] leading-relaxed resize-none p-5 bg-slate-50/30 focus-visible:ring-indigo-600"
                placeholder="..."
              />
            </div>
          </div>

          {!isPro && (
            <div className="shrink-0 p-8 bg-slate-950 text-white">
              <div className="flex items-center gap-3 mb-3">
                <ShieldCheck className="w-4 h-4 text-indigo-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                  Licence Standard
                </span>
              </div>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight leading-tight mb-5">
                L&apos;upgrade débloque le White-Label et la signature
                électronique légale.
              </p>
              <Button
                asChild
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-none h-10 text-[9px] font-black uppercase tracking-widest"
              >
                <Link href="/billing">Upgrade Now</Link>
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* FOOTER FIXE */}
      <footer className="shrink-0 h-8 bg-white border-t border-slate-200 px-6 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <Terminal className="w-3 h-3 text-slate-400" />
            <span className="text-[8px] font-mono text-slate-400 uppercase">
              Kern: 3.0.4-Stable
            </span>
          </div>
          <div className="flex items-center gap-2 border-l border-slate-200 pl-8">
            <Lock className="w-3 h-3 text-emerald-500" />
            <span className="text-[8px] font-mono text-slate-400 uppercase tracking-tighter">
              AES-256 Link Active
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="text-[9px] font-black text-slate-950 uppercase tracking-widest font-mono italic">
            Synchronized
          </span>
        </div>
      </footer>
    </form>
  );
}
