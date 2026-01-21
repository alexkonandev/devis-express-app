"use client";

import { useEffect, useState } from "react";
import { Loader2, Building2, Mail, MapPin, Hash} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// --- TYPES PRISMA ---
import { Client } from "@/app/generated/prisma/client";

export interface ClientInput {
  name: string;
  email: string;
  address: string;
  siret: string;
}

interface ClientFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ClientInput, id?: string) => Promise<boolean>;
  clientToEdit?: Partial<Client> | null;
}

export function ClientFormDialog({
  isOpen,
  onClose,
  onSubmit,
  clientToEdit,
}: ClientFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ClientInput>({
    name: "",
    email: "",
    address: "",
    siret: "",
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: clientToEdit?.name || "",
        email: clientToEdit?.email || "",
        address: clientToEdit?.address || "",
        siret: clientToEdit?.siret || "",
      });
    }
  }, [clientToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    try {
      const success = await onSubmit(formData, clientToEdit?.id);
      if (success) onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-112.5 bg-white p-0 gap-0 overflow-hidden shadow-none border-slate-200 rounded-none">
        {/* HEADER : INDUSTRIAL LOOK */}
        <DialogHeader className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="flex items-center gap-2 text-slate-950 font-black uppercase tracking-widest text-[10px]">
            <Building2 className="w-3.5 h-3.5 text-indigo-600" />
            {clientToEdit?.id
              ? "ACTIF_CLIENT : EDITION"
              : "ACTIF_CLIENT : NOUVEAU"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* RAISON SOCIALE (V3) */}
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-950">
              Raison Sociale <span className="text-indigo-600">*</span>
            </Label>
            <Input
              autoFocus
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="NOM DE L'ENTREPRISE"
              className="font-bold text-[13px] h-10 border-slate-200 focus:ring-0 focus:border-indigo-600 rounded-none bg-transparent transition-all uppercase placeholder:text-slate-300 placeholder:font-normal placeholder:italic placeholder:tracking-normal"
            />
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* EMAIL (V3) */}
            <div className="space-y-1.5">
              <Label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-950">
                <Mail className="w-3 h-3 text-slate-400" /> Email Facturation
              </Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="CONTACT@CLIENT.COM"
                className="bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-600 rounded-none h-10 transition-all text-[13px] font-mono font-bold text-indigo-600 placeholder:text-slate-300 placeholder:font-normal"
              />
            </div>

            {/* SIRET (V3) */}
            <div className="space-y-1.5">
              <Label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-950">
                <Hash className="w-3 h-3 text-slate-400" /> Identifiant Légal
                (SIRET)
              </Label>
              <Input
                value={formData.siret}
                onChange={(e) =>
                  setFormData({ ...formData, siret: e.target.value })
                }
                placeholder="NUMÉRO D'ENREGISTREMENT"
                className="font-mono text-[13px] bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-600 rounded-none h-10 transition-all font-bold placeholder:text-slate-300 placeholder:font-normal"
              />
            </div>
          </div>

          {/* ADRESSE (V3) */}
          <div className="space-y-1.5">
            <Label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-950">
              <MapPin className="w-3 h-3 text-slate-400" /> Adresse du siège
            </Label>
            <Textarea
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              placeholder="ADRESSE PHYSIQUE COMPLÈTE..."
              className="min-h-20 resize-none border-slate-200 focus:border-indigo-600 rounded-none transition-all text-[13px] font-medium leading-tight text-slate-800 placeholder:text-slate-300 placeholder:font-normal"
            />
          </div>

          {/* FOOTER ACTION */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="text-[11px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-950 rounded-none"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 h-10 rounded-none font-bold text-[11px] uppercase tracking-widest transition-all shadow-none flex items-center gap-2 active:scale-95"
            >
              {isSubmitting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <Building2 className="w-3.5 h-3.5" />
                  {clientToEdit?.id
                    ? "Sauvegarder_Modifs"
                    : "Enregistrer_Actif"}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
