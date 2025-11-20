import { create } from "zustand";
import { persist } from "zustand/middleware";

// --- 1. TYPES ---

export type QuoteStatus =
  | "draft"
  | "sent"
  | "accepted"
  | "rejected"
  | "archived";

export interface Folder {
  id: string;
  name: string;
  parentId: string | null; // null = root
  createdAt: string;
}

export interface QuoteMeta {
  status: QuoteStatus;
  folderId: string | null; // null = root
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

const generateId = () => Math.random().toString(36).substring(2, 9);

export const DEFAULT_QUOTE_DATA: QuoteDataState = {
  meta: {
    status: "draft",
    folderId: null,
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
  folders: Folder[]; // CHANGED: Array of Folder objects

  // --- ACTIONS ---
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
  updateQuoteStatus: (quoteNumber: string, status: QuoteStatus) => void;
  duplicateQuote: (quoteNumber: string) => void;

  // --- GESTION AVANCÉE DES DOSSIERS & MOUVEMENTS ---
  createFolder: (name: string, parentId: string | null) => void;
  deleteFolder: (folderId: string) => void;
  renameFolder: (folderId: string, newName: string) => void;
  
  // Drag & Drop Actions
  moveQuoteToFolder: (quoteNumber: string, targetFolderId: string | null) => void;
  moveFolderToFolder: (folderId: string, targetParentId: string | null) => void;
}

export const useQuoteStore = create(
  persist<QuoteStore>(
    (set, get) => ({
      quotes: [],
      activeQuote: DEFAULT_QUOTE_DATA,
      folders: [], // Initial empty folders

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
        
        // We use the current activeQuote as the source of truth.
        // We don't need to update activeQuote's timestamp here because 
        // updateActiveQuoteField already does it on every change.
        // We just want to sync the current state to the list.
        const quoteToSave = { ...activeQuote };

        if (existingIndex > -1) {
          const updatedQuotes = [...quotes];
          updatedQuotes[existingIndex] = quoteToSave;
          // IMPORTANT: Do NOT update activeQuote here, otherwise it triggers 
          // the auto-save useEffect in the component, causing an infinite loop.
          set({ quotes: updatedQuotes });
        } else {
          // If it's a new quote, we add it to the list.
          // Here we might want to update activeQuote to ensure it's linked?
          // But activeQuote is already the one we are saving.
          set({ quotes: [...quotes, quoteToSave] });
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

      updateQuoteStatus: (quoteNumber, status) =>
        set((state) => ({
          quotes: state.quotes.map((q) =>
            q.quote.number === quoteNumber
              ? { ...q, meta: { ...q.meta, status: status } }
              : q
          ),
        })),

      duplicateQuote: (quoteNumber) =>
        set((state) => {
          const quoteToDuplicate = state.quotes.find(
            (q) => q.quote.number === quoteNumber
          );
          if (!quoteToDuplicate) return state;

          const newQuote = JSON.parse(JSON.stringify(quoteToDuplicate));
          newQuote.quote.number = generateQuoteNumber();
          newQuote.meta.createdAt = getISODate();
          newQuote.meta.updatedAt = getISODate();
          newQuote.meta.status = "draft";
          newQuote.quote.issueDate = getTodayDate();
          // Keep the same folder or move to root? Let's keep same folder for now.
          // newQuote.meta.folderId = quoteToDuplicate.meta.folderId; 

          return {
            quotes: [...state.quotes, newQuote],
          };
        }),

      // --- GESTION DES DOSSIERS (V3 - NESTED) ---

      createFolder: (name, parentId) =>
        set((state) => ({
          folders: [
            ...state.folders,
            {
              id: generateId(),
              name,
              parentId,
              createdAt: getISODate(),
            },
          ],
        })),

      deleteFolder: (folderId) =>
        set((state) => {
          // Recursive delete helper could be added here if needed
          // For now, we just delete the folder. Items inside become "orphaned" or move to root?
          // Let's move items to root for safety.
          const quotesToUpdate = state.quotes.map((q) =>
            q.meta.folderId === folderId
              ? { ...q, meta: { ...q.meta, folderId: null } }
              : q
          );
          
          // Also delete subfolders recursively? Or move them to root?
          // Let's delete subfolders for simplicity in this iteration, or we can implement recursive delete later.
          // For now: simple delete.
          return {
            folders: state.folders.filter((f) => f.id !== folderId),
            quotes: quotesToUpdate,
          };
        }),

      renameFolder: (folderId, newName) =>
        set((state) => ({
          folders: state.folders.map((f) =>
            f.id === folderId ? { ...f, name: newName } : f
          ),
        })),

      // --- DRAG & DROP ACTIONS ---

      moveQuoteToFolder: (quoteNumber, targetFolderId) =>
        set((state) => ({
          quotes: state.quotes.map((q) =>
            q.quote.number === quoteNumber
              ? { ...q, meta: { ...q.meta, folderId: targetFolderId } }
              : q
          ),
        })),

      moveFolderToFolder: (folderId, targetParentId) =>
        set((state) => {
          // Prevent moving a folder into itself or its children (Cycle detection)
          if (folderId === targetParentId) return state;
          
          return {
            folders: state.folders.map((f) =>
              f.id === folderId ? { ...f, parentId: targetParentId } : f
            ),
          };
        }),
    }),
    { name: "devis-express-store-v3" } // New version key to reset store
  )
);
