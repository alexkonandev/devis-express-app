// @/components/pdf/themes/swiss.ts
import { ThemeConfig } from "../types";

export const swissTheme: ThemeConfig = {
  key: "swiss",
  name: "Swiss International",
  description: "Grilles strictes, typographie helvétique, contraste maximal.",
  isPro: true, // Ce thème sera payant

  colors: {
    primary: "#000000",
    secondary: "#E5E5E5",
    text: "#000000",
    muted: "#525252",
    bg: "#FFFFFF",
  },

  fonts: {
    heading: "'Inter', sans-serif",
    body: "'Inter', sans-serif",
    // On charge Inter avec des graisses spécifiques (400, 600, 900)
    googleImportUrl:
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;900&display=swap",
  },

  layout: {
    header: "minimal", // Titre immense, pas de fioritures
    total: "hero-top", // Le prix est la première chose qu'on voit (Business first)
  },

  styles: {
    container:
      "bg-white p-12 border-t-[20px] border-black selection:bg-black selection:text-white",

    header: {
      wrapper: "flex flex-col gap-6 mb-20",
      title: "text-7xl font-black tracking-tighter uppercase leading-[0.8]",
      meta: "flex gap-8 border-t-4 border-black pt-4 text-xs font-bold uppercase tracking-widest",
    },

    table: {
      header:
        "border-b-4 border-black pb-2 text-xs font-black uppercase tracking-widest text-left",
      row: "border-b border-neutral-200 hover:bg-neutral-50 transition-colors",
      cell: "py-4 text-sm font-medium",
    },

    total: {
      wrapper: "bg-black text-white p-8 mb-12", // Bloc noir massif
      label:
        "text-xs font-bold uppercase tracking-widest opacity-70 mb-2 block",
      price: "text-5xl font-black tracking-tighter",
    },

    footer:
      "mt-auto pt-8 border-t border-neutral-200 flex justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-400",
  },
};
