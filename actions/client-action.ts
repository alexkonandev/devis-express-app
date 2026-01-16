"use server";

import db from "@/lib/prisma";
import { getClerkUserId } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getClients() {
  try {
    const authId = await getClerkUserId();
    if (!authId) return [];
    return await db.client.findMany({
      where: { userId: authId },
      orderBy: { name: "asc" },
    });
  } catch {
    // Suppression de _err car inutilisé
    return [];
  }
}

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
    return { success: true, data: client };
  } catch (err) {
    console.error("[UPSERT_CLIENT_ERROR]:", err);
    return { success: false, error: "Erreur technique" };
  }
}

export async function deleteClient(clientId: string) {
  try {
    const authId = await getClerkUserId();
    if (!authId) return { success: false, error: "Non autorisé" };

    // Suppression sécurisée par l'ID du client ET l'ID de l'utilisateur
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
      error: "Erreur lors de la suppression de l'actif",
    };
  }
}

/**
 * @action deleteManyClients
 * @description Suppression en lot pour l'efficacité opérationnelle (Batch Delete).
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