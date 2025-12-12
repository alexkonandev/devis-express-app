// types/catalog.ts

// Type pour les données entrantes des Server Actions
export type ItemInput = {
  title: string;
  description?: string;
  unitPriceEuros: number;
  defaultQuantity: number;
  isTaxable: boolean;
  category?: string;
};

// Extension pour l'objet complet en base de données
export interface ServiceItem extends ItemInput {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// Type brut venant de Prisma (ServiceTemplate)
export type RawServiceTemplate = {
  id: string;
  category: string;
  subcategory: string;
  title: string;
  salesCopy: any; // Json
  pricing: any; // Json
  technicalScope: any; // Json
  marketContext: any; // Json
};

// Types pour l'UI (Explorateur)
export type UIItem = {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  headline: string;
  description: string;
  defaultPrice: number;
  rawSalesCopy: any;
  rawPricing: any;
  rawTechnicalScope: any;
};

export type UICategory = { id: string; label: string; items: UIItem[] };

export type UIDomain = {
  id: string;
  label: string;
  iconName: string; // LucideIcon type idéalement
  color: string;
  categories: UICategory[];
};
