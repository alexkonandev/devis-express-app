import { ThemeLayout, ThemeVariables } from "./types";

// --- 1. VARIABLES PAR DÉFAUT (Fallback) ---
export const DEFAULT_VARIABLES: ThemeVariables = {
  colors: {
    primary: "#000000",
    secondary: "#F3F4F6",
    text: "#1F2937",
    bg: "#FFFFFF",
    border: "#E5E7EB",
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    fontUrl:
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;900&display=swap",
    headingWeight: "900",
  },
  borderRadius: "0px",
};

// --- 2. DÉFINITION DES LAYOUTS (STRUCTURE) ---

// A. LAYOUT SWISS (Brutaliste & Grille)
const swissLayout: ThemeLayout = {
  key: "swiss",
  name: "Swiss International",
  layoutConfig: {
    headerStyle: "minimal",
    totalPosition: "hero-top",
  },
  styles: {
    // Container: Bordure noire épaisse en haut (Signature premium)
    container:
      "bg-[var(--bg)] text-[var(--text)] p-12 border-t-[20px] border-[var(--primary)] font-[family-name:var(--font-family)] tracking-tight",
    header: {
      wrapper: "flex flex-col gap-8 mb-20",
      // Titre géant, interligne très serré
      title:
        "text-7xl leading-[0.8] uppercase tracking-tighter text-[var(--primary)] font-[weight:var(--heading-weight)] break-words",
      metaWrapper:
        "grid grid-cols-2 gap-12 border-t-4 border-[var(--primary)] pt-6",
      metaItem:
        "flex flex-col text-[9px] uppercase tracking-[0.2em] font-bold opacity-100",
    },
    table: {
      wrapper: "mt-16",
      // En-têtes minuscules mais très gras
      header:
        "border-b-4 border-[var(--primary)] pb-3 text-[9px] font-black uppercase tracking-[0.2em] text-left opacity-100",
      row: "border-b border-[var(--border)] group",
      cell: "py-5 text-sm font-medium group-last:border-0",
    },
    total: {
      // Bloc noir massif impactant
      wrapper: "bg-[var(--primary)] text-[var(--bg)] p-10 w-full mb-16",
      row: "flex justify-between text-xs font-bold uppercase tracking-widest opacity-80 mb-2",
      grandTotal: "text-6xl font-black tracking-tighter mt-4",
    },
    footer:
      "mt-auto pt-8 border-t-2 border-[var(--primary)] flex justify-between text-[9px] font-bold uppercase tracking-[0.2em]",
  },
};

// B. LAYOUT MODERN (SaaS & Clean)
const modernLayout: ThemeLayout = {
  key: "tech",
  name: "Modern SaaS",
  layoutConfig: {
    headerStyle: "split",
    totalPosition: "bottom-right",
  },
  styles: {
    container:
      "bg-[var(--bg)] text-[var(--text)] p-10 font-[family-name:var(--font-family)]",
    header: {
      wrapper:
        "flex justify-between items-start mb-12 pb-8 border-b border-[var(--border)]",
      title:
        "text-4xl font-[weight:var(--heading-weight)] text-[var(--primary)] tracking-tight",
      metaWrapper: "text-right flex flex-col gap-2",
      metaItem: "text-xs text-[var(--text)] font-medium opacity-60",
    },
    table: {
      // Tableau encadré avec coins arrondis
      wrapper:
        "mt-8 border border-[var(--border)] rounded-[var(--radius)] overflow-hidden shadow-sm",
      header:
        "bg-[var(--secondary)] text-[var(--text)] text-xs font-bold uppercase px-6 py-4 tracking-wide",
      row: "border-b last:border-0 border-[var(--border)] bg-white hover:bg-[var(--secondary)]/30 transition-colors",
      cell: "px-6 py-4 text-sm text-[var(--text)]",
    },
    total: {
      // Bloc flottant à droite, fond léger
      wrapper:
        "ml-auto mt-8 w-80 bg-[var(--secondary)] p-8 rounded-[var(--radius)]",
      row: "flex justify-between text-sm mb-3 font-medium text-[var(--text)] opacity-80",
      grandTotal:
        "text-2xl font-[weight:var(--heading-weight)] text-[var(--primary)] border-t border-[var(--border)] pt-4 mt-2",
    },
    footer: "mt-auto pt-8 text-center text-xs opacity-40 font-medium",
  },
};

// C. LAYOUT SERIF (Luxe & Éditorial)
const serifLayout: ThemeLayout = {
  key: "corporate", // On map sur 'corporate' pour l'instant
  name: "Atelier Luxe",
  layoutConfig: {
    headerStyle: "centered", // Tout centré
    totalPosition: "bottom-right",
  },
  styles: {
    container:
      "bg-[var(--bg)] text-[var(--text)] p-16 font-[family-name:var(--font-family)]",
    header: {
      wrapper: "text-center mb-16 flex flex-col items-center gap-6",
      title:
        "text-5xl font-[weight:var(--heading-weight)] text-[var(--primary)] italic tracking-tight", // L'italique ajoute la touche luxe
      metaWrapper:
        "flex gap-8 justify-center border-y border-[var(--border)] py-4 w-full max-w-lg mx-auto",
      metaItem: "flex flex-col text-xs uppercase tracking-widest font-serif",
    },
    table: {
      wrapper: "mt-12",
      header:
        "border-b border-[var(--primary)] pb-4 text-xs font-serif italic text-center opacity-70",
      row: "border-b border-[var(--border)]",
      cell: "py-6 text-sm text-center font-serif", // Cellules centrées
    },
    total: {
      wrapper:
        "ml-auto mt-12 w-full max-w-xs border-t-2 border-[var(--primary)] pt-6",
      row: "flex justify-between text-sm mb-2 font-serif italic",
      grandTotal:
        "text-3xl font-[weight:var(--heading-weight)] text-right mt-4",
    },
    footer:
      "mt-auto pt-12 text-center text-[10px] uppercase tracking-[0.3em] opacity-40",
  },
};

// --- 3. EXPORT DES LAYOUTS ---
export const LAYOUTS = {
  swiss: swissLayout,
  tech: modernLayout,
  corporate: serifLayout,
};

export const getLayout = (key: string) =>
  LAYOUTS[key as keyof typeof LAYOUTS] || swissLayout;
