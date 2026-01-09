import { auth } from "@clerk/nextjs/server";
import db from "@/lib/prisma";

const DAY_IN_MS = 86_400_000;

/**
 * Vérifie le statut PRO via Lemon Squeezy.
 * Utilise le modèle 'subscription' unique défini dans ton schéma.
 */
export const checkSubscription = async (): Promise<boolean> => {
  const { userId } = await auth();

  if (!userId) return false;

  try {
    const subscription = await db.subscription.findUnique({
      where: { userId },
      select: {
        variantId: true,
        endsAt: true,
      },
    });

    if (!subscription) return false;

    // Si pas de date de fin, l'abonnement est considéré comme actif (ou à vie)
    if (!subscription.endsAt) return !!subscription.variantId;

    // Vérification de validité avec période de grâce
    const isValid =
      subscription.variantId &&
      subscription.endsAt.getTime() + DAY_IN_MS > Date.now();

    return !!isValid;
  } catch (error) {
    console.error("Erreur checkSubscription:", error);
    return false;
  }
};
