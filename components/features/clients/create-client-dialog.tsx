"use client";

import React, { useTransition, useState, ChangeEvent } from "react";
import { Plus, Loader2, Check, AlertTriangle } from "lucide-react";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { upsertClient } from "@/actions/client-action";

/**
 * NOTIFICATIONS DESIGN SYSTEM
 */
const notify = {
  success: (msg: string) =>
    toast.custom(() => (
      <div className="bg-slate-950 border-2 border-indigo-600 p-4 flex items-center gap-3 w-[300px] shadow-2xl rounded-none">
        <Check className="w-4 h-4 text-emerald-500" />
        <p className="text-[10px] font-black uppercase text-white tracking-widest">
          {msg}
        </p>
      </div>
    )),
  error: (msg: string) =>
    toast.custom(() => (
      <div className="bg-slate-950 border-2 border-rose-600 p-4 flex items-center gap-3 w-[300px] shadow-2xl rounded-none">
        <AlertTriangle className="w-4 h-4 text-rose-600" />
        <p className="text-[10px] font-black uppercase text-white tracking-widest">
          {msg}
        </p>
      </div>
    )),
};

const clientSchema = z.object({
  "client-name": z.string().min(2, "DÉNOMINATION TROP COURTE"),
  "client-email": z.string().email("FORMAT EMAIL INVALIDE"),
  "client-siret": z
    .string()
    .optional()
    .refine((val) => !val || val.replace(/\s/g, "").length === 14, {
      message: "SIRET INVALIDE (14 CHIFFRES REQUIS)",
    }),
});

export function CreateClientDialog() {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [siret, setSiret] = useState("");

  const resetForm = () => {
    setName("");
    setEmail("");
    setSiret("");
    setErrors({});
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value.toUpperCase());
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/[\s]/g, "").toLowerCase();
    setEmail(cleaned);
  };

  const handleSiretChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (raw.length > 14) return;

    let formatted = "";
    for (let i = 0; i < raw.length; i++) {
      if (i === 3 || i === 6 || i === 9) formatted += " ";
      formatted += raw[i];
    }
    setSiret(formatted);
  };

  async function handleFormSubmit() {
    setErrors({});

    const result = clientSchema.safeParse({
      "client-name": name,
      "client-email": email,
      "client-siret": siret,
    });

    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        formattedErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(formattedErrors);
      notify.error("DONNÉES INVALIDES");
      return;
    }

    startTransition(async () => {
      const response = await upsertClient({
        name: result.data["client-name"],
        email: result.data["client-email"],
        siret: result.data["client-siret"]?.replace(/\s/g, ""),
      });

      if (response.success) {
        notify.success("ACTIF ENREGISTRÉ");
        setIsOpen(false);
        resetForm();
      } else {
        notify.error(response.error || "ERREUR SYSTÈME");
      }
    });
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        setIsOpen(v);
        if (!v) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 text-white hover:bg-indigo-700 text-[10px] font-black uppercase tracking-widest px-6 h-9 rounded-none shadow-none transition-none">
          <Plus className="w-4 h-4 mr-2" /> Nouveau Partenaire
        </Button>
      </DialogTrigger>

      <DialogContent className="rounded-none border-2 border-slate-950 bg-white shadow-2xl max-w-md p-0 overflow-hidden outline-none">
        <DialogHeader className="p-6 bg-slate-950 text-white">
          <div className="flex items-center gap-3">
            <div className="w-1 h-5 bg-indigo-600" />
            <DialogTitle className="text-[14px] font-black uppercase tracking-[0.2em]">
              Initialisation-Flux-Client
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="p-8 space-y-5">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
              Dénomination Sociale
            </Label>
            <Input
              value={name}
              onChange={handleNameChange}
              className={cn(
                "rounded-none border-slate-200 focus:border-indigo-600 focus:ring-0 text-[13px] font-bold h-11 bg-slate-50/50 transition-none",
                errors["client-name"] && "border-rose-500 bg-rose-50/30"
              )}
              placeholder="EX: ACME HOLDING"
            />
            {errors["client-name"] && (
              <p className="text-[9px] font-black text-rose-600 uppercase italic tracking-tighter">
                {errors["client-name"]}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
              Adresse Courriel
            </Label>
            <Input
              value={email}
              onChange={handleEmailChange}
              className={cn(
                "rounded-none border-slate-200 focus:border-indigo-600 focus:ring-0 text-[13px] font-bold h-11 bg-slate-50/50 transition-none",
                errors["client-email"] && "border-rose-500 bg-rose-50/30"
              )}
              placeholder="contact@entreprise.com"
            />
            {errors["client-email"] && (
              <p className="text-[9px] font-black text-rose-600 uppercase italic tracking-tighter">
                {errors["client-email"]}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
              Numéro SIRET (14 Chiffres)
            </Label>
            <Input
              value={siret}
              onChange={handleSiretChange}
              className={cn(
                "rounded-none border-slate-200 focus:border-indigo-600 focus:ring-0 font-mono text-[13px] h-11 bg-slate-50/50 transition-none",
                errors["client-siret"] && "border-rose-500 bg-rose-50/30"
              )}
              placeholder="000 000 000 00000"
            />
            {errors["client-siret"] && (
              <p className="text-[9px] font-black text-rose-600 uppercase italic tracking-tighter">
                {errors["client-siret"]}
              </p>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1 rounded-none border-slate-200 text-[10px] font-black uppercase h-11 hover:bg-slate-50 transition-none"
            >
              Annuler
            </Button>
            <Button
              onClick={handleFormSubmit}
              disabled={isPending}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-none text-[10px] font-black uppercase h-11 transition-all"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Confirmer l'actif"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
