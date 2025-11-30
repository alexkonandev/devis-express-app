// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Définir les routes publiques
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
]);

// 1. Ajoutez 'async' ici
export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    // 2. Utilisez 'await' pour appeler protect()
    // En fonction de votre version exacte de Clerk installée (v5 ou v6),
    // la syntaxe peut varier légèrement. Voici la plus sûre :

    await auth.protect();

    // NOTE : Si l'erreur persiste avec "auth.protect is not a function",
    // utilisez cette syntaxe alternative pour les versions v5 strictes :
    // await (await auth()).protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
