// components/invoice/ClientSelector.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Check, Plus, Loader2 } from "lucide-react";
import { searchClientsAction } from "@/app/actions/client.actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface ClientData {
  id: string;
  name: string;
  email?: string | null;
  address?: string | null;
  siret?: string | null;
  phone?: string | null;
}

interface ClientSelectorProps {
  onSelect: (client: ClientData) => void;
}

export function ClientSelector({ onSelect }: ClientSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [clients, setClients] = useState<ClientData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleOpen = async () => {
    setIsOpen(true);
    if (clients.length === 0 && !isLoading) {
      setIsLoading(true);
      const res = await searchClientsAction();
      if (res.success && res.data) {
        setClients(res.data as ClientData[]);
      } else {
        toast.error("Impossible de charger vos clients");
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredClients = clients.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative w-full mb-2 print:hidden" ref={wrapperRef}>
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 group-hover:text-emerald-500 transition-colors" />
        <input
          type="text"
          placeholder="Rechercher un client existant..."
          className="w-full h-8 pl-9 pr-4 rounded-md border border-neutral-200 bg-neutral-50/50 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all placeholder:text-neutral-400"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleOpen}
        />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border border-neutral-200 shadow-xl z-50 max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 flex justify-center text-neutral-400">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          ) : filteredClients.length > 0 ? (
            <div className="p-1">
              <div className="px-2 py-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                Vos Clients ({filteredClients.length})
              </div>
              {filteredClients.map((client) => (
                <button
                  key={client.id}
                  onClick={() => {
                    onSelect(client);
                    setIsOpen(false);
                    setQuery("");
                    toast.success("Client injecté !");
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-emerald-50 rounded-md flex items-center justify-between group transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 font-bold text-[10px]">
                      {client.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900 text-xs">
                        {client.name}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-3 text-center">
              <p className="text-xs text-neutral-500 mb-2">
                Aucun client trouvé.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs h-7"
                onClick={() => window.open("/clients", "_blank")}
              >
                <Plus className="w-3 h-3 mr-2" /> Créer
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
