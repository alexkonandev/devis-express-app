import { redirect } from "next/navigation";
import { getClerkUserId } from "@/lib/auth";
import QuotesListView from "@/components/quotes/quotes-list-view";
import { getQuotesListAction } from "@/app/actions/quote-list.actions";

export const metadata = {
  title: "Gestion des Devis | DevisExpress",
};

// Next.js 15 : searchParams est une Promise
interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DevisListPage({ searchParams }: PageProps) {
  const userId = await getClerkUserId();
  if (!userId) redirect("/sign-in");

  // --- CORRECTION NEXT.JS 15 ---
  // On "unwrap" la promise avant d'accéder aux propriétés
  const resolvedParams = await searchParams;

  // Extraction et nettoyage sécurisé
  const page =
    typeof resolvedParams.page === "string" ? parseInt(resolvedParams.page) : 1;
  const search =
    typeof resolvedParams.search === "string" ? resolvedParams.search : "";
  const status =
    typeof resolvedParams.status === "string" ? resolvedParams.status : "all";
  const sortBy =
    typeof resolvedParams.sortBy === "string"
      ? resolvedParams.sortBy
      : "updatedAt";
  const sortDir = (resolvedParams.sortDir === "asc" ? "asc" : "desc") as
    | "asc"
    | "desc";

  // Appel de la Server Action (qui contient maintenant la logique corrigée)
  const result = await getQuotesListAction({
    page,
    pageSize: 20,
    search,
    status,
    sortBy,
    sortDir,
  });

  // On passe le résultat à la vue (qui doit gérer initialData.success)
  return <QuotesListView initialData={result} />;
}
