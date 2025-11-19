"use client";

import React, { useState, useEffect } from "react";
import {
  Save,
  Building2,
  FileText,
  ShieldAlert,
  Download,
  Upload,
  CheckCircle2,
} from "lucide-react";

// --- UI Components (Simulés pour l'exemple) ---
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch"; // Supposons un composant Switch
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// --- Layout Components (Ceux qu'on a créés avant) ---
// Import AppSidebar, AppTopBar...

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  // Simulation de sauvegarde
  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900 flex">
      {/* Navigation Latérale */}
      <aside className="fixed left-0 top-0 h-full w-20 bg-white border-r border-neutral-200 z-50">
        {/* ... (Même code que AppSidebar précédent) ... */}
      </aside>

      {/* Contenu Principal */}
      <main className="flex-1 pl-20 flex flex-col min-h-screen">
        {/* Header Simple */}
        <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-8 sticky top-0 z-40">
          <h1 className="text-lg font-bold text-neutral-900">Réglages</h1>
          <Button
            onClick={handleSave}
            className="bg-neutral-900 text-white hover:bg-black gap-2"
          >
            {isSaving ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSaving ? "Enregistré" : "Enregistrer les modifications"}
          </Button>
        </header>

        {/* Zone de Contenu */}
        <div className="p-8 max-w-4xl mx-auto w-full space-y-8">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="mb-8 bg-white border border-neutral-200 p-1 rounded-lg h-auto">
              <TabsTrigger
                value="general"
                className="data-[state=active]:bg-neutral-100 data-[state=active]:text-neutral-900 px-4 py-2 rounded-md text-sm font-medium flex gap-2 items-center"
              >
                <Building2 className="w-4 h-4" /> Identité
              </TabsTrigger>
              <TabsTrigger
                value="preferences"
                className="data-[state=active]:bg-neutral-100 data-[state=active]:text-neutral-900 px-4 py-2 rounded-md text-sm font-medium flex gap-2 items-center"
              >
                <FileText className="w-4 h-4" /> Devis & Facturation
              </TabsTrigger>
              <TabsTrigger
                value="data"
                className="data-[state=active]:bg-neutral-100 data-[state=active]:text-neutral-900 px-4 py-2 rounded-md text-sm font-medium flex gap-2 items-center"
              >
                <ShieldAlert className="w-4 h-4" /> Données
              </TabsTrigger>
            </TabsList>

            {/* ONGLET 1 : IDENTITÉ */}
            <TabsContent value="general" className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-6">
                <div>
                  <h3 className="text-base font-bold text-neutral-900">
                    Profil de l'entreprise
                  </h3>
                  <p className="text-sm text-neutral-500">
                    Ces informations apparaîtront automatiquement sur vos
                    nouveaux devis.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Nom de l'entreprise / Votre nom</Label>
                    <Input
                      placeholder="Ex: Alex Konan Dev"
                      className="bg-neutral-50 border-neutral-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email de contact</Label>
                    <Input
                      placeholder="contact@exemple.com"
                      className="bg-neutral-50 border-neutral-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Numéro de SIRET</Label>
                    <Input
                      placeholder="123 456 789 00012"
                      className="bg-neutral-50 border-neutral-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Téléphone</Label>
                    <Input
                      placeholder="+33 6 00 00 00 00"
                      className="bg-neutral-50 border-neutral-200"
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label>Adresse complète</Label>
                    <Input
                      placeholder="10 Rue des Freelances, 75000 Paris"
                      className="bg-neutral-50 border-neutral-200"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* ONGLET 2 : PRÉFÉRENCES */}
            <TabsContent value="preferences" className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-6">
                <div>
                  <h3 className="text-base font-bold text-neutral-900">
                    Règles de facturation
                  </h3>
                  <p className="text-sm text-neutral-500">
                    Définissez vos valeurs par défaut.
                  </p>
                </div>

                <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-100">
                  <div className="space-y-1">
                    <Label className="text-base">Mode Auto-Entrepreneur</Label>
                    <p className="text-xs text-neutral-500">
                      Force la TVA à 0% et ajoute la mention légale obligatoire.
                    </p>
                  </div>
                  <Switch /> {/* Composant Toggle */}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Taux de TVA par défaut (%)</Label>
                    <Input
                      type="number"
                      placeholder="20"
                      className="bg-neutral-50 border-neutral-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Validité des devis (jours)</Label>
                    <Input
                      type="number"
                      placeholder="30"
                      className="bg-neutral-50 border-neutral-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Mentions légales & Paiement (Pied de page)</Label>
                  <Textarea
                    className="min-h-[100px] bg-neutral-50 border-neutral-200"
                    placeholder="IBAN: FR76 ... &#10;Paiement sous 30 jours..."
                  />
                </div>
              </div>
            </TabsContent>

            {/* ONGLET 3 : DONNÉES */}
            <TabsContent value="data" className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-6">
                <div>
                  <h3 className="text-base font-bold text-neutral-900">
                    Sauvegarde & Restauration
                  </h3>
                  <p className="text-sm text-neutral-500">
                    Vos données sont stockées localement. Pensez à faire des
                    sauvegardes.
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="flex-1 h-12 gap-2 border-neutral-200"
                  >
                    <Download className="w-4 h-4" /> Exporter mes données
                    (.json)
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 h-12 gap-2 border-neutral-200"
                  >
                    <Upload className="w-4 h-4" /> Importer une sauvegarde
                  </Button>
                </div>
              </div>

              <div className="bg-red-50 p-6 rounded-xl border border-red-100 space-y-4">
                <h3 className="text-base font-bold text-red-900">
                  Zone de danger
                </h3>
                <p className="text-sm text-red-700">
                  Cette action effacera tous vos devis et réglages stockés dans
                  ce navigateur.
                </p>
                <Button
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Réinitialiser l'application
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
