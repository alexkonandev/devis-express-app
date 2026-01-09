import { describe, it, expect, vi, beforeEach } from "vitest";
import { getAvailableThemes, createSystemTheme } from "../design-action";
import db from "@/lib/prisma";

describe("Theme Actions - System Configuration Validation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("devrait récupérer les thèmes triés par niveau premium", async () => {
    await getAvailableThemes();

    expect(db.theme.findMany).toHaveBeenCalledWith({
      orderBy: { isPremium: "asc" },
    });
  });

  it("devrait créer un thème système avec les bonnes métadonnées", async () => {
    const themeData = {
      name: "Modern Blue",
      color: "#0000FF",
      baseLayout: "standard",
      config: { fontSize: "14px" },
      isPremium: true,
    };

    await createSystemTheme(themeData);

    expect(db.theme.create).toHaveBeenCalledWith({
      data: {
        name: themeData.name,
        color: themeData.color,
        baseLayout: themeData.baseLayout,
        config: themeData.config,
        isSystem: true,
        isPremium: true,
      },
    });
  });
});
