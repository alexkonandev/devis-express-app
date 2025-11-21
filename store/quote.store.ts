import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  parentId: string | null; // null = root
  createdAt: string;
}

export interface QuoteMeta {
  status: QuoteStatus;
  folderId: string | null; // Référence par ID (plus robuste)
  folder: string | null;   // Référence par Nom (pour compatibilité UI existante)
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

// La structure d'un Devis
export interface Quote {
  id?: string;
  meta: QuoteMeta;
  company: QuoteCompany;
  client: QuoteClient;
  quote: {
    number: string;
    issueDate: string;
    expiryDate: string;
    paymentTerms: string; // ex: "30 jours"
    terms: string;        // Mentions légales / Pied de page
  };
  items: LineItem[];
  financials: { vatRatePercent: number; discountAmountEuros: number };
}

// Les Réglages Globaux de l'Application
export interface AppSettings {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  companySiret: string;
  quotePrefix: string;     // ex: "DEV-"
  nextNumber: number;      // ex: 105
  defaultVat: number;      // ex: 20
  defaultTerms: string;    // Mentions légales par défaut
}

// Alias pour compatibilité
export type QuoteDataState = Quote;

// ============================================================================
// 2. UTILITAIRES
// ============================================================================

const getISODate = () => new Date().toISOString();
const getTodayDate = () => new Date().toISOString().split("T")[0];
const getFutureDate = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
};
const generateId = () => Math.random().toString(36).substring(2, 9);

// Générateur de numéro basé sur les réglages (ou par défaut)
const generateQuoteNumber = (prefix = "DEV-", nextNum = 1) => {
  const year = new Date().getFullYear();
  // Format: PREFIX-2025-001
  return `${prefix}${year}-${nextNum.toString().padStart(3, "0")}`;
};

export const DEFAULT_SETTINGS: AppSettings = {
  companyName: "Mon Entreprise",
  companyEmail: "contact@exemple.com",
  companyPhone: "",
  companyAddress: "",
  companySiret: "",
  quotePrefix: "D-",
  nextNumber: 1,
  defaultVat: 20,
  defaultTerms: "Paiement à réception de facture. TVA non applicable, art. 293 B du CGI.",
};

export const DEFAULT_QUOTE_DATA: Quote = {
  meta: {
    status: "draft",
    folderId: null,
    folder: null,
    isFavorite: false,
    createdAt: getISODate(),
    updatedAt: getISODate(),
    tags: [],
  },
  company: {
    name: "",
    address: "",
    phone: "",
    email: "",
  },
  client: { name: "", address: "", phone: "", email: "" },
  quote: {
    number: "",
    issueDate: getTodayDate(),
    expiryDate: getFutureDate(30),
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
  quotes: Quote[];
  activeQuote: Quote;
  userFolders: Folder[]; // C'est ici qu'on corrige le nom !
  settings: AppSettings; // Ajout des réglages

  // --- ACTIONS ÉDITEUR ---
  updateActiveQuoteField: (group: keyof Quote | "meta", field: string, value: any) => void;
  updateActiveLineItem: (index: number, field: keyof LineItem, value: any) => void;
  addActiveLineItem: () => void;
  removeActiveLineItem: (index: number) => void;
  
  // --- ACTIONS CORE ---
  resetActiveQuote: () => void; // Crée un nouveau devis basé sur les Settings
  loadQuoteForEditing: (quoteNumber: string) => void;
  saveActiveQuoteToList: () => void;
  deleteQuoteFromList: (quoteNumber: string) => void;

  // --- ACTIONS LISTE ---
  toggleFavorite: (quoteNumber: string) => void;
  updateQuoteStatus: (quoteNumber: string, status: QuoteStatus) => void;
  duplicateQuote: (quoteNumber: string) => void;

  // --- ACTIONS SETTINGS ---
  updateSettings: (newSettings: Partial<AppSettings>) => void;

  // --- ACTIONS DOSSIERS ---
  createFolder: (name: string, parentId?: string | null) => void;
  deleteFolder: (folderNameOrId: string) => void;
  renameFolder: (oldNameOrId: string, newName: string) => void;
  
  // --- ACTIONS DRAG & DROP ---
  moveQuoteToFolder: (quoteNumber: string, targetFolder: string | null) => void;
}

// ============================================================================
// 4. STORE IMPLEMENTATION
// ============================================================================

export const useQuoteStore = create(
  persist<QuoteStore>(
    (set, get) => ({
      quotes: [],
      activeQuote: DEFAULT_QUOTE_DATA,
      userFolders: [],
      settings: DEFAULT_SETTINGS,

      // --- MISE A JOUR CHAMPS ---
      updateActiveQuoteField: (group, field, value) =>
        set((state) => ({
          activeQuote: {
            ...state.activeQuote,
            [group]: {
              ...state.activeQuote[group as keyof Quote],
              [field]: value,
            },
            meta:
              group === "meta"
                ? { ...state.activeQuote.meta, updatedAt: getISODate(), [field]: value }
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
              { id: generateId(), title: "", subtitle: "", quantity: 1, unitPriceEuros: 0 },
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

      // --- LOGIQUE INTELLIGENTE DE CRÉATION ---
      resetActiveQuote: () => {
        const { settings } = get();
        
        // On crée un nouveau devis en utilisant les réglages par défaut
        set({
          activeQuote: {
            ...DEFAULT_QUOTE_DATA,
            meta: {
              ...DEFAULT_QUOTE_DATA.meta,
              createdAt: getISODate(),
              updatedAt: getISODate(),
            },
            company: {
              name: settings.companyName,
              email: settings.companyEmail,
              phone: settings.companyPhone,
              address: settings.companyAddress,
            },
            quote: {
              number: generateQuoteNumber(settings.quotePrefix, settings.nextNumber),
              issueDate: getTodayDate(),
              expiryDate: getFutureDate(30),
              paymentTerms: "",
              terms: settings.defaultTerms,
            },
            financials: {
                vatRatePercent: settings.defaultVat,
                discountAmountEuros: 0
            },
            items: [{ id: generateId(), title: "", subtitle: "", quantity: 1, unitPriceEuros: 0 }],
          },
        });
      },

      loadQuoteForEditing: (quoteNumber) => {
        const quoteToLoad = get().quotes.find((q) => q.quote.number === quoteNumber);
        if (quoteToLoad) {
            // Clone profond pour éviter les mutations directes sur la liste
            set({ activeQuote: JSON.parse(JSON.stringify(quoteToLoad)) });
        }
      },

      saveActiveQuoteToList: () => {
        const activeQuote = get().activeQuote;
        const quotes = get().quotes;
        const settings = get().settings;

        const existingIndex = quotes.findIndex((q) => q.quote.number === activeQuote.quote.number);
        
        const quoteToSave = { ...activeQuote };

        if (existingIndex > -1) {
          // Mise à jour existant
          const updatedQuotes = [...quotes];
          updatedQuotes[existingIndex] = quoteToSave;
          set({ quotes: updatedQuotes });
        } else {
          // Création nouveau -> On incrémente le compteur de devis dans les settings !
          set({ 
              quotes: [...quotes, quoteToSave],
              settings: { ...settings, nextNumber: settings.nextNumber + 1 }
          });
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
          const original = state.quotes.find((q) => q.quote.number === quoteNumber);
          if (!original) return state;

          const newQuote = JSON.parse(JSON.stringify(original));
          newQuote.quote.number = generateQuoteNumber(state.settings.quotePrefix, state.settings.nextNumber);
          newQuote.meta.createdAt = getISODate();
          newQuote.meta.status = "draft";
          
          // Incrémenter le compteur
          const newSettings = { ...state.settings, nextNumber: state.settings.nextNumber + 1 };

          return {
            quotes: [...state.quotes, newQuote],
            settings: newSettings
          };
        }),

      // --- SETTINGS ---
      updateSettings: (newSettings) => 
        set((state) => ({ settings: { ...state.settings, ...newSettings } })),

      // --- GESTION DOSSIERS ---

      createFolder: (name, parentId = null) =>
        set((state) => ({
          userFolders: [
            ...state.userFolders,
            { id: generateId(), name, parentId, createdAt: getISODate() },
          ],
        })),

      deleteFolder: (folderNameOrId) =>
        set((state) => {
          // Supprime le dossier (par ID ou Nom pour compatibilité)
          const updatedFolders = state.userFolders.filter(
            (f) => f.id !== folderNameOrId && f.name !== folderNameOrId
          );

          // "Sortir" les devis du dossier supprimé (les remettre à la racine)
          const updatedQuotes = state.quotes.map((q) =>
            q.meta.folder === folderNameOrId || q.meta.folderId === folderNameOrId
              ? { ...q, meta: { ...q.meta, folder: null, folderId: null } }
              : q
          );
          
          return {
            userFolders: updatedFolders,
            quotes: updatedQuotes,
          };
        }),

      renameFolder: (oldNameOrId, newName) =>
        set((state) => ({
          userFolders: state.userFolders.map((f) =>
            f.id === oldNameOrId || f.name === oldNameOrId 
                ? { ...f, name: newName } 
                : f
          ),
          // Mettre à jour les références dans les devis
          quotes: state.quotes.map(q => 
            q.meta.folder === oldNameOrId 
                ? { ...q, meta: { ...q.meta, folder: newName } }
                : q
          )
        })),

      moveQuoteToFolder: (quoteNumber, targetFolder) =>
        set((state) => ({
          quotes: state.quotes.map((q) =>
            q.quote.number === quoteNumber
              ? { ...q, meta: { ...q.meta, folder: targetFolder, folderId: targetFolder } }
              : q
          ),
        })),

    }),
    { name: "devis-express-store-v3" }
  )
);