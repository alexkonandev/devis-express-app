import { Metadata } from "next";
import ClientsView from "@/components/clients/clients-view";

// Optimisation SEO / Titre de l'onglet
export const metadata: Metadata = {
  title: "Gestion Clients | DevisExpress",
  description: "Gérez votre carnet d'adresses clients et entreprises.",
};

export default async function ClientsPage() {
  // Ici, page.tsx est un Server Component.
  // Il ne contient AUCUNE logique d'état (useState, useEffect).
  // Il se contente de rendre la Vue Client.

  return <ClientsView />;
}
