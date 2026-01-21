// @/types/catalog.ts
import {
  Profession,
  BusinessModel,
  UserService,
  CatalogOffer,
} from "@/app/generated/prisma/client";

/**
 * SOURCE DE VÉRITÉ : L'ACTIF
 * Fusionne les services personnels et les offres catalogue.
 */
export type CatalogItem = (UserService | CatalogOffer) & {
  category: string; // Obligatoire pour le tri
  isPremium: boolean;
};

/**
 * FILTRAGE STRATÉGIQUE
 */
export interface CatalogFilters {
  search?: string;
  profession?: Profession;
  model?: BusinessModel;
  type: "personal" | "library";
}

/**
 * CONTRAT DE RÉPONSE UNIFIÉ
 * Évite l'usage de 'any' et standardise les retours d'actions.
 */
export interface ActionResponse<T = void> {
  success: boolean;
  error?: string;
  data?: T;
}

/**
 * LIST ITEM (Pour la scannabilité dans le Radar)
 */
export interface CatalogListItem {
  id: string;
  title: string;
  category: string;
  unitPrice: number;
  isPremium: boolean;
}
