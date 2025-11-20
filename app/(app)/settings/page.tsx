"use client";

import React, { useState, useEffect } from "react";
import { useQuoteStore } from "@/store/quote.store";
import {
  Building2,
  Save,
  ShieldCheck,
  FileJson,
  Upload,
  Download,
  Hash,
  Percent,
  Trash2,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function SettingsPage() {
  // On imagine que tu as ajouté `settings` dans ton store comme discuté
  // Si ce n'est pas encore fait, voici comment on simule l'état local pour l'instant
  // Idéalement, connecte ces champs au store : useQuoteStore(state => state.settings)
  
  const [companyProfile, setCompanyProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    siret: "",
    website: ""
  });

  const [preferences, setPreferences] = useState({
    defaultVat: 20,
    quotePrefix: "DEV-",
    nextNumber: 1,
    defaultTerms: ""
  });

  const [isSaving, setIsSaving] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  // Simulation chargement
  useEffect(() => {
      // Ici, charger depuis le store
      setCompanyProfile({
          name: "Mon Entreprise",
          email: "contact@entreprise.com",
          phone: "+33 6 00 00 00 00",
          address: "10 Rue de la Paix, 75000 Paris",
          siret: "",
          website: ""
      });
  }, []);

  const handleSave = () => {
      setIsSaving(true);
      // Simulation save au store
      setTimeout(() => setIsSaving(false), 1000);
  };

  // --- GESTION IMPORT / EXPORT ---
  const handleExport = () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(localStorage.getItem("devis-express-store-v3") || "{}");
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href",     dataStr);
      downloadAnchorNode.setAttribute("download", "devis_express_backup.json");
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
                // Validation basique
                if (!json.state || !json.state.quotes) throw new Error("Format invalide");
                
                // Sauvegarde brute dans le localStorage (Attention : écrase tout !)
                localStorage.setItem("devis-express-store-v3", JSON.stringify(json));
                window.location.reload(); // Recharger pour appliquer
            } catch (err) {
                setImportError("Le fichier ne semble pas être une sauvegarde valide.");
            }
        };
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-neutral-50 overflow-hidden font-sans text-neutral-900">
      
      {/* HEADER */}
      <header className="h-16 bg-white border-b border-neutral-200 px-8 flex items-center justify-between shrink-0 sticky top-0 z-20">
         <h1 className="text-lg font-bold">Réglages</h1>
         <Button onClick={handleSave} disabled={isSaving} className="bg-neutral-900 text-white hover:bg-black gap-2 min-w-[140px]">
             {isSaving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>}
             {isSaving ? "Enregistrement..." : "Enregistrer"}
         </Button>
      </header>

      {/* CONTENU */}
      <div className="flex-1 overflow-y-auto p-8">
         <div className="max-w-4xl mx-auto space-y-8 pb-20">
            
            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8 bg-white border border-neutral-200 h-12 p-1 rounded-xl">
                    <TabsTrigger value="profile" className="rounded-lg data-[state=active]:bg-neutral-100 data-[state=active]:text-neutral-900">Profil & Identité</TabsTrigger>
                    <TabsTrigger value="config" className="rounded-lg data-[state=active]:bg-neutral-100 data-[state=active]:text-neutral-900">Configuration Devis</TabsTrigger>
                    <TabsTrigger value="data" className="rounded-lg data-[state=active]:bg-neutral-100 data-[state=active]:text-neutral-900">Données & Backup</TabsTrigger>
                </TabsList>

                {/* --- ONGLET 1 : PROFIL --- */}
                <TabsContent value="profile" className="space-y-6">
                    <Card className="border-neutral-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Building2 className="w-5 h-5"/> Identité de l'entreprise</CardTitle>
                            <CardDescription>Ces informations apparaîtront automatiquement en haut de vos nouveaux devis.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Nom de l'entreprise / Votre nom</Label>
                                    <Input value={companyProfile.name} onChange={(e) => setCompanyProfile({...companyProfile, name: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email de contact</Label>
                                    <Input value={companyProfile.email} onChange={(e) => setCompanyProfile({...companyProfile, email: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Numéro de téléphone</Label>
                                    <Input value={companyProfile.phone} onChange={(e) => setCompanyProfile({...companyProfile, phone: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <Label>SIRET / N° Immatriculation</Label>
                                    <Input value={companyProfile.siret} onChange={(e) => setCompanyProfile({...companyProfile, siret: e.target.value})} placeholder="Optionnel" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Adresse complète</Label>
                                <Input value={companyProfile.address} onChange={(e) => setCompanyProfile({...companyProfile, address: e.target.value})} />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- ONGLET 2 : CONFIGURATION --- */}
                <TabsContent value="config" className="space-y-6">
                     <Card className="border-neutral-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Hash className="w-5 h-5"/> Numérotation & Finances</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label>Préfixe des devis</Label>
                                    <Input value={preferences.quotePrefix} onChange={(e) => setPreferences({...preferences, quotePrefix: e.target.value})} className="font-mono" />
                                    <p className="text-[10px] text-neutral-500">Ex: DEV-2024-</p>
                                </div>
                                <div className="space-y-2">
                                    <Label>Prochain numéro</Label>
                                    <Input type="number" value={preferences.nextNumber} onChange={(e) => setPreferences({...preferences, nextNumber: parseInt(e.target.value)})} className="font-mono" />
                                </div>
                                <div className="space-y-2">
                                    <Label>TVA par défaut (%)</Label>
                                    <div className="relative">
                                        <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                        <Input type="number" value={preferences.defaultVat} onChange={(e) => setPreferences({...preferences, defaultVat: parseFloat(e.target.value)})} className="pl-9" />
                                    </div>
                                </div>
                             </div>
                             
                             <Separator />
                             
                             <div className="space-y-2">
                                <Label>Mentions légales par défaut (Pied de page)</Label>
                                <Textarea 
                                    className="min-h-[120px] bg-neutral-50" 
                                    placeholder="Conditions de paiement, pénalités de retard, RIB..." 
                                    value={preferences.defaultTerms}
                                    onChange={(e) => setPreferences({...preferences, defaultTerms: e.target.value})}
                                />
                             </div>
                        </CardContent>
                     </Card>
                </TabsContent>

                {/* --- ONGLET 3 : DATA --- */}
                <TabsContent value="data" className="space-y-6">
                     <Alert className="bg-blue-50 border-blue-200 text-blue-800">
                        <ShieldCheck className="h-4 w-4" />
                        <AlertTitle>Vos données sont privées</AlertTitle>
                        <AlertDescription>
                            Tout est stocké localement dans votre navigateur. Aucune donnée n'est envoyée sur un serveur.
                            Pensez à faire des sauvegardes régulières.
                        </AlertDescription>
                    </Alert>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         {/* EXPORT */}
                         <Card className="border-neutral-200 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Download className="w-5 h-5"/> Exporter</CardTitle>
                                <CardDescription>Téléchargez une copie complète de vos devis et réglages.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button onClick={handleExport} variant="outline" className="w-full border-neutral-300 hover:bg-neutral-100">
                                    <FileJson className="w-4 h-4 mr-2"/> Télécharger le fichier .json
                                </Button>
                            </CardContent>
                         </Card>

                         {/* IMPORT */}
                         <Card className="border-neutral-200 shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Upload className="w-5 h-5"/> Restaurer</CardTitle>
                                <CardDescription>Importez un fichier de sauvegarde précédemment exporté.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="relative">
                                    <Input 
                                        type="file" 
                                        accept=".json" 
                                        onChange={handleImport}
                                        className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-neutral-100 file:text-neutral-700 hover:file:bg-neutral-200"
                                    />
                                </div>
                                {importError && <p className="text-xs text-red-500 font-medium">{importError}</p>}
                            </CardContent>
                         </Card>
                     </div>

                     {/* DANGER ZONE */}
                     <Card className="border-red-100 bg-red-50/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-red-700"><AlertTriangle className="w-5 h-5"/> Zone de Danger</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="font-bold text-sm text-red-900">Réinitialiser l'application</p>
                                <p className="text-xs text-red-700">Cette action effacera tous vos devis et réglages. C'est irréversible.</p>
                            </div>
                            <Button variant="destructive" onClick={() => {
                                if(confirm("Êtes-vous sûr de vouloir tout effacer ?")) {
                                    localStorage.clear();
                                    window.location.reload();
                                }
                            }}>
                                <Trash2 className="w-4 h-4 mr-2"/> Tout effacer
                            </Button>
                        </CardContent>
                     </Card>
                </TabsContent>

            </Tabs>

         </div>
      </div>

    </div>
  );
}