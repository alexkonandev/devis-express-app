import { getClerkUserId } from "@/lib/auth";
import { currentUser } from "@clerk/nextjs/server";
import db from "@/lib/prisma";
import { redirect } from "next/navigation";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage() {
  const userId = await getClerkUserId();
  if (!userId) redirect("/sign-in");

  // 1. Récupération
  let user = await db.user.findUnique({
    where: { id: userId },
  });

  // 2. Auto-Réparation (Seed)
  if (!user) {
    const clerkUser = await currentUser();
    if (!clerkUser) redirect("/sign-in");

    const email = clerkUser.emailAddresses[0]?.emailAddress;

    user = await db.user.create({
      data: {
        id: userId,
        email: email,
        companyName: clerkUser.fullName || "Mon Studio",
        companyEmail: email,
        quotePrefix: "DEV-",
        nextQuoteNumber: 1,
        defaultVatRate: 20,
        companyPhone: "",
        companyAddress: "",
        companySiret: "",
        companyWebsite: "",
      },
    });
  }

  // 3. Normalisation des données pour le client
  const initialSettings = {
    companyName: user.companyName || "",
    companyEmail: user.companyEmail || "",
    companyPhone: user.companyPhone || "",
    companyAddress: user.companyAddress || "",
    companySiret: user.companySiret || "",
    companyWebsite: user.companyWebsite || "",
    quotePrefix: user.quotePrefix || "DEV-",
    nextQuoteNumber: user.nextQuoteNumber || 1,
    defaultVatRate: user.defaultVatRate || 20,
    defaultTerms:
      user.defaultTerms || "Paiement à réception. Validité 30 jours.",
  };

  return (
    <div className="h-[calc(100vh-4rem)] w-full bg-[#FDFDFD]">
      <SettingsClient initialSettings={initialSettings} />
    </div>
  );
}
