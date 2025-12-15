// Fichier: lib/types.ts

import {
  UIItem,
  UIServicePricing,
  UIServiceScope,
  UIServiceSalesCopy,
  UIServiceContext,
} from "@/types/explorer";

/**
 * ServiceItem est l'extension de UIItem pour l'application de gestion.
 * Il ajoute les champs nécessaires à la BDD (Prisma) qui ne sont pas dans l'Explorer pur.
 */
export interface ServiceItem extends UIItem {
  // Champs Prisma spécifiques
  userId: string;
  createdAt: Date;
  updatedAt: Date;

  // Champs opérationnels (Business Logic & Compatibilité DB)
  unitPriceEuros: number;
  defaultQuantity: number;
  isTaxable: boolean;
}

/**
 * Input pour la création/modification (Formulaire & Actions)
 * On utilise Partial<> pour les champs riches afin de ne pas bloquer
 * la création manuelle d'items simples.
 */
export type ItemInput = {
  title: string;
  description?: string;
  category?: string;
  subcategory?: string;

  unitPriceEuros: number;
  defaultQuantity: number;
  isTaxable: boolean;

  // Données Riches (Pass-through JSON)
  // On autorise 'any' pour la flexibilité lors des transitions,
  // mais on vise les types UI... pour la structure.
  pricing?: Partial<UIServicePricing> | any;
  technicalScope?: Partial<UIServiceScope> | any;
  salesCopy?: Partial<UIServiceSalesCopy> | any;
  marketContext?: Partial<UIServiceContext> | any;
};
