import {
  QuoteStatus as PrismaQuoteStatus,
  Theme as PrismaTheme,
  CatalogOffer as PrismaCatalogOffer,
  UserService as PrismaUserService,
  Client as PrismaClient,
} from "@/app/generated/prisma/client";

/**
 * RÉ-EXPORTS PRISMA (Alignement total Backend/Frontend)
 */
export type EditorQuoteStatus = PrismaQuoteStatus;
export type EditorTheme = PrismaTheme;
export type EditorCatalogOffer = PrismaCatalogOffer;
export type EditorUserService = PrismaUserService;
export type EditorClient = PrismaClient;

/**
 * Ligne de prestation pour l'état de l'éditeur
 */
export interface EditorQuoteItem {
  title: string;
  subtitle: string;
  quantity: number;
  unitPrice: number;
}

/**
 * Structure complète du devis
 */
export interface EditorActiveQuote {
  title: string;
  company: {
    name: string;
    email: string;
    address: string;
    siret: string;
    website: string;
  };
  client: {
    name: string;
    email: string;
    address: string;
    siret: string;
  };
  quote: {
    number: string;
    issueDate: string;
    terms: string;
    status: EditorQuoteStatus;
  };
  financials: {
    vatRatePercent: number;
    discountAmountEuros: number;
  };
  items: EditorQuoteItem[];
}

export interface EditorUserSettings {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  companySiret: string;
  companyWebsite: string;
  quotePrefix: string;
  nextQuoteNumber: number;
  defaultVatRate: number;
  defaultTerms: string;
}

export interface EditorActionResponse<T = void> {
  success: boolean;
  error?: string;
  data?: T;
}
