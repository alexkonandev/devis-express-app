"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import {
  getClientsAction,
  upsertClientAction,
  deleteClientAction,
  ClientInput,
} from "@/app/actions/client.actions";

// On définit le type ici pour qu'il soit partagé
export interface Client extends ClientInput {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export function useClientManager() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Chargement initial
  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setIsLoading(true);
    const res = await getClientsAction();
    if (res.success) setClients(res.data);
    setIsLoading(false);
  };

  // Filtrage intelligent
  const filteredClients = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(lowerQuery) ||
        c.email?.toLowerCase().includes(lowerQuery) ||
        c.siret?.includes(lowerQuery)
    );
  }, [clients, searchQuery]);

  // Actions CRUD
  const saveClient = async (data: ClientInput, id?: string) => {
    const res = await upsertClientAction(data, id);
    if (res.success) {
      toast.success(id ? "Client mis à jour" : "Client créé");
      loadClients();
      return true;
    }
    toast.error("Erreur lors de la sauvegarde");
    return false;
  };

  const removeClient = async (id: string) => {
    // Optimistic UI : On supprime visuellement tout de suite
    setClients((prev) => prev.filter((c) => c.id !== id));

    const res = await deleteClientAction(id);
    if (!res.success) {
      toast.error("Impossible de supprimer");
      loadClients(); // On remet les données si ça a échoué
    } else {
      toast.success("Client supprimé");
    }
  };

  return {
    clients: filteredClients,
    totalCount: clients.length,
    isLoading,
    searchQuery,
    setSearchQuery,
    saveClient,
    removeClient,
    refresh: loadClients,
  };
}
