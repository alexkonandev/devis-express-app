import { describe, it, expect, vi, beforeEach } from "vitest";
import { getUserProfile, updateCompanySettings } from "../user-action";
import db from "@/lib/prisma";
import { getClerkUserId } from "@/lib/auth";

describe("User Actions - Profile & Settings Validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getUserProfile", () => {
    it("devrait retourner null si l'utilisateur n'est pas authentifié", async () => {
      (getClerkUserId as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
        null
      );

      const result = await getUserProfile();

      expect(result).toBeNull();
      expect(db.user.findUnique).not.toHaveBeenCalled();
    });

    it("devrait récupérer le profil avec les relations d'abonnement", async () => {
      const mockUserId = "user_nomad_456";
      (getClerkUserId as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockUserId
      );

      await getUserProfile();

      expect(db.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockUserId },
        include: { subscription: true },
      });
    });
  });

  describe("updateCompanySettings", () => {
    it("devrait mettre à jour les infos entreprise de l'utilisateur connecté", async () => {
      const mockUserId = "user_nomad_456";
      (getClerkUserId as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
        mockUserId
      );

      const settings = {
        companyName: "Nomad Solutions",
        companySiret: "88899911100012",
      };

      const result = await updateCompanySettings(settings);

      expect(result.success).toBe(true);
      expect(db.user.update).toHaveBeenCalledWith({
        where: { id: mockUserId },
        data: settings,
      });
    });
  });
});
