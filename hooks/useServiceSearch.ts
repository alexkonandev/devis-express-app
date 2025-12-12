// hooks/useServiceSearch.ts
import { useState, useMemo, useEffect } from "react";
import Fuse from "fuse.js";
import { ServiceItem } from "@/types/catalog"; // Assurez-vous que le chemin est correct

// Configuration Fuse.js pour un catalogue de services
const fuseOptions = {
  // 0.0 (match parfait) à 1.0 (match tout)
  threshold: 0.35,
  // Trouver des correspondances même si elles sont loin les unes des autres
  distance: 100,
  // Clés à indexer et pondérations
  keys: [
    { name: "title", weight: 0.8 },
    { name: "description", weight: 0.4 },
    { name: "category", weight: 0.2 },
  ],
};

export const useServiceSearch = (items: ServiceItem[], query: string) => {
  const [searchResults, setSearchResults] = useState<ServiceItem[]>(items);

  // 1. Instanciation de Fuse (Memoization)
  // L'instance Fuse est coûteuse. On la crée uniquement si la liste d'items change.
  const fuse = useMemo(() => {
    return new Fuse(items, fuseOptions);
  }, [items]);

  // 2. Exécution de la Recherche
  useEffect(() => {
    if (!query.trim()) {
      // Si la requête est vide, afficher tous les items
      setSearchResults(items);
      return;
    }

    // Exécuter la recherche floue
    const results = fuse.search(query).map((result) => result.item);
    setSearchResults(results);
  }, [query, fuse, items]);

  return searchResults;
};
