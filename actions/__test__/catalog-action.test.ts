import { describe, it, expect, vi, beforeEach } from "vitest";
import { getCatalogOffers, upsertCatalogOffer } from "../catalog-action";
import db from "@/lib/prisma";
import { getClerkUserId } from "@/lib/auth";

describe("Catalog Actions - Business Logic Validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getCatalogOffers", () => {
    it("devrait appeler findMany pour récupérer le catalogue", async () => {
      (getClerkUserId as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
        "user_123"
      );

      await getCatalogOffers();

      expect(db.catalogOffer.findMany).toHaveBeenCalledWith({
        orderBy: { title: "asc" },
      });
    });
  });

  describe("upsertCatalogOffer", () => {
    // SOURCE DE VÉRITÉ : L'objet doit contenir 'category'
   const mockOffer = {
     id: "new_id", // Toujours passer un ID pour le contrat d'upsert ou gérer l'optionnel
     title: "Consulting SEO",
     subtitle: "Audit technique complet",
     unitPriceEuros: 500,
     category: "Marketing",
     description: "Optimisation pour les moteurs de recherche",
     isPremium: false,
   };

    it("devrait rejeter l'opération si l'utilisateur n'est pas authentifié", async () => {
      (getClerkUserId as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
        null
      );

      const result = await upsertCatalogOffer(mockOffer);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Non autorisé");
    });

    it("devrait créer une offre avec tous les champs requis", async () => {
      (getClerkUserId as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
        "user_123"
      );

      await upsertCatalogOffer(mockOffer);

      expect(db.catalogOffer.create).toHaveBeenCalledWith({
        data: {
          title: mockOffer.title,
          description: mockOffer.description,
          unitPriceEuros: mockOffer.unitPriceEuros,
          category: mockOffer.category,
        },
      });
    });

    it("devrait mettre à jour une offre existante via son ID", async () => {
      (getClerkUserId as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
        "user_123"
      );
      const offerId = "offer_abc_123";

await upsertCatalogOffer({ ...mockOffer, id: "offer_abc_123" });
      expect(db.catalogOffer.update).toHaveBeenCalledWith({
        where: { id: offerId },
        data: {
          title: mockOffer.title,
          description: mockOffer.description,
          unitPriceEuros: mockOffer.unitPriceEuros,
          category: mockOffer.category,
        },
      });
    });
  });
});
