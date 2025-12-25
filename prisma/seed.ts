// Fichier: prisma/seed.ts

// 1. IMPORTS CRITIQUES (Modèle Adaptateur Officiel - STRICT)
import { PrismaClient, Prisma } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as pg from "pg";
import "dotenv/config";

// --- GESTION DU CLIENT ET DE L'ADAPTATEUR (STRICT) ---

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL must be defined for the seed script.");
}

// 1. Initialisation du Pool PostgreSQL
const pool = new pg.Pool({ connectionString: DATABASE_URL });

// 2. Création de l'Adaptateur
const adapter = new PrismaPg(pool);

// 3. Initialisation du Client Prisma avec l'Adaptateur
const prisma = new PrismaClient({
  adapter,
});

// ====================================================================
// 2. DONNÉES : LES 3 THÈMES "CHIRURGICAUX"
// ====================================================================

const SYSTEM_THEMES = [
  // 1. SWISS INTERNATIONAL (L'Autorité)
  {
    id: "theme_swiss_system", // ID fixe pour éviter les doublons
    name: "Swiss International",
    description:
      "Grilles strictes, typographie helvétique, contraste maximal. Idéal pour l'architecture et le conseil.",
    color: "#000000", // Pastille noire
    baseLayout: "swiss", // Correspond à la clé dans registry.ts
    isSystem: true,
    config: {
      colors: {
        primary: "#000000",
        secondary: "#F4F4F5", // Zinc-100
        text: "#000000",
        bg: "#FFFFFF",
        border: "#E4E4E7", // Zinc-200
      },
      typography: {
        fontFamily: "'Inter', sans-serif",
        fontUrl:
          "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;900&display=swap",
        headingWeight: "900",
      },
      borderRadius: "0px",
    },
  },

  // 2. TECH UNICORN (L'Innovation)
  {
    id: "theme_tech_system",
    name: "Tech Unicorn",
    description:
      "Moderne, aéré et digital. Idéal pour les startups et le développement web.",
    color: "#4F46E5", // Pastille Indigo
    baseLayout: "tech", // Correspond à la clé dans registry.ts
    isSystem: true,
    config: {
      colors: {
        primary: "#4F46E5", // Indigo-600
        secondary: "#EEF2FF", // Indigo-50
        text: "#334155", // Slate-700
        bg: "#FFFFFF",
        border: "#CBD5E1", // Slate-300
      },
      typography: {
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontUrl:
          "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800&display=swap",
        headingWeight: "800",
      },
      borderRadius: "12px",
    },
  },

  // 3. ATELIER LUXE (L'Élégance)
  {
    id: "theme_corporate_system",
    name: "Atelier Luxe",
    description:
      "Sophistiqué, éditorial et texturé. Idéal pour la mode, le design et le luxe.",
    color: "#1C1917", // Pastille Stone
    baseLayout: "corporate", // Correspond à la clé dans registry.ts
    isSystem: true,
    config: {
      colors: {
        primary: "#1C1917", // Stone-900
        secondary: "#F5F5F4", // Stone-100
        text: "#44403C", // Stone-700
        bg: "#FAFAF9", // Stone-50 (Papier chaud)
        border: "#D6D3D1", // Stone-300
      },
      typography: {
        fontFamily: "'Playfair Display', serif",
        fontUrl:
          "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@400;700&display=swap",
        headingWeight: "700",
      },
      borderRadius: "2px",
    },
  },
];

// ====================================================================
// 3. LOGIQUE D'INJECTION (Idempotente)
// ====================================================================

export async function main() {
  console.log(`\n======================================================`);
  console.log(`🎨 SEEDING THÈMES (Mode: Data-First)`);
  console.log(`======================================================`);

  try {
    // A. NETTOYAGE SÉLECTIF
    // On ne supprime QUE les thèmes système pour les recréer proprement.
    // On ne touche pas aux éventuels thèmes créés par les utilisateurs.
    console.log(`\n[NETTOYAGE] Suppression des anciens thèmes système...`);
    const deleteResult = await prisma.theme.deleteMany({
      where: { isSystem: true },
    });
    console.log(`✅ ${deleteResult.count} thèmes système supprimés.`);

    // B. INJECTION
    console.log(`\n[INJECTION] Création des ${SYSTEM_THEMES.length} thèmes...`);

    for (const theme of SYSTEM_THEMES) {
      await prisma.theme.create({
        data: {
          id: theme.id,
          name: theme.name,
          description: theme.description,
          color: theme.color,
          baseLayout: theme.baseLayout,
          isSystem: theme.isSystem,
          // Cast explicite pour satisfaire le typage strict Prisma JSON
          config: theme.config as Prisma.InputJsonValue,
        },
      });
      console.log(`   -> Créé: ${theme.name} (${theme.baseLayout})`);
    }

    console.log(`\n✅ [SUCCESS] Identités visuelles injectées avec succès.`);
  } catch (e) {
    console.error(`\n🛑 ERREUR LORS DU SEEDING:`, e);
    throw e; // Relancer pour que le process exit code soit 1
  }
}

// ====================================================================
// 4. EXÉCUTION & FERMETURE PROPRE (CRUCIAL POUR POOL PG)
// ====================================================================

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end(); // Fermeture explicite du pool PostgreSQL
    console.log("🔌 Connexions fermées.");
  })
  .catch(async (e) => {
    console.error(e);
    try {
      await prisma.$disconnect();
      await pool.end();
    } catch (err) {
      // Ignorer erreur fermeture si déjà fermé
    }
    process.exit(1);
  });
