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
