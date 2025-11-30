import { create } from "zustand";

// ============================================================================
// 1. TYPES & INTERFACES
// ============================================================================

export type QuoteStatus =
  | "draft"
  | "sent"
  | "accepted"
  | "rejected"
  | "archived";

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
}

export interface QuoteMeta {
  status: QuoteStatus;
  folderId: string | null;
  folder: string | null;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface LineItem {
  id: string;
  title: string;
  subtitle: string;
  quantity: number;
  unitPriceEuros: number;
}

export interface QuoteCompany {
  name: string;
  address: string;
  phone: string;
  email: string;
  siret?: string;
}

export interface QuoteClient {
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface Quote {
  id?: string; // "new" ou UUID
  meta: QuoteMeta;
  company: QuoteCompany;
  client: QuoteClient;
  quote: {
    number: string;
    issueDate: string;
    expiryDate: string;
    paymentTerms: string;
    terms: string;
  };
  items: LineItem[];
  financials: { vatRatePercent: number; discountAmountEuros: number };
}

// ============================================================================
// 2. UTILITAIRES & DEFAULTS
// ============================================================================

const getISODate = () => new Date().toISOString();
const generateId = () => Math.random().toString(36).substring(2, 9);

export const DEFAULT_QUOTE_DATA: Quote = {
  id: "new",
  meta: {
    status: "draft",
    folderId: null,
    folder: null,
    isFavorite: false,
    createdAt: getISODate(),
    updatedAt: getISODate(),
    tags: [],
  },
  company: { name: "", address: "", phone: "", email: "" },
  client: { name: "", address: "", phone: "", email: "" },
  quote: {
    number: "BROUILLON",
    issueDate: new Date().toISOString().split("T")[0],
    expiryDate: "",
    paymentTerms: "",
    terms: "",
  },
  items: [{ id: "1", title: "", subtitle: "", quantity: 1, unitPriceEuros: 0 }],
  financials: { vatRatePercent: 20, discountAmountEuros: 0 },
};

// ============================================================================
// 3. STORE INTERFACE
// ============================================================================

interface QuoteStore {
  activeQuote: Quote;
  userFolders: Folder[];

  // --- ACTIONS UI ---
  setActiveQuote: (quote: Quote) => void; // Pour l'hydratation serveur
  updateActiveQuoteField: (
    group: keyof Quote | "meta",
    field: string,
    value: any
  ) => void;
  updateActiveLineItem: (
    index: number,
    field: keyof LineItem,
    value: any
  ) => void;
  addActiveLineItem: () => void;
  removeActiveLineItem: (index: number) => void;
  resetActiveQuote: () => void;
}

// ============================================================================
// 4. STORE IMPLEMENTATION (No Persist, UI Logic Only)
// ============================================================================

export const useQuoteStore = create<QuoteStore>((set) => ({
  activeQuote: DEFAULT_QUOTE_DATA,
  userFolders: [], // Pourrait être hydraté depuis le serveur aussi si besoin

  // --- HYDRATATION ---
  setActiveQuote: (quote) => set({ activeQuote: quote }),

  // --- MODIFICATIONS UI ---
  updateActiveQuoteField: (group, field, value) =>
    set((state) => {
      // CAS 1 : On modifie directement les métadonnées (ex: status)
      if (group === "meta") {
        return {
          activeQuote: {
            ...state.activeQuote,
            meta: {
              ...state.activeQuote.meta,
              [field]: value, // On applique le changement (ex: status = 'sent')
              updatedAt: getISODate(), // On met à jour la date
            },
          },
        };
      }

      // CAS 2 : On modifie un autre groupe (client, company, quote...)
      // On met à jour le groupe ciblé ET on rafraîchit la date dans meta
      return {
        activeQuote: {
          ...state.activeQuote,
          [group]: {
            ...state.activeQuote[group as keyof Quote],
            [field]: value,
          },
          meta: {
            ...state.activeQuote.meta,
            updatedAt: getISODate(),
          },
        },
      };
    }),

  updateActiveLineItem: (index, field, value) =>
    set((state) => {
      const newItems = [...state.activeQuote.items];
      newItems[index] = { ...newItems[index], [field]: value };
      return {
        activeQuote: {
          ...state.activeQuote,
          items: newItems,
          meta: { ...state.activeQuote.meta, updatedAt: getISODate() },
        },
      };
    }),

  addActiveLineItem: () =>
    set((state) => ({
      activeQuote: {
        ...state.activeQuote,
        items: [
          ...state.activeQuote.items,
          {
            id: generateId(),
            title: "",
            subtitle: "",
            quantity: 1,
            unitPriceEuros: 0,
          },
        ],
      },
    })),

  removeActiveLineItem: (index) =>
    set((state) => ({
      activeQuote: {
        ...state.activeQuote,
        items: state.activeQuote.items.filter((_, i) => i !== index),
      },
    })),

  resetActiveQuote: () => set({ activeQuote: DEFAULT_QUOTE_DATA }),
}));
