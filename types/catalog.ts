
import { CatalogOffer } from "@/app/generated/prisma/client";
import { ActionResponse } from "./quote";

/**
 * On utilise Omit pour la sécurité et on s'assure que
 * les champs correspondent à ton schéma (subtitle au lieu de description).
 */
export type CatalogOfferInput = Omit<CatalogOffer, "createdAt" | "userId"> & {
  id?: string;
};

export type CatalogListItem = CatalogOffer;
export type CatalogActionResponse = ActionResponse<CatalogOffer>;
