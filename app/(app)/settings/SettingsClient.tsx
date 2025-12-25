"use client";

import React, { useState } from "react";
import {
  Save,
  Loader2,
  Building2,
  CreditCard,
  Hash,
  Globe,
  Mail,
  Smartphone,
  MapPin,
  ArrowLeft,
  FileText,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { updateSettingsAction, SettingsPayload } from "./actions";

// --- COMPOSANTS COMPACTS ---

const BentoCard = ({
  title,
  icon: Icon,
  children,
  className,
}: {
  title: string;
  icon: any;
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "bg-white border border-zinc-200 flex flex-col p-5 shadow-sm",
      className
    )}
  >
    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-zinc-100">
      <Icon className="w-3.5 h-3.5 text-zinc-400" />
      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
        {title}
      </span>
    </div>
    <div className="flex-1 flex flex-col gap-4">{children}</div>
  </div>
);

const CompactLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="text-[9px] font-bold uppercase text-zinc-400 mb-1 block">
    {children}
  </label>
);

const CompactInput = ({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={cn(
      "w-full bg-zinc-50 text-xs font-medium text-zinc-900 border border-zinc-200 rounded-sm px-3 py-2 outline-none focus:border-indigo-500 focus:bg-white transition-all placeholder:text-zinc-300",
      className
    )}
  />
);

const CompactTextarea = ({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    {...props}
    className={cn(
      "w-full h-full bg-zinc-50 text-xs font-medium text-zinc-900 border border-zinc-200 rounded-sm px-3 py-2 outline-none focus:border-indigo-500 focus:bg-white transition-all resize-none placeholder:text-zinc-300",
      className
    )}
  />
);

// --- MAIN COMPONENT ---

export default function SettingsClient({
  initialSettings,
}: {
  initialSettings: SettingsPayload;
}) {
  const [settings, setSettings] = useState<SettingsPayload>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleChange = (field: keyof SettingsPayload, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const result = await updateSettingsAction(settings);
    if (result.success) {
      toast.success("Saved");
      router.refresh();
    } else {
      toast.error("Error");
    }
    setTimeout(() => setIsSaving(false), 500);
  };

  return (
    <div className="h-full w-full bg-[#FAFAFA] flex flex-col overflow-hidden text-zinc-900 font-sans">
      {/* 1. HEADER MINIMALISTE (H: 56px) */}
      <header className="h-14 border-b border-zinc-200 bg-white px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/editor")}
            className="w-8 h-8 flex items-center justify-center hover:bg-zinc-100 rounded-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-zinc-500" />
          </button>
          <h1 className="text-sm font-black uppercase tracking-widest text-zinc-900">
            Global Settings
          </h1>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className={cn(
            "h-8 px-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-sm",
            isSaving
              ? "bg-zinc-100 text-zinc-400"
              : "bg-black text-white hover:bg-zinc-800"
          )}
        >
          {isSaving ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Save className="w-3 h-3" />
          )}
          <span>{isSaving ? "Sauvegarder" : "Sauvegarder"}</span>
        </button>
      </header>

      {/* 2. THE GRID (Reste de la hauteur) */}
      <main className="flex-1 p-6">
        <div className="grid grid-cols-12 grid-rows-6 gap-4 h-full max-h-[800px] mx-auto max-w-[1600px]">
          {/* A. IDENTITÉ (Top Left - Large) */}
          <BentoCard
            title="Identité Commerciale"
            icon={Building2}
            className="col-span-12 md:col-span-6 row-span-3"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <CompactLabel>Nom de l'entreprise</CompactLabel>
                <CompactInput
                  value={settings.companyName}
                  onChange={(e) => handleChange("companyName", e.target.value)}
                  className="font-bold text-sm"
                />
              </div>
              <div>
                <CompactLabel>Email Contact</CompactLabel>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-400" />
                  <CompactInput
                    value={settings.companyEmail}
                    onChange={(e) =>
                      handleChange("companyEmail", e.target.value)
                    }
                    className="pl-9"
                  />
                </div>
              </div>
              <div>
                <CompactLabel>Site Web</CompactLabel>
                <div className="relative">
                  <Globe className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-400" />
                  <CompactInput
                    value={settings.companyWebsite}
                    onChange={(e) =>
                      handleChange("companyWebsite", e.target.value)
                    }
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
          </BentoCard>

          {/* B. FACTURATION (Top Right - Medium) */}
          <BentoCard
            title="Configuration Devis"
            icon={CreditCard}
            className="col-span-12 md:col-span-6 row-span-2"
          >
            <div className="grid grid-cols-3 gap-4">
              <div>
                <CompactLabel>Préfixe</CompactLabel>
                <div className="relative">
                  <Hash className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-400" />
                  <CompactInput
                    value={settings.quotePrefix}
                    onChange={(e) =>
                      handleChange("quotePrefix", e.target.value)
                    }
                    className="pl-9 font-mono"
                  />
                </div>
              </div>
              <div>
                <CompactLabel>Compteur</CompactLabel>
                <CompactInput
                  type="number"
                  value={settings.nextQuoteNumber}
                  onChange={(e) =>
                    handleChange("nextQuoteNumber", e.target.value)
                  }
                  className="font-mono"
                />
              </div>
              <div>
                <CompactLabel>TVA (%)</CompactLabel>
                <CompactInput
                  type="number"
                  value={settings.defaultVatRate}
                  onChange={(e) =>
                    handleChange("defaultVatRate", e.target.value)
                  }
                  className="font-mono"
                />
              </div>
            </div>
            <div className="mt-auto pt-2 flex justify-between items-end border-t border-zinc-50">
              <span className="text-[9px] text-zinc-400">Aperçu :</span>
              <span className="text-xs font-mono bg-zinc-100 px-2 py-1 rounded text-zinc-600">
                {settings.quotePrefix}
                {String(settings.nextQuoteNumber).padStart(3, "0")}
              </span>
            </div>
          </BentoCard>

          {/* C. LEGAL (Bottom Left - Medium) */}
          <BentoCard
            title="Juridique & Adresse"
            icon={MapPin}
            className="col-span-12 md:col-span-6 row-span-3"
          >
            <div className="flex flex-col h-full gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <CompactLabel>Téléphone</CompactLabel>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-400" />
                    <CompactInput
                      value={settings.companyPhone}
                      onChange={(e) =>
                        handleChange("companyPhone", e.target.value)
                      }
                      className="pl-9"
                    />
                  </div>
                </div>
                <div>
                  <CompactLabel>SIRET</CompactLabel>
                  <CompactInput
                    value={settings.companySiret}
                    onChange={(e) =>
                      handleChange("companySiret", e.target.value)
                    }
                    className="font-mono tracking-widest"
                  />
                </div>
              </div>
              <div className="flex-1">
                <CompactLabel>Adresse Complète</CompactLabel>
                <CompactTextarea
                  value={settings.companyAddress}
                  onChange={(e) =>
                    handleChange("companyAddress", e.target.value)
                  }
                  className="h-[calc(100%-20px)]"
                />
              </div>
            </div>
          </BentoCard>

          {/* D. CONDITIONS (Middle Right - Large Height) */}
          <BentoCard
            title="Conditions Générales (CGV)"
            icon={FileText}
            className="col-span-12 md:col-span-6 row-span-3"
          >
            <div className="flex flex-col h-full">
              <CompactLabel>Pied de page par défaut</CompactLabel>
              <CompactTextarea
                value={settings.defaultTerms}
                onChange={(e) => handleChange("defaultTerms", e.target.value)}
                className="flex-1 font-mono text-[11px] leading-relaxed p-3"
              />
            </div>
          </BentoCard>

          {/* E. DANGER (Bottom Right - Strip) */}
          <div className="col-span-12 md:col-span-6 row-span-1 flex items-center justify-between bg-red-50 border border-red-100 p-5 rounded-sm">
            <div className="flex items-center gap-3">
              <Trash2 className="w-4 h-4 text-red-600" />
              <div>
                <h3 className="text-[10px] font-black uppercase text-red-900 tracking-widest">
                  Zone Critique
                </h3>
                <p className="text-[10px] text-red-600">
                  Suppression irréversible du compte.
                </p>
              </div>
            </div>
            <button className="px-4 py-2 bg-white border border-red-200 text-red-600 text-[9px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm">
              Supprimer
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
