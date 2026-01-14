// Fichier: proxy.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

// Liste exhaustive des routes publiques pour le SEO et la conformité
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhook(.*)",
  "/aide(.*)",
  "/contact(.*)",
  "/mentions-legales(.*)",
  "/confidentialite(.*)",
  "/conditions-generales(.*)", // Indispensable pour les paiements
]);

export default clerkMiddleware(async (auth, request: NextRequest) => {
  const session = await auth();

  // Protection des routes privées (Dashboard, Editeur, Settings)
  if (!session.userId && !isPublicRoute(request)) {
    return session.redirectToSignIn();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
