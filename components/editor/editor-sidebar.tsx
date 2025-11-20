import React from "react";
import {
  Settings,
  FileText,
  Palette,
  ChevronLeft,
  Folder,
  CheckCircle2,
  Calendar,
  Hash,
  Save,
  Download,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Quote } from "@/store/quote.store";

interface EditorSidebarProps {
  activeQuote: Quote;
  folders: { id: string; name: string }[];
  onUpdateField: (group: string, field: string, value: any) => void;
  onSave: () => void;
  isSaving: boolean;
}

export const EditorSidebar = ({
  activeQuote,
  folders,
  onUpdateField,
  onSave,
  isSaving,
}: EditorSidebarProps) => {
  const handleMetaChange = (field: string, value: any) => {
    onUpdateField("meta", field, value);
  };

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateField("company", e.target.name, e.target.value);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="h-16 flex items-center px-4 border-b border-neutral-200 shrink-0 gap-3">
        <Link
          href="/mes-devis"
          className="flex items-center justify-center h-8 w-8 rounded-lg text-neutral-500 hover:bg-neutral-100 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-sm truncate">
            {activeQuote.client.name || "Nouveau Devis"}
          </h1>
          <p className="text-[10px] text-neutral-400 font-mono">
            {activeQuote.quote.number}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="infos" className="flex-1 flex flex-col min-h-0">
        <div className="px-4 pt-4">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="infos">Infos</TabsTrigger>
            <TabsTrigger value="settings">Réglages</TabsTrigger>
            <TabsTrigger value="design" disabled>
              Design
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <TabsContent value="infos" className="space-y-6 mt-0">
            {/* Status */}
            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase text-neutral-400">
                Statut & Dossier
              </Label>
              <div className="space-y-2">
                <Select
                  value={activeQuote.meta.status}
                  onValueChange={(val) => handleMetaChange("status", val)}
                >
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-neutral-400" />
                      <SelectValue placeholder="Statut" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="sent">Envoyé</SelectItem>
                    <SelectItem value="accepted">Accepté</SelectItem>
                    <SelectItem value="rejected">Refusé</SelectItem>
                    <SelectItem value="archived">Archivé</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={activeQuote.meta.folderId || "root"}
                  onValueChange={(val) =>
                    handleMetaChange("folderId", val === "root" ? null : val)
                  }
                >
                  <SelectTrigger>
                    <div className="flex items-center gap-2">
                      <Folder className="w-4 h-4 text-neutral-400" />
                      <SelectValue placeholder="Dossier" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="root">Racine (Aucun)</SelectItem>
                    {folders.map((f) => (
                      <SelectItem key={f.id} value={f.id}>
                        {f.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Dates & Number */}
            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase text-neutral-400">
                Détails
              </Label>
              <div className="space-y-2">
                <div className="grid gap-1.5">
                  <Label className="text-xs text-neutral-500">Numéro</Label>
                  <div className="relative">
                    <Hash className="absolute left-2.5 top-2.5 w-4 h-4 text-neutral-400" />
                    <Input
                      value={activeQuote.quote.number}
                      onChange={(e) =>
                        onUpdateField("quote", "number", e.target.value)
                      }
                      className="pl-9 font-mono"
                    />
                  </div>
                </div>
                <div className="grid gap-1.5">
                  <Label className="text-xs text-neutral-500">Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-2.5 top-2.5 w-4 h-4 text-neutral-400" />
                    <Input
                      type="date"
                      value={activeQuote.quote.issueDate}
                      onChange={(e) =>
                        onUpdateField("quote", "issueDate", e.target.value)
                      }
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6 mt-0">
            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase text-neutral-400">
                Vos Coordonnées
              </Label>
              <div className="space-y-2">
                <Input
                  placeholder="Nom Entreprise"
                  name="name"
                  value={activeQuote.company.name}
                  onChange={handleCompanyChange}
                />
                <Input
                  placeholder="Email"
                  name="email"
                  value={activeQuote.company.email}
                  onChange={handleCompanyChange}
                />
                <Input
                  placeholder="Téléphone"
                  name="phone"
                  value={activeQuote.company.phone}
                  onChange={handleCompanyChange}
                />
                <Input
                  placeholder="Adresse"
                  name="address"
                  value={activeQuote.company.address}
                  onChange={handleCompanyChange}
                />
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {/* Footer Actions */}
      <div className="p-4 border-t border-neutral-200 bg-neutral-50 space-y-2">
        <Button
          onClick={onSave}
          className="w-full bg-neutral-900 hover:bg-black text-white"
          disabled={isSaving}
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          Exporter PDF
        </Button>
      </div>
    </div>
  );
};
