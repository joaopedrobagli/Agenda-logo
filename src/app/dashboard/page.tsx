import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";

export default async function DashboardPage() {

  const session = await auth();
  if (!session?.user) redirect("/login");

  const business = await prisma.business.findUnique({
    where: { ownerId: session.user.id },
    include: {
      services: true,
      slots: {
        include: {
          appointments: {
            include: {
              client: true,
              service: true,
            },
          },
        },
      },
    },
  });

  if (!business) redirect("/onboarding");

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const todayAppointments = business.slots
    .filter((slot) => {
      const slotDate = new Date(slot.dateTime);
      return slotDate >= today && slotDate < tomorrow && slot.appointments.length > 0;
    })
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const weekAppointments = business.slots.filter((slot) => {
    const slotDate = new Date(slot.dateTime);
    return slotDate >= weekStart && slot.appointments.length > 0;
  }).length;

  const clientIds = new Set(
    business.slots.flatMap((slot) => slot.appointments.map((a) => a.clientId))
  );

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthRevenue = business.slots
    .filter((slot) => new Date(slot.dateTime) >= monthStart && slot.appointments.length > 0)
    .flatMap((slot) => slot.appointments)
    .reduce((acc, appt) => acc + (appt.service?.price ?? 0), 0);

  const initials = session.user.name
    ?.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() ?? "?";

  const todayFormatted = new Date().toLocaleDateString("pt-BR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="flex min-h-screen bg-[#F0F4F8]">

      <Sidebar
        userName={session.user.name ?? ""}
        userEmail={session.user.email ?? ""}
        initials={initials}
        activePage="dashboard"
        appointmentsCount={todayAppointments.length}
      />

      <main className="flex-1 p-7 overflow-auto">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-medium text-gray-900">
              Bom dia, {session.user.name?.split(" ")[0]} 👋
            </h1>
            <p className="text-xs text-gray-400 mt-0.5 capitalize">{todayFormatted}</p>
          </div>
          <Link
            href={`/negocio/${business.slug}`}
            target="_blank"
            className="flex items-center gap-2 bg-[#0C447C] text-white text-sm px-4 py-2.5 rounded-lg hover:bg-[#185FA5] transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Ver minha página
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-5">
          {[
            { label: "Agendamentos hoje", value: todayAppointments.length.toString(), sub: "agendamentos confirmados", accent: "#1D9E75", iconBg: "#E1F5EE", iconColor: "#0F6E56", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" },
            { label: "Esta semana", value: weekAppointments.toString(), sub: "agendamentos na semana", accent: "#378ADD", iconBg: "#E6F1FB", iconColor: "#185FA5", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
            { label: "Total de clientes", value: clientIds.size.toString(), sub: "clientes únicos", accent: "#7F77DD", iconBg: "#EEEDFE", iconColor: "#534AB7", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
            { label: "Receita do mês", value: `R$ ${monthRevenue.toFixed(2).replace(".", ",")}`, sub: "receita estimada", accent: "#BA7517", iconBg: "#FAEEDA", iconColor: "#854F0B", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
          ].map((m) => (
            <div key={m.label} className="bg-white rounded-xl p-4 border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full rounded-l-xl" style={{ background: m.accent }} />
              <div className="pl-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ background: m.iconBg }}>
                  <svg className="w-4 h-4" fill="none" stroke={m.iconColor} strokeWidth={1.75} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={m.icon} />
                  </svg>
                </div>
                <p className="text-[11px] text-gray-400 mb-1">{m.label}</p>
                <p className="text-xl font-medium text-gray-900 mb-1">{m.value}</p>
                <p className="text-[11px] text-gray-400">{m.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4">

          <div className="col-span-2 bg-white border border-gray-100 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-gray-900">Agendamentos de hoje</p>
              <span className="text-xs text-[#185FA5] cursor-pointer hover:underline">Ver todos</span>
            </div>
            {todayAppointments.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">Nenhum agendamento para hoje</p>
            ) : (
              todayAppointments.map((slot) => {
                const appt = slot.appointments[0];
                const time = new Date(slot.dateTime).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
                return (
                  <div key={slot.id} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
                    <span className="bg-gray-100 text-gray-500 text-[11px] px-2 py-1 rounded-md w-12 text-center shrink-0">{time}</span>
                    <div className="w-7 h-7 rounded-full bg-[#E6F1FB] flex items-center justify-center text-[10px] font-medium text-[#185FA5] shrink-0">
                      {appt.client.name?.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{appt.client.name}</p>
                      <p className="text-xs text-gray-400">{appt.service.name} · {appt.service.duration} min</p>
                    </div>
                    <span className="text-[11px] px-2.5 py-1 rounded-full bg-green-50 text-green-700">Confirmado</span>
                  </div>
                );
              })
            )}
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-gray-900">Serviços ativos</p>
              <Link href="/dashboard/servicos" className="text-xs text-[#185FA5] hover:underline">Gerenciar</Link>
            </div>
            {business.services.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">Nenhum serviço cadastrado</p>
            ) : (
              business.services.map((s, i) => {
                const dots = ["#1D9E75", "#378ADD", "#7F77DD", "#BA7517"];
                return (
                  <div key={s.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: dots[i % dots.length] }} />
                      <div>
                        <p className="text-sm text-gray-900">{s.name}</p>
                        <p className="text-xs text-gray-400">{s.duration} min</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-[#0C447C]">
                      R$ {s.price.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}