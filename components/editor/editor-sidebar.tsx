"use client";

import React from "react";
import {
  ChevronLeft,
  Calendar,
  Hash,
  Save,
  Loader2,
  Building2,
  FileText,
  MapPin,
  Mail,
  Phone,
  Clock,
  CreditCard,
  MoreHorizontal,
  ArrowUpRight,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator"; // Assure-toi d'avoir ce composant ou remplace par <hr />
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Quote } from "@/store/quote.store";

interface EditorSidebarProps {
  activeQuote: Quote;
  onUpdateField: (group: string, field: string, value: any) => void;
  onSave: () => void;
  isSaving: boolean;
}

export const EditorSidebar = React.memo(
  ({ activeQuote, onUpdateField, onSave, isSaving }: EditorSidebarProps) => {
    // Handlers simplifiés
    const handleMetaChange = (field: string, val: any) =>
      onUpdateField("meta", field, val);
    const handleQuoteChange = (field: string, val: any) =>
      onUpdateField("quote", field, val);
    const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) =>
      onUpdateField("company", e.target.name, e.target.value);

    // Composant Helper pour les Labels "Tech"
    const TechLabel = ({
      children,
      icon: Icon,
    }: {
      children: React.ReactNode;
      icon?: any;
    }) => (
      <Label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
        {Icon && <Icon className="w-3 h-3" />}
        {children}
      </Label>
    );

    // Badge Statut Ultra-Minimaliste
    const StatusBadge = ({ status }: { status: string }) => {
      const styles = {
        draft: "bg-neutral-100 text-neutral-600 border-neutral-200",
        sent: "bg-blue-50 text-blue-700 border-blue-200",
        accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
        rejected: "bg-red-50 text-red-700 border-red-200",
      };
      // @ts-ignore
      const currentStyle = styles[status] || styles.draft;
      const labels = {
        draft: "Brouillon",
        sent: "Envoyé",
        accepted: "Signé",
        rejected: "Refusé",
      };

      return (
        <div
          className={`px-2 py-1 rounded-[4px] border text-[10px] font-bold uppercase tracking-wide ${currentStyle}`}
        >
          {/* @ts-ignore */}
          {labels[status]}
        </div>
      );
    };

    return (
      <aside className="flex flex-col w-88 h-full bg-[#FAFAFA] border-l border-neutral-200 shadow-2xl z-40 text-neutral-900">
        {/* --- 1. HEADER TYPE "TOOLBAR" --- */}
        <div className="h-16 flex items-center justify-between px-4 bg-white border-b border-neutral-200 shrink-0">
          <div className="flex items-center gap-3">
            <Link
              href="/devis"
              className="flex items-center justify-center w-6 h-6 rounded hover:bg-neutral-100 text-neutral-500 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </Link>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-neutral-900">
                Propriétés
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={activeQuote.meta.status} />
          </div>
        </div>

        {/* --- 2. CONTENU PRINCIPAL (Scrollable) --- */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <Tabs defaultValue="general" className="w-full">
            {/* Navigation Tabs type "Segmented Control" iOS/Mac */}
            <div className="px-4 py-3 bg-white border-b border-neutral-200 sticky top-0 z-10">
              <TabsList className="w-full h-8 bg-neutral-100 p-0.5 rounded-md border border-neutral-200">
                <TabsTrigger
                  value="general"
                  className="flex-1 text-[11px] font-medium h-full rounded-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-black text-neutral-500"
                >
                  Général
                </TabsTrigger>
                <TabsTrigger
                  value="billing"
                  className="flex-1 text-[11px] font-medium h-full rounded-sm data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-black text-neutral-500"
                >
                  Facturation
                </TabsTrigger>
              </TabsList>
            </div>

            {/* === ONGLET GÉNÉRAL === */}
            <TabsContent value="general" className="mt-0 p-0">
              {/* BLOC 1 : IDENTIFICATION */}
              <div className="p-4 space-y-4 border-b border-neutral-200 bg-white">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <TechLabel icon={Hash}>Référence</TechLabel>
                    <Input
                      value={activeQuote.quote.number}
                      onChange={(e) =>
                        handleQuoteChange("number", e.target.value)
                      }
                      className="h-8 text-xs font-mono bg-white border-neutral-300 focus-visible:ring-1 focus-visible:ring-black shadow-sm"
                    />
                  </div>
                  <div>
                    <TechLabel icon={Calendar}>Date</TechLabel>
                    <Input
                      type="date"
                      value={activeQuote.quote.issueDate}
                      onChange={(e) =>
                        handleQuoteChange("issueDate", e.target.value)
                      }
                      className="h-8 text-xs bg-white border-neutral-300 focus-visible:ring-1 focus-visible:ring-black shadow-sm"
                    />
                  </div>
                </div>
              </div>

              {/* BLOC 2 : WORKFLOW & VALIDITÉ */}
              <div className="p-4 space-y-4 border-b border-neutral-200 bg-white">
                <div className="space-y-3">
                  <div>
                    <TechLabel icon={LayoutDashboard}>État du cycle</TechLabel>
                    <Select
                      value={activeQuote.meta.status}
                      onValueChange={(val) => handleMetaChange("status", val)}
                    >
                      <SelectTrigger className="h-8 text-xs bg-white border-neutral-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft" className="text-xs">
                          Brouillon
                        </SelectItem>
                        <SelectItem value="sent" className="text-xs">
                          Envoyé au client
                        </SelectItem>
                        <SelectItem value="accepted" className="text-xs">
                          Signé / Validé
                        </SelectItem>
                        <SelectItem value="rejected" className="text-xs">
                          Refusé / Perdu
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <TechLabel icon={Clock}>Validité (Jours)</TechLabel>
                      <Input
                        type="number"
                        value={activeQuote.meta.validityDays || 30}
                        onChange={(e) =>
                          handleMetaChange(
                            "validityDays",
                            parseInt(e.target.value)
                          )
                        }
                        className="h-8 text-xs bg-white border-neutral-300 text-right pr-2"
                      />
                    </div>
                    <div className="flex items-end pb-1 text-[10px] text-neutral-400">
                      Expire le:{" "}
                      <span className="text-neutral-600 font-mono ml-1">
                        Calcul auto...
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* BLOC 3 : CONDITIONS FINANCIÈRES */}
              <div className="p-4 bg-white border-b border-neutral-200">
                <TechLabel icon={CreditCard}>Conditions de règlement</TechLabel>
                <Textarea
                  value={activeQuote.meta.paymentTerms || ""}
                  onChange={(e) =>
                    handleMetaChange("paymentTerms", e.target.value)
                  }
                  className="min-h-[100px] text-xs leading-relaxed bg-neutral-50/50 border-neutral-300 resize-none focus-visible:ring-1 focus-visible:ring-black"
                  placeholder="Ex: Acompte de 30% à la commande, solde à la livraison."
                />
              </div>
            </TabsContent>

            {/* === ONGLET FACTURATION (EMETTEUR) === */}
            <TabsContent value="billing" className="mt-0 p-0">
              <div className="p-4 bg-blue-50/30 border-b border-blue-100">
                <p className="text-[11px] text-blue-800 flex gap-2">
                  <Building2 className="w-4 h-4 shrink-0" />
                  Personnalisation locale de l'émetteur pour ce document.
                </p>
              </div>

              <div className="p-4 space-y-4 bg-white border-b border-neutral-200">
                <div className="space-y-3">
                  <div>
                    <TechLabel>Nom Entité</TechLabel>
                    <Input
                      name="name"
                      value={activeQuote.company.name}
                      onChange={handleCompanyChange}
                      className="h-8 text-xs font-semibold bg-white border-neutral-300"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <TechLabel icon={Mail}>Email Contact</TechLabel>
                      <Input
                        name="email"
                        value={activeQuote.company.email}
                        onChange={handleCompanyChange}
                        className="h-8 text-xs bg-white border-neutral-300"
                      />
                    </div>
                    <div>
                      <TechLabel icon={Phone}>Téléphone</TechLabel>
                      <Input
                        name="phone"
                        value={activeQuote.company.phone}
                        onChange={handleCompanyChange}
                        className="h-8 text-xs bg-white border-neutral-300"
                      />
                    </div>
                  </div>

                  <div>
                    <TechLabel icon={MapPin}>Siège Social</TechLabel>
                    <Textarea
                      name="address"
                      value={activeQuote.company.address}
                      onChange={(e) =>
                        onUpdateField("company", "address", e.target.value)
                      }
                      className="h-16 text-xs bg-white border-neutral-300 resize-none"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* --- 3. FOOTER ACTIONS (Sticky Bottom) --- */}
        <div className="p-4 bg-white border-t border-neutral-200 shrink-0 space-y-3">
          {/* Métriques rapides (Optionnel mais "Pro") */}
          <div className="flex justify-between text-[10px] text-neutral-400 font-mono uppercase">
            <span>v1.2.0</span>
            <span>Auto-Save: ON</span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {/* Bouton secondaire (Sauvegarder) */}
            <Button
              variant="outline"
              onClick={onSave}
              disabled={isSaving}
              className="col-span-1 h-9 bg-white border-neutral-300 hover:bg-neutral-50 p-0"
              title="Sauvegarder sans fermer"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4 text-neutral-600" />
              )}
            </Button>

            {/* Bouton Primaire (Action Business) */}
            <Button
              onClick={onSave}
              disabled={isSaving}
              className="col-span-3 h-9 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold shadow-sm border border-black"
            >
              <ArrowUpRight className="w-3.5 h-3.5 mr-2" />
              Finaliser & Exporter
            </Button>
          </div>
        </div>
      </aside>
    );
  }
);

EditorSidebar.displayName = "EditorSidebar";
