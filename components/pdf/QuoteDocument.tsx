/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { Quote } from "@/store/quote.store";

// ==========================================
// 1. CONFIGURATION DES POLICES (Reste inchangé)
// ==========================================
Font.register({
  family: "Figtree",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/figtree/v5/_Xmz-HUzqDCFdgfMm4S9Fr8.ttf",
      fontWeight: "normal",
    },
    {
      src: "https://fonts.gstatic.com/s/figtree/v5/_Xmz-HUzqDCFdgfMm4S9Fr8.ttf",
      fontWeight: "bold",
    },
  ],
});

Font.register({
  family: "JetBrains Mono",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnF8RD8yKxTOlOV.ttf",
      fontWeight: "normal",
    },
    {
      src: "https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnF8RD8yKxTOlOV.ttf",
      fontWeight: "bold",
    },
  ],
});

// ==========================================
// 2. UTILITAIRES & DESIGN SYSTEM (Reste inchangé)
// ==========================================

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(price);
};

// Les thèmes contiennent désormais les valeurs numériques des bords
const THEMES = {
  minimalist: {
    primary: "#111827",
    secondary: "#6b7280",
    accent: "#e5e7eb",
    bg: "#ffffff",
    headerBg: "#ffffff",
    tableHeaderBg: "#f9fafb",
    tableHeaderColor: "#111827",
    borderColor: "#e5e7eb",
    borderRadius: 2,
  },
  executive: {
    primary: "#0f172a",
    secondary: "#64748b",
    accent: "#cbd5e1",
    bg: "#ffffff",
    headerBg: "#f8fafc",
    tableHeaderBg: "#0f172a",
    tableHeaderColor: "#ffffff",
    borderColor: "#e2e8f0",
    borderRadius: 4,
  },
  bold: {
    primary: "#000000",
    secondary: "#000000",
    accent: "#000000",
    bg: "#ffffff",
    headerBg: "#000000",
    tableHeaderBg: "#000000",
    tableHeaderColor: "#ffffff",
    borderColor: "#000000",
    borderRadius: 0,
  },
};

// ==========================================
// 3. GÉNÉRATEUR DE STYLES SÉCURISÉ
// ==========================================

const createStyles = (themeName: string) => {
  // SÉCURITÉ : Assure-toi que t existe
  // @ts-ignore
  const t = THEMES[themeName] || THEMES["minimalist"];

  // Lecture de la valeur de l'arrondi une seule fois
  const radius = Number(t.borderRadius) || 0;

  return StyleSheet.create({
    page: {
      fontFamily: "Figtree",
      fontSize: 10,
      paddingTop: 40,
      paddingBottom: 60,
      paddingHorizontal: 40,
      backgroundColor: t.bg,
      color: t.primary,
      flexDirection: "column",
    },

    // --- TYPO ---
    mono: {
      fontFamily: "JetBrains Mono",
      letterSpacing: -0.5,
    },

    // --- HEADER (Reste inchangé) ---
    headerContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 40,
      backgroundColor: themeName === "bold" ? t.headerBg : "transparent",
      padding: themeName === "bold" ? 20 : 0,
      color: themeName === "bold" ? "#fff" : t.primary,
    },
    logoText: {
      fontSize: 26,
      fontWeight: "bold",
      textTransform: "uppercase",
      letterSpacing: -0.5,
      marginBottom: 6,
      color: themeName === "bold" ? "#fff" : t.primary,
    },
    invoiceMeta: {
      fontSize: 9,
      fontFamily: "JetBrains Mono",
      color: themeName === "bold" ? "#a3a3a3" : t.secondary,
      marginBottom: 2,
    },

    // --- ADRESSES ---
    addressesContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 40,
      borderBottomWidth: themeName === "minimalist" ? 1 : 0,
      borderBottomColor: t.borderColor,
      paddingBottom: 20,
    },
    addressBlock: {
      width: "45%",
      backgroundColor: themeName === "executive" ? "#f1f5f9" : "transparent",
      padding: themeName === "executive" ? 12 : 0,
      // FIX : Assure que 0 est utilisé si la condition n'est pas remplie
      borderRadius: themeName === "executive" ? radius : 0,
    },
    addressLabel: {
      fontSize: 8,
      fontWeight: "bold",
      textTransform: "uppercase",
      color: t.secondary,
      marginBottom: 8,
      letterSpacing: 1,
    },
    addressName: {
      fontSize: 11,
      fontWeight: "bold",
      marginBottom: 4,
    },
    addressText: {
      fontSize: 10,
      color: t.secondary,
      lineHeight: 1.4,
    },

    // --- TABLEAU ---
    tableContainer: { width: "100%", marginBottom: 20 },
    tableHeader: {
      flexDirection: "row",
      backgroundColor: t.tableHeaderBg,
      paddingVertical: 8,
      paddingHorizontal: 8,
      // FIX SÉCURISÉ : Lit directement la valeur numérique
      borderRadius: radius,
    },
    th: {
      color: t.tableHeaderColor,
      fontSize: 9,
      fontWeight: "bold",
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    tableRow: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: themeName === "bold" ? "#000" : "#e5e5e5",
      paddingVertical: 10,
      paddingHorizontal: 8,
    },

    // Colonnes (Reste inchangé)
    colDesc: { width: "50%", textAlign: "left" },
    colQty: { width: "15%", textAlign: "center" },
    colPrice: { width: "17.5%", textAlign: "right" },
    colTotal: { width: "17.5%", textAlign: "right" },

    cellTitle: { fontWeight: "bold", fontSize: 10, marginBottom: 2 },
    cellSubtitle: { fontSize: 8, color: t.secondary },
    cellText: { fontSize: 10 },
    cellTotal: { fontSize: 10, fontWeight: "bold" },

    // --- TOTAUX ---
    totalsContainer: {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginTop: 10,
    },
    totalsBox: {
      width: "45%",
      padding: themeName === "bold" ? 15 : 0,
      backgroundColor: themeName === "bold" ? "#000" : "transparent",
      color: themeName === "bold" ? "#fff" : t.primary,
      // FIX SÉCURISÉ
      borderRadius: radius,
    },
    totalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 4,
    },
    totalLabel: {
      fontSize: 10,
      color: themeName === "bold" ? "#a3a3a3" : t.secondary,
    },
    totalValue: {
      fontSize: 10,
      fontWeight: "bold",
      fontFamily: "JetBrains Mono",
    },
    finalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 10,
      paddingTop: 10,
      borderTopWidth: themeName === "bold" ? 0 : 1,
      borderTopColor: t.borderColor,
    },
    finalLabel: {
      fontSize: 12,
      fontWeight: "bold",
      textTransform: "uppercase",
    },
    finalValue: {
      fontSize: 16,
      fontWeight: "bold",
      fontFamily: "JetBrains Mono",
    },

    // --- FOOTER ---
    footer: {
      position: "absolute",
      bottom: 30,
      left: 40,
      right: 40,
      paddingTop: 15,
      borderTopWidth: 1,
      borderTopColor: t.borderColor,
      textAlign: "center",
    },
    footerText: {
      fontSize: 8,
      color: t.secondary,
      lineHeight: 1.5,
    },
  });
};

// ==========================================
// 4. COMPOSANT PRINCIPAL
// ==========================================

interface PdfDocumentProps {
  quote: Quote;
  theme?: "minimalist" | "executive" | "bold";
}

export const PdfDocument = ({
  quote,
  theme = "minimalist",
}: PdfDocumentProps) => {
  const styles = createStyles(theme);

  if (!quote)
    return (
      <Document>
        <Page>
          <Text>Chargement...</Text>
        </Page>
      </Document>
    );

  const subTotal = quote.items.reduce(
    (acc, item) => acc + item.quantity * item.unitPriceEuros,
    0
  );
  const taxAmount = subTotal * (quote.financials.vatRatePercent / 100);
  const totalTTC = subTotal + taxAmount - quote.financials.discountAmountEuros;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.logoText}>DEVIS</Text>
            <Text style={styles.invoiceMeta}>N° {quote.quote.number}</Text>
            <Text style={styles.invoiceMeta}>
              DATE : {new Date(quote.quote.issueDate).toLocaleDateString()}
            </Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "bold",
                marginBottom: 4,
                color: theme === "bold" ? "white" : "black",
              }}
            >
              {quote.company.name || "Votre Entreprise"}
            </Text>
            <Text style={styles.invoiceMeta}>{quote.company.email}</Text>
            <Text style={styles.invoiceMeta}>{quote.company.phone}</Text>
          </View>
        </View>

        {/* ADRESSES */}
        <View style={styles.addressesContainer}>
          <View style={styles.addressBlock}>
            <Text style={styles.addressLabel}>Émetteur</Text>
            <Text style={styles.addressName}>{quote.company.name}</Text>
            <Text style={styles.addressText}>{quote.company.address}</Text>
          </View>

          <View style={styles.addressBlock}>
            <Text style={styles.addressLabel}>Adressé à</Text>
            <Text style={styles.addressName}>{quote.client.name}</Text>
            <Text style={styles.addressText}>{quote.client.email}</Text>
            <Text style={styles.addressText}>{quote.client.address}</Text>
          </View>
        </View>

        {/* TABLEAU */}
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.th, styles.colDesc]}>Description</Text>
            <Text style={[styles.th, styles.colQty]}>Qté</Text>
            <Text style={[styles.th, styles.colPrice]}>Prix U.</Text>
            <Text style={[styles.th, styles.colTotal]}>Total</Text>
          </View>

          {quote.items.map((item, index) => (
            <View key={index} style={styles.tableRow} wrap={false}>
              <View style={styles.colDesc}>
                <Text style={styles.cellTitle}>{item.title}</Text>
                {item.subtitle && (
                  <Text style={styles.cellSubtitle}>{item.subtitle}</Text>
                )}
              </View>
              <Text style={[styles.cellText, styles.colQty, styles.mono]}>
                {item.quantity}
              </Text>
              <Text style={[styles.cellText, styles.colPrice, styles.mono]}>
                {formatPrice(item.unitPriceEuros)}
              </Text>
              <Text style={[styles.cellTotal, styles.colTotal, styles.mono]}>
                {formatPrice(item.quantity * item.unitPriceEuros)}
              </Text>
            </View>
          ))}
        </View>

        {/* TOTAUX */}
        <View style={styles.totalsContainer} wrap={false}>
          <View style={styles.totalsBox}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total HT</Text>
              <Text style={styles.totalValue}>{formatPrice(subTotal)}</Text>
            </View>

            {quote.financials.discountAmountEuros > 0 && (
              <View style={styles.totalRow}>
                <Text
                  style={[
                    styles.totalLabel,
                    { color: theme === "bold" ? "#4ade80" : "#16a34a" },
                  ]}
                >
                  Remise
                </Text>
                <Text
                  style={[
                    styles.totalValue,
                    { color: theme === "bold" ? "#4ade80" : "#16a34a" },
                  ]}
                >
                  - {formatPrice(quote.financials.discountAmountEuros)}
                </Text>
              </View>
            )}

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                TVA ({quote.financials.vatRatePercent}%)
              </Text>
              <Text style={styles.totalValue}>{formatPrice(taxAmount)}</Text>
            </View>

            <View style={styles.finalRow}>
              <Text style={styles.finalLabel}>Net à payer</Text>
              <Text style={styles.finalValue}>{formatPrice(totalTTC)}</Text>
            </View>
          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {quote.quote.terms ||
              "Merci de votre confiance. Conditions de paiement : à réception de facture."}
          </Text>
          <Text style={[styles.footerText, { marginTop: 4, opacity: 0.7 }]}>
            Document généré par Luxorum
          </Text>
        </View>
      </Page>
    </Document>
  );
};
