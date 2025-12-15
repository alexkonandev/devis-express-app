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
  // Ajout pour compatibilité avec l'EditorSidebar
  validityDays?: number;
  paymentTerms?: string;
}

export interface LineItem {
  id: string;
  title: string;
  subtitle: string;
  quantity: number;
  unitPriceEuros: number;

  // NOUVEAU : Données riches provenant du catalogue
  technicalScope?: any;
  pricing?: any;
  salesCopy?: any;
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
    validityDays: 30,
    paymentTerms: "Acompte de 30% à la commande, solde à la livraison.",
  },
  company: { name: "", address: "", phone: "", email: "" },
  client: { name: "", address: "", phone: "", email: "" },
  quote: {
    number: "BROUILLON",
    issueDate: new Date().toISOString().split("T")[0],
    expiryDate: "",
    paymentTerms: "",
    terms: "Règlement à réception de facture.",
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
  setActiveQuote: (quote: Quote) => void;
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

  // CORRECTION : Accepte maintenant des données partielles
  addActiveLineItem: (item?: Partial<LineItem>) => void;

  removeActiveLineItem: (index: number) => void;
  resetActiveQuote: () => void;
}

// ============================================================================
// 4. STORE IMPLEMENTATION (No Persist, UI Logic Only)
// ============================================================================

export const useQuoteStore = create<QuoteStore>((set) => ({
  activeQuote: DEFAULT_QUOTE_DATA,
  userFolders: [],

  // --- HYDRATATION ---
  setActiveQuote: (quote) => set({ activeQuote: quote }),

  // --- MODIFICATIONS UI ---
  updateActiveQuoteField: (group, field, value) =>
    set((state) => {
      // CAS 1 : On modifie directement les métadonnées
      if (group === "meta") {
        return {
          activeQuote: {
            ...state.activeQuote,
            meta: {
              ...state.activeQuote.meta,
              [field]: value,
              updatedAt: getISODate(),
            },
          },
        };
      }

      // CAS 2 : Autres groupes
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

  addActiveLineItem: (itemData) =>
    set((state) => {
      // 1. ON NE PREND QUE LA DESCRIPTION COMMERCIALE
      // Fini la concaténation des "INCLUS :" et "NON INCLUS :"
      let smartSubtitle = itemData?.subtitle || "";

      if (itemData?.salesCopy?.description) {
        smartSubtitle = itemData.salesCopy.description;
      }

      // On arrête ici ! On n'ajoute plus technicalScope.included/excluded au texte.

      return {
        activeQuote: {
          ...state.activeQuote,
          items: [
            ...state.activeQuote.items,
            {
              id: generateId(),
              title: itemData?.title || "",
              subtitle: smartSubtitle, // Description propre (juste le pitch)
              quantity: itemData?.quantity || 1,
              unitPriceEuros: itemData?.unitPriceEuros || 0,

              // Les données riches sont passées ici, et c'est l'UI qui va décider de les afficher
              technicalScope: itemData?.technicalScope,
              pricing: itemData?.pricing,
              salesCopy: itemData?.salesCopy,
            },
          ],
          meta: { ...state.activeQuote.meta, updatedAt: getISODate() },
        },
      };
    }),

  removeActiveLineItem: (index) =>
    set((state) => ({
      activeQuote: {
        ...state.activeQuote,
        items: state.activeQuote.items.filter((_, i) => i !== index),
        meta: { ...state.activeQuote.meta, updatedAt: getISODate() },
      },
    })),

  resetActiveQuote: () => set({ activeQuote: DEFAULT_QUOTE_DATA }),
}));
