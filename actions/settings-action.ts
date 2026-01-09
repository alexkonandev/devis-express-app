"use server";

import db from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { settingsSchema, SettingsFormValues } from "@/lib/validations/settings";

export async function updateSettings(values: SettingsFormValues) {
  const { userId } = await auth();
  if (!userId) throw new Error("Non autorisé");

  const validatedFields = settingsSchema.parse(values);

  try {
    await db.user.update({
      where: { id: userId },
      data: validatedFields,
    });

    revalidatePath("/settings");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erreur lors de la mise à jour" };
  }
}
