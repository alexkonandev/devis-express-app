import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/prisma";
import { getAdvancedDashboardData } from "@/actions/dashboard-actions";
import { DashboardView } from "@/features/dashboard/dashboard-view";
import { Profession, BusinessModel } from "@/types/dashboard";

export const metadata = {
  title: "Tableau de bord | DevisExpress",
};

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      profession: true,
      businessModel: true,
      isOnboarded: true,
    },
  });

  if (!user?.isOnboarded) {
    redirect("/onboarding");
  }

  const data = await getAdvancedDashboardData();

  return (
    <DashboardView
      data={data}
      profile={{
        profession: user.profession as unknown as Profession | null,
        businessModel: user.businessModel as unknown as BusinessModel | null,
      }}
    />
  );
}
