import React from "react";
import { ThemeLayout } from "../themes/types";

interface QuoteItem {
  title: string;
  subtitle: string;
  quantity: number;
  unitPriceEuros: number;
}

interface QuoteTableProps {
  layout: ThemeLayout;
  quote: { items: QuoteItem[] };
}

export const QuoteTable = ({ layout, quote }: QuoteTableProps) => {
  const { styles } = layout;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(price);

  return (
    <div className={styles.table.wrapper}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left">
            <th className={styles.table.header}>Description</th>
            <th className={`${styles.table.header} text-right w-24`}>Qté</th>
            <th className={`${styles.table.header} text-right w-32`}>
              Prix Unit.
            </th>
            <th className={`${styles.table.header} text-right w-32`}>
              Total HT
            </th>
          </tr>
        </thead>
        <tbody>
          {quote.items.length === 0 && (
            <tr>
              <td
                colSpan={4}
                className="py-8 text-center text-xs italic opacity-50"
              >
                Aucune prestation ajoutée.
              </td>
            </tr>
          )}

          {quote.items.map((item, index) => {
            const totalRow = item.quantity * item.unitPriceEuros;
            return (
              <tr key={index} className={styles.table.row}>
                <td className={styles.table.cell}>
                  <div className="font-bold">{item.title}</div>
                  {item.subtitle && (
                    <div className="text-xs opacity-60 mt-1 whitespace-pre-wrap max-w-[400px]">
                      {item.subtitle}
                    </div>
                  )}
                </td>
                <td
                  className={`${styles.table.cell} text-right font-mono opacity-80`}
                >
                  {item.quantity}
                </td>
                <td
                  className={`${styles.table.cell} text-right font-mono opacity-80`}
                >
                  {formatPrice(item.unitPriceEuros)}
                </td>
                <td
                  className={`${styles.table.cell} text-right font-bold font-mono`}
                >
                  {formatPrice(totalRow)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
