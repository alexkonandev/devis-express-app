import React from "react";
import { ThemeLayout } from "../types"; // Assure-toi que le chemin est bon

interface ActiveQuote {
  title: string;
  company: {
    name: string;
    email: string;
    phone: string;
    address?: string;
    siret?: string;
  };
  quote: { number: string; issueDate: string | Date; terms: string };
}

interface QuoteHeaderProps {
  layout: ThemeLayout;
  quote: ActiveQuote;
}

export const QuoteHeader = ({ layout, quote }: QuoteHeaderProps) => {
  const { styles } = layout;

  // Formatage de la date
  const dateStr = new Date(quote.quote.issueDate).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className={styles.header.wrapper}>
      {/* GAUCHE : Titre du Devis + Info Entreprise */}
      <div className="flex-1">
        <h1 className={styles.header.title}>{quote.title || "Devis"}</h1>

        <div className="mt-4 text-xs opacity-70 leading-relaxed">
          <strong>{quote.company.name}</strong>
          <br />
          {quote.company.address}
          <br />
          {quote.company.email} • {quote.company.phone}
          {quote.company.siret && (
            <>
              <br />
              SIRET: {quote.company.siret}
            </>
          )}
        </div>
      </div>

      {/* DROITE : Métadonnées (Date, Numéro) */}
      <div className={styles.header.metaWrapper}>
        <div className={styles.header.metaItem}>
          <span className="opacity-50 mb-1">Numéro</span>
          <span>{quote.quote.number}</span>
        </div>
        <div className={styles.header.metaItem}>
          <span className="opacity-50 mb-1">Date d'émission</span>
          <span>{dateStr}</span>
        </div>
      </div>
    </header>
  );
};
