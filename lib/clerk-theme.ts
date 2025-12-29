// Fichier: lib/clerk-theme.ts

export const clerkAppearance = {
  layout: {
    socialButtonsPlacement: "bottom" as const,
    logoPlacement: "none" as const, // On gère le logo manuellement dans le layout
  },
  elements: {
    // La carte principale (on retire les ombres par défaut pour fondre dans le layout)
    card: "shadow-none border-none bg-transparent w-full p-0",
    rootBox: "w-full",

    // Typographie des titres par défaut de Clerk (on les cache souvent pour mettre les nôtres)
    headerTitle: "sr-only",
    headerSubtitle: "sr-only",

    // Champs de formulaire (Style Studio : Fin, Carré, Sobre)
    formFieldInput:
      "h-10 rounded-sm border-zinc-200 bg-zinc-50 text-sm focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 transition-all placeholder:text-zinc-400 text-zinc-900",
    formFieldLabel:
      "text-[11px] font-bold uppercase tracking-wide text-zinc-500 mb-1.5",

    // Bouton Principal (Le Noir Studio)
    formButtonPrimary:
      "h-10 rounded-sm bg-zinc-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wide transition-all shadow-sm active:scale-95",

    // Boutons Sociaux (Google, etc.)
    socialButtonsBlockButton:
      "h-10 rounded-sm border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-bold transition-all",
    socialButtonsBlockButtonText: "font-bold text-zinc-700",

    // Liens et Footer
    footerActionLink:
      "text-indigo-600 hover:text-indigo-700 font-bold text-xs underline-offset-4 hover:underline",
    identityPreviewText: "text-zinc-600 font-medium text-sm",
    formFieldAction:
      "text-indigo-600 hover:text-indigo-700 font-bold text-[10px] uppercase cursor-pointer",

    // Séparateurs
    dividerLine: "bg-zinc-100",
    dividerText:
      "text-zinc-400 text-[10px] font-bold uppercase tracking-widest bg-white px-2",

    // Messages d'erreur
    formFieldWarningText: "text-xs text-amber-600 font-medium mt-1",
    formFieldErrorText: "text-xs text-red-600 font-medium mt-1",
  },
  variables: {
    colorPrimary: "#18181b", // zinc-900
    colorText: "#18181b",
    colorTextSecondary: "#71717a", // zinc-500
    borderRadius: "0.25rem", // rounded-sm
    fontFamily: "inherit",
  },
};
