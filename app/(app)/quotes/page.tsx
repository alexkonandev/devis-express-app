import { redirect } from "next/navigation";
import { getClerkUserId } from "@/lib/auth";
import { QuotesListView } from "@/components/quotes/quotes-list-view";

// ✅ Import de l'action (Logique)
import { getQuotesListAction } from "@/actions/quote-action";

// ✅ Import du type (Contrat) depuis le bon dossier
import { QuoteFilters } from "@/types/quote";

export const metadata = {
  title: "Gestion des Devis | DevisExpress",
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DevisListPage({ searchParams }: PageProps) {
  const userId = await getClerkUserId();
  if (!userId) redirect("/sign-in");

  const resolvedParams = await searchParams;

  // Utilisation du type QuoteFilters importé proprement
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

  const result = await getQuotesListAction(filters);

  return <QuotesListView initialData={result} currentFilters={filters} />;
}
