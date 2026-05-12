// Server Component — sem "use client"
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ServicosClient from "./ServicosClient";

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

      {/* SIDEBAR */}
      <aside className="w-56 bg-[#0C447C] flex flex-col shrink-0">
        <div className="flex items-center gap-2 px-5 py-6">
          <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-white font-medium text-sm">Agenda Logo</span>
        </div>

        <div className="px-3 mb-2">
          <p className="text-[10px] text-white/35 uppercase tracking-widest px-2 mb-1">Principal</p>
          {[
            { label: "Início", href: "/dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
            { label: "Agendamentos", href: "/dashboard/agendamentos", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
            { label: "Horários", href: "/dashboard/horarios", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
          ].map((item) => (
            <Link key={item.label} href={item.href} className="flex items-center gap-2.5 px-2 py-2 rounded-lg mb-0.5 hover:bg-white/8 transition">
              <svg className="w-4 h-4 text-white/55 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              <span className="text-sm text-white/55">{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="px-3 mb-2">
          <p className="text-[10px] text-white/35 uppercase tracking-widest px-2 mb-1">Negócio</p>
          {[
            { label: "Serviços", href: "/dashboard/servicos", active: true, icon: "M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" },
            { label: "Clientes", href: "/dashboard/clientes", active: false, icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
            { label: "Meu link", href: "#", active: false, icon: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" },
          ].map((item) => (
            <Link key={item.label} href={item.href} className={`flex items-center gap-2.5 px-2 py-2 rounded-lg mb-0.5 transition ${item.active ? "bg-white/15" : "hover:bg-white/8"}`}>
              <svg className={`w-4 h-4 shrink-0 ${item.active ? "text-white" : "text-white/55"}`} fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              <span className={`text-sm ${item.active ? "text-white" : "text-white/55"}`}>{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="mt-auto px-3 py-4 border-t border-white/10">
          <div className="bg-white/8 rounded-xl p-3 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#378ADD] flex items-center justify-center text-white text-xs font-medium shrink-0">
              {initials}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-white text-xs font-medium truncate">{session.user.name}</p>
              <p className="text-white/40 text-[11px] truncate">{session.user.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* CONTEÚDO — usa o Client Component */}
      <main className="flex-1 p-7">
        <ServicosClient initialServices={business.services} />
      </main>
    </div>
  );
}