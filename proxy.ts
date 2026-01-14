import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/", 
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhook(.*)",
  "/aide(.*)",
  "/contact(.*)",
]);

export default clerkMiddleware(async (auth, request: NextRequest) => {
  const session = await auth();

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
