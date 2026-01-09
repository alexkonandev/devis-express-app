"use server";

import db from "@/lib/prisma";
import { getClerkUserId } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export type OnboardingData = {
  profession: "TECH" | "CREATIVE" | "MARKETING" | "CONTENT" | "CONSULTING";
  businessModel: "PROJECT" | "TIME" | "RECURRING" | "UNIT";
};

export async function completeOnboardingAction(data: OnboardingData) {
  try {
    const authId = await getClerkUserId();

    if (!authId) {
      return { success: false, error: "Utilisateur non identifié." };
    }
    await db.user.update({
      where: { id: authId },
      data: {
        profession: data.profession,
        businessModel: data.businessModel,
        isOnboarded: true,
      },
    });

    revalidatePath("/", "layout");

    return { success: true };
  } catch (error) {
    console.error("[ONBOARDING_ERROR]:", error);
    return {
      success: false,
      error: "Impossible de finaliser la configuration.",
    };
  }
}
