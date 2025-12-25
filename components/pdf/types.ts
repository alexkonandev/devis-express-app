// @/components/pdf/themes/types.ts

// A. LES VARIABLES (DATA)
// Ce sont les valeurs qui seront stockées en base de données pour chaque client.
export interface ThemeVariables {
  colors: {
    primary: string; // Titres, Totaux, Bordures fortes
    secondary: string; // Fonds alternés, Accents légers
    text: string; // Texte courant
    bg: string; // Fond de page (ex: blanc ou crème)
    border: string; // Lignes de séparation fines
  };
  typography: {
    fontFamily: string; // ex: "'Inter', sans-serif"
    fontUrl?: string; // ex: URL Google Fonts
    headingWeight: string; // '700', '900'
  };
  borderRadius: string; // '0px', '8px', '20px'
}

// B. LE LAYOUT (STRUCTURE)
// C'est ton code React/Tailwind. Il ne contient AUCUNE couleur hexadécimale,
// seulement des références aux variables CSS (--primary, --bg, etc.).
export interface ThemeLayout {
  key: string;
  name: string;
  layoutConfig: {
    headerStyle: "minimal" | "split" | "centered";
    totalPosition: "hero-top" | "bottom-right";
  };
  // Les classes Tailwind ici utilisent des valeurs arbitraires dynamiques
  styles: {
    container: string;
    header: {
      wrapper: string;
      title: string;
      metaWrapper: string;
      metaItem: string;
    };
    table: {
      wrapper: string;
      header: string;
      row: string;
      cell: string;
    };
    total: {
      wrapper: string;
      row: string;
      grandTotal: string;
    };
    footer: string;
  };
}
