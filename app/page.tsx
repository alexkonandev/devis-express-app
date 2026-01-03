import { getClerkUserId } from "@/lib/auth"; // On utilise ton abstraction propre
import LandingPageView from "@/components/landing-page-view";

export default async function Home() {
  // C'est beaucoup plus lisible : on récupère juste l'ID
  const userId = await getClerkUserId();

  return <LandingPageView userId={userId} />;
}
