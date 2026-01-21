import { getClerkUserId } from "@/lib/auth";
import db from "@/lib/prisma";
import { redirect } from "next/navigation";
import { checkSubscription } from "@/lib/subscription";
import { SettingsForm } from "@/features/settings/settings-form";

export default async function SettingsPage() {
  const userId = await getClerkUserId();
  if (!userId) redirect("/sign-in");

  const isPro = await checkSubscription();

  const user = await db.user.findUnique({
    where: { id: userId },
  });

  if (!user) redirect("/onboarding");

  // On passe les données initiales au formulaire
  const initialData = {
    companyName: user.companyName || "",
    companyEmail: user.companyEmail || "",
    companyPhone: user.companyPhone || "",
    companyAddress: user.companyAddress || "",
    companySiret: user.companySiret || "",
    companyWebsite: user.companyWebsite || "",
    quotePrefix: user.quotePrefix,
    nextQuoteNumber: user.nextQuoteNumber,
    defaultVatRate: user.defaultVatRate,
    defaultTerms: user.defaultTerms || "",
  };

  return <SettingsForm initialData={initialData} isPro={isPro} />;
}
