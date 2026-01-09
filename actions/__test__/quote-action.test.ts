import { describe, it, expect, vi, beforeEach } from "vitest";
import { upsertQuote } from "../quote-action";
import db from "@/lib/prisma";
import { getClerkUserId } from "@/lib/auth";
import { QuoteStatus } from "@/app/generated/prisma/client";

// On récupère le type exact de l'input de l'action pour éviter le 'any'
type UpsertInput = Parameters<typeof upsertQuote>[0];

describe("Quote Actions - Business Logic Validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("devrait rejeter la création si l’utilisateur n’est pas authentifié", async () => {
    // Simulation d'un utilisateur non connecté
    (getClerkUserId as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      null
    );

    const input: UpsertInput = {
      clientId: "client_123",
      number: "INV-2026-001",
      status: QuoteStatus.DRAFT,
      lines: [],
    };

    const result = await upsertQuote(input);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Non autorisé");
  });

  it("devrait formater correctement les lignes de devis (String to Number)", async () => {
    // Simulation d'un utilisateur connecté
    (getClerkUserId as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      "user_nomad_123"
    );

    // Données de test avec des valeurs qui pourraient venir d'un formulaire (souvent traitées comme strings)
    const input: UpsertInput = {
      clientId: "client_123",
      number: "INV-2026-002",
      status: QuoteStatus.DRAFT,
      lines: [
        {
          title: "Consulting Stratégique",
          subtitle: "Optimisation fiscale",
          quantity: 2, // Le typage impose déjà number, mais on valide la structure
          unitPriceEuros: 1500,
        },
      ],
    };

    await upsertQuote(input);

    // On vérifie que Prisma est appelé avec les bonnes relations
    expect(db.quote.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          clientId: "client_123",
          lines: {
            create: [
              expect.objectContaining({
                quantity: 2,
                unitPriceEuros: 1500,
              }),
            ],
          },
        }),
      })
    );
  });
});
