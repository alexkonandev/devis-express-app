// @/components/pdf/themes/index.ts
import { ThemeConfig } from "../types";
import { swissTheme } from "./swiss";

// Un thème de fallback simple (gratuit)
const basicTheme: ThemeConfig = {
  key: "basic",
  name: "Standard",
  description: "Simple et efficace.",
  isPro: false,
  colors: {
    primary: "#111",
    secondary: "#eee",
    text: "#333",
    muted: "#888",
    bg: "#fff",
  },
  fonts: { heading: "sans-serif", body: "sans-serif", googleImportUrl: "" },
  layout: { header: "split", total: "bottom-right" },
  styles: {
    container: "bg-white p-10",
    header: {
      wrapper: "flex justify-between mb-10",
      title: "text-4xl font-bold",
      meta: "text-sm text-gray-500",
    },
    table: {
      header: "border-b border-gray-300 font-bold py-2",
      row: "border-b border-gray-100",
      cell: "py-2",
    },
    total: {
      wrapper: "mt-10 text-right",
      label: "text-gray-500",
      price: "text-2xl font-bold",
    },
    footer: "mt-20 text-center text-xs text-gray-400",
  },
};

export const THEME_REGISTRY: Record<string, ThemeConfig> = {
  basic: basicTheme,
  swiss: swissTheme,
};

export const DEFAULT_THEME = basicTheme;

// Helper pour récupérer un thème sans crash
export const getTheme = (key: string): ThemeConfig => {
  return THEME_REGISTRY[key] || DEFAULT_THEME;
};
