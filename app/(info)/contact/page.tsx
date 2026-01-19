"use client";

import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, ContactInput } from "@/lib/validations/contact";
import { sendContactAction } from "@/actions/contact-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ShieldCheck, Globe, Zap } from "lucide-react";

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema) as Resolver<ContactInput>,
  });

  const onSubmit = async (data: ContactInput) => {
    const response = await sendContactAction(data);
    if (response.success) {
      toast.success("TRANSMISSION_REÇUE : 100%");
      reset();
    } else {
      toast.error("ERREUR_RÉSEAU : ÉCHEC DE L'ENVOI.");
    }
  };

  return (
    <div className="flex flex-col gap-16">
      {/* EN-TÊTE : Identité Haute-Fidélité */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b-4 border-slate-950 pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-indigo-600 animate-pulse rounded-none" />
            <span className="text-[10px] font-mono font-black text-indigo-600 uppercase tracking-[0.3em]">
              Système_Actif
            </span>
          </div>
          <h1 className="text-[42px] font-black uppercase tracking-tighter leading-none text-slate-950">
            Centre<span className="text-indigo-600">.</span>Support
          </h1>
        </div>
        <div className="flex flex-col md:items-end font-mono text-[11px] text-slate-400 font-bold uppercase tracking-widest">
          <span>Localisation: Abidjan_CI</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* FORMULAIRE : Console de Contrôle */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="lg:col-span-7 space-y-10"
        >
          <div className="grid gap-8">
            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-950 flex justify-between">
                <span>01_Identité_Professionnelle</span>
                <span className="text-slate-400">Obligatoire</span>
              </label>
              <Input
                {...register("name")}
                className="h-12 rounded-none border-2 border-slate-200 focus-visible:ring-0 focus-visible:border-slate-950 font-mono text-[14px] bg-slate-50/30 uppercase"
                placeholder="VOTRE_NOM_OU_RAISON_SOCIALE"
              />
              {errors.name && (
                <p className="text-[10px] font-bold text-red-600 uppercase tracking-tighter">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-950">
                02_Nature_du_Flux
              </label>
              <div className="relative">
                <select
                  {...register("subject")}
                  className="flex h-12 w-full border-2 border-slate-200 bg-white px-3 py-2 text-[13px] font-mono font-bold uppercase focus:outline-none focus:border-slate-950 rounded-none appearance-none cursor-pointer"
                >
                  <option value="support">Assistance_Technique</option>
                  <option value="facturation">Gestion_Facturation</option>
                  <option value="partenariat">Accord_Commercial</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  ▼
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-950">
                03_Détails_Transmission
              </label>
              <Textarea
                {...register("message")}
                className="min-h-[180px] rounded-none border-2 border-slate-200 focus-visible:ring-0 focus-visible:border-slate-950 text-[14px] leading-relaxed bg-slate-50/30"
                placeholder="Veuillez décrire votre requête avec précision..."
              />
              {errors.message && (
                <p className="text-[10px] font-bold text-red-600 uppercase tracking-tighter">
                  {errors.message.message}
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-14 bg-slate-950 text-white font-black uppercase text-[12px] tracking-[0.3em] rounded-none hover:bg-indigo-600 transition-all shadow-[8px_8px_0px_0px_rgba(79,70,229,0.2)] active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            {isSubmitting ? "CHIFFREMENT_ET_ENVOI..." : "Exécuter_Transmission"}
          </Button>
        </form>

        {/* SIDEBAR : Métadonnées Techniques */}
        <aside className="lg:col-span-5 space-y-12">
          <div className="p-8 bg-slate-50 border-l-4 border-slate-950 space-y-6">
            <h4 className="text-[12px] font-black uppercase tracking-widest text-slate-950">
              État_Infrastructure
            </h4>

            <div className="space-y-4">
              {[
                { label: "Sécurité", val: "AES-256", icon: ShieldCheck },
                { label: "Disponibilité", val: "99.9%", icon: Zap },
                { label: "Réseau", val: "Stable", icon: Globe },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between border-b border-slate-200 pb-2"
                >
                  <div className="flex items-center gap-2">
                    <item.icon size={14} className="text-indigo-600" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono font-black text-slate-950">
                    {item.val}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="px-8 space-y-4 border-t border-slate-100 pt-8">
            <p className="text-[13px] text-slate-700 leading-relaxed italic">
              &quot;Toute transmission est traitée sous un cycle de 24h ouvrées par
              notre unité technique.&quot;
            </p>
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-tighter text-wrap">
                ID_SÉCURITÉ: DX-ALPHA-2026
              </span>
              <div className="h-2 w-8 bg-slate-300" />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
