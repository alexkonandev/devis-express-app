"use server";

import db from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma/client";
import { getClerkUserId } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// ============================================================================
// 1. DÉFINITIONS DE TYPES (Alignés sur Frontend & DB)
// ============================================================================

// ============================================================================
// 1. DÉFINITIONS DE TYPES (Alignés sur Frontend & DB)
// ============================================================================

export type QuoteStatus =
  | "draft"
  | "sent"
  | "accepted"
  | "rejected"
  | "archived";

// MISE À JOUR : Ajout des champs riches optionnels dans les items
export type QuotePayload = {
  id?: string;
  clientId?: string;
  number: string;
  issueDate: Date;
  validityDate?: Date;
  terms: string;
  totalTTC: number;
  status: QuoteStatus;
  financials: {
    vatRatePercent: number;
    discountAmountEuros: number;
  };
  client: {
    name: string;
    email: string;
    address: string;
  };
  company: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: Array<{
    title: string;
    quantity: number;
    unitPriceEuros: number;
    subtitle?: string;
    // --- NOUVEAUX CHAMPS RICHES ---
    // Ils sont optionnels (?) car une ligne ajoutée manuellement n'en aura pas forcément
    technicalScope?: any; // ou { included: string[], excluded: string[] }
    pricing?: any;
    salesCopy?: any;
  }>;
};

export type SearchResult = {
  id: string;
  number: string;
  clientName: string;
  total: number;
  status: string;
  date: Date;
};

// ============================================================================
// 2. ACTION : SAUVEGARDE (CREATE / UPDATE)
// ============================================================================

export async function saveDevisAction(payload: QuotePayload) {
  const userId = await getClerkUserId();
  if (!userId) {
    return { success: false, error: "Authentification requise." };
  }

  try {
    // A. Mise à jour Profil Émetteur (User)
    if (payload.company) {
      await db.user.update({
        where: { id: userId },
        data: {
          companyName: payload.company.name,
          companyEmail: payload.company.email,
          companyPhone: payload.company.phone,
          companyAddress: payload.company.address,
        },
      });
    }

    // B. Gestion du Client (Upsert)
    const clientRecord = await db.client.upsert({
      where: {
        userId_name: { userId: userId, name: payload.client.name },
      },
      update: {
        email: payload.client.email,
        address: payload.client.address,
      },
      create: {
        userId: userId,
        name: payload.client.name,
        email: payload.client.email,
        address: payload.client.address,
      },
    });

    // C. Date de validité
    let validUntil = payload.validityDate;
    if (!validUntil) {
      validUntil = new Date(payload.issueDate);
      validUntil.setDate(validUntil.getDate() + 30);
    }

    // D. Préparation des données Prisma
    const devisData = {
      userId: userId,
      clientId: clientRecord.id,
      number: payload.number,
      issueDate: payload.issueDate,
      validityDate: validUntil,
      status: payload.status,
      totalTTC: payload.totalTTC,
      vatRatePercent: payload.financials.vatRatePercent,
      discountAmountEuros: payload.financials.discountAmountEuros,
      
      // La magie opère ici : Prisma va sérialiser tout l'objet items,
      // y compris les nouveaux champs technicalScope, pricing, etc.
      itemsData: payload.items as Prisma.JsonValue, 
      
      terms: payload.terms,
    };

    // E. Exécution
    const result = payload.id
      ? await db.devis.update({
          where: { id: payload.id, userId: userId },
          data: devisData,
        })
      : await db.devis.create({
          data: devisData,
        });

    revalidatePath("/devis");
    return {
      success: true,
      devisId: result.id,
      message: "Devis sauvegardé avec succès.",
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const target = (error.meta?.target as string[]) || [];
        if (target.includes("number")) {
          return {
            success: false,
            error: `Le numéro "${payload.number}" existe déjà.`,
          };
        }
      }
    }
    console.error("Erreur saveDevisAction:", error);
    return { success: false, error: "Échec de la sauvegarde technique." };
  }
}

// ============================================================================
// 3. ACTION : RECHERCHE (POUR LA BARRE DE COMMANDE)
// ============================================================================

export async function searchDevisAction(
  query: string
): Promise<SearchResult[]> {
  const userId = await getClerkUserId();
  if (!userId || !query || query.length < 2) return [];

  try {
    const results = await db.devis.findMany({
      where: {
        userId: userId,
        OR: [
          { number: { contains: query, mode: "insensitive" } },
          { client: { name: { contains: query, mode: "insensitive" } } },
        ],
      },
      select: {
        id: true,
        number: true,
        totalTTC: true,
        createdAt: true,
        status: true, // On récupère le champ status
        client: { select: { name: true } },
      },
      take: 5,
      orderBy: { createdAt: "desc" },
    });

    return results.map((r) => ({
      id: r.id,
      number: r.number,
      clientName: r.client.name,
      total: r.totalTTC,
      status: r.status, // On renvoie le raw status (le front fera la traduction)
      date: r.createdAt,
    }));
  } catch (error) {
    console.error("Erreur recherche:", error);
    return [];
  }
}

// ============================================================================
// 4. ACTION : SUPPRESSION
// ============================================================================

export async function deleteDevisAction(devisId: string) {
  const userId = await getClerkUserId();
  if (!userId) return { success: false, error: "Auth requise." };

  try {
    await db.devis.delete({ where: { id: devisId, userId: userId } });
    revalidatePath("/devis");
    return { success: true };
  } catch (error) {
    console.error("Erreur delete:", error);
    return { success: false, error: "Impossible de supprimer ce document." };
  }
}

// ============================================================================
// 5. ACTION : CRÉATION DOSSIER (PLACEHOLDER)
// ============================================================================
// Gardé pour compatibilité avec SearchCommand, même si la feature n'est pas encore en DB
export async function createFolderAction(name: string) {
  return { success: true };
}
