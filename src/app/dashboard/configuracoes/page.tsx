import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Sidebar from "@/components/Sidebar";
import ConfiguracoesClient from "./ConfiguracoesClient";

export default async function ConfiguracoesPage() {

  const session = await auth();
  if (!session?.user) redirect("/login");

  const business = await prisma.business.findUnique({
    where: { ownerId: session.user.id },
  });

  if (!business) redirect("/onboarding");

  const initials = session.user.name
    ?.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() ?? "?";

  const publicUrl = `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/negocio/${business.slug}`;

  return (
    <div className="flex min-h-screen bg-[#F0F4F8]">

      <Sidebar
        userName={session.user.name ?? ""}
        userEmail={session.user.email ?? ""}
        initials={initials}
        activePage="configuracoes"
        businessSlug={business.slug}
      />

      <main className="flex-1 p-7 overflow-auto">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-lg font-medium text-gray-900">Configurações</h1>
            <p className="text-xs text-gray-400 mt-0.5">Gerencie as informações do seu negócio e conta</p>
          </div>

          <ConfiguracoesClient
            business={{
              id: business.id,
              name: business.name,
              description: business.description ?? "",
              slug: business.slug,
            }}
            publicUrl={publicUrl}
            user={{
              name: session.user.name ?? "",
              email: session.user.email ?? "",
              initials,
            }}
          />
        </div>
      </main>
    </div>
  );
}