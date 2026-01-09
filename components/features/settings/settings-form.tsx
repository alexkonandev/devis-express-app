"use client";
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
} from "lucide-react";

interface SettingsFormProps {
  initialData: SettingsFormValues;
  isPro: boolean;
}

export function SettingsForm({ initialData, isPro }: SettingsFormProps) {
  const form = useForm<SettingsFormValues>({
    // @ts-expect-error - Résout le décalage de typage entre Zod et RHF
    resolver: zodResolver(settingsSchema),
    defaultValues: initialData,
  });

  async function onSubmit(data: SettingsFormValues) {
    const result = await updateSettings(data);
    if (result.success) {
      toast.success("Configuration mise à jour avec succès");
    } else {
      toast.error("Erreur lors de la sauvegarde");
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-6 w-full animate-in fade-in duration-500"
    >
      {/* HEADER : Aligné sur la densité du Dashboard */}
      <div className="flex items-center justify-between border-b border-zinc-200 pb-5">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-black uppercase tracking-tighter text-zinc-900 leading-none">
            Configuration Studio
          </h1>
          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
            Identité légale et automatisation fiscale
          </p>
        </div>
        <Button
          type="submit"
          size="sm"
          className="bg-zinc-900 text-white hover:bg-zinc-800 text-[10px] font-black uppercase tracking-widest px-8 h-9 shadow-md transition-all active:scale-95"
        >
          <Save className="w-3.5 h-3.5 mr-2" />
          Sauvegarder les modifications
        </Button>
      </div>

      {/* GRILLE TRIPARTITE : Exploitation de l'espace horizontal */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* BLOC 1 : IDENTITÉ CORPORATE */}
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden h-full">
          <div className="bg-zinc-50/50 px-4 py-3 border-b border-zinc-100 flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-zinc-400" />
            <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              Identité Corporate
            </h2>
          </div>
          <div className="p-5 space-y-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-zinc-400 tracking-wider">
                Nom du Studio
              </label>
              <Input
                {...form.register("companyName")}
                className="font-mono text-xs h-9 focus-visible:ring-zinc-900"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-zinc-400 tracking-wider">
                Email Business
              </label>
              <Input
                {...form.register("companyEmail")}
                className="font-mono text-xs h-9 focus-visible:ring-zinc-900"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-zinc-400 tracking-wider">
                SIRET
              </label>
              <Input
                {...form.register("companySiret")}
                placeholder="000 000 000 00000"
                className="font-mono text-xs h-9 focus-visible:ring-zinc-900"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-zinc-400 tracking-wider">
                Site Web (Optionnel)
              </label>
              <Input
                {...form.register("companyWebsite")}
                placeholder="https://..."
                className="font-mono text-xs h-9 focus-visible:ring-zinc-900"
              />
            </div>
          </div>
        </div>

        {/* BLOC 2 : LOGISTIQUE ET TVA */}
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden h-full">
          <div className="bg-zinc-50/50 px-4 py-3 border-b border-zinc-100 flex items-center gap-2">
            <ReceiptEuro className="w-3.5 h-3.5 text-zinc-400" />
            <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              Logistique Devis
            </h2>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-zinc-400 tracking-wider">
                  Préfixe
                </label>
                <Input
                  {...form.register("quotePrefix")}
                  className="font-mono text-xs h-9 uppercase focus-visible:ring-zinc-900"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase text-zinc-400 tracking-wider">
                  Prochain N°
                </label>
                <Input
                  type="number"
                  {...form.register("nextQuoteNumber", { valueAsNumber: true })}
                  className="font-mono text-xs h-9 focus-visible:ring-zinc-900"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-zinc-400 tracking-wider">
                TVA par défaut (%)
              </label>
              <Input
                type="number"
                {...form.register("defaultVatRate", { valueAsNumber: true })}
                className="font-mono text-xs h-9 focus-visible:ring-zinc-900"
              />
            </div>
            <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-100">
              <p className="text-[9px] text-zinc-500 font-medium leading-relaxed italic">
                * Ces paramètres seront appliqués automatiquement à chaque
                nouveau devis généré.
              </p>
            </div>
          </div>
        </div>

        {/* BLOC 3 : CLAUSES ET MENTIONS */}
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden h-full">
          <div className="bg-zinc-50/50 px-4 py-3 border-b border-zinc-100 flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-zinc-400" />
            <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
              Mentions Légales
            </h2>
          </div>
          <div className="p-5 space-y-2 h-[calc(100%-45px)]">
            <label className="text-[9px] font-black uppercase text-zinc-400 tracking-wider">
              Clauses par défaut
            </label>
            <Textarea
              {...form.register("defaultTerms")}
              className="h-[180px] font-mono text-[10px] leading-relaxed resize-none focus-visible:ring-zinc-900 p-4 border-zinc-200"
              placeholder="Ex: Paiement à réception. Validité 30 jours. Intérêts de retard..."
            />
          </div>
        </div>
      </div>

      {/* PLAN UPGRADE : Call-to-action stratégique */}
      {/* PLAN UPGRADE : Redirection vers Billing pour conversion */}
      {!isPro && (
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center gap-6 shadow-lg shadow-zinc-200/50">
          <div className="p-3 bg-zinc-800 rounded-xl">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex flex-col">
            <p className="text-[11px] font-black uppercase text-white tracking-widest">
              Passer au Plan Studio Pro
            </p>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tight">
              Supprime le branding, débloque les exports PDF premium et la
              signature électronique.
            </p>
          </div>
          {/* Utilisation de asChild pour transformer le Button en lien sémantique Next.js */}
          <Button
            asChild
            variant="outline"
            size="sm"
            className="ml-auto h-9 text-[10px] font-black uppercase bg-white text-zinc-900 border-transparent hover:bg-zinc-100 transition-colors px-6"
          >
            <Link href="/billing">Upgrade maintenant</Link>
          </Button>
        </div>
      )}
    </form>
  );
}
