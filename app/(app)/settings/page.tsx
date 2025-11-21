"use client";

import React, { useState, useEffect } from "react";
import { useQuoteStore, AppSettings } from "@/store/quote.store";
import {
  Save,
  Upload,
  Download,
  Trash2,
  Loader2,
  Building2,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  FileText,
  ShieldCheck,
  Globe,
  LayoutTemplate,
  Database,
  Hash,
  Percent,
  Home,
  ChevronRight,
  AlertOctagon,
  Laptop,
  CheckCircle2
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
// Note: On n'utilise plus les Tabs UI par défaut pour la structure, mais un state simple pour la toolbar

// --- COMPOSANTS UI "SOFTWARE" ---

const SettingsSection = ({ 
  title, 
  description, 
  children, 
  danger = false 
}: { 
  title: string; 
  description: string; 
  children: React.ReactNode; 
  danger?: boolean;
}) => (
  <section className={`group bg-white border rounded-xl overflow-hidden transition-all duration-200
    ${danger 
      ? "border-red-100 shadow-sm" 
      : "border-neutral-200 shadow-sm hover:shadow-md"
    }
  `}>
    <div className={`px-6 py-4 border-b flex items-center justify-between ${
        danger ? "bg-red-50/30 border-red-100" : "bg-neutral-50/50 border-neutral-100"
    }`}>
        <div>
            <h3 className={`text-sm font-bold ${danger ? "text-red-900" : "text-neutral-900"}`}>
            {title}
            </h3>
            <p className="text-[11px] text-neutral-500 font-medium mt-0.5">
            {description}
            </p>
        </div>
        {danger && <AlertOctagon className="w-4 h-4 text-red-400" />}
    </div>
    <div className="p-6 space-y-5">
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

const SettingsToolbar = ({ 
  activeTab, 
  setActiveTab, 
  isSaving, 
  onSave 
}: { 
  activeTab: string; 
  setActiveTab: (v: string) => void; 
  isSaving: boolean; 
  onSave: () => void; 
}) => {
  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-neutral-200 px-6 flex items-center justify-between shrink-0 sticky top-0 z-40">
      
      {/* GAUCHE : Fil d'Ariane */}
      <div className="flex items-center gap-2 text-sm text-neutral-500">
        <div className="flex items-center gap-1 hover:text-neutral-900 transition-colors cursor-pointer">
          <Home className="w-4 h-4" />
        </div>
        <ChevronRight className="w-4 h-4 text-neutral-300" />
        <span className="text-neutral-900 font-medium">Paramètres</span>
      </div>

      {/* CENTRE : Navigation Onglets (Style "OS Switcher") */}
      <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center">
        <div className="flex items-center bg-neutral-100/80 p-1 rounded-lg border border-neutral-200/50">
          {[
            { id: "identity", label: "Identité", icon: Building2 },
            { id: "billing", label: "Facturation", icon: CreditCard },
            { id: "system", label: "Système", icon: Laptop },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 transition-all duration-200 ${
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

      {/* DROITE : Actions */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 bg-neutral-100/50 px-3 py-1.5 rounded-full border border-neutral-100">
            {isSaving ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin text-neutral-600" />
                <span className="hidden xl:inline text-neutral-600">Enregistrement...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span className="hidden xl:inline text-neutral-600">Synchronisé</span>
              </>
            )}
        </div>

        <Button 
          onClick={onSave}
          size="sm" 
          className="bg-neutral-900 text-white hover:bg-black shadow-sm h-9 px-4"
          disabled={isSaving}
        >
          <Save className="w-3.5 h-3.5 mr-2" />
          Sauvegarder
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

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (field: keyof AppSettings, value: any) => {
    updateSettings({ [field]: value });
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulation de l'appel API / Latence réseau
    setTimeout(() => setIsSaving(false), 800);
  };

  // --- LOGIQUE AVANCÉE EXPORT/IMPORT (Tirée de ta V1) ---
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
          if (confirm("Attention : Cette action va remplacer toutes vos données actuelles. Continuer ?")) {
            localStorage.setItem("devis-express-store-v3", JSON.stringify(json));
            window.location.reload();
          }
        } catch (err) {
          alert("Erreur : Le fichier de sauvegarde est invalide.");
        }
      };
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-screen w-full bg-neutral-50/30">
      
      {/* HEADER LOGICIEL */}
      <SettingsToolbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isSaving={isSaving} 
        onSave={handleSave} 
      />

      {/* CONTENU SCROLLABLE */}
      <div className="flex-1 overflow-y-auto scroll-smooth p-6 md:p-8">
        <div className="max-w-6xl mx-auto pb-24 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* --- ONGLET 1 : IDENTITÉ --- */}
          {activeTab === "identity" && (
            <div className="grid grid-cols-1 gap-6">
              <SettingsSection 
                title="Profil Public" 
                description="Informations visibles sur l'en-tête de vos documents."
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputGroup label="Nom de l'entreprise" icon={Building2}>
                    <Input
                      value={settings.companyName}
                      onChange={(e) => handleChange("companyName", e.target.value)}
                      className="bg-white border-neutral-200 focus:border-neutral-400 transition-all"
                      placeholder="Ex: Acme Corp"
                    />
                  </InputGroup>

                  <InputGroup label="Email de contact" icon={Mail}>
                    <Input
                      value={settings.companyEmail}
                      onChange={(e) => handleChange("companyEmail", e.target.value)}
                      className="bg-white border-neutral-200 focus:border-neutral-400 transition-all"
                      placeholder="contact@acme.com"
                    />
                  </InputGroup>

                  <InputGroup label="Téléphone" icon={Phone}>
                    <Input
                      value={settings.companyPhone}
                      onChange={(e) => handleChange("companyPhone", e.target.value)}
                      className="bg-white border-neutral-200 focus:border-neutral-400 transition-all"
                      placeholder="+33 6..."
                    />
                  </InputGroup>

                  <InputGroup label="Site Web" icon={Globe}>
                    <Input
                      className="bg-white border-neutral-200 focus:border-neutral-400 transition-all"
                      placeholder="https://..."
                    />
                  </InputGroup>
                </div>
              </SettingsSection>

              <SettingsSection 
                title="Entité Juridique" 
                description="Adresse de facturation et identifiants légaux."
              >
                <div className="space-y-6">
                  <InputGroup label="Adresse Complète" icon={MapPin}>
                    <Textarea
                      value={settings.companyAddress}
                      onChange={(e) => handleChange("companyAddress", e.target.value)}
                      className="min-h-[80px] resize-none bg-white border-neutral-200 focus:border-neutral-400 transition-all leading-relaxed"
                      placeholder="123 Avenue..."
                    />
                  </InputGroup>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputGroup label="Numéro SIRET" icon={FileText}>
                      <Input
                        value={settings.companySiret}
                        onChange={(e) => handleChange("companySiret", e.target.value)}
                        className="bg-white border-neutral-200 font-mono text-sm focus:border-neutral-400 transition-all"
                        placeholder="000 000 000 00000"
                      />
                    </InputGroup>
                    <InputGroup label="TVA Intracom." icon={Hash}>
                      <Input
                        className="bg-white border-neutral-200 font-mono text-sm focus:border-neutral-400 transition-all"
                        placeholder="FR 00..."
                      />
                    </InputGroup>
                  </div>
                </div>
              </SettingsSection>
            </div>
          )}

          {/* --- ONGLET 2 : FACTURATION --- */}
          {activeTab === "billing" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Colonne Gauche : Paramètres */}
              <div className="lg:col-span-2 space-y-6">
                 <SettingsSection 
                    title="Séquence de Numérotation" 
                    description="Format des numéros de devis (ex: DEV-2024-001)."
                  >
                    <div className="grid grid-cols-2 gap-6">
                      <InputGroup label="Préfixe" icon={LayoutTemplate}>
                        <Input
                          value={settings.quotePrefix}
                          onChange={(e) => handleChange("quotePrefix", e.target.value)}
                          className="bg-white font-mono border-neutral-200 focus:border-neutral-400"
                          placeholder="DEV-"
                        />
                      </InputGroup>
                      <InputGroup label="Prochain Numéro" icon={Hash}>
                        <Input
                          type="number"
                          value={settings.nextNumber}
                          onChange={(e) => handleChange("nextNumber", parseInt(e.target.value))}
                          className="bg-white font-mono border-neutral-200 focus:border-neutral-400"
                        />
                      </InputGroup>
                    </div>
                 </SettingsSection>

                 <SettingsSection 
                    title="Valeurs Financières" 
                    description="Taux appliqués par défaut lors de la création."
                  >
                    <div className="grid grid-cols-2 gap-6">
                        <InputGroup label="TVA par défaut (%)" icon={Percent}>
                            <Input
                                type="number"
                                value={settings.defaultVat}
                                onChange={(e) => handleChange("defaultVat", parseFloat(e.target.value))}
                                className="bg-white text-right border-neutral-200 focus:border-neutral-400"
                            />
                        </InputGroup>
                        {/* Placeholder pour d'autres options financières */}
                        <div className="flex items-center pt-6">
                             <div className="text-xs text-neutral-400 flex items-center gap-2">
                                <CheckCircle2 className="w-3 h-3" /> Devise : EUR (€)
                             </div>
                        </div>
                    </div>
                 </SettingsSection>

                 <SettingsSection 
                    title="Mentions Légales (Pied de page)" 
                    description="Texte juridique affiché bas de chaque page."
                  >
                    <Textarea
                      value={settings.defaultTerms}
                      onChange={(e) => handleChange("defaultTerms", e.target.value)}
                      className="min-h-[120px] resize-none bg-white font-mono text-xs border-neutral-200 focus:border-neutral-400 leading-relaxed p-4"
                      placeholder="Conditions de paiement..."
                    />
                 </SettingsSection>
              </div>

              {/* Colonne Droite : Preview Widget */}
              <div className="lg:col-span-1">
                 <div className="sticky top-6">
                    <div className="bg-neutral-900 rounded-xl p-6 text-white shadow-xl shadow-neutral-900/10 overflow-hidden relative">
                        {/* Déco de fond */}
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-neutral-800 rounded-full opacity-50 blur-xl" />
                        
                        <div className="relative z-10">
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-4">
                                Aperçu du prochain devis
                            </p>
                            
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/10 mb-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <FileText className="w-4 h-4 text-neutral-300" />
                                    <span className="font-mono text-xl font-bold tracking-tight text-white">
                                        {settings.quotePrefix}{new Date().getFullYear()}-{settings.nextNumber.toString().padStart(3, "0")}
                                    </span>
                                </div>
                                <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                                    <div className="w-2/3 h-full bg-emerald-500" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-neutral-400">
                                    <span>TVA appliquée</span>
                                    <span className="text-white font-mono">{settings.defaultVat}%</span>
                                </div>
                                <div className="flex justify-between text-xs text-neutral-400">
                                    <span>Mentions légales</span>
                                    <span className="text-white font-mono">{settings.defaultTerms.length > 0 ? "Configurées" : "Vides"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-4 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                        <p className="text-xs text-emerald-800 leading-relaxed">
                            Toutes vos modifications sont appliquées instantanément aux nouveaux documents créés.
                        </p>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {/* --- ONGLET 3 : SYSTÈME --- */}
          {activeTab === "system" && (
            <div className="grid grid-cols-1 gap-6">
              
              <SettingsSection 
                title="Gestion des Données" 
                description="Sauvegardez ou restaurez l'intégralité de votre espace de travail."
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Bouton Export */}
                  <button
                    onClick={handleExport}
                    className="flex flex-col items-start p-5 bg-neutral-50 border border-neutral-200 rounded-xl hover:bg-white hover:border-neutral-300 hover:shadow-md transition-all text-left group"
                  >
                    <div className="h-10 w-10 bg-white border border-neutral-200 text-neutral-700 rounded-lg flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                      <Download className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-neutral-900">Exporter la base de données</h4>
                        <p className="text-xs text-neutral-500 mt-1">Télécharger un fichier complet (.json)</p>
                    </div>
                  </button>

                  {/* Bouton Import */}
                  <div className="relative flex flex-col items-start p-5 bg-neutral-50 border border-neutral-200 rounded-xl hover:bg-white hover:border-neutral-300 hover:shadow-md transition-all text-left group cursor-pointer">
                    <div className="h-10 w-10 bg-white border border-neutral-200 text-neutral-700 rounded-lg flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-neutral-900">Importer une sauvegarde</h4>
                        <p className="text-xs text-neutral-500 mt-1">Glissez votre fichier .json ici</p>
                    </div>
                    <Input
                      type="file"
                      accept=".json"
                      onChange={handleImport}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    />
                  </div>
                </div>
              </SettingsSection>

              <SettingsSection 
                title="Zone de Danger" 
                description="Actions destructrices pour le système."
                danger
              >
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-red-50 rounded-xl border border-red-100">
                  <div>
                    <h4 className="text-sm font-bold text-red-900 flex items-center gap-2">
                        <Trash2 className="w-4 h-4" />
                        Réinitialisation d'usine
                    </h4>
                    <p className="text-xs text-red-700/80 mt-1 max-w-md">
                      Cette action effacera <strong>définitivement</strong> tous vos devis, clients et dossiers stockés dans le navigateur.
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    className="bg-white border-2 border-red-100 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all shadow-sm shrink-0"
                    onClick={() => {
                      if (confirm("Êtes-vous ABSOLUMENT sûr ? Toutes vos données seront perdues.")) {
                        localStorage.clear();
                        window.location.reload();
                      }
                    }}
                  >
                    Tout Effacer
                  </Button>
                </div>
              </SettingsSection>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}