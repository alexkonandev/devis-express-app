import { getClerkUserId } from "@/lib/auth";
import db from "@/lib/prisma";

const DAY_IN_MS = 86_400_000;

export const checkSubscription = async () => {
  const userId = await getClerkUserId();

  if (!userId) {
    return false;
  }

  const userSubscription = await db.userSubscription.findUnique({
    where: {
      userId: userId,
    },
    select: {
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
    },
  });

  if (!userSubscription) {
    return false;
  }

  // Vérifie que l'abonnement est valide (date de fin + 1 jour de grâce > maintenant)
  const isValid =
    userSubscription.stripePriceId &&
    userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS >
      Date.now();

  return !!isValid; // Retourne un booléen (true/false)
};
