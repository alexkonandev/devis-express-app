"use server";

import db from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma/client";
import { getClerkUserId } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// Type pour les données du formulaire
export type ClientInput = {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  siret?: string;
  notes?: string;
};

// ==========================================
// 1. RÉCUPÉRER LES CLIENTS
// ==========================================
export async function getClientsAction() {
  try {
    const userId = await getClerkUserId();
    if (!userId) return { success: false, error: "Non authentifié" };

    const clients = await db.client.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { Devis: true }, // Compte le nombre de devis pour ce client
        },
      },
    });

    return { success: true, data: clients };
  } catch (error) {
    console.error("Erreur getClientsAction:", error);
    return { success: false, error: "Impossible de charger les clients." };
  }
}

// ==========================================
// 2. CRÉER OU MODIFIER (UPSERT)
// ==========================================
export async function upsertClientAction(data: ClientInput, clientId?: string) {
  try {
    const userId = await getClerkUserId();
    if (!userId) return { success: false, error: "Non authentifié" };

    // A. MODE CRÉATION
    if (!clientId) {
      // --- LOGIQUE FREEMIUM SIMPLIFIÉE ---
      // 1. Vérification du quota (Limite à 3 pour le plan Gratuit)
      const currentCount = await db.client.count({ where: { userId } });

      // TODO: Remplacer 'false' par une vraie vérification (ex: user.plan === 'PRO')
      const isPremium = false;

      if (!isPremium && currentCount >= 3) {
        return {
          success: false,
          error: "LIMIT_REACHED",
          message:
            "Limite de 3 clients atteinte. Passez Premium pour l'illimité.",
        };
      }

      await db.client.create({
        data: {
          userId,
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          siret: data.siret,
          // notes: data.notes, // Décommente si tu as ajouté ce champ
        },
      });
    } else {
      // B. MODE ÉDITION
      await db.client.update({
        where: { id: clientId, userId },
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          siret: data.siret,
        },
      });
    }

    revalidatePath("/clients");
    return { success: true };
  } catch (error) {
    console.error("Erreur upsertClientAction:", error);

    // Gestion erreur Prisma P2002 (Unicité)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return { success: false, error: "Un client avec ce nom existe déjà." };
      }
    }

    return { success: false, error: "Erreur lors de la sauvegarde." };
  }
}

// ==========================================
// 3. SUPPRIMER UN CLIENT
// ==========================================
export async function deleteClientAction(clientId: string) {
  try {
    const userId = await getClerkUserId();
    if (!userId) return { success: false, error: "Non authentifié" };

    await db.client.delete({
      where: { id: clientId, userId },
    });

    revalidatePath("/clients");
    return { success: true };
  } catch (error) {
    console.error("Erreur deleteClientAction:", error);
    return { success: false, error: "Impossible de supprimer ce client." };
  }
}

export async function searchClientsAction() {
  try {
    const userId = await getClerkUserId();
    if (!userId) return { success: false, error: "Non authentifié" };

    const clients = await db.client.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        siret: true, // Assurez-vous que ces champs existent dans votre schéma
        phone: true, // Assurez-vous que ces champs existent dans votre schéma
      },
      orderBy: { name: "asc" },
    });

    return { success: true, data: clients };
  } catch (error) {
    return {
      success: false,
      error: "Erreur lors de la récupération des clients",
    };
  }
}
