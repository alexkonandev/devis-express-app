"use client";

import React, { useState, useEffect } from "react";
import { useQuoteStore, AppSettings } from "@/store/quote.store";
import {
  Save, Upload, Download, Trash2, Loader2, Building2, Mail, Phone,
  MapPin, CreditCard, FileText, ShieldCheck, Globe, LayoutTemplate,
  Hash, Percent, ChevronRight, AlertOctagon, Laptop, CheckCircle2
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// --- COMPOSANTS UI "SOFTWARE" ---

const SettingsSection = ({ 
  title, description, children, danger = false 
}: { 
  title: string; description: string; children: React.ReactNode; danger?: boolean;
}) => (
  <section className={`bg-white border rounded-lg overflow-hidden transition-all duration-200 ${
    danger ? "border-red-200" : "border-neutral-200"
  }`}>
    <div className={`px-5 py-3 border-b flex items-center justify-between ${
      danger ? "bg-red-50/50 border-red-200" : "bg-neutral-50/30 border-neutral-100"
    }`}>
      <div>
        <h3 className={`text-xs font-bold ${danger ? "text-red-900" : "text-neutral-900"} uppercase tracking-wider`}>
          {title}
        </h3>
        <p className="text-[10px] text-neutral-500 font-medium mt-0.5">
          {description}
        </p>
      </div>
      {danger && <AlertOctagon className="w-4 h-4 text-red-400" />}
    </div>
    <div className="p-5 space-y-4">
      {children}
    </div>
  </section>
);

const InputGroup = ({ label, icon: Icon, children }: { label: string, icon?: any, children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <Label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
      {Icon && <Icon className="w-3 h-3" />}
      {label}
    </Label>
    {children}
  </div>
);

// --- TOOLBAR SETTINGS (Navigation Intégrée) ---

const SettingsToolbar = ({ activeTab, setActiveTab, isSaving, onSave }: any) => {
  return (
    <header className="h-14 bg-white/80 backdrop-blur-md border-b border-neutral-200 px-6 flex items-center justify-between shrink-0 sticky top-0 z-40">
      <div className="flex items-center gap-2">
        <h1 className="text-sm font-bold text-neutral-900">Paramètres</h1>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center">
        <div className="flex items-center bg-neutral-100/80 p-0.5 rounded-lg border border-neutral-200/50">
          {[
            { id: "identity", label: "Identité", icon: Building2 },
            { id: "billing", label: "Facturation", icon: CreditCard },
            { id: "system", label: "Système", icon: Laptop },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-white shadow-sm text-neutral-900"
                  : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/50"
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 bg-neutral-100/50 px-2.5 py-1 rounded-full border border-neutral-100">
          {isSaving ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin text-neutral-600" />
              <span className="hidden xl:inline text-neutral-600 text-[10px]">Enregistrement...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span className="hidden xl:inline text-neutral-600 text-[10px]">Synchronisé</span>
            </>
          )}
        </div>
        <Button onClick={onSave} size="sm" className="bg-neutral-900 text-white hover:bg-black shadow-sm h-8 px-3 text-xs font-bold" disabled={isSaving}>
          <Save className="w-3.5 h-3.5 mr-1.5" /> Sauvegarder
        </Button>
      </div>
    </header>
  );
};

// --- PAGE PRINCIPALE ---

export default function SettingsPage() {
  const { settings, updateSettings } = useQuoteStore();
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("identity");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleChange = (field: keyof AppSettings, value: any) => {
    updateSettings({ [field]: value });
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 800);
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(localStorage.getItem("devis-express-store-v3") || "{}");
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `backup_devis_express_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      fileReader.readAsText(event.target.files[0], "UTF-8");
      fileReader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          if (!json.state) throw new Error("Format invalide");
          if (confirm("Attention : Cette action va remplacer toutes vos données actuelles.")) {
            localStorage.setItem("devis-express-store-v3", JSON.stringify(json));
            window.location.reload();
          }
        } catch (err) { alert("Fichier invalide."); }
      };
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col w-full bg-neutral-50/30 min-h-full">
      <SettingsToolbar activeTab={activeTab} setActiveTab={setActiveTab} isSaving={isSaving} onSave={handleSave} />
      <div className="flex-1">
        <div className="pb-24 space-y-5 px-6 pt-6">
          
          {/* IDENTITÉ */}
          {activeTab === "identity" && (
            <div className="space-y-5 max-w-6xl">
              <SettingsSection title="Profil Public" description="Informations visibles sur l'en-tête.">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <InputGroup label="Nom de l'entreprise" icon={Building2}>
                    <Input value={settings.companyName} onChange={(e) => handleChange("companyName", e.target.value)} className="h-9 bg-white border-neutral-200 text-sm" placeholder="Ex: Acme Corp" />
                  </InputGroup>
                  <InputGroup label="Email" icon={Mail}>
                    <Input value={settings.companyEmail} onChange={(e) => handleChange("companyEmail", e.target.value)} className="h-9 bg-white border-neutral-200 text-sm" />
                  </InputGroup>
                  <InputGroup label="Téléphone" icon={Phone}>
                    <Input value={settings.companyPhone} onChange={(e) => handleChange("companyPhone", e.target.value)} className="h-9 bg-white border-neutral-200 text-sm" />
                  </InputGroup>
                  <InputGroup label="Site Web" icon={Globe}>
                    <Input className="h-9 bg-white border-neutral-200 text-sm" placeholder="https://..." />
                  </InputGroup>
                </div>
              </SettingsSection>
              <SettingsSection title="Entité Juridique" description="Adresse de facturation et légal.">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2">
                    <InputGroup label="Adresse Complète" icon={MapPin}>
                      <Textarea value={settings.companyAddress} onChange={(e) => handleChange("companyAddress", e.target.value)} className="min-h-[70px] resize-none bg-white border-neutral-200 text-sm" />
                    </InputGroup>
                  </div>
                  <InputGroup label="SIRET" icon={FileText}>
                    <Input value={settings.companySiret} onChange={(e) => handleChange("companySiret", e.target.value)} className="h-9 bg-white border-neutral-200 font-mono text-xs" />
                  </InputGroup>
                </div>
              </SettingsSection>
            </div>
          )}

          {/* FACTURATION */}
          {activeTab === "billing" && (
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
              <div className="xl:col-span-3 space-y-5">
                 <SettingsSection title="Séquence" description="Format des numéros.">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <InputGroup label="Préfixe" icon={LayoutTemplate}>
                        <Input value={settings.quotePrefix} onChange={(e) => handleChange("quotePrefix", e.target.value)} className="h-9 bg-white font-mono border-neutral-200 text-sm" />
                      </InputGroup>
                      <InputGroup label="Prochain N°" icon={Hash}>
                        <Input type="number" value={settings.nextNumber} onChange={(e) => handleChange("nextNumber", parseInt(e.target.value))} className="h-9 bg-white font-mono border-neutral-200 text-sm" />
                      </InputGroup>
                      <InputGroup label="TVA Défaut (%)" icon={Percent}>
                        <Input type="number" value={settings.defaultVat} onChange={(e) => handleChange("defaultVat", parseFloat(e.target.value))} className="h-9 bg-white text-right border-neutral-200 text-sm" />
                      </InputGroup>
                    </div>
                 </SettingsSection>
                 <SettingsSection title="Mentions Légales" description="Pied de page par défaut.">
                    <Textarea value={settings.defaultTerms} onChange={(e) => handleChange("defaultTerms", e.target.value)} className="min-h-[100px] resize-none bg-white font-mono text-xs border-neutral-200 p-3" />
                 </SettingsSection>
              </div>
              <div className="xl:col-span-1 sticky top-20 h-fit">
                 <div className="bg-neutral-900 rounded-lg p-5 text-white shadow-lg relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Aperçu</p>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/10 mb-4">
                            <span className="font-mono text-lg font-bold text-white">{settings.quotePrefix}{new Date().getFullYear()}-{settings.nextNumber.toString().padStart(3, "0")}</span>
                        </div>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {/* SYSTÈME */}
          {activeTab === "system" && (
            <div className="space-y-5 max-w-4xl">
              <SettingsSection title="Données" description="Sauvegarde et restauration.">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button onClick={handleExport} className="flex items-center gap-4 p-4 bg-neutral-50 border border-neutral-200 rounded-lg hover:bg-white transition-all text-left">
                    <div className="h-9 w-9 bg-white border border-neutral-200 rounded-lg flex items-center justify-center"><Download className="w-4 h-4" /></div>
                    <div><h4 className="font-bold text-sm">Exporter</h4><p className="text-xs text-neutral-500">Format .json</p></div>
                  </button>
                  <div className="relative flex items-center gap-4 p-4 bg-neutral-50 border border-neutral-200 rounded-lg hover:bg-white transition-all text-left cursor-pointer">
                    <div className="h-9 w-9 bg-white border border-neutral-200 rounded-lg flex items-center justify-center"><Upload className="w-4 h-4" /></div>
                    <div><h4 className="font-bold text-sm">Importer</h4><p className="text-xs text-neutral-500">Glisser fichier</p></div>
                    <Input type="file" accept=".json" onChange={handleImport} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  </div>
                </div>
              </SettingsSection>
              <SettingsSection title="Zone Danger" description="Irréversible." danger>
                <div className="flex items-center justify-between gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                  <h4 className="text-sm font-bold text-red-900 flex items-center gap-2"><Trash2 className="w-4 h-4" /> Reset Usine</h4>
                  <Button variant="destructive" className="bg-white border-2 border-red-100 text-red-600 hover:bg-red-600 hover:text-white h-8 text-xs" onClick={() => { if (confirm("Sûr ?")) { localStorage.clear(); window.location.reload(); } }}>Tout Effacer</Button>
                </div>
              </SettingsSection>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}