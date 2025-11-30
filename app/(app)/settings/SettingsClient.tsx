"use client";

import React, { useState } from "react";
import {
  Save,
  Building2,
  CreditCard,
  Loader2,
  ChevronRight,
  Globe,
  Hash,
  FileText,
  ShieldCheck,
  Smartphone,
  Mail,
  MapPin,
  AlertTriangle,
  History,
  Percent,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { updateSettingsAction, SettingsPayload } from "./actions";
import { useRouter } from "next/navigation";

// --- COMPOSANTS UI ---

const SettingsSection = ({
  title,
  description,
  children,
  danger = false,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  danger?: boolean;
}) => (
  <div
    className={`mb-8 bg-white border rounded-xl overflow-hidden shadow-sm ${
      danger ? "border-red-200" : "border-neutral-200"
    }`}
  >
    <div
      className={`px-6 py-4 border-b ${
        danger
          ? "bg-red-50/50 border-red-100"
          : "bg-neutral-50/50 border-neutral-100"
      }`}
    >
      <h3
        className={`text-sm font-bold flex items-center gap-2 ${
          danger ? "text-red-700" : "text-neutral-900"
        }`}
      >
        {danger && <AlertTriangle className="w-4 h-4" />}
        {title}
      </h3>
      <p className="text-xs text-neutral-500 mt-1">{description}</p>
    </div>
    <div className="p-6 space-y-6">{children}</div>
  </div>
);

const InputRow = ({
  label,
  icon: Icon,
  children,
  helper,
}: {
  label: string;
  icon?: React.ElementType;
  children: React.ReactNode;
  helper?: string;
}) => (
  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
    <div className="md:col-span-4">
      <Label className="text-sm font-bold text-neutral-800 flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-neutral-400" />}
        {label}
      </Label>
      {helper && (
        <p className="text-[11px] text-neutral-400 mt-1.5 leading-relaxed pr-4">
          {helper}
        </p>
      )}
    </div>
    <div className="md:col-span-8">{children}</div>
  </div>
);

// --- COMPOSANT PRINCIPAL ---

export default function SettingsClient({
  initialSettings,
}: {
  initialSettings: SettingsPayload;
}) {
  const [settings, setSettings] = useState<SettingsPayload>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("identity");
  const router = useRouter();

  const handleChange = (field: keyof SettingsPayload, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const result = await updateSettingsAction(settings);
    if (result.success) {
      router.refresh();
    } else {
      alert("Erreur: " + result.error);
    }
    setTimeout(() => setIsSaving(false), 500);
  };

  const menuItems = [
    { id: "identity", label: "Identité & Branding", icon: Building2 },
    { id: "billing", label: "Facturation & Devis", icon: CreditCard },
    { id: "system", label: "Zone Danger", icon: ShieldCheck },
  ];

  return (
    <div className="flex h-[calc(100vh-3.5rem)] bg-neutral-50 overflow-hidden">
      {/* A. SIDEBAR NAVIGATION (Fixe à gauche) */}
      <aside className="w-64 bg-white border-r border-neutral-200 flex-none overflow-y-auto py-6 flex flex-col">
        <div className="px-6 mb-6">
          <h2 className="text-xs font-black text-neutral-900 uppercase tracking-widest">
            Paramètres
          </h2>
        </div>
        <nav className="space-y-1 px-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded-lg transition-all group ${
                activeTab === item.id
                  ? "bg-neutral-900 text-white shadow-md"
                  : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
              }`}
            >
              <item.icon
                className={`w-4 h-4 transition-colors ${
                  activeTab === item.id
                    ? "text-white"
                    : "text-neutral-400 group-hover:text-neutral-900"
                }`}
              />
              {item.label}
              {activeTab === item.id && (
                <ChevronRight className="w-3 h-3 ml-auto opacity-50" />
              )}
            </button>
          ))}
        </nav>
      </aside>

      {/* B. CONTENU PRINCIPAL */}
      <main className="flex-1 flex flex-col min-w-0 bg-neutral-50/50 relative">
        {/* HEADER ACTION */}
        <header className="h-16 flex-none flex items-center justify-between px-8 border-b border-neutral-200 bg-white sticky top-0 z-10 ">
          <div>
            <h1 className="text-lg font-bold text-neutral-900 tracking-tight">
              {menuItems.find((i) => i.id === activeTab)?.label}
            </h1>
          </div>

          <Button
            onClick={handleSave}
            size="sm"
            className="bg-neutral-900 text-white hover:bg-black shadow-lg shadow-neutral-900/10 h-9 px-6 text-xs font-bold transition-all"
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
            ) : (
              <Save className="w-3.5 h-3.5 mr-2" />
            )}
            {isSaving ? "Sauvegarde..." : "Enregistrer"}
          </Button>
        </header>

        {/* CONTENU SCROLLABLE (CENTRÉ) */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className=" mx-auto space-y-8 pb-20">
            {/* TAB: IDENTITY */}
            {activeTab === "identity" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
                <SettingsSection
                  title="Profil Public"
                  description="Ces informations sont visibles sur l'en-tête de vos documents."
                >
                  <InputRow
                    label="Nom de l'entreprise"
                    icon={Building2}
                    helper="Le nom commercial ou légal."
                  >
                    <Input
                      value={settings.companyName}
                      onChange={(e) =>
                        handleChange("companyName", e.target.value)
                      }
                      placeholder="Ex: Acme Corp"
                      className="font-bold bg-neutral-50/50 focus:bg-white transition-colors"
                    />
                  </InputRow>
                  <Separator className="bg-neutral-100" />
                  <InputRow
                    label="Email de contact"
                    icon={Mail}
                    helper="Apparaîtra sous le nom de l'entreprise."
                  >
                    <Input
                      value={settings.companyEmail}
                      onChange={(e) =>
                        handleChange("companyEmail", e.target.value)
                      }
                    />
                  </InputRow>
                  <Separator className="bg-neutral-100" />
                  <InputRow label="Site Internet" icon={Globe}>
                    <Input
                      value={settings.companyWebsite}
                      onChange={(e) =>
                        handleChange("companyWebsite", e.target.value)
                      }
                      placeholder="https://"
                    />
                  </InputRow>
                </SettingsSection>

                <SettingsSection
                  title="Mentions Légales"
                  description="Obligatoire pour la validité fiscale de vos devis."
                >
                  <InputRow
                    label="Adresse du siège"
                    icon={MapPin}
                    helper="Adresse complète incluant code postal et ville."
                  >
                    <Textarea
                      value={settings.companyAddress}
                      onChange={(e) =>
                        handleChange("companyAddress", e.target.value)
                      }
                      className="min-h-[80px] resize-none"
                    />
                  </InputRow>
                  <Separator className="bg-neutral-100" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-xs font-bold text-neutral-700 mb-2 block">
                        Téléphone
                      </Label>
                      <div className="relative">
                        <Smartphone className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                        <Input
                          value={settings.companyPhone}
                          onChange={(e) =>
                            handleChange("companyPhone", e.target.value)
                          }
                          className="pl-9"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs font-bold text-neutral-700 mb-2 block">
                        SIRET / SIREN
                      </Label>
                      <div className="relative">
                        <ShieldCheck className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                        <Input
                          value={settings.companySiret}
                          onChange={(e) =>
                            handleChange("companySiret", e.target.value)
                          }
                          className="pl-9 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </SettingsSection>
              </div>
            )}

            {/* TAB: BILLING */}
            {activeTab === "billing" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
                <SettingsSection
                  title="Séquençage"
                  description="Format automatique de vos numéros de documents."
                >
                  <div className="grid grid-cols-2 gap-6">
                    <InputRow
                      label="Préfixe"
                      icon={Hash}
                      helper="Ex: DEV-2024-"
                    >
                      <Input
                        value={settings.quotePrefix}
                        onChange={(e) =>
                          handleChange("quotePrefix", e.target.value)
                        }
                        className="font-mono font-bold"
                      />
                    </InputRow>
                    <InputRow
                      label="Compteur"
                      icon={History}
                      helper="Numéro du prochain devis."
                    >
                      <Input
                        type="number"
                        value={settings.nextQuoteNumber}
                        onChange={(e) =>
                          handleChange(
                            "nextQuoteNumber",
                            parseInt(e.target.value)
                          )
                        }
                        className="font-mono"
                      />
                    </InputRow>
                  </div>
                  <div className="mt-4 p-4 bg-neutral-100 rounded-lg border border-neutral-200 flex items-center justify-between">
                    <span className="text-xs text-neutral-600 font-medium">
                      Aperçu du prochain numéro généré :
                    </span>
                    <span className="font-mono font-bold text-sm bg-white px-3 py-1 rounded border border-neutral-200 text-neutral-900 shadow-sm">
                      {settings.quotePrefix}
                      {settings.nextQuoteNumber.toString().padStart(3, "0")}
                    </span>
                  </div>
                </SettingsSection>

                <SettingsSection
                  title="Conditions par défaut"
                  description="Appliquées à chaque nouveau devis créé."
                >
                  <InputRow label="Taux de TVA (%)" icon={Percent}>
                    <Input
                      type="number"
                      value={settings.defaultVatRate}
                      onChange={(e) =>
                        handleChange(
                          "defaultVatRate",
                          parseFloat(e.target.value)
                        )
                      }
                      className="max-w-[120px]"
                    />
                  </InputRow>
                  <Separator className="bg-neutral-100" />
                  <InputRow
                    label="Pied de page / CGV"
                    icon={FileText}
                    helper="Conditions de paiement, pénalités de retard, mentions légales..."
                  >
                    <Textarea
                      value={settings.defaultTerms}
                      onChange={(e) =>
                        handleChange("defaultTerms", e.target.value)
                      }
                      className="min-h-[120px] text-xs font-mono bg-neutral-50/50"
                    />
                  </InputRow>
                </SettingsSection>
              </div>
            )}

            {/* TAB: SYSTEM */}
            {activeTab === "system" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
                <SettingsSection
                  title="Zone de Danger"
                  description="Actions irréversibles sur votre compte."
                  danger
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-neutral-900">
                        Supprimer le compte
                      </h4>
                      <p className="text-xs text-neutral-500 mt-1 max-w-sm leading-relaxed">
                        Cette action supprimera définitivement tous vos devis,
                        clients et paramètres de nos serveurs.
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 font-bold shadow-sm"
                    >
                      Supprimer définitivement
                    </Button>
                  </div>
                </SettingsSection>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
