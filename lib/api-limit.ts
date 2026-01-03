    import db from "@/lib/prisma";
    import { getClerkUserId } from "@/lib/auth"; // Ton helper d'auth
    import { MAX_FREE_COUNTS } from "@/constants"; // On créera ce fichier constants juste après pour être propre

    export const incrementApiLimit = async () => {
      const userId = await getClerkUserId();

      if (!userId) return;

      const userApiLimit = await db.userApiLimit.findUnique({
        where: { userId },
      });

      if (userApiLimit) {
        await db.userApiLimit.update({
          where: { userId },
          data: { count: userApiLimit.count + 1 },
        });
      } else {
        await db.userApiLimit.create({
          data: { userId, count: 1 },
        });
      }
    };

    export const checkApiLimit = async () => {
      const userId = await getClerkUserId();

      if (!userId) return false;

      const userApiLimit = await db.userApiLimit.findUnique({
        where: { userId },
      });

      if (!userApiLimit || userApiLimit.count < MAX_FREE_COUNTS) {
        return true; // L'utilisateur peut encore créer un devis
      } else {
        return false; // Bloqué -> Direction paiement
      }
    };

    export const getApiLimitCount = async () => {
      const userId = await getClerkUserId();

      if (!userId) return 0;

      const userApiLimit = await db.userApiLimit.findUnique({
        where: { userId },
      });

      if (!userApiLimit) return 0;

      return userApiLimit.count;
    };