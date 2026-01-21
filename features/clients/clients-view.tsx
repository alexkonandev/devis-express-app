// @/features/clients/clients-view.tsx
"use client";

import React, { useTransition } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion"; // Pour le polish
import { ClientsLayout } from "./components/clients-layout";
import { ClientExplorer } from "./components/client-explorer";
import { ClientInspector } from "./components/client-inspector";
import { ClientIntelligence } from "./components/client-intelligence";
import { ClientListItem } from "@/types/client";

interface ClientsViewProps {
  initialData: ClientListItem[];
}

export default function ClientsView({ initialData }: ClientsViewProps) {
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const activeId = searchParams.get("id") || initialData[0]?.id;

  const handleSelectClient = (id: string) => {
    if (id === activeId) return; // Évite de re-déclencher pour rien

    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.set("id", id);
      replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const selectedClient = initialData.find((c) => c.id === activeId);

  return (
    <ClientsLayout
      explorer={
        <ClientExplorer
          clients={initialData}
          activeId={activeId}
          onSelect={handleSelectClient}
        />
      }
      inspector={
        <div className="h-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeId} // Indispensable pour déclencher l'animation au switch
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: isPending ? 0.5 : 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15, ease: "easeInOut" }}
              className="h-full"
            >
              <ClientInspector client={selectedClient} />
            </motion.div>
          </AnimatePresence>
        </div>
      }
      intelligence={
        <div className="h-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeId}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: isPending ? 0.5 : 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="h-full"
            >
              <ClientIntelligence client={selectedClient} />
            </motion.div>
          </AnimatePresence>
        </div>
      }
    />
  );
}
