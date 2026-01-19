"use server";

import db from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { currentUser, createClerkClient } from "@clerk/nextjs/server";

export type OnboardingData = {
  profession: "TECH" | "CREATIVE" | "MARKETING" | "CONTENT" | "CONSULTING";
  businessModel: "PROJECT" | "TIME" | "RECURRING" | "UNIT";
};

export async function completeOnboardingAction(data: OnboardingData) {
  try {
    const user = await currentUser();

    if (!user || !user.id) {
      return { success: false, error: "Utilisateur non identifié." };
    }

    const authId = user.id;
    const email = user.emailAddresses[0]?.emailAddress;

    // 1. Mise à jour de la base de données Prisma
    await db.user.upsert({
      where: { id: authId },
      update: {
        profession: data.profession,
        businessModel: data.businessModel,
        isOnboarded: true,
      },
      create: {
        id: authId,
        email: email,
        profession: data.profession,
        businessModel: data.businessModel,
        isOnboarded: true,
      },
    });

    // 2. SYNCHRONISATION CLERK (Indispensable pour le Middleware)
    const clerk = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    await clerk.users.updateUserMetadata(authId, {
      publicMetadata: {
        onboardingComplete: true,
      },
    });

    // 3. Purge du cache
    revalidatePath("/", "layout");

    return { success: true };
  } catch (error) {
    console.error("[ONBOARDING_ERROR]:", error);
    return {
      success: false,
      error: "Impossible de finaliser la configuration système.",
    };
  }
}
