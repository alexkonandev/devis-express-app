import { redirect } from "next/navigation";
import { getClerkUserId } from "@/lib/auth";
import { getItemsAction } from "@/app/actions/item.actions";
import CatalogControlCenter from "@/components/catalog/CatalogControlCenter";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const userId = await getClerkUserId();
  if (!userId) redirect("/sign-in");

  const itemsRes = await getItemsAction();
  const initialItems = itemsRes.success ? itemsRes.data : [];

  return (
    <main className=" w-full bg-white">
      <CatalogControlCenter initialItems={initialItems} />
    </main>
  );
}
