// lib/data-mapping.ts
import { RawServiceTemplate, UIDomain } from "@/types/catalog"; // Assure-toi que RawServiceTemplate contient bien les champs technicalScope etc en type 'any' ou 'JsonValue'
import { UIItem } from "@/types/explorer"; // Importe le bon type de sortie
import { DOMAIN_MAP } from "@/lib/constants";

export const mapTemplatesToDomains = (
  rawTemplates: RawServiceTemplate[]
): UIDomain[] => {
  const domainsMap: { [key: string]: UIDomain } = {};

  rawTemplates.forEach((template) => {
    // 1. Logique de regroupement (Domaine / Catégorie)
    const domainKey = template.category || "Default";
    const categoryKey = template.subcategory || "Divers";

    if (!domainsMap[domainKey]) {
      const domainInfo = DOMAIN_MAP[domainKey] || DOMAIN_MAP["Tech"];
      domainsMap[domainKey] = {
        id: domainKey.toLowerCase(),
        label: domainInfo.label,
        iconName: domainInfo.iconName,
        // color: domainInfo.color, // Retire si pas dans UIDomain, sinon garde
        categories: [],
      };
    }

    const domain = domainsMap[domainKey];
    let category = domain.categories.find((c) => c.label === categoryKey);

    if (!category) {
      category = {
        id: categoryKey.toLowerCase().replace(/[^a-z0-9]/g, "_"),
        label: categoryKey,
        items: [],
      };
      domain.categories.push(category);
    }

    // 2. Extraction sécurisée des données JSON
    const salesCopy = template.salesCopy as any;
    const pricing = template.pricing as any;
    const technicalScope = template.technicalScope as any;
    const marketContext = template.marketContext as any;

    // 3. Construction de l'objet UIItem CONFORME à l'interface
    // C'est ici que tu avais l'erreur : on mappe directement vers les clés attendues
    const uiItem: UIItem = {
      id: template.id,
      title: template.title,
      category: template.category,
      subcategory: template.subcategory || "Général",

      // Fallbacks pour la description liste
      description: salesCopy?.description || template.title,

      // Calcul du prix par défaut
      defaultPrice: pricing?.tiers?.senior?.avg || 0,

      // MAPPING CRITIQUE : On utilise les noms de clés exacts de l'interface UIItem
      salesCopy: salesCopy, // Au lieu de rawSalesCopy
      pricing: pricing, // Au lieu de rawPricing
      technicalScope: technicalScope, // Au lieu de rawTechnicalScope
      marketContext: marketContext, // Ajout du contexte marché

      // Optionnel : icône
      iconName: "Box",
    };

    category.items.push(uiItem);
  });

  return Object.values(domainsMap);
};
