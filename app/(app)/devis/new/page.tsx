import { redirect } from "next/navigation";
import { getClerkUserId } from "@/lib/auth";
import db from "@/lib/prisma";
import {
  getTemplatesAction,
  searchCatalogItemsAction,
} from "@/app/actions/item.actions";
// IMPORT DE L'ACTION THÈMES
import { getSystemThemesAction } from "@/app/actions/theme.actions";

import CreateQuoteClient from "@/components/editor/CreateQuoteClient";

export default async function EditorPage() {
  // 1. SÉCURITÉ
  const userId = await getClerkUserId();
  if (!userId) redirect("/sign-in");

  // 2. FETCHING PARALLÈLE (Performance optimale)
  const [catalogData, templatesResponse, themesResponse, user] =
    await Promise.all([
      searchCatalogItemsAction(""), // Catalogue items
      getTemplatesAction(), // Templates services
      getSystemThemesAction(), // <--- Récupération des thèmes
      db.user.findUnique({ where: { id: userId } }), // Infos user
    ]);

  // 3. GESTION DES ERREURS / REDIRECTIONS
  if (!user) redirect("/settings");

  // Sécurisation des données retournées
  const safeTemplates =
    templatesResponse.success && templatesResponse.data
      ? templatesResponse.data
      : [];

  const safeThemes =
    themesResponse.success && themesResponse.data ? themesResponse.data : [];

  const safeCatalog = catalogData || [];

  // 4. PRÉPARATION DU DTO (Data Transfer Object)
  const userSettings = {
    companyName: user.companyName || "",
    companyEmail: user.companyEmail || "",
    companyPhone: user.companyPhone || "",
    companyAddress: user.companyAddress || "",
    companySiret: user.companySiret || "",
    companyWebsite: user.companyWebsite || "",
    quotePrefix: user.quotePrefix || "DEV-",
    nextQuoteNumber: user.nextQuoteNumber || 1,
    defaultVatRate: user.defaultVatRate || 20,
    defaultTerms: user.defaultTerms || "",
  };

  return (
    <CreateQuoteClient
      initialCatalog={safeCatalog}
      initialTemplates={safeTemplates}
      initialThemes={safeThemes} // <--- Injection des Thèmes dans le Client
      userSettings={userSettings}
    />
  );
}
