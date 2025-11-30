// app/devis/page.tsx (Server Component)

import  db  from "@/lib/prisma"; // Utilise le Named Export du client Prisma
import SuiviDevisClient, { Quote } from "./SuiviDevisClient"; // Importe le Client Component et son Type
import { getClerkUserId, getCurrentUser } from "@/lib/auth"; // Fonctions d'Auth Clerk
import { redirect } from "next/navigation";

// Définition de la fonction de récupération et de formatage des données
// Cette fonction reste côté serveur (Server Component)
async function getQuotesData(userId: string): Promise<Quote[]> {
  // 1. Récupération optimisée des données
  const devisList = await db.devis.findMany({
    where: { userId: userId },
    include: {
      client: true, // On récupère les infos du client lié
    },
    orderBy: { createdAt: "desc" },
  });

  // 2. Transformation des données pour l'UI (Mapping)
  const formattedQuotes: Quote[] = devisList.map((d) => {
    // Calcul de la date de validité (ex: +30 jours par défaut)
    const validite = new Date(d.createdAt);
    validite.setDate(validite.getDate() + 30);

    // Extraction sécurisée du titre du projet depuis le JSON itemsData
    const items = d.itemsData as any[];
    // Utilise le titre du premier article comme titre du projet
    const projetTitle =
      items && items.length > 0 ? items[0].title : `Devis N°${d.number}`;

    return {
      id: d.id,
      client: d.client.name,
      email_client: d.client.email || "",
      projet: projetTitle,
      date_creation: d.createdAt.toISOString(),
      date_validite: validite.toISOString(),
      statut: d.isSent ? "Envoyé" : "Brouillon",
      montant_ht: d.totalTTC, // Montant TTC pour affichage rapide
    };
  });

  return formattedQuotes;
}

export default async function SuiviDevisPage() {
  try {
    const clerkUserId = await getClerkUserId();

    if (!clerkUserId) {
      // Stratégie : Rediriger si non connecté (meilleure UX que d'afficher une erreur)
      // Assurez-vous que votre Middleware Next.js gère la route /sign-in
      redirect("/sign-in");
    }

    // --- SYNCHRONISATION PRISMA / CLERK (Upsert) ---

    // Récupérer le profil complet de Clerk pour obtenir l'email
    const clerkUser = await getCurrentUser();
    const userEmail =
      clerkUser?.emailAddresses?.[0]?.emailAddress ??
      "email_non_defini@clerk.com";

    // Création ou mise à jour de l'utilisateur dans notre base de données Neon
    // L'ID est CLERK_ID, l'email est synchronisé.
    await db.user.upsert({
      where: { id: clerkUserId },
      update: { email: userEmail }, // Mise à jour de l'email si Clerk le change
      create: {
        id: clerkUserId,
        email: userEmail,
        // Les autres champs (companyName, etc.) sont initialisés à null
      },
    });
    // --------------------------------------------------

    // Récupération des données pour l'utilisateur synchronisé
    const quotes = await getQuotesData(clerkUserId);

    // 3. Rendu du Client Component avec les données initiales
    return <SuiviDevisClient initialQuotes={quotes} />;
  } catch (error) {
    console.error("Erreur critique dans SuiviDevisPage:", error);
    // En cas d'échec DB (ex: connexion perdue), afficher un message d'erreur fatal
    return (
      <div className="p-10 text-red-600 font-bold text-center">
        Erreur critique de la base de données. Veuillez contacter le support
        technique.
      </div>
    );
  }
}
