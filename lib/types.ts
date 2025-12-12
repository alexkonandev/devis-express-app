// lib/types.ts

// Structure de base pour les Server Actions
export type ItemInput = {
  title: string;
  description?: string;
  unitPriceEuros: number;
  defaultQuantity: number;
  isTaxable: boolean;
  category?: string;
};

// Modèle complet de l'élément de service (tel que stocké en DB)
export interface ServiceItem extends ItemInput {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Structure de retour pour les Server Actions (uniforme)
export type ActionResponse<T = undefined> = {
  success: boolean;
  error?: string;
  data?: T;
};
