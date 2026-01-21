
import { Client } from "@/app/generated/prisma/client";
import { ActionResponse } from "./quote"; // On réutilise l'interface générique

// @/types/client.ts
export interface ClientListItem {
  id: string;
  name: string;
  email: string | null;
  siret: string | null;
  address: string | null;
  totalSpent: number;   // Calculé via agrégation Prisma
  quoteCount: number;   // Calculé via agrégation Prisma
  createdAt: Date;
}
/**
 * Réponse typée pour les actions clients.
 * Utilise le générique de ActionResponse pour garantir la sécurité des données.
 */
export type ClientActionResponse = ActionResponse<Client>;
