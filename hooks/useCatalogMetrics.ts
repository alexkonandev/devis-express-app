// hooks/useCatalogMetrics.ts
import { useMemo } from "react";
import { ServiceItem } from "@/lib/types";

export const useCatalogMetrics = (items: ServiceItem[]) => {
  return useMemo(() => {
    // Défense contre undefined/null
    if (!items || items.length === 0) {
      return { totalServices: 0, avgPrice: 0, ontologyCoverage: 0 };
    }

    const totalServices = items.length;

    // Calcul précis (évite les erreurs de virgule flottante basiques en JS pour l'affichage)
    const totalPrice = items.reduce((acc, curr) => {
      const price = Number(curr.unitPriceEuros) || 0; // Coercion sécurisée
      return acc + price;
    }, 0);

    const avgPrice = totalServices > 0 ? totalPrice / totalServices : 0;

    // KPI Business: Taux de couverture (basé sur un target arbitraire de 50 services standards)
    // Dans un vrai SaaS, ce '50' viendrait d'une config distante.
    const TARGET_CATALOG_SIZE = 50;
    const ontologyCoverage = Math.min(
      Math.round((totalServices / TARGET_CATALOG_SIZE) * 100),
      100
    );

    return {
      totalServices,
      avgPrice,
      ontologyCoverage,
    };
  }, [items]);
};
