import { Metadata } from "next";
import { redirect } from "next/navigation";
import ClientsView from "@/components/clients/clients-view";
import { getClients } from "@/actions/client-action";
import { getClerkUserId } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Gestion Clients | DevisExpress",
  description: "Gérez votre carnet d'adresses clients et entreprises.",
};

export default async function ClientsPage() {
  const userId = await getClerkUserId();
  if (!userId) redirect("/sign-in");

  // Fetch initial des clients (Server-side)
  const initialClients = await getClients();

  return (
    <main className="min-h-screen bg-zinc-50/50">
      <div className="p-6 md:p-10 max-w-400 mx-auto w-full">
        <ClientsView initialData={initialClients} />
      </div>
    </main>
  );
}
