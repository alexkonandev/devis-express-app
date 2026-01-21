"use server";

import db from "@/lib/prisma";
import { getClerkUserId } from "@/lib/auth";
import { revalidatePath } from "next/cache";

/**
 * RÉCUPÉRATION DES CLIENTS + KPIS
 * Calcule le nombre de devis et le CA total par client pour l'UI.
 */
export async function getClients() {
  try {
    const authId = await getClerkUserId();
    if (!authId) return [];

    const clients = await db.client.findMany({
      where: { userId: authId },
      include: {
        _count: {
          select: { quotes: true },
        },
        quotes: {
          select: {
            lines: {
              select: {
                quantity: true,
                unitPrice: true, // Aligné sur ton nouveau schéma
              },
            },
          },
        },
      },
      orderBy: { name: "asc" },
    });

    // Transformation pour correspondre à l'interface ClientListItem
    return clients.map((client) => {
      const totalSpent = client.quotes.reduce((acc, quote) => {
        const quoteTotal = quote.lines.reduce(
          (sum, line) => sum + line.quantity * line.unitPrice,
          0
        );
        return acc + quoteTotal;
      }, 0);

      return {
        id: client.id,
        name: client.name,
        email: client.email,
        address: client.address,
        siret: client.siret,
        userId: client.userId,
        createdAt: client.createdAt,
        updatedAt: client.updatedAt,
        quoteCount: client._count.quotes,
        totalSpent: totalSpent,
      };
    });
  } catch (err) {
    console.error("[GET_CLIENTS_ERROR]:", err);
    return [];
  }
}

/**
 * UPSERT CLIENT
 * Création ou mise à jour avec synchronisation du cache.
 */
export async function upsertClient(data: {
  id?: string;
  name: string;
  email?: string;
  address?: string;
  siret?: string;
}) {
  try {
    const authId = await getClerkUserId();
    if (!authId) return { success: false, error: "Non autorisé" };

    const clientData = {
      name: data.name,
      email: data.email || null,
      address: data.address || null,
      siret: data.siret || null,
      userId: authId,
    };

    const client = data.id
      ? await db.client.update({
          where: { id: data.id, userId: authId },
          data: clientData,
        })
      : await db.client.create({ data: clientData });

    revalidatePath("/dashboard/clients");
    revalidatePath("/quotes/new"); // Pour rafraîchir la liste dans l'éditeur de devis

    return { success: true, data: client };
  } catch (err) {
    console.error("[UPSERT_CLIENT_ERROR]:", err);
    return { success: false, error: "Erreur technique lors de la sauvegarde" };
  }
}

/**
 * SUPPRESSION UNITAIRE
 */
export async function deleteClient(clientId: string) {
  try {
    const authId = await getClerkUserId();
    if (!authId) return { success: false, error: "Non autorisé" };

    await db.client.delete({
      where: {
        id: clientId,
        userId: authId,
      },
    });

    revalidatePath("/dashboard/clients");
    return { success: true };
  } catch (err) {
    console.error("[DELETE_CLIENT_ERROR]:", err);
    return {
      success: false,
      error: "Impossible de supprimer un client lié à des devis existants",
    };
  }
}

/**
 * SUPPRESSION GROUPÉE (BATCH DELETE)
 */
export async function deleteManyClients(clientIds: string[]) {
  try {
    const authId = await getClerkUserId();
    if (!authId) return { success: false, error: "Non autorisé" };

    const result = await db.client.deleteMany({
      where: {
        id: { in: clientIds },
        userId: authId,
      },
    });

    revalidatePath("/dashboard/clients");
    return { success: true, count: result.count };
  } catch (err) {
    console.error("[DELETE_MANY_CLIENTS_ERROR]:", err);
    return { success: false, error: "Erreur lors de la suppression groupée" };
  }
}
