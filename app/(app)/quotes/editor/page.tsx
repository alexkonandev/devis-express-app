import { redirect } from "next/navigation";
import { getClerkUserId } from "@/lib/auth";
import db from "@/lib/prisma";

import { getCatalogOffers } from "@/actions/catalog-action";
import { getAvailableThemes } from "@/actions/design-action";
import { getClients } from "@/actions/client-action";
import CreateQuoteClient from "@/components/editor/CreateQuoteClient";

// ✅ Import unique depuis ton fichier central
import {
  EditorUserSettings,
  EditorTheme,
  EditorCatalogOffer,
  EditorClient,
} from "@/types/editor";

interface PageProps {
  searchParams: Promise<{ themeId?: string }>;
}

export default async function EditorPage({ searchParams }: PageProps) {
  const userId = await getClerkUserId();
  if (!userId) redirect("/sign-in");

  const { themeId } = await searchParams;

  // Parallélisation pour la vitesse (Profit & UX)
  const [catalog, themes, clients, user] = await Promise.all([
    getCatalogOffers() as Promise<EditorCatalogOffer[]>,
    getAvailableThemes() as Promise<EditorTheme[]>,
    getClients() as Promise<EditorClient[]>,
    db.user.findUnique({ where: { id: userId } }),
  ]);

  if (!user) redirect("/settings");

  // On sélectionne le thème (soit celui de l'URL, soit le premier dispo)
  const preSelectedTheme = themeId
    ? themes.find((t) => t.id === themeId) || themes[0] || null
    : themes[0] || null;

  const userSettings: EditorUserSettings = {
    companyName: user.companyName ?? "",
    companyEmail: user.companyEmail ?? "",
    companyPhone: user.companyPhone ?? "",
    companyAddress: user.companyAddress ?? "",
    companySiret: user.companySiret ?? "",
    companyWebsite: user.companyWebsite ?? "",
    quotePrefix: user.quotePrefix ?? "DEV-",
    nextQuoteNumber: user.nextQuoteNumber ?? 1,
    defaultVatRate: user.defaultVatRate ?? 20.0,
    defaultTerms: user.defaultTerms ?? "",
  };

  return (
    <CreateQuoteClient
      initialCatalog={catalog || []}
      initialThemes={themes || []}
      initialClients={clients || []}
      userSettings={userSettings}
      preSelectedTheme={preSelectedTheme}
    />
  );
}
