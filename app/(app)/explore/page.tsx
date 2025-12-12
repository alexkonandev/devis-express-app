// app/explore/page.tsx
import React from "react";
import { redirect } from "next/navigation";
import { getTemplatesAction } from "@/app/actions/item.actions";
import { mapTemplatesToDomains } from "@/lib/data-mapping";
import { RawServiceTemplate } from "@/types/catalog";
import { getClerkUserId } from "@/lib/auth";
import { ServiceExplorerPage } from "@/components/explorer/ServiceExplorerPage";

export default async function ExplorePage() {
  // Sécurité: Redirection si non authentifié (Même logique que le catalogue)
  const userId = await getClerkUserId();
  if (!userId) {
    redirect("/sign-in");
  }

  // Fetching et Mapping des données pour cette page uniquement
  const templatesRes = await getTemplatesAction();
  const rawTemplates = templatesRes.success
    ? (templatesRes.data as RawServiceTemplate[])
    : [];

  // Transformation des données côté Serveur
  const mappedDomains = mapTemplatesToDomains(rawTemplates);

  // On passe les données au composant Client (qui était la modale)
  return (
    <main className="w-full  bg-neutral-50/50">
      <ServiceExplorerPage mappedDomains={mappedDomains} />
    </main>
  );
}
