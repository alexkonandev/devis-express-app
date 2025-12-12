// Fichier: prisma/seed.ts

// 1. IMPORTS CRITIQUES (Modèle Adaptateur Officiel)
import { PrismaClient, Prisma } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as pg from "pg";
import "dotenv/config";

// --- GESTION DU CLIENT ET DE L'ADAPTATEUR ---

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

// --- CONSTANTES GLOBALES ---
const TEST_USER_ID = "climbing_user_id_v1";
const TEST_CLIENT_NAME = "Client Fictif A";

// --- INTERFACES & TYPES (Structure validée pour le Schéma JSON) ---
type PricingTier = { min: number; max: number; avg: number };
type PricingModel =
  | "hourly"
  | "daily"
  | "flat_fee"
  | "monthly_retainer"
  | "per_unit";

interface ServiceTemplateData {
  id: string;
  category: string;
  subcategory: string;
  title: string;

  salesCopy: {
    headline: string;
    description: string;
    key_benefits: string[];
  };

  technicalScope: {
    included: string[];
    excluded: string[];
  };

  pricing: {
    suggested_model: PricingModel;
    currency: "EUR" | "USD";
    unit_label: string;
    tiers: {
      junior: PricingTier;
      senior: PricingTier;
      expert: PricingTier;
    };
  };
  marketContext: {
    trend: "stable" | "rising" | "falling";
    insight: string;
  };
}

// Typage minimal pour l'injection JSON
type DevisItemData = {
  title: string;
  quantity: number;
  unitPriceEuros: number;
};

// ====================================================================
// 1. CONSTANTE DE L'ONTOLOGIE DE SERVICES (Contenu non altéré)
// ====================================================================

const SERVICE_ONTOLOGY: ServiceTemplateData[] = [
  // --- DOMAINE : TECH ---
  {
    id: "TECH_DEVOPS_SETUP",
    category: "Tech",
    subcategory: "Infrastructure & Cloud",
    title: "Setup Infrastructure Cloud & CI/CD",
    salesCopy: {
      headline:
        "Infrastructure Cloud Haute Disponibilité & Automatisation CI/CD",
      description:
        "Transformez votre infrastructure en un avantage compétitif. Nous automatisons l'intégralité de votre chaîne de déploiement pour éliminer les erreurs humaines, réduire le temps de mise en marché de 80% et garantir une disponibilité de 99.9%. Dormez tranquille, votre infrastructure s'auto-répare.",
      key_benefits: [
        "Zero Downtime Deployment",
        "Sécurité automatisée",
        "Scalabilité instantanée",
      ],
    },
    technicalScope: {
      included: [
        "Audit d'Infrastructure (AWS/Azure/On-prem)",
        "Containerisation Docker optimisée",
        "Orchestration Kubernetes/ECS",
        "Pipeline CI/CD (GitHub Actions/GitLab CI)",
        "Monitoring Prometheus/Grafana + Alerting",
        "Documentation Runbook opérationnel",
      ],
      excluded: [
        "Refonte du code applicatif",
        "Support utilisateur niveau 1",
        "Factures Cloud Provider",
      ],
    },
    pricing: {
      suggested_model: "flat_fee",
      currency: "EUR",
      unit_label: "par projet",
      tiers: {
        junior: { min: 1500, max: 2500, avg: 2000 },
        senior: { min: 2500, max: 6000, avg: 4500 },
        expert: { min: 6000, max: 12000, avg: 9000 },
      },
    },
    marketContext: {
      trend: "rising",
      insight:
        "Forte demande pour l'automatisation et la sécurité (DevSecOps).",
    },
  },
  {
    id: "TECH_FULLSTACK_DEV",
    category: "Tech",
    subcategory: "Développement Web",
    title: "Développement Full-Stack React/Node.js",
    salesCopy: {
      headline: "Développement d'Applications Scalables (Clean Architecture)",
      description:
        "Développez votre application avec les standards de l'industrie. Nous ne livrons pas seulement des fonctionnalités, nous construisons une architecture robuste et documentée, conçue pour absorber votre croissance future sans accumuler de dette technique.",
      key_benefits: [
        "Architecture SOLID",
        "Tests automatisés inclus",
        "Performance Web Vitals optimisée",
      ],
    },
    technicalScope: {
      included: [
        "Intégration Frontend React/Next.js Pixel-Perfect",
        "API Backend Node.js sécurisée (REST/GraphQL)",
        "Tests unitaires (Jest) et E2E (Cypress)",
        "Optimisation Performance (Lazy loading, Caching)",
        "Sécurisation OWASP Top 10",
      ],
      excluded: [
        "Maquettes graphiques (Design)",
        "Rédaction contenus",
        "Licences logicielles tierces",
      ],
    },
    pricing: {
      suggested_model: "daily",
      currency: "EUR",
      unit_label: "par jour (TJM)",
      tiers: {
        junior: { min: 250, max: 400, avg: 325 },
        senior: { min: 600, max: 900, avg: 750 },
        expert: { min: 950, max: 1400, avg: 1100 },
      },
    },
    marketContext: {
      trend: "stable",
      insight:
        "Le marché se polarise : les profils seniors capables de gérer l'architecture sont très chers.",
    },
  },
  {
    id: "TECH_MAINTENANCE_WP",
    category: "Tech",
    subcategory: "Maintenance",
    title: "Pack Maintenance & Sécurité",
    salesCopy: {
      headline: "Maintenance Proactive & Sécurité Garantie (SLA)",
      description:
        "Ne laissez pas une mise à jour de plugin casser votre business. Notre équipe surveille votre site 24/7, applique les correctifs de sécurité avant qu'ils ne deviennent critiques, et assure des sauvegardes quotidiennes.",
      key_benefits: [
        "Uptime monitoring 24/7",
        "Sauvegardes journalières cloud",
        "Intervention < 4h en cas de crash",
      ],
    },
    technicalScope: {
      included: [
        "Mises à jour Core/Thème/Plugins",
        "Scan de sécurité quotidien",
        "Sauvegardes externalisées",
        "Rapport mensuel de performance",
      ],
      excluded: [
        "Développement de nouvelles fonctionnalités",
        "Refonte design",
        "Contenu éditorial",
      ],
    },
    pricing: {
      suggested_model: "monthly_retainer",
      currency: "EUR",
      unit_label: "par mois",
      tiers: {
        junior: { min: 50, max: 150, avg: 100 },
        senior: { min: 150, max: 500, avg: 300 },
        expert: { min: 1000, max: 3000, avg: 1500 },
      },
    },
    marketContext: {
      trend: "stable",
      insight:
        "Excellent produit d'appel pour générer du MRR (Revenu Récurrent).",
    },
  },
  {
    id: "DESIGN_SYSTEM_UI",
    category: "Design",
    subcategory: "UX/UI",
    title: "Design System Complet",
    salesCopy: {
      headline: "Système de Design UX/UI Scalable",
      description:
        "Passez d'un design artisanal à un système industriel. Nous créons votre 'Source de Vérité' unique : une bibliothèque de composants réutilisables, documentés et testés, qui garantit une cohérence parfaite sur tous vos produits.",
      key_benefits: [
        "Cohérence visuelle totale",
        "Accélération du dev de 40%",
        "Documentation interactive",
      ],
    },
    technicalScope: {
      included: [
        "Atomic Design Library (Figma)",
        "Prototypage interactif Hi-Fi",
        "Auto-Layout & Variants avancés",
        "Documentation Developer Handoff",
        "Audit Accessibilité (WCAG)",
      ],
      excluded: ["Intégration HTML/CSS", "Copywriting", "Achat de polices"],
    },
    pricing: {
      suggested_model: "flat_fee",
      currency: "EUR",
      unit_label: "par système",
      tiers: {
        junior: { min: 1500, max: 3000, avg: 2200 },
        senior: { min: 5000, max: 12000, avg: 8000 },
        expert: { min: 15000, max: 30000, avg: 20000 },
      },
    },
    marketContext: {
      trend: "rising",
      insight: "Indispensable pour les Scale-ups. Très forte valeur perçue.",
    },
  },
  {
    id: "DESIGN_PACKSHOT",
    category: "Design",
    subcategory: "E-commerce",
    title: "Packshot Produit Premium",
    salesCopy: {
      headline: "Photographie Produit E-commerce (Optimisé Conversion)",
      description:
        "Vos produits méritent mieux qu'une photo au smartphone. Nos packshots haute définition, détourés et retouchés, mettent en valeur chaque détail de texture et de finition. Augmentez votre taux de conversion et réduisez les retours.",
      key_benefits: [
        "Détourage précis (Plume)",
        "Retouche colorimétrique fidèle",
        "Formats Webp optimisés",
      ],
    },
    technicalScope: {
      included: [
        "Prise de vue Studio",
        "Retouche chromie & poussières",
        "Détourage fond blanc pur/transparent",
        "Export Web & Print",
      ],
      excluded: [
        "Stylisme complexe",
        "Modèle vivant",
        "Déplacement hors studio",
      ],
    },
    pricing: {
      suggested_model: "per_unit",
      currency: "EUR",
      unit_label: "par photo",
      tiers: {
        junior: { min: 10, max: 20, avg: 15 },
        senior: { min: 25, max: 55, avg: 40 },
        expert: { min: 60, max: 150, avg: 90 },
      },
    },
    marketContext: {
      trend: "stable",
      insight:
        "Volume vs Qualité. La 3D commence à concurrencer la photo traditionnelle.",
    },
  },
  {
    id: "MKT_SEO_AUDIT",
    category: "Marketing",
    subcategory: "SEO",
    title: "Audit SEO Technique & Sémantique",
    salesCopy: {
      headline: "Stratégie SEO & Acquisition Organique",
      description:
        "Arrêtez de louer votre trafic. Investissez dans un actif durable. Nous identifions les freins techniques invisibles qui brident votre site et déployons une stratégie de contenu qui positionne votre marque comme l'autorité de référence.",
      key_benefits: [
        "Plan d'action sur 6 mois",
        "Analyse Core Web Vitals",
        "Stratégie de mots-clés transactionnels",
      ],
    },
    technicalScope: {
      included: [
        "Crawl technique complet",
        "Analyse sémantique & Keyword Mapping",
        "Audit Backlinks & Toxicité",
        "Analyse Core Web Vitals",
        "Roadmap priorisée",
      ],
      excluded: [
        "Développement correctifs (Intégration)",
        "Achat de liens (Netlinking)",
      ],
    },
    pricing: {
      suggested_model: "flat_fee",
      currency: "EUR",
      unit_label: "par audit",
      tiers: {
        junior: { min: 800, max: 1500, avg: 1200 },
        senior: { min: 2000, max: 4500, avg: 3000 },
        expert: { min: 5000, max: 10000, avg: 7000 },
      },
    },
    marketContext: {
      trend: "rising",
      insight:
        "L'IA change la donne (SGE), l'expertise humaine stratégique devient premium.",
    },
  },
  {
    id: "MKT_ADS_MANAGEMENT",
    category: "Marketing",
    subcategory: "Paid Media",
    title: "Gestion Campagnes Google Ads",
    salesCopy: {
      headline: "Gestion Google Ads Performance & ROI",
      description:
        "Maximisez chaque euro investi. Nous structurons vos campagnes pour cibler uniquement les prospects qualifiés, optimisons vos scores de qualité pour réduire vos coûts par clic (CPC), et ajustons les enchères pour un ROAS positif.",
      key_benefits: [
        "Ciblage chirurgical",
        "Optimisation continue du QS",
        "Reporting ROI mensuel",
      ],
    },
    technicalScope: {
      included: [
        "Structure de campagne (SKAG/STAG)",
        "Rédaction des annonces (Copywriting)",
        "Gestion des enchères",
        "A/B Testing",
        "Exclusion mots-clés négatifs",
      ],
      excluded: [
        "Budget publicitaire (payé à Google)",
        "Création Landing Pages",
        "Tracking server-side complexe",
      ],
    },
    pricing: {
      suggested_model: "monthly_retainer",
      currency: "EUR",
      unit_label: "par mois",
      tiers: {
        junior: { min: 300, max: 600, avg: 450 },
        senior: { min: 800, max: 2000, avg: 1400 },
        expert: { min: 2500, max: 5000, avg: 3500 },
      },
    },
    marketContext: {
      trend: "stable",
      insight: "Le modèle au % du budget dépensé est aussi fréquent (10-20%).",
    },
  },
  {
    id: "AV_MOTION_EXPLAINER",
    category: "AV",
    subcategory: "Motion Design",
    title: "Vidéo Explicative (60s)",
    salesCopy: {
      headline: "Vidéo Motion Design - Storytelling Visuel",
      description:
        "Expliquez l'inexplicable. En 60 secondes, nous transformons votre proposition de valeur complexe en une histoire visuelle captivante. Idéal pour booster les conversions de votre page d'accueil.",
      key_benefits: [
        "Scénario & Script inclus",
        "Voix-off professionnelle",
        "Animation fluide et dynamique",
      ],
    },
    technicalScope: {
      included: [
        "Script & Storyboard",
        "Styleframes (Direction artistique)",
        "Animation 2D After Effects",
        "Sound Design & Mixage",
        "Rendu HD optimisé web",
      ],
      excluded: [
        "Tournage réel",
        "Personnages 3D complexes",
        "Modifications illimitées (max 3 A/R)",
      ],
    },
    pricing: {
      suggested_model: "flat_fee",
      currency: "EUR",
      unit_label: "par vidéo",
      tiers: {
        junior: { min: 800, max: 1500, avg: 1200 },
        senior: { min: 2500, max: 5000, avg: 3500 },
        expert: { min: 6000, max: 12000, avg: 8000 },
      },
    },
    marketContext: {
      trend: "stable",
      insight: "Format roi pour le SaaS B2B.",
    },
  },
  {
    id: "CONSULTING_DESIGN_SPRINT",
    category: "Consulting",
    subcategory: "Innovation",
    title: "Design Sprint (5 Jours)",
    salesCopy: {
      headline: "Design Sprint: De l'Idée au Prototype Testé",
      description:
        "Comprimez des mois de débats en une semaine d'action. Nous alignons votre équipe, prototypons une solution réaliste et la testons auprès de 5 vrais utilisateurs. Validez votre idée avant d'écrire une ligne de code.",
      key_benefits: [
        "Validation marché en 5 jours",
        "Prototype Haute Fidélité",
        "Feedback utilisateurs réels",
      ],
    },
    technicalScope: {
      included: [
        "Préparation & Cadrage",
        "Facilitation des 5 jours d'ateliers",
        "Création du Prototype",
        "Recrutement Testeurs",
        "Rapport de synthèse & Recommandations",
      ],
      excluded: [
        "Développement du produit final",
        "Location de salle",
        "Frais de bouche",
      ],
    },
    pricing: {
      suggested_model: "flat_fee",
      currency: "EUR",
      unit_label: "par sprint",
      tiers: {
        junior: { min: 3000, max: 6000, avg: 4500 },
        senior: { min: 10000, max: 20000, avg: 15000 },
        expert: { min: 25000, max: 40000, avg: 30000 },
      },
    },
    marketContext: {
      trend: "rising",
      insight: "Service à très haute marge, vendu sur la réduction du risque.",
    },
  },
  {
    id: "ADMIN_EXECUTIVE_ASSIST",
    category: "Admin",
    subcategory: "Assistance",
    title: "Executive Assistance Premium",
    salesCopy: {
      headline: "Executive Assistance & Support de Direction",
      description:
        "Récupérez 10 heures par semaine. Plus qu'un secrétariat, un véritable partenaire opérationnel. Gestion proactive de votre agenda, organisation de déplacements et filtrage des priorités. Concentrez-vous sur votre zone de génie.",
      key_benefits: [
        "Gestion agenda complexe",
        "Organisation voyages",
        "Zéro friction administrative",
      ],
    },
    technicalScope: {
      included: [
        "Gestion Email & Agenda",
        "Organisation Logistique",
        "Préparation de dossiers",
        "Facturation & Relances basiques",
      ],
      excluded: [
        "Comptabilité certifiée",
        "Prospection commerciale à froid",
        "Gestion personnelle (sauf accord)",
      ],
    },
    pricing: {
      suggested_model: "monthly_retainer",
      currency: "EUR",
      unit_label: "par mois (20h)",
      tiers: {
        junior: { min: 400, max: 800, avg: 600 },
        senior: { min: 1000, max: 2000, avg: 1500 },
        expert: { min: 2500, max: 4000, avg: 3000 },
      },
    },
    marketContext: {
      trend: "stable",
      insight:
        "La qualité de service (réactivité, anglais parfait) justifie les écarts de prix.",
    },
  },
  // Fichier: prisma/seed.ts (Correction du bloc ADMIN_GDPR_AUDIT)

  {
    id: "ADMIN_GDPR_AUDIT",
    category: "Admin",
    subcategory: "Légal",
    title: "Mise en Conformité RGPD",
    salesCopy: {
      headline: "Pack Conformité RGPD & Privacy",
      description:
        "Protégez votre entreprise des sanctions. Nous cartographions vos données, sécurisons vos contrats sous-traitants et mettons en place les documents légaux obligatoires pour votre site web et vos opérations.",
      key_benefits: [
        "Registre des traitements",
        "Politique de confidentialité",
        "Audit bandeaux cookies",
        "Revue contrats DPA",
        "Plan d'action conformité",
      ],
      // <-- REMARQUE : 'excluded' n'est plus ici
    },
    // <--- NOUVEAU BLOC technicalScope MANQUANT
    technicalScope: {
      included: [
        "Cartographie des données (Registre art. 30)",
        "Rédaction Politique de Confidentialité",
        "Audit bandeaux cookies",
        "Revue contrats DPA",
        "Plan d'action conformité",
      ],
      excluded: [
        "Développement technique",
        "Rôle de DPO externalisé (service récurrent)",
        "Assurance cyber",
      ],
    },
    pricing: {
      suggested_model: "flat_fee",
      currency: "EUR",
      unit_label: "par audit",
      tiers: {
        junior: { min: 800, max: 1500, avg: 1200 },
        senior: { min: 2000, max: 5000, avg: 3500 },
        expert: { min: 6000, max: 12000, avg: 8000 },
      },
    },
    marketContext: {
      trend: "stable",
      insight: "Produit de nécessité ('Fear selling').",
    },
  },
];

// ====================================================================
// 2. DONNÉES DE TEST UTILISATEUR ET DEVIS
// ====================================================================

const devisDataItems: DevisItemData[] = [
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
];

const devisDataTemplate = {
  number: "DEV-2025-001",
  issueDate: new Date(),
  totalTTC: 6620.0,
  vatRatePercent: 20.0,
  discountAmountEuros: 100.0,
  terms: "Paiement à 30 jours.",
  status: "sent",
};

// ====================================================================
// 3. LOGIQUE D'INJECTION PRINCIPALE (main)
// ====================================================================

export async function main() {
  console.log(`\n======================================================`);
  console.log(`🌱 Démarrage du Seeding (Mode Adaptateur) ...`);
  console.log(`======================================================`);

  // --- A. NETTOYAGE (Idempotence) ---

  console.log(`\n[NETTOYAGE] Nettoyage des tables de test...`);
  // Nettoyage en fonction des modèles RÉELS dans le schéma fourni
  await prisma.devis.deleteMany({});
  await prisma.client.deleteMany({ where: { userId: TEST_USER_ID } });
  await prisma.user.deleteMany({ where: { id: TEST_USER_ID } });
  await prisma.serviceTemplate.deleteMany({});

  console.log(`[NETTOYAGE] Anciennes données supprimées.`);

  // --- B. INJECTION DE L'ONTOLOGIE ---

  console.log(`\n[ONTOLOGIE] Injection des modèles...`);

  for (const item of SERVICE_ONTOLOGY) {
    await prisma.serviceTemplate.create({
      data: {
        id: item.id,
        category: item.category,
        subcategory: item.subcategory,
        title: item.title,
        // Correction TS2322 : InputJsonValue
        salesCopy: item.salesCopy as Prisma.InputJsonValue,
        technicalScope: item.technicalScope as Prisma.InputJsonValue,
        pricing: item.pricing as Prisma.InputJsonValue,
        marketContext: item.marketContext as Prisma.InputJsonValue,
      },
    });
  }
  console.log(
    `✅ [ONTOLOGIE] Injection des ${SERVICE_ONTOLOGY.length} modèles terminée.`
  );

  // --- C. INJECTION DES DONNÉES DE TEST UTILISATEUR ---

  console.log(`\n[DONNÉES TEST] Création Utilisateur, Client et Devis...`);

  // 1. Créer l'utilisateur de base et le client via une relation
  const userWithClient = await prisma.user.create({
    data: {
      id: TEST_USER_ID,
      email: "contact@alex-digital-nomad.com",
      companyName: "ALEX Digital Ventures SAS",
      companyEmail: "devis@alex-digital-nomad.com",
      companyPhone: "+33 6 00 00 00 00",
      companyAddress: "10 Rue de la Performance, 75000 PARIS",
      Clients: {
        create: {
          name: TEST_CLIENT_NAME,
          email: "client.a@entreprise.com",
          address: "22 Avenue du ROI, 13000 Marseille",
        },
      },
      // Création du ServiceItem (catalogue)
      ServiceItems: {
        create: {
          title: "Développement Front V1",
          unitPriceEuros: 400.0,
          description:
            "TJM standard pour l'intégration de maquettes et le développement de composants React. Exclut l'architecture backend.",
          category: "Tech",
        },
      },
    },
    // Inclure le client créé pour obtenir son ID
    include: { Clients: true },
  });

  const clientTest = userWithClient.Clients[0];

  // 2. Créer le Devis de test (incluant les items dans itemsData)
  await prisma.devis.create({
    data: {
      ...devisDataTemplate,
      // Connexion aux relations existantes
      user: { connect: { id: userWithClient.id } },
      client: { connect: { id: clientTest.id } },

      // Stockage des items en JSON (selon votre schéma)
      itemsData: devisDataItems as Prisma.InputJsonValue,
    } as Prisma.DevisCreateInput,
  });

  console.log(
    `✅ [DONNÉES TEST] Utilisateur (${userWithClient.email}), Client et Devis de test injectés.`
  );
  console.log(`======================================================`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end(); // Fermeture du pool de connexion PostgreSQL
  })
  .catch(async (e) => {
    console.error(`\n🛑 ERREUR FATALE LORS DU SEEDING:`, e);
    // Tenter de déconnecter en cas d'échec
    try {
      await prisma.$disconnect();
      await pool.end();
    } catch (err) {
      // Ignorer les erreurs de déconnexion
    }
    process.exit(1);
  });
