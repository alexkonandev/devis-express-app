// @/app/quotes/page.tsx
import { redirect } from "next/navigation";
import { getClerkUserId } from "@/lib/auth";
import QuotesView from "@/features/quotes/quotes-view";

// ✅ Import de l'action (Logique de récupération)
import { getQuotesListAction } from "@/actions/quote-action";

// ✅ Import du type pour les filtres
import { QuoteFilters } from "@/types/quote";

export const metadata = {
  title: "QOS | Flux Devis Industriel",
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function QuotesPage({ searchParams }: PageProps) {
  const userId = await getClerkUserId();
  if (!userId) redirect("/sign-in");

  const resolvedParams = await searchParams;

  /**
   * NORMALISATION DES FILTRES
   * On transforme les query params bruts en un objet typé QuoteFilters
   */
  const filters: QuoteFilters = {
    page:
      typeof resolvedParams.page === "string"
        ? parseInt(resolvedParams.page)
        : 1,
    pageSize: 20,
    search:
      typeof resolvedParams.search === "string" ? resolvedParams.search : "",
    status: (typeof resolvedParams.status === "string"
      ? resolvedParams.status
      : "all") as QuoteFilters["status"],
    sortBy: (typeof resolvedParams.sortBy === "string"
      ? resolvedParams.sortBy
      : "updatedAt") as QuoteFilters["sortBy"],
    sortDir: resolvedParams.sortDir === "asc" ? "asc" : "desc",
  };

  // FETCHING : Récupération des données via Server Action
  const result = await getQuotesListAction(filters);

  // INJECTION : On passe le résultat à la vue interactive
  return <QuotesView initialData={result} />;
}
