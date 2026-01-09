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
      // Même si l'action ne filtre pas par userId (selon tes erreurs Prisma),
      // on mock l'auth pour passer la garde de l'action.
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
      title: "Consulting SEO",
      unitPriceEuros: 500,
      category: "Marketing", // Ajouté pour corriger TS(2345)
      description: "Optimisation pour les moteurs de recherche",
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

      await upsertCatalogOffer({ id: offerId, ...mockOffer });

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
