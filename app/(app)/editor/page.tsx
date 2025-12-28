import { redirect } from "next/navigation";
import { getClerkUserId } from "@/lib/auth";
import db from "@/lib/prisma";
import {
  getTemplatesAction,
  searchCatalogItemsAction,
} from "@/app/actions/item.actions";
import { getSystemThemesAction } from "@/app/actions/theme.actions";
// 1. IMPORT DE L'ACTION CLIENTS
import { getClientsAction } from "@/app/actions/client.actions";

import CreateQuoteClient from "@/components/editor/CreateQuoteClient";

export default async function EditorPage() {
  const userId = await getClerkUserId();
  if (!userId) redirect("/sign-in");

  // 2. AJOUT DU FETCH CLIENTS DANS LE PROMISE.ALL
  const [
    catalogData,
    templatesResponse,
    themesResponse,
    clientsResponse,
    user,
  ] = await Promise.all([
    searchCatalogItemsAction(""),
    getTemplatesAction(),
    getSystemThemesAction(),
    getClientsAction(), // <--- Récupération des clients (CRM)
    db.user.findUnique({ where: { id: userId } }),
  ]);

  if (!user) redirect("/settings");

  const safeTemplates =
    templatesResponse.success && templatesResponse.data
      ? templatesResponse.data
      : [];
  const safeThemes =
    themesResponse.success && themesResponse.data ? themesResponse.data : [];
  const safeCatalog = catalogData || [];
  // 3. SÉCURISATION DES CLIENTS
  const safeClients =
    clientsResponse.success && clientsResponse.data ? clientsResponse.data : [];

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
      initialThemes={safeThemes}
      initialClients={safeClients} // <--- Injection dans le Client Component
      userSettings={userSettings}
    />
  );
}
