import { getClerkUserId } from "@/lib/auth";
import { currentUser } from "@clerk/nextjs/server"; // Nécessaire pour récupérer l'email si création
import  db  from "@/lib/prisma";
import { redirect } from "next/navigation";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage() {
  const userId = await getClerkUserId();
  if (!userId) redirect("/sign-in");

  // 1. On tente de trouver l'utilisateur en base
  let user = await db.user.findUnique({
    where: { id: userId },
  });

  // 2. AUTO-RÉPARATION : Si l'utilisateur n'existe pas (suite au reset DB), on le crée
  if (!user) {
    const clerkUser = await currentUser();

    if (!clerkUser) redirect("/sign-in"); // Sécurité double

    const email = clerkUser.emailAddresses[0]?.emailAddress;

    // Création silencieuse du compte dans la DB Neon
    user = await db.user.create({
      data: {
        id: userId,
        email: email,
        // On initialise avec des valeurs par défaut pour éviter les champs vides tristes
        companyName: clerkUser.fullName || "Mon Entreprise",
        companyEmail: email,
        quotePrefix: "DEV-",
        nextQuoteNumber: 1,
        defaultVatRate: 20,
      },
    });
  }

  // 3. Préparation des données pour le Client Component
  // Maintenant on est sûr que 'user' n'est pas null
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
      user.defaultTerms ||
      "Paiement à réception. TVA non applicable, art. 293 B du CGI.",
  };

  return <SettingsClient initialSettings={initialSettings} />;
}
