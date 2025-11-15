import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { promises as fs } from "fs";
import path from "path";

// --- Définition des NOUVEAUX Types (Contrat de Données) ---
// Note : Tous les montants financiers sont en centimes (integer) pour la précision.

/**
 * Définit une seule ligne dans le devis.
 * Supporte un titre et un sous-titre optionnel.
 */
interface LineItem {
  title: string;
  subtitle?: string;
  quantity: number;
  unitPriceCents: number; // Prix unitaire en centimes
}

/**
 * La structure de données complète attendue par l'API.
 * Elle est conçue pour correspondre aux placeholders du nouveau template.
 */
interface QuoteData {
  company: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  client: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  quote: {
    number: string;
    issueDate: string;
    expiryDate: string;
    paymentTerms: string;
    paymentDetails: string;
    terms: string;
  };
  items: LineItem[];
  financials: {
    vatRatePercent: number; // Ex: 20 (pour 20%)
    discountAmountCents?: number; // Remise globale en centimes
  };
}

// --- Logique Métier : Calculs (Mise à jour) ---

/**
 * Calcule tous les totaux financiers à partir des données brutes.
 * @param data Les données complètes du devis (QuoteData)
 * @returns Un objet avec tous les montants calculés, en centimes.
 */
function calculateTotals(data: QuoteData) {
  // 1. Calcul du sous-total (somme des lignes)
  const subTotalCents = data.items.reduce((acc, item) => {
    return acc + item.quantity * item.unitPriceCents;
  }, 0);

  // 2. Application de la remise
  const discountCents = data.financials.discountAmountCents || 0;

  // La base de calcul pour la TVA est le sous-total MOINS la remise
  const subTotalAfterDiscountCents = subTotalCents - discountCents;

  // 3. Calcul de la TVA
  const taxRate = data.financials.vatRatePercent / 100;
  const taxAmountCents = Math.round(subTotalAfterDiscountCents * taxRate);

  // 4. Calcul du Total TTC
  const totalTTC_Cents = subTotalAfterDiscountCents + taxAmountCents;

  return {
    subTotalCents, // Correspond à {{SUBTOTAL}}
    discountCents, // Correspond à {{DISCOUNT_AMOUNT}}
    taxAmountCents, // Correspond à {{VAT_AMOUNT}}
    totalTTC_Cents, // Correspond à {{TOTAL_TTC}}
  };
}

/**
 * Fonction utilitaire pour formater les centimes en chaîne EUR (ex: "123.45")
 */
function formatCents(cents: number): string {
  return (cents / 100).toFixed(2);
}

// ====================================================================
// GESTIONNAIRE DE ROUTE POST (Le Cerveau de l'API)
// ====================================================================
export async function POST(request: NextRequest) {
  try {
    // 1. Réception des Données
    const quoteData: QuoteData = await request.json();

    // 2. Logique Métier (Calculs)
    const totals = calculateTotals(quoteData);

    // 3. Templating HTML (Préparation de l'injection)
    const templatePath = path.join(
      process.cwd(),
      "templates",
      "template-devis.html"
      // Assurez-vous que ce chemin pointe vers votre NOUVEAU template
    );
    let htmlTemplate = await fs.readFile(templatePath, "utf8");

    // ** 3.1 Injection des Lignes (Logique complexe) **
    // Correspond au nouveau format (titre + sous-titre optionnel)
    const linesHtml = quoteData.items
      .map(
        (item) => `
      <tr class="border-b border-gray-200 avoid-break">
        <td class="px-6 py-4 align-top">
          <p class="font-medium text-gray-800">${item.title}</p>
          ${
            item.subtitle
              ? `<p class="text-xs text-gray-600 mt-1">${item.subtitle}</p>`
              : ""
          }
        </td>
        <td class="px-6 py-4 text-center align-top">${item.quantity}</td>
        <td class="px-6 py-4 text-right align-top">${formatCents(
          item.unitPriceCents
        )} €</td>
        <td class="px-6 py-4 text-right align-top font-medium text-gray-800">${formatCents(
          item.quantity * item.unitPriceCents
        )} €</td>
      </tr>
    `
      )
      .join("");

    // ** 3.2 Injection des Données Simples (Remplacement 1-to-1) **
    // Utilise les NOUVEAUX placeholders et la NOUVELLE structure de données
    htmlTemplate = htmlTemplate
      // Vendeur (Vous)
      .replace("{{COMPANY_NAME}}", quoteData.company.name)
      .replace("{{COMPANY_EMAIL}}", quoteData.company.email)
      .replace("{{COMPANY_PHONE}}", quoteData.company.phone)
      .replace("{{COMPANY_ADDRESS}}", quoteData.company.address)

      // Client
      .replace("{{CLIENT_NAME}}", quoteData.client.name)
      .replace("{{CLIENT_EMAIL}}", quoteData.client.email)
      .replace("{{CLIENT_PHONE}}", quoteData.client.phone)
      .replace("{{CLIENT_ADDRESS}}", quoteData.client.address)

      // Détails Devis
      .replace("{{QUOTE_NUMBER}}", quoteData.quote.number)
      .replace("{{ISSUE_DATE}}", quoteData.quote.issueDate)
      .replace("{{EXPIRY_DATE}}", quoteData.quote.expiryDate)
      .replace("{{PAYMENT_TERMS}}", quoteData.quote.paymentTerms)

      // Lignes (le bloc)
      .replace("{{LINE_ITEMS}}", linesHtml)

      // Totaux (calculés)
      .replace("{{SUBTOTAL}}", formatCents(totals.subTotalCents))
      .replace("{{VAT_RATE}}", quoteData.financials.vatRatePercent.toString())
      .replace("{{VAT_AMOUNT}}", formatCents(totals.taxAmountCents))
      .replace("{{DISCOUNT_AMOUNT}}", formatCents(totals.discountCents))
      .replace("{{TOTAL_TTC}}", formatCents(totals.totalTTC_Cents))

      // Footer
      .replace(
        "{{TERMS}}",
        quoteData.quote.terms || "Aucune condition spécifiée."
      )
      .replace(
        "{{PAYMENT_DETAILS}}",
        quoteData.quote.paymentDetails ||
          "Aucune information de paiement fournie."
      );

    // 4. Lancement de Puppeteer (Génération PDF)
    const browser = await puppeteer.launch({
      headless: true,
      // Note: Pour Vercel, vous aurez besoin de 'chrome-aws-lambda'
      // et d'une configuration args: ['--no-sandbox']
    });
    const page = await browser.newPage();

    // Charger le HTML
    await page.setContent(htmlTemplate, { waitUntil: "networkidle0" });

    // Générer le PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "25mm", right: "15mm", bottom: "25mm", left: "15mm" },
    });

    await browser.close();

    // 5. Retourner le PDF
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="devis-${quoteData.quote.number}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la génération du devis:", error);
    return NextResponse.json(
      {
        message: "Échec de la génération du PDF.",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
