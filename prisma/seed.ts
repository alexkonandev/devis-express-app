// prisma/seed.ts

// 1. IMPORT CRITIQUE : Utilisation du chemin généré pour les types de Prisma
import { Prisma } from "../app/generated/prisma/client";
// 2. Importation du client DB depuis votre couche d'abstraction (lib/db.ts)
import  db  from "@/lib/prisma";
import "dotenv/config";

// L'ID doit correspondre à celui que nous utilisons dans le Server Component
const TEST_USER_ID = "climbing_user_id_v1";

// Définir le type de données pour les devis en utilisant le type Prisma importé
type DevisCreateInput = Prisma.DevisCreateInput & {
  itemsData: { title: string; quantity: number; unitPriceEuros: number }[];
};

// 1. Définition des données
const devisData: DevisCreateInput = {
  userId: TEST_USER_ID,
  clientId: "", // Sera mis à jour après la création du client
  number: "DEV-2025-001",
  issueDate: new Date(),
  totalTTC: 5500.0,
  vatRatePercent: 20.0,
  discountAmountEuros: 100.0,
  isSent: true,
  itemsData: [
    {
      title: "Conception et architecture Next.js",
      quantity: 1,
      unitPriceEuros: 3000,
    },
    {
      title: "Développement module Devis (Prisma 7)",
      quantity: 1,
      unitPriceEuros: 2600,
    },
  ],
  terms: "Paiement à 30 jours.",
};

// 2. Logique d'injection
export async function main() {
  console.log("Démarrage du Seeding des données Devis Express...");

  // Créer/Récupérer l'utilisateur de base
  const user = await db.user.upsert({
    where: { id: TEST_USER_ID },
    update: {},
    create: {
      id: TEST_USER_ID,
      email: "contact@alex-digital-nomad.com",
      companyName: "ALEX Digital Ventures SAS",
      companyEmail: "devis@alex-digital-nomad.com",
      companyPhone: "+33 6 00 00 00 00",
      companyAddress: "10 Rue de la Performance, 75000 PARIS",
    },
  });

  // Créer/Récupérer le client de test
  const clientTest = await db.client.upsert({
    where: { userId_name: { userId: user.id, name: "Client Fictif A" } },
    update: {},
    create: {
      userId: user.id,
      name: "Client Fictif A",
      email: "client.a@entreprise.com",
      address: "22 Avenue du ROI, 13000 Marseille",
    },
  });

  // Mettre à jour l'ID Client dans les données de devis
  devisData.clientId = clientTest.id;

  // Créer le devis de test
  await db.devis.create({
    data: devisData,
  } as { data: Prisma.DevisCreateInput }); // Cast for safety due to custom itemsData structure

  console.log(`✅ Utilisateur (${user.email}) et devis de test injectés.`);
}

main();
