"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Search,
  Trash2,
  Loader2,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  User,
  Building2,
  Save,
  MoreHorizontal,
  X,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

// --- IMPORTS UI ---
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// --- ACTIONS BACKEND ---
import {
  getClientsAction,
  upsertClientAction,
  deleteClientAction,
  ClientInput,
} from "@/app/actions/client.actions";

// Types
interface Client extends ClientInput {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// ====================================================================
// 1. COMPOSANT ATOMIQUE : CARD CLIENT (LISTE DE GAUCHE)
// ====================================================================
const ClientListItem = ({
  client,
  isSelected,
  onClick,
}: {
  client: Client;
  isSelected: boolean;
  onClick: () => void;
}) => {
  const isPro = !!client.siret;

  return (
    <div
      onClick={onClick}
      className={`
        group relative p-4 rounded-xl cursor-pointer transition-all duration-200 border
        ${
          isSelected
            ? "bg-white border-neutral-900 shadow-xl shadow-neutral-900/5 z-10 scale-[1.02]"
            : "bg-white border-neutral-100 hover:border-neutral-300 hover:bg-neutral-50"
        }
      `}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold shadow-sm transition-colors ${
              isSelected
                ? "bg-neutral-900 text-white"
                : "bg-neutral-100 text-neutral-600 group-hover:bg-white"
            }`}
          >
            {client.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="font-bold text-sm text-neutral-900 leading-tight">
              {client.name}
            </h4>
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
              {isPro ? "Entreprise" : "Particulier"}
            </span>
          </div>
        </div>
        {isSelected && (
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <Mail className="w-3 h-3 text-neutral-400" />
          <span className="truncate max-w-[180px]">{client.email || "—"}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <Phone className="w-3 h-3 text-neutral-400" />
          <span className="font-mono">{client.phone || "—"}</span>
        </div>
      </div>
    </div>
  );
};

// ====================================================================
// 2. MODAL CRÉATION (RAPIDE)
// ====================================================================
const CreationFormModal = ({
  isModalOpen,
  setIsModalOpen,
  onClientCreated,
}: {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  onClientCreated: (client: Client) => void;
}) => {
  const initialForm: ClientInput = {
    name: "",
    email: "",
    phone: "",
    address: "",
    siret: "",
    notes: "",
  };
  const [formData, setFormData] = useState<ClientInput>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return toast.error("Nom requis");

    setIsSubmitting(true);
    const res = await upsertClientAction(formData, undefined);

    if (res.success) {
      toast.success("Client ajouté");
      setIsModalOpen(false);
      setFormData(initialForm);
      onClientCreated(); // Refresh list
    } else {
      toast.error(res.error === "LIMIT_REACHED" ? "Limite atteinte" : "Erreur");
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-black tracking-tight">
            Nouveau Contact
          </DialogTitle>
          <DialogDescription>
            Ajout rapide au carnet d'adresses.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreationSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label className="uppercase text-[10px] font-bold text-neutral-500">
              Nom / Raison Sociale
            </Label>
            <Input
              autoFocus
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Ex: Studio Design"
              className="font-bold focus-visible:ring-neutral-900"
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-neutral-900 hover:bg-black text-white rounded-full font-bold"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Créer le client"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// ====================================================================
// 3. LAYOUT PRINCIPAL (MASTER-DETAIL)
// ====================================================================
export default function ClientsControlCenter() {
  // --- STATE ---
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Selection & Edition
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);

  // Form State (Right Panel)
  const [formData, setFormData] = useState<ClientInput>({
    name: "",
    email: "",
    phone: "",
    address: "",
    siret: "",
    notes: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // --- DATA LOADING ---
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const res = await getClientsAction();
    if (res.success) setClients(res.data);
    setIsLoading(false);
  };

  // --- COMPUTED ---
  const filteredClients = useMemo(() => {
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.siret?.includes(searchQuery)
    );
  }, [clients, searchQuery]);

  const selectedClient = useMemo(
    () => clients.find((c) => c.id === selectedClientId),
    [clients, selectedClientId]
  );

  // --- HANDLERS ---
  const handleSelect = (client: Client) => {
    // Si changements non sauvegardés, alerte (optionnel, ici on écrase pour simplicité UX fluide)
    setSelectedClientId(client.id);
    setFormData({
      name: client.name,
      email: client.email || "",
      phone: client.phone || "",
      address: client.address || "",
      siret: client.siret || "",
      notes: client.notes || "",
    });
    setHasUnsavedChanges(false);
  };

  const handleFieldChange = (field: keyof ClientInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handleSave = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!selectedClientId) return;
    if (!formData.name.trim()) return toast.error("Nom requis");

    setIsSaving(true);
    const res = await upsertClientAction(formData, selectedClientId);
    if (res.success) {
      toast.success("Modifications enregistrées");
      setHasUnsavedChanges(false);
      // Update local list without full reload for speed
      setClients((prev) =>
        prev.map((c) => (c.id === selectedClientId ? { ...c, ...formData } : c))
      );
    } else {
      toast.error("Erreur de sauvegarde");
    }
    setIsSaving(false);
  };

  const handleDelete = async () => {
    if (!selectedClientId) return;
    if (!confirm("Supprimer ce client ?")) return;

    const idToDelete = selectedClientId;
    setSelectedClientId(null); // Deselect immediately
    setClients((prev) => prev.filter((c) => c.id !== idToDelete)); // Optimistic

    const res = await deleteClientAction(idToDelete);
    if (!res.success) {
      toast.error("Erreur suppression");
      loadData(); // Revert
    } else {
      toast.success("Client supprimé");
    }
  };

  // --- RENDER ---
  return (
    <div className="flex h-[calc(100vh-4rem)] bg-neutral-50 overflow-hidden font-sans text-neutral-900">
      <CreationFormModal
        isModalOpen={isCreationModalOpen}
        setIsModalOpen={setIsCreationModalOpen}
        onClientCreated={loadData}
      />

      {/* --- GAUCHE : LISTE (35%) --- */}
      <aside className="w-[35%] min-w-[320px] max-w-[400px] flex flex-col border-r border-neutral-200 bg-neutral-50/50">
        {/* HEADER GAUCHE */}
        <div className="h-16 px-4 border-b border-neutral-200 flex items-center justify-between bg-white/50 backdrop-blur-sm shrink-0">
          <h2 className="text-lg font-black tracking-tight text-neutral-900">
            Clients
          </h2>
          <div className="flex gap-2">
            <span className="text-xs font-mono font-bold text-neutral-400 bg-neutral-100 px-2 py-1 rounded-full">
              {clients.length}
            </span>
            <Button
              size="icon"
              onClick={() => setIsCreationModalOpen(true)}
              className="w-8 h-8 rounded-full bg-neutral-900 text-white hover:bg-black shadow-lg shadow-neutral-900/20"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="p-4 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
            <input
              type="text"
              placeholder="Filtrer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-4 rounded-lg border border-neutral-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all placeholder:text-neutral-400"
            />
          </div>
        </div>

        {/* LISTE SCROLLABLE */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-neutral-300" />
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="text-center py-10 text-neutral-400 text-sm">
              Aucun client trouvé.
            </div>
          ) : (
            filteredClients.map((client) => (
              <ClientListItem
                key={client.id}
                client={client}
                isSelected={selectedClientId === client.id}
                onClick={() => handleSelect(client)}
              />
            ))
          )}
        </div>
      </aside>

      {/* --- DROITE : INSPECTEUR / FORMULAIRE (65%) --- */}
      <main className="flex-1 flex flex-col bg-white h-full relative z-0">
        {!selectedClient ? (
          // EMPTY STATE
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 animate-in fade-in duration-500">
            <div className="w-24 h-24 bg-neutral-50 rounded-full flex items-center justify-center mb-6">
              <Briefcase className="w-8 h-8 text-neutral-300" />
            </div>
            <h3 className="text-2xl font-black tracking-tight text-neutral-900 mb-2">
              Aucune sélection
            </h3>
            <p className="text-neutral-500 max-w-xs mx-auto">
              Sélectionnez un client à gauche pour voir les détails et éditer
              les informations.
            </p>
          </div>
        ) : (
          // INSPECTEUR ACTIF
          <>
            {/* HEADER INSPECTEUR */}
            <div className="h-16 px-8 border-b border-neutral-100 flex items-center justify-between shrink-0 bg-white sticky top-0 z-20">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-neutral-900 text-white flex items-center justify-center text-lg font-bold">
                  {selectedClient.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-neutral-900 leading-none">
                    {formData.name || selectedClient.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-mono text-neutral-400">
                      ID: {selectedClient.id.slice(0, 8)}
                    </span>
                    {hasUnsavedChanges && (
                      <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-bold animate-pulse">
                        Modifié
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-neutral-400 hover:text-neutral-900"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="text-red-600 font-medium"
                      onClick={handleDelete}
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Supprimer ce client
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedClientId(null)}
                >
                  <X className="w-5 h-5 text-neutral-400" />
                </Button>
              </div>
            </div>

            {/* FORMULAIRE SCROLLABLE */}
            <div className="flex-1 overflow-y-auto p-8 md:p-12">
              <form
                id="client-form"
                onSubmit={handleSave}
                className="max-w-2xl mx-auto space-y-10"
              >
                {/* SECTION 1: IDENTITÉ */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
                    <Building2 className="w-4 h-4 text-neutral-900" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-neutral-900">
                      Société
                    </h3>
                  </div>

                  <div className="grid gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-neutral-500 uppercase">
                        Nom de l'entreprise
                      </Label>
                      <Input
                        value={formData.name}
                        onChange={(e) =>
                          handleFieldChange("name", e.target.value)
                        }
                        className="h-12 text-lg font-bold border-neutral-200 focus-visible:ring-neutral-900"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-neutral-500 uppercase">
                        Numéro SIRET
                      </Label>
                      <Input
                        value={formData.siret || ""}
                        onChange={(e) =>
                          handleFieldChange("siret", e.target.value)
                        }
                        className="font-mono bg-neutral-50 border-transparent focus:bg-white focus:border-neutral-200 transition-all"
                        placeholder="Non renseigné"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 2: CONTACT */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
                    <User className="w-4 h-4 text-neutral-900" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-neutral-900">
                      Coordonnées
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-neutral-500 uppercase">
                        Email
                      </Label>
                      <Input
                        type="email"
                        value={formData.email || ""}
                        onChange={(e) =>
                          handleFieldChange("email", e.target.value)
                        }
                        className="border-neutral-200 focus-visible:ring-neutral-900"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-neutral-500 uppercase">
                        Téléphone
                      </Label>
                      <Input
                        value={formData.phone || ""}
                        onChange={(e) =>
                          handleFieldChange("phone", e.target.value)
                        }
                        className="border-neutral-200 focus-visible:ring-neutral-900"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 3: ADRESSE & NOTES */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
                    <MapPin className="w-4 h-4 text-neutral-900" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-neutral-900">
                      Localisation & Notes
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-neutral-500 uppercase">
                        Adresse Postale
                      </Label>
                      <Textarea
                        value={formData.address || ""}
                        onChange={(e) =>
                          handleFieldChange("address", e.target.value)
                        }
                        className="min-h-[80px] border-neutral-200 focus-visible:ring-neutral-900 resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-neutral-500 uppercase">
                        Notes Internes
                      </Label>
                      <Textarea
                        value={formData.notes || ""}
                        onChange={(e) =>
                          handleFieldChange("notes", e.target.value)
                        }
                        className="min-h-[80px] border-yellow-200 bg-yellow-50 focus-visible:ring-yellow-400 focus-visible:border-yellow-400 resize-none text-neutral-700"
                        placeholder="Infos privées..."
                      />
                    </div>
                  </div>
                </div>

                {/* ESPACE FINAL POUR SCROLL */}
                <div className="h-20" />
              </form>
            </div>

            {/* ACTION BAR (STICKY BOTTOM) */}
            <div className="h-20 border-t border-neutral-100 bg-white/90 backdrop-blur-md px-8 flex items-center justify-between shrink-0 absolute bottom-0 w-full z-10">
              <div className="text-xs text-neutral-400 font-medium">
                {hasUnsavedChanges
                  ? "Modifications non enregistrées"
                  : "Tous les changements sont sauvegardés"}
              </div>
              <Button
                type="submit"
                form="client-form"
                disabled={isSaving || !hasUnsavedChanges}
                className={`rounded-full font-bold px-8 transition-all ${
                  hasUnsavedChanges
                    ? "bg-neutral-900 hover:bg-black text-white shadow-lg"
                    : "bg-neutral-100 text-neutral-300"
                }`}
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Enregistrer
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
