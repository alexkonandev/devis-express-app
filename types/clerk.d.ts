// types/clerk.d.ts
export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      onboardingComplete?: boolean;
      // Ajoute ici tes futurs champs (ex: role, plan, etc.)
    };
  }
}
