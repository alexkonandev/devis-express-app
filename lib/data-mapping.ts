// lib/data-mapping.ts
import { RawServiceTemplate, UIDomain } from "@/types/catalog";
import { DOMAIN_MAP } from "@/lib/constants";

export const mapTemplatesToDomains = (
  rawTemplates: RawServiceTemplate[]
): UIDomain[] => {
  const domainsMap: { [key: string]: UIDomain } = {};

  rawTemplates.forEach((template) => {
    const domainKey = template.category || "Default";
    const categoryKey = template.subcategory || "Divers";

    if (!domainsMap[domainKey]) {
      const domainInfo = DOMAIN_MAP[domainKey] || DOMAIN_MAP["Tech"];
      domainsMap[domainKey] = {
        id: domainKey.toLowerCase(),
        label: domainInfo.label,
        iconName: domainInfo.iconName,
        color: domainInfo.color,
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

    const salesCopy = template.salesCopy as any;
    const pricing = template.pricing as any;

    category.items.push({
      id: template.id,
      title: template.title,
      category: template.category,
      subcategory: template.subcategory,
      headline: salesCopy?.headline || template.title,
      description: salesCopy?.description || template.title,
      defaultPrice: pricing?.tiers?.senior?.avg || 0,
      rawSalesCopy: salesCopy,
      rawPricing: pricing,
      rawTechnicalScope: template.technicalScope,
    });
  });

  return Object.values(domainsMap);
};
