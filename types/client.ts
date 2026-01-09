
import { Client } from "@/app/generated/prisma/client";
import { ActionResponse } from "./quote"; // On réutilise l'interface générique

/**
 * Interface pour la création et la mise à jour d'un client.
 * Elle correspond exactement aux besoins de ton formulaire et de ton action upsert.
 */
export interface ClientInput {
  id?: string;
  name: string;
  email?: string;
  address?: string;
  siret?: string;
}

/**
 * Type pour la liste des clients (souvent identique au modèle Prisma).
 * On l'exporte explicitement pour garder la cohérence.
 */
export type ClientListItem = Client;

/**
 * Réponse typée pour les actions clients.
 * Utilise le générique de ActionResponse pour garantir la sécurité des données.
 */
export type ClientActionResponse = ActionResponse<Client>;
