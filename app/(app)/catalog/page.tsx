import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getClerkUserId } from "@/lib/auth";
import { getCatalogOffers } from "@/actions/catalog-action";
import UnifiedCatalogView from "@/components/catalog/unified-catalog-view";

export const metadata: Metadata = {
  title: "Catalogue Services | DevisExpress",
  description:
    "Gérez vos prestations et services pour une facturation ultra-rapide.",
};

export default async function CatalogPage() {
  const userId = await getClerkUserId();

  if (!userId) {
    redirect("/sign-in");
  }

  const initialItems = await getCatalogOffers();

  return (

      <UnifiedCatalogView initialItems={initialItems} />
  
  );
}
