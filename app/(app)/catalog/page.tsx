// @/app/(dashboard)/catalog/page.tsx
import { redirect } from "next/navigation";
import { getClerkUserId } from "@/lib/auth";
import CatalogView from "@/features/catalog/catalog-view";

// ✅ Import de l'action pour récupérer les services et offres
import { getCatalogItemsAction } from "@/actions/catalog-action";

export const metadata = {
  title: "Inventory | Catalog Operating System",
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CatalogPage({ searchParams }: PageProps) {
  // 1. SÉCURITÉ : Vérification de l'accès
  const userId = await getClerkUserId();
  if (!userId) redirect("/sign-in");

  const resolvedParams = await searchParams;

  /**
   * 2. NORMALISATION DES FILTRES
   * On extrait les paramètres de l'URL pour le filtrage côté serveur
   * Cela permet un chargement initial déjà filtré (SEO & Performance)
   */
  const typeFilter = resolvedParams.type === "library" ? "library" : "personal";
  const searchFilter =
    typeof resolvedParams.search === "string" ? resolvedParams.search : "";

  // 3. FETCHING : Récupération des actifs (UserService + CatalogOffer)
  // L'action doit retourner un tableau unifié compatible avec CatalogItem[]
  const items = await getCatalogItemsAction({
    type: typeFilter,
    search: searchFilter,
  });

  // 4. INJECTION : On propulse les données dans le système triple colonne
  return <CatalogView initialItems={items} />;
}
