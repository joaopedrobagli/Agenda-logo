import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ServicosClient from "./ServicosClient";
import Sidebar from "@/components/Sidebar";

export default async function ServicosPage() {

  const session = await auth();
  if (!session?.user) redirect("/login");

  const business = await prisma.business.findUnique({
    where: { ownerId: session.user.id },
    include: { services: true },
  });

  if (!business) redirect("/onboarding");

  const initials = session.user.name
    ?.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() ?? "?";

  return (
    <div className="flex min-h-screen bg-[#F0F4F8]">

      {/* Sidebar padronizada */}
      <Sidebar
        userName={session.user.name ?? ""}
        userEmail={session.user.email ?? ""}
        initials={initials}
        activePage="servicos"
      />

      <main className="flex-1 p-7">
        <ServicosClient initialServices={business.services} />
      </main>
    </div>
  );
}