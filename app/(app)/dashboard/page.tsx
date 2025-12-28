import { redirect } from "next/navigation";
import { getClerkUserId } from "@/lib/auth";
import { DashboardView } from "@/components/dashboard/dashboard-view"; // Import mis à jour
import { getAdvancedDashboardData } from "@/app/actions/dashboard.actions";

export const metadata = {
  title: "Accueil | DevisExpress",
};

export default async function DashboardPage() {
  const userId = await getClerkUserId();
  if (!userId) redirect("/sign-in");

  const data = await getAdvancedDashboardData();

  return <DashboardView data={data} />;
}
