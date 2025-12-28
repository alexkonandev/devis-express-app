import { redirect } from "next/navigation";
import { getClerkUserId } from "@/lib/auth";
import { getUnifiedCatalogAction } from "@/app/actions/item.actions";
import UnifiedCatalogView from "@/components/catalog/unified-catalog-view";

export const metadata = {
  title: "Catalogue Services | DevisExpress",
};

export default async function CatalogPage() {
  const userId = await getClerkUserId();
  if (!userId) redirect("/sign-in");

  const result = await getUnifiedCatalogAction();
  const initialItems = result.success ? result.data : [];

  return <UnifiedCatalogView initialItems={initialItems} />;
}
