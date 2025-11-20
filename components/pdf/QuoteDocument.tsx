import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// On définit les styles (C'est du CSS-in-JS, très performant pour le PDF)
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#333",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold", // Helvetica-Bold si chargé
    textTransform: "uppercase",
    marginBottom: 8,
  },
  meta: {
    fontSize: 9,
    color: "#666",
    marginBottom: 2,
  },
  companyBlock: {
    alignItems: "flex-end",
  },
  companyName: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
  },
  clientBlock: {
    marginBottom: 30,
    padding: 10,
    backgroundColor: "#f9fafb", // neutral-50
    borderRadius: 4,
  },
  label: {
    fontSize: 8,
    textTransform: "uppercase",
    color: "#9ca3af",
    marginBottom: 4,
    letterSpacing: 1,
  },
  // TABLEAU
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 4,
    marginBottom: 4,
    fontWeight: "bold",
    fontSize: 8,
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 6,
  },
  colDesc: { width: "50%" },
  colQty: { width: "15%", textAlign: "center" },
  colPrice: { width: "15%", textAlign: "right" },
  colTotal: { width: "20%", textAlign: "right", fontWeight: "bold" },

  // TOTAUX
  totalSection: {
    marginTop: 20,
    alignSelf: "flex-end",
    width: "40%",
  },
  rowTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  totalFinal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#000",
  },
  finalPrice: {
    fontSize: 14,
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: "#9ca3af",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 10,
  },
});

// Le Composant PDF
export const QuoteDocument = ({ quote, totals }: any) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Devis</Text>
          <Text style={styles.meta}>N° {quote.quote.number}</Text>
          <Text style={styles.meta}>Date : {quote.quote.issueDate}</Text>
        </View>
        <View style={styles.companyBlock}>
          <Text style={styles.companyName}>
            {quote.company.name || "Votre Entreprise"}
          </Text>
          <Text style={styles.meta}>{quote.company.email}</Text>
          <Text style={styles.meta}>{quote.company.phone}</Text>
          <Text style={styles.meta}>{quote.company.address}</Text>
        </View>
      </View>

      {/* CLIENT */}
      <View style={styles.clientBlock}>
        <Text style={styles.label}>Client</Text>
        <Text style={{ fontSize: 12, marginBottom: 2 }}>
          {quote.client.name}
        </Text>
        <Text style={{ color: "#666" }}>{quote.client.email}</Text>
      </View>

      {/* TABLEAU */}
      <View>
        {/* En-têtes */}
        <View style={styles.tableHeader}>
          <Text style={styles.colDesc}>Description</Text>
          <Text style={styles.colQty}>Qté</Text>
          <Text style={styles.colPrice}>Prix U.</Text>
          <Text style={styles.colTotal}>Total</Text>
        </View>

        {/* Lignes */}
        {quote.items.map((item: any, i: number) => (
          <View key={i} style={styles.tableRow}>
            <View style={styles.colDesc}>
              <Text style={{ fontWeight: "bold" }}>{item.title}</Text>
              {item.subtitle && (
                <Text style={{ fontSize: 8, color: "#666" }}>
                  {item.subtitle}
                </Text>
              )}
            </View>
            <Text style={styles.colQty}>{item.quantity}</Text>
            <Text style={styles.colPrice}>{item.unitPriceEuros} €</Text>
            <Text style={styles.colTotal}>
              {(item.quantity * item.unitPriceEuros).toFixed(2)} €
            </Text>
          </View>
        ))}
      </View>

      {/* TOTAUX */}
      <View style={styles.totalSection}>
        <View style={styles.rowTotal}>
          <Text>Total HT</Text>
          <Text>{totals.subTotal.toFixed(2)} €</Text>
        </View>
        {quote.financials.discountAmountEuros > 0 && (
          <View style={styles.rowTotal}>
            <Text>Remise</Text>
            <Text>- {quote.financials.discountAmountEuros} €</Text>
          </View>
        )}
        <View style={styles.rowTotal}>
          <Text style={{ color: "#666" }}>
            TVA ({quote.financials.vatRatePercent}%)
          </Text>
          <Text>{totals.taxAmount.toFixed(2)} €</Text>
        </View>
        <View style={styles.totalFinal}>
          <Text style={{ fontWeight: "bold" }}>NET À PAYER</Text>
          <Text style={styles.finalPrice}>{totals.totalTTC.toFixed(2)} €</Text>
        </View>
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Text>{quote.quote.terms || "Merci de votre confiance."}</Text>
      </View>
    </Page>
  </Document>
);
