import React from "react";
import { ThemeLayout } from "../themes/types";

interface TotalsData {
  subTotal: number;
  taxAmount: number;
  totalTTC: number;
  discount: number;
  vatRate: number;
}

interface QuoteTotalsProps {
  layout: ThemeLayout;
  totals: TotalsData;
}

export const QuoteTotals = ({ layout, totals }: QuoteTotalsProps) => {
  const { styles } = layout;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(price);

  return (
    <div className={styles.total.wrapper}>
      <div className={styles.total.row}>
        <span>Total HT</span>
        <span className="font-mono">{formatPrice(totals.subTotal)}</span>
      </div>

      {totals.discount > 0 && (
        <div className={`${styles.total.row} text-emerald-600`}>
          <span>Remise</span>
          <span className="font-mono">- {formatPrice(totals.discount)}</span>
        </div>
      )}

      <div className={styles.total.row}>
        <span>TVA ({totals.vatRate}%)</span>
        <span className="font-mono">{formatPrice(totals.taxAmount)}</span>
      </div>

      {/* Séparateur visuel si besoin, selon le layout */}
      <div className="my-4 border-t border-current opacity-20" />

      <div className="flex justify-between items-end mt-2">
        <span className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">
          Total TTC
        </span>
        <span className={styles.total.grandTotal}>
          {formatPrice(totals.totalTTC)}
        </span>
      </div>
    </div>
  );
};
