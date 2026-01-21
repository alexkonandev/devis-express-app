"use client";

import React, { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, UserPlus, Mail, Phone, MapPin, Building2 } from "lucide-react";
// ✅ On utilise upsertClient pour la création (id est optionnel)
import { upsertClient } from "@/actions/client-action";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

/**
 * DIALOGUE DE CRÉATION CLIENT
 * Alignement strict sur l'action serveur et le schéma Prisma.
 */
export function CreateClientDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      // Mapping direct vers les arguments de upsertClient
      const res = await upsertClient({
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        address: (formData.get("address") as string) || "",
        siret: (formData.get("siret") as string) || "", // Mappe l'identifiant fiscal vers siret
      });

      if (res.success) {
        toast.success("CLIENT_ENREGISTRÉ");
        setOpen(false);
      } else {
        toast.error("ERREUR_CRÉATION", { description: res.error });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-8 rounded-none bg-slate-950 hover:bg-indigo-600 text-[9px] font-black uppercase tracking-widest px-3 transition-colors gap-2">
          <Plus size={12} />
          Nouveau_Client
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md rounded-none border-2 border-slate-950 p-0 overflow-hidden shadow-[20px_20px_0px_rgba(0,0,0,0.1)]">
        <DialogHeader className="p-8 bg-slate-950 text-white shrink-0">
          <DialogTitle className="text-[12px] font-black uppercase tracking-[0.3em] flex items-center gap-3">
            <UserPlus size={16} className="text-indigo-400" />
            Enregistrement_Client
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white">
          {/* NOM (OBLIGATOIRE) */}
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Building2 size={12} /> Nom_Complet_Ou_Société
            </label>
            <input
              name="name"
              required
              className="w-full border-b-2 border-slate-100 p-2 text-[12px] font-bold outline-none focus:border-slate-950 transition-colors bg-transparent"
              placeholder="EX: TECH_SOLUTIONS_SARL"
            />
          </div>

          {/* EMAIL (OBLIGATOIRE) */}
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Mail size={12} /> Email_De_Contact
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full border-b-2 border-slate-100 p-2 text-[12px] font-bold outline-none focus:border-slate-950 transition-colors bg-transparent"
              placeholder="CONTACT@SOCIETE.COM"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* TÉLÉPHONE (Optionnel selon ton action) */}
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Phone size={12} /> Téléphone
              </label>
              <input
                name="phone"
                className="w-full border-b-2 border-slate-100 p-2 text-[12px] font-bold outline-none focus:border-slate-950 transition-colors bg-transparent"
                placeholder="+225..."
              />
            </div>

            {/* SIRET / ID FISCAL */}
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                Identifiant_Fiscal
              </label>
              <input
                name="siret"
                className="w-full border-b-2 border-slate-100 p-2 text-[12px] font-bold outline-none focus:border-slate-950 transition-colors bg-transparent"
                placeholder="RCCM / IFU"
              />
            </div>
          </div>

          {/* ADRESSE GEOGRAPHIQUE */}
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <MapPin size={12} /> Localisation_Physique
            </label>
            <textarea
              name="address"
              rows={2}
              className="w-full border-b-2 border-slate-100 p-2 text-[12px] font-bold outline-none focus:border-slate-950 transition-colors resize-none bg-transparent"
              placeholder="ABIDJAN, COCODY..."
            />
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-14 bg-slate-950 text-white rounded-none font-black uppercase tracking-[0.2em] text-[10px] hover:bg-indigo-600 transition-all shadow-md active:scale-[0.98]"
          >
            {isPending ? "Communication_Serveur..." : "Valider_Enregistrement"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
