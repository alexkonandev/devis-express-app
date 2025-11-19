import { create } from "zustand";
import { persist } from "zustand/middleware";

// --- 1. TYPES ---

export type QuoteStatus =
  | "draft"
  | "sent"
  | "accepted"
  | "rejected"
  | "archived";

export interface QuoteMeta {
  status: QuoteStatus;
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

export interface QuoteDataState {
  meta: QuoteMeta;
  company: { name: string; address: string; phone: string; email: string };
  client: { name: string; address: string; phone: string; email: string };
  quote: {
    number: string;
    issueDate: string;
    expiryDate: string;
    paymentTerms: string;
    paymentDetails: string;
    terms: string;
  };
  items: LineItem[];
  financials: { vatRatePercent: number; discountAmountEuros: number };
}

const getISODate = () => new Date().toISOString();
const getTodayDate = () => new Date().toISOString().split("T")[0];
const getFutureDate = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
};

const generateQuoteNumber = () => {
  const year = new Date().getFullYear();
  const randomId = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `DEV-${year}-${randomId}`;
};

export const DEFAULT_QUOTE_DATA: QuoteDataState = {
  meta: {
    status: "draft",
    folder: null,
    isFavorite: false,
    createdAt: getISODate(),
    updatedAt: getISODate(),
    tags: [],
  },
  company: {
    name: "Alex Konan Dev",
    address: "123 Rue de l'Exemple, 75001 Paris",
    phone: "+33 6 00 00 00 00",
    email: "pro@devisexpress.com",
  },
  client: { name: "", address: "", phone: "", email: "" },
  quote: {
    number: generateQuoteNumber(),
    issueDate: getTodayDate(),
    expiryDate: getFutureDate(30),
    paymentTerms: "Paiement net à 30 jours.",
    paymentDetails: "IBAN: FR76 XXXX XXXX XXXX XXXX XXX\nBIC: XXXX",
    terms: "50% d'acompte requis pour démarrer les travaux.",
  },
  items: [{ id: "1", title: "", subtitle: "", quantity: 1, unitPriceEuros: 0 }],
  financials: { vatRatePercent: 20, discountAmountEuros: 0 },
};

interface QuoteStore {
  quotes: QuoteDataState[];
  activeQuote: QuoteDataState;
  userFolders: string[];

  updateActiveQuoteField: (
    group: keyof QuoteDataState,
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
  loadQuoteForEditing: (quoteNumber: string) => void;

  saveActiveQuoteToList: () => void;
  deleteQuoteFromList: (quoteNumber: string) => void;

  toggleFavorite: (quoteNumber: string) => void;
  moveToFolder: (quoteNumber: string, folderName: string | null) => void;
  updateQuoteStatus: (quoteNumber: string, status: QuoteStatus) => void;

  createFolder: (folderName: string) => void;
  deleteFolder: (folderName: string) => void;
  renameFolder: (oldName: string, newName: string) => void; // <--- NOUVEAU
}

export const useQuoteStore = create(
  persist<QuoteStore>(
    (set, get) => ({
      quotes: [],
      activeQuote: DEFAULT_QUOTE_DATA,
      userFolders: ["Clients VIP", "Projets Web", "Consulting"],

      updateActiveQuoteField: (group, field, value) =>
        set((state) => ({
          activeQuote: {
            ...state.activeQuote,
            [group]: {
              ...state.activeQuote[group as keyof any],
              [field]: value,
            },
            meta:
              group === "meta"
                ? {
                    ...state.activeQuote.meta,
                    updatedAt: getISODate(),
                    [field]: value,
                  }
                : { ...state.activeQuote.meta, updatedAt: getISODate() },
          },
        })),

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
                id: new Date().getTime().toString(),
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

      resetActiveQuote: () => {
        set({
          activeQuote: {
            ...DEFAULT_QUOTE_DATA,
            meta: {
              ...DEFAULT_QUOTE_DATA.meta,
              createdAt: getISODate(),
              updatedAt: getISODate(),
            },
            quote: {
              ...DEFAULT_QUOTE_DATA.quote,
              number: generateQuoteNumber(),
            },
            items: [
              {
                id: "1",
                title: "",
                subtitle: "",
                quantity: 1,
                unitPriceEuros: 0,
              },
            ],
          },
        });
      },

      loadQuoteForEditing: (quoteNumber) => {
        const quoteToLoad = get().quotes.find(
          (q) => q.quote.number === quoteNumber
        );
        if (quoteToLoad)
          set({ activeQuote: JSON.parse(JSON.stringify(quoteToLoad)) });
      },

      saveActiveQuoteToList: () => {
        const activeQuote = get().activeQuote;
        const quotes = get().quotes;
        const existingIndex = quotes.findIndex(
          (q) => q.quote.number === activeQuote.quote.number
        );
        const quoteToSave = {
          ...activeQuote,
          meta: { ...activeQuote.meta, updatedAt: getISODate() },
        };

        if (existingIndex > -1) {
          const updatedQuotes = [...quotes];
          updatedQuotes[existingIndex] = quoteToSave;
          set({ quotes: updatedQuotes, activeQuote: quoteToSave });
        } else {
          set({ quotes: [...quotes, quoteToSave], activeQuote: quoteToSave });
        }
      },

      deleteQuoteFromList: (quoteNumber) =>
        set((state) => ({
          quotes: state.quotes.filter((q) => q.quote.number !== quoteNumber),
        })),

      toggleFavorite: (quoteNumber) =>
        set((state) => ({
          quotes: state.quotes.map((q) =>
            q.quote.number === quoteNumber
              ? { ...q, meta: { ...q.meta, isFavorite: !q.meta.isFavorite } }
              : q
          ),
        })),

      moveToFolder: (quoteNumber, folderName) =>
        set((state) => ({
          quotes: state.quotes.map((q) =>
            q.quote.number === quoteNumber
              ? { ...q, meta: { ...q.meta, folder: folderName } }
              : q
          ),
        })),

      updateQuoteStatus: (quoteNumber, status) =>
        set((state) => ({
          quotes: state.quotes.map((q) =>
            q.quote.number === quoteNumber
              ? { ...q, meta: { ...q.meta, status: status } }
              : q
          ),
        })),

      // --- GESTION DES DOSSIERS ---

      createFolder: (folderName) =>
        set((state) => {
          if (state.userFolders.includes(folderName)) return state;
          return { userFolders: [...state.userFolders, folderName] };
        }),

      deleteFolder: (folderName) =>
        set((state) => ({
          userFolders: state.userFolders.filter((f) => f !== folderName),
          quotes: state.quotes.map((q) =>
            q.meta.folder === folderName
              ? { ...q, meta: { ...q.meta, folder: null } }
              : q
          ),
        })),

      // NOUVELLE FONCTION DE RENOMMAGE
      renameFolder: (oldName, newName) =>
        set((state) => ({
          // 1. Met à jour le nom dans la liste des dossiers
          userFolders: state.userFolders.map((f) =>
            f === oldName ? newName : f
          ),
          // 2. Met à jour TOUS les devis qui étaient dans ce dossier
          quotes: state.quotes.map((q) =>
            q.meta.folder === oldName
              ? { ...q, meta: { ...q.meta, folder: newName } }
              : q
          ),
        })),
    }),
    { name: "devis-express-store-v2" }
  )
);
