"use client";

import { useEffect, useState } from "react";
import { Loader2, Building2, Mail, Phone, MapPin, Hash } from "lucide-react";
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
import { ClientInput } from "@/app/actions/client.actions";
import { Client } from "@/hooks/useClientManager"; // Import du type

interface ClientFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ClientInput, id?: string) => Promise<boolean>;
  clientToEdit?: Client | null;
}

export function ClientFormDialog({
  isOpen,
  onClose,
  onSubmit,
  clientToEdit,
}: ClientFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // État local du formulaire
  const [formData, setFormData] = useState<ClientInput>({
    name: "",
    email: "",
    phone: "",
    address: "",
    siret: "",
  });

  // Reset ou Remplissage à l'ouverture
  useEffect(() => {
    if (clientToEdit) {
      setFormData({
        name: clientToEdit.name,
        email: clientToEdit.email || "",
        phone: clientToEdit.phone || "",
        address: clientToEdit.address || "",
        siret: clientToEdit.siret || "",
      });
    } else {
      setFormData({ name: "", email: "", phone: "", address: "", siret: "" });
    }
  }, [clientToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    const success = await onSubmit(formData, clientToEdit?.id);
    setIsSubmitting(false);
    if (success) onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white p-0 gap-0 overflow-hidden shadow-2xl border-zinc-100">
        <DialogHeader className="px-6 py-4 bg-zinc-50/50 border-b border-zinc-100">
          <DialogTitle className="flex items-center gap-2 text-zinc-900">
            <div className="p-2 bg-white rounded-lg border border-zinc-100 shadow-sm">
              <Building2 className="w-4 h-4 text-indigo-600" />
            </div>
            {clientToEdit ? "Modifier la fiche" : "Nouveau Client"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* NOM (Focus Principal) */}
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase text-zinc-400">
              Nom / Société <span className="text-red-500">*</span>
            </Label>
            <Input
              autoFocus
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Ex: Agence Média"
              className="font-bold text-lg h-12 border-zinc-200 focus:ring-zinc-900 bg-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* EMAIL */}
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-zinc-400">
                <Mail className="w-3 h-3" /> Email
              </Label>
              <Input
                type="email"
                value={formData.email || ""}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="bg-zinc-50/50 border-zinc-100 focus:bg-white transition-all"
              />
            </div>
            {/* TÉLÉPHONE */}
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-zinc-400">
                <Phone className="w-3 h-3" /> Téléphone
              </Label>
              <Input
                value={formData.phone || ""}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="bg-zinc-50/50 border-zinc-100 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* SIRET (Légal) */}
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-zinc-400">
              <Hash className="w-3 h-3" /> SIRET / TVA
            </Label>
            <Input
              value={formData.siret || ""}
              onChange={(e) =>
                setFormData({ ...formData, siret: e.target.value })
              }
              placeholder="Numéro d'identification légale"
              className="font-mono text-xs bg-zinc-50/50 border-zinc-100 focus:bg-white transition-all"
            />
          </div>

          {/* ADRESSE */}
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-zinc-400">
              <MapPin className="w-3 h-3" /> Adresse de facturation
            </Label>
            <Textarea
              value={formData.address || ""}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="min-h-[80px] resize-none bg-zinc-50/50 border-zinc-100 focus:bg-white transition-all text-sm"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-zinc-900 hover:bg-black text-white px-8 font-bold"
            >
              {isSubmitting && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {clientToEdit ? "Sauvegarder" : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
