"use server";

import { getClerkUserId } from "@/lib/auth";
import db from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Type correspondant à ton ActiveQuote dans le front
type QuoteInput = {
  title: string;
  client: {
    name: string;
    email: string;
    phone: string;
    address: string;
    siret: string;
  };
  quote: { number: string; issueDate: string | Date; terms: string };
  financials: { vatRatePercent: number; discountAmountEuros: number };
  items: any[];
};

export async function upsertQuoteAction(
  quoteData: QuoteInput,
  quoteId?: string | null
) {
  const userId = await getClerkUserId();
  if (!userId) return { success: false, error: "Non autorisé" };

  try {
    // 1. GESTION INTELLIGENTE DU CLIENT (CRM)
    // On cherche un client existant pour cet user avec ce nom, ou on le crée/met à jour
    const client = await db.client.upsert({
      where: {
        userId_name: {
          userId,
          name: quoteData.client.name, // Clé unique composite
        },
      },
      update: {
        email: quoteData.client.email,
        phone: quoteData.client.phone,
        address: quoteData.client.address,
        siret: quoteData.client.siret,
      },
      create: {
        userId,
        name: quoteData.client.name,
        email: quoteData.client.email,
        phone: quoteData.client.phone,
        address: quoteData.client.address,
        siret: quoteData.client.siret,
      },
    });

    // 2. CALCUL DES TOTAUX (Sécurité Financière)
    // On ne fait jamais confiance au client pour les maths financières
    const subTotal = quoteData.items.reduce(
      (acc: number, item: any) =>
        acc + Number(item.quantity) * Number(item.unitPriceEuros),
      0
    );
    const discount = Number(quoteData.financials.discountAmountEuros) || 0;
    const taxable = Math.max(0, subTotal - discount);
    const vatRate = Number(quoteData.financials.vatRatePercent) || 0;
    const totalTTC = taxable * (1 + vatRate / 100);

    // 3. PRÉPARATION DE LA DONNÉE JSON
    // On stocke la structure riche (Items + Titre Projet) dans le champ JSON
    const itemsDataJSON = {
      projectTitle: quoteData.title, // On sauvegarde le titre du projet ici
      items: quoteData.items,
    };

    // 4. UPSERT DU DEVIS
    const devisData = {
      userId,
      clientId: client.id,
      number: quoteData.quote.number,
      issueDate: new Date(quoteData.quote.issueDate),
      validityDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Validité +30j par défaut
      status: "draft", // Toujours brouillon par défaut lors d'une sauvegarde manuelle
      totalTTC,
      vatRatePercent: vatRate,
      discountAmountEuros: discount,
      terms: quoteData.quote.terms,
      itemsData: itemsDataJSON, // Stockage JSON
    };

    let savedQuote;

    if (quoteId) {
      // MISE À JOUR
      savedQuote = await db.devis.update({
        where: { id: quoteId },
        data: devisData,
      });
    } else {
      // CRÉATION
      // Vérification doublon numéro de devis
      const existing = await db.devis.findUnique({
        where: { number: quoteData.quote.number },
      });
      if (existing) {
        return { success: false, error: "Ce numéro de devis existe déjà." };
      }

      savedQuote = await db.devis.create({
        data: devisData,
      });
    }

    // 5. REVALIDATION DU CACHE
    revalidatePath("/dashboard");
    revalidatePath("/devis");

    return { success: true, data: savedQuote };
  } catch (error) {
    console.error("Save Error:", error);
    return { success: false, error: "Erreur base de données" };
  }
}
