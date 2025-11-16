import {create} from "zustand";
import { persist } from "zustand/middleware"; // On importe le middleware 'persist'

// --- Types (Tu peux les déplacer dans un fichier /types.ts plus tard) ---
export interface LineItem {
  id: string;
  title: string;
  subtitle: string;
  quantity: number;
  unitPriceEuros: number;
}

export interface QuoteDataState {
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

// --- Fonctions utilitaires ---
const getTodayDate = () => new Date().toISOString().split("T")[0];
const getFutureDate = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
};

// Fonction pour générer un numéro de devis unique (pour 'resetActiveQuote')
const generateQuoteNumber = () => {
  const year = new Date().getFullYear();
  const randomId = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `DEV-${year}-${randomId}`;
};

// --- État Initial pour un NOUVEAU devis ---
export const DEFAULT_QUOTE_DATA: QuoteDataState = {
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
  items: [
    {
      id: "1",
      title: "",
      subtitle: "",
      quantity: 1,
      unitPriceEuros: 0,
    },
  ],
  financials: { vatRatePercent: 20, discountAmountEuros: 0 },
};

// --- Définition de notre Store Zustand ---
interface QuoteStore {
  /**
   * La "base de données" : liste de tous les devis sauvegardés.
   */
  quotes: QuoteDataState[];
  /**
   * Le "formulaire" : devis actuellement en cours d'édition sur /creer.
   */
  activeQuote: QuoteDataState;

  // --- ACTIONS ---

  /**
   * Met à jour n'importe quel champ du devis actif.
   * C'est le "cerveau" de la page /creer.
   */
  updateActiveQuoteField: (
    group: keyof QuoteDataState,
    field: string,
    value: string | number
  ) => void;

  /**
   * Met à jour une ligne d'article dans le devis actif.
   */
  updateActiveLineItem: (
    index: number,
    field: keyof LineItem,
    value: LineItem[keyof LineItem]
  ) => void;

  /**
   * Ajoute une nouvelle ligne vide au devis actif.
   */
  addActiveLineItem: () => void;

  /**
   * Supprime une ligne du devis actif.
   */
  removeActiveLineItem: (index: number) => void;

  /**
   * Réinitialise le devis actif à un état vide (pour un nouveau devis).
   */
  resetActiveQuote: () => void;

  /**
   * Sauvegarde le devis actif dans la liste des devis (page /mes-devis).
   * Gère à la fois l'ajout (nouveau) et la mise à jour (existant).
   */
  saveActiveQuoteToList: () => void;

  /**
   * Charge un devis existant de la liste vers l'éditeur (/creer).
   */
  loadQuoteForEditing: (quoteNumber: string) => void;

  /**
   * Supprime un devis de la liste principale (/mes-devis).
   */
  deleteQuoteFromList: (quoteNumber: string) => void;
}

/**
 * Notre hook global.
 * Il est "persisté" (sauvegardé) dans le localStorage.
 */
export const useQuoteStore = create(
  persist<QuoteStore>(
    (set, get) => ({
      // --- ÉTAT (STATE) ---
      quotes: [],
      activeQuote: DEFAULT_QUOTE_DATA,

      // --- IMPLÉMENTATION DES ACTIONS ---

      updateActiveQuoteField: (group, field, value) =>
        set((state) => ({
          activeQuote: {
            ...state.activeQuote,
            [group]: {
              ...state.activeQuote[group as keyof QuoteDataState],
              [field]: value,
            },
          },
        })),

      updateActiveLineItem: (index, field, value) =>
        set((state) => {
          const newItems = [...state.activeQuote.items];
          newItems[index] = { ...newItems[index], [field]: value };
          return {
            activeQuote: { ...state.activeQuote, items: newItems },
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
            // On génère un nouveau numéro unique pour ce nouveau devis
            quote: {
              ...DEFAULT_QUOTE_DATA.quote,
              number: generateQuoteNumber(),
            },
            // On réinitialise les items à un seul item vide
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

      saveActiveQuoteToList: () => {
        const activeQuote = get().activeQuote;
        const quotes = get().quotes;
        const existingIndex = quotes.findIndex(
          (q) => q.quote.number === activeQuote.quote.number
        );

        if (existingIndex > -1) {
          // Mettre à jour le devis existant
          const updatedQuotes = [...quotes];
          updatedQuotes[existingIndex] = activeQuote;
          set({ quotes: updatedQuotes });
        } else {
          // Ajouter un nouveau devis
          set({ quotes: [...quotes, activeQuote] });
        }
      },

      loadQuoteForEditing: (quoteNumber) => {
        const quoteToLoad = get().quotes.find(
          (q) => q.quote.number === quoteNumber
        );
        if (quoteToLoad) {
          set({ activeQuote: quoteToLoad });
        }
      },

      deleteQuoteFromList: (quoteNumber) =>
        set((state) => ({
          quotes: state.quotes.filter((q) => q.quote.number !== quoteNumber),
        })),
    }),
    {
      name: "devis-express-store", // Le nom de la clé dans localStorage.
    }
  )
);
