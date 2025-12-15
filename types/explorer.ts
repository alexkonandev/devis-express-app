// Fichier: types/explorer.ts

export type PricingTier = { min: number; max: number; avg: number };
export type PricingModel =
  | "hourly"
  | "daily"
  | "flat_fee"
  | "monthly_retainer"
  | "per_unit";

export interface UIServicePricing {
  suggested_model: PricingModel;
  currency: "EUR" | "USD";
  unit_label: string;
  tiers: {
    junior: PricingTier;
    senior: PricingTier;
    expert: PricingTier;
  };
}

export interface UIServiceScope {
  included: string[];
  excluded: string[];
}

export interface UIServiceSalesCopy {
  headline: string;
  description: string;
  key_benefits: string[];
}

export interface UIServiceContext {
  trend: "stable" | "rising" | "falling";
  insight: string;
}

// L'interface UIItem enrichie (Mega-Object)
export interface UIItem {
  id: string;
  title: string;
  category: string;
  subcategory: string; // Nouveau
  description: string; // Fallback pour la description simple
  defaultPrice: number; // Prix calculé par défaut (souvent Senior Avg)
  iconName?: string;

  // Données Riches (Optionnelles car issues du JSON)
  salesCopy?: UIServiceSalesCopy;
  technicalScope?: UIServiceScope;
  pricing?: UIServicePricing;
  marketContext?: UIServiceContext;
}

export interface UICategory {
  id: string;
  label: string;
  items: UIItem[];
}

export interface UIDomain {
  id: string;
  label: string;
  iconName: string;
  categories: UICategory[];
}
