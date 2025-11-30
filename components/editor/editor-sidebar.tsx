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
  BadgeInfo,
  MapPin,
  Mail,
  Phone,
  Check,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Quote } from "@/store/quote.store";

interface EditorSidebarProps {
  activeQuote: Quote;
  onUpdateField: (group: string, field: string, value: any) => void;
  onSave: () => void;
  isSaving: boolean;
}

export const EditorSidebar = React.memo(
  ({ activeQuote, onUpdateField, onSave, isSaving }: EditorSidebarProps) => {
    const handleMetaChange = (field: string, value: any) => {
      onUpdateField("meta", field, value);
    };

    const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdateField("company", e.target.name, e.target.value);
    };

    // Styles de statut avec plus de "peps"
    const getStatusStyles = (status: string) => {
      switch (status) {
        case "draft":
          return {
            label: "Brouillon",
            classes:
              "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50",
          };
        case "sent":
          return {
            label: "Envoyé",
            classes:
              "bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100",
          };
        case "accepted":
          return {
            label: "Signé",
            classes:
              "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100",
          };
        case "rejected":
          return {
            label: "Refusé",
            classes: "bg-red-50 text-red-800 border-red-300 hover:bg-red-100",
          };
        default:
          return { label: "Brouillon", classes: "bg-white border-neutral-300" };
      }
    };

    const currentStatus = getStatusStyles(activeQuote.meta.status);

    return (
      <div className="flex flex-col h-full bg-white border-l border-neutral-200 w-96 shadow-xl z-30">
        {/* 1. HEADER HUD (High Contrast) */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-neutral-200 shrink-0 bg-white">
          <div className="flex items-center gap-3 overflow-hidden">
            <Link
              href="/devis"
              className="flex items-center justify-center h-8 w-8 rounded-full border border-neutral-200 text-neutral-600 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all"
              title="Retour"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>

            <div className="flex flex-col min-w-0">
              {/* Nom Client en Noir Profond */}
              <span className="font-extrabold text-sm truncate text-neutral-950 leading-tight">
                {activeQuote.client.name || "Sans Titre"}
              </span>
              <span className="text-[11px] text-neutral-500 font-mono font-medium">
                {activeQuote.quote.number}
              </span>
            </div>
          </div>

          {/* BADGE STATUT */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold border shadow-sm transition-all active:scale-95 outline-none ring-offset-1 focus:ring-2 ring-neutral-900
                  ${currentStatus.classes}
                `}
              >
                {currentStatus.label}
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-44 border-neutral-200 font-medium"
            >
              <DropdownMenuItem
                onClick={() => handleMetaChange("status", "draft")}
                className="focus:bg-neutral-100 cursor-pointer py-2"
              >
                <div className="w-2.5 h-2.5 rounded-full border border-neutral-400 bg-neutral-100 mr-2" />{" "}
                Brouillon
                {activeQuote.meta.status === "draft" && (
                  <Check className="w-4 h-4 ml-auto" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleMetaChange("status", "sent")}
                className="focus:bg-blue-50 cursor-pointer py-2"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-2" />{" "}
                Envoyé
                {activeQuote.meta.status === "sent" && (
                  <Check className="w-4 h-4 ml-auto text-blue-600" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleMetaChange("status", "accepted")}
                className="focus:bg-emerald-50 cursor-pointer py-2"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2" />{" "}
                Signé
                {activeQuote.meta.status === "accepted" && (
                  <Check className="w-4 h-4 ml-auto text-emerald-600" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleMetaChange("status", "rejected")}
                className="focus:bg-red-50 cursor-pointer py-2"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 mr-2" />{" "}
                Refusé
                {activeQuote.meta.status === "rejected" && (
                  <Check className="w-4 h-4 ml-auto text-red-600" />
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* 2. CONTENU PRINCIPAL */}
        <Tabs defaultValue="infos" className="flex-1 flex flex-col min-h-0">
          <div className="px-5 pt-6 pb-2">
            <TabsList className="w-full grid grid-cols-2 bg-neutral-100 p-1 rounded-lg h-10 border border-neutral-200">
              <TabsTrigger
                value="infos"
                className="text-xs font-bold h-8 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm data-[state=active]:ring-1 ring-neutral-200 text-neutral-500"
              >
                <FileText className="w-4 h-4 mr-2" />
                Général
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="text-xs font-bold h-8 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm data-[state=active]:ring-1 ring-neutral-200 text-neutral-500"
              >
                <Building2 className="w-4 h-4 mr-2" />
                Émetteur
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 custom-scrollbar">
            {/* --- TAB: INFOS --- */}
            <TabsContent value="infos" className="space-y-6 mt-0">
              <div className="space-y-5">
                {/* Numéro */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-neutral-900 uppercase tracking-tight">
                    Référence Devis
                  </Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
                    <Input
                      value={activeQuote.quote.number}
                      onChange={(e) =>
                        onUpdateField("quote", "number", e.target.value)
                      }
                      // CONTRASTE ÉLEVÉ : bg-white + border-neutral-300
                      className="pl-9 font-mono text-sm h-10 bg-white border-neutral-300 text-neutral-900 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 placeholder:text-neutral-400 shadow-sm"
                    />
                  </div>
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-neutral-900 uppercase tracking-tight">
                    Date d'émission
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
                    <Input
                      type="date"
                      value={activeQuote.quote.issueDate}
                      onChange={(e) =>
                        onUpdateField("quote", "issueDate", e.target.value)
                      }
                      className="pl-9 text-sm h-10 bg-white border-neutral-300 text-neutral-900 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-sm"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* --- TAB: EMETTEUR --- */}
            <TabsContent value="settings" className="space-y-6 mt-0">
              <div className="bg-blue-50 p-3 rounded-md border border-blue-200 flex gap-3">
                <BadgeInfo className="w-5 h-5 text-blue-700 shrink-0" />
                <p className="text-xs text-blue-900 font-medium leading-snug">
                  Modifiez ici les coordonnées pour{" "}
                  <strong>ce document uniquement</strong>.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-neutral-900">
                    Nom de la société
                  </Label>
                  <Input
                    name="name"
                    value={activeQuote.company.name}
                    onChange={handleCompanyChange}
                    className="h-10 text-sm font-semibold bg-white border-neutral-300 text-neutral-900 focus:border-neutral-900 shadow-sm"
                    placeholder="Votre Entreprise"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-neutral-900">
                    Email professionnel
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-neutral-500" />
                    <Input
                      name="email"
                      value={activeQuote.company.email}
                      onChange={handleCompanyChange}
                      className="h-10 text-sm pl-10 bg-white border-neutral-300 text-neutral-900 focus:border-neutral-900 shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-neutral-900">
                    Téléphone
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-neutral-500" />
                    <Input
                      name="phone"
                      value={activeQuote.company.phone}
                      onChange={handleCompanyChange}
                      className="h-10 text-sm pl-10 bg-white border-neutral-300 text-neutral-900 focus:border-neutral-900 shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-neutral-900">
                    Adresse postale
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-neutral-500" />
                    <Input
                      name="address"
                      value={activeQuote.company.address}
                      onChange={handleCompanyChange}
                      className="h-10 text-sm pl-10 bg-white border-neutral-300 text-neutral-900 focus:border-neutral-900 shadow-sm"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {/* 3. FOOTER ACTIONS */}
        <div className="p-5 border-t border-neutral-200 bg-white z-10">
          <Button
            onClick={onSave}
            // Bouton Noir Absolu pour contraste maximum
            className="w-full h-11 bg-black hover:bg-neutral-800 text-white font-bold text-sm shadow-md transition-all hover:translate-y-[-1px] border border-black"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Sauvegarde...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Enregistrer le devis
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }
);

EditorSidebar.displayName = "EditorSidebar";
