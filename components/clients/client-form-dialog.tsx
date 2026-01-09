"use client";

import { useEffect, useState } from "react";
import { Loader2, Building2, Mail, MapPin, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// --- TYPES PRISMA ---
import { Client } from "@/app/generated/prisma/client";

/**
 * Input aligné sur le schéma Prisma : Pas de téléphone.
 * On privilégie l'email pour une communication asynchrone et traçable.
 */
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

  // Synchronisation de l'état local avec les props
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
      <DialogContent className="sm:max-w-[450px] bg-white p-0 gap-0 overflow-hidden shadow-2xl border-zinc-100 rounded-sm">
        <DialogHeader className="px-6 py-5 bg-zinc-50/50 border-b border-zinc-100">
          <DialogTitle className="flex items-center gap-3 text-zinc-900 font-black uppercase tracking-widest text-[10px]">
            <div className="p-2 bg-white rounded-sm border border-zinc-200 shadow-sm">
              <Building2 className="w-4 h-4 text-zinc-900" />
            </div>
            {clientToEdit?.id ? "Éditer Client" : "Nouveau Client"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* NOM / SOCIÉTÉ */}
          <div className="space-y-2">
            <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">
              Raison Sociale <span className="text-zinc-900">*</span>
            </Label>
            <Input
              autoFocus
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="NOM DE L'ENTREPRISE"
              className="font-black text-sm h-11 border-zinc-200 focus:border-zinc-900 rounded-sm bg-transparent transition-all uppercase"
            />
          </div>

          {/* EMAIL & SIRET */}
          <div className="grid grid-cols-1 gap-5">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-400">
                <Mail className="w-3 h-3" /> Email de facturation
              </Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="facturation@client.com"
                className="bg-zinc-50 border-zinc-100 focus:bg-white focus:border-zinc-900 rounded-sm h-10 transition-all text-xs font-bold"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-400">
                <Hash className="w-3 h-3" /> SIRET / Numéro de TVA
              </Label>
              <Input
                value={formData.siret}
                onChange={(e) =>
                  setFormData({ ...formData, siret: e.target.value })
                }
                placeholder="IDENTIFIANT LÉGAL"
                className="font-mono text-xs bg-zinc-50 border-zinc-100 focus:bg-white focus:border-zinc-900 rounded-sm h-10 transition-all font-bold"
              />
            </div>
          </div>

          {/* ADRESSE */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-400">
              <MapPin className="w-3 h-3" /> Adresse du siège
            </Label>
            <Textarea
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              placeholder="ADRESSE COMPLÈTE..."
              className="min-h-20 resize-none bg-zinc-50 border-zinc-100 focus:bg-white focus:border-zinc-900 rounded-sm transition-all text-xs font-medium leading-relaxed"
            />
          </div>

          <DialogFooter className="pt-4 border-t border-zinc-50">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="text-[9px] font-black uppercase tracking-widest hover:bg-zinc-100"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-zinc-900 hover:bg-black text-white px-8 rounded-sm font-black text-[9px] uppercase tracking-widest transition-all shadow-md active:scale-95"
            >
              {isSubmitting ? (
                <Loader2 className="w-3 h-3 mr-2 animate-spin" />
              ) : clientToEdit?.id ? (
                "Sauvegarder"
              ) : (
                "Enregistrer le client"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
