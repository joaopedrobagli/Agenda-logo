// Importa a função auth para verificar se o usuário está logado
import { auth, signOut } from "@/lib/auth";

// Importa o redirect para redirecionar se não estiver logado
import { redirect } from "next/navigation";

// Importa o prisma para buscar dados reais do banco
import { prisma } from "@/lib/prisma";

// Importa o Link do Next.js para navegação
import Link from "next/link";

export default async function DashboardPage() {

  // Busca a sessão atual
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Busca o negócio do dono com agendamentos e serviços
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

  // Se não tem negócio, manda pro onboarding
  if (!business) redirect("/onboarding");

  // Pega os agendamentos de hoje
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // Filtra os slots de hoje que têm agendamento
  const todayAppointments = business.slots
    .filter((slot) => {
      const slotDate = new Date(slot.dateTime);
      return slotDate >= today && slotDate < tomorrow && slot.appointments.length > 0;
    })
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  // Conta agendamentos da semana
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const weekAppointments = business.slots.filter((slot) => {
    const slotDate = new Date(slot.dateTime);
    return slotDate >= weekStart && slot.appointments.length > 0;
  }).length;

  // Conta total de clientes únicos
  const clientIds = new Set(
    business.slots
      .flatMap((slot) => slot.appointments.map((a) => a.clientId))
  );

  // Calcula receita do mês
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthRevenue = business.slots
    .filter((slot) => new Date(slot.dateTime) >= monthStart && slot.appointments.length > 0)
    .flatMap((slot) => slot.appointments)
    .reduce((acc, appt) => acc + (appt.service?.price ?? 0), 0);

  // Pega as iniciais do nome do usuário
  const initials = session.user.name
    ?.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() ?? "?";

  // Data atual formatada
  const todayFormatted = new Date().toLocaleDateString("pt-BR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="flex min-h-screen bg-[#F0F4F8]">

      {/* ===== SIDEBAR ===== */}
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
            { label: "Início", href: "/dashboard", active: true, icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
            { label: "Agendamentos", href: "/dashboard/agendamentos", active: false, badge: todayAppointments.length.toString(), icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
            { label: "Horários", href: "/dashboard/horarios", active: false, icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
          ].map((item: any) => (
            <Link key={item.label} href={item.href} className={`flex items-center gap-2.5 px-2 py-2 rounded-lg mb-0.5 transition ${item.active ? "bg-white/15" : "hover:bg-white/8"}`}>
              <svg className={`w-4 h-4 shrink-0 ${item.active ? "text-white" : "text-white/55"}`} fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              <span className={`text-sm flex-1 ${item.active ? "text-white" : "text-white/55"}`}>{item.label}</span>
              {item.badge && item.badge !== "0" && (
                <span className="bg-[#378ADD] text-white text-[10px] px-1.5 py-0.5 rounded-full">{item.badge}</span>
              )}
            </Link>
          ))}
        </div>

        <div className="px-3 mb-2">
          <p className="text-[10px] text-white/35 uppercase tracking-widest px-2 mb-1">Negócio</p>
          {[
            { label: "Serviços", href: "/dashboard/servicos", icon: "M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" },
            { label: "Clientes", href: "/dashboard/clientes", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
            { label: "Meu link", href: "#", icon: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" },
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
          <p className="text-[10px] text-white/35 uppercase tracking-widest px-2 mb-1">Conta</p>
          <Link href="/dashboard/configuracoes" className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-white/8 transition">
            <svg className="w-4 h-4 text-white/55 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm text-white/55">Configurações</span>
          </Link>
        </div>

        <div className="mt-auto px-3 py-4 border-t border-white/10">
          <div className="bg-white/8 rounded-xl p-3 flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#378ADD] flex items-center justify-center text-white text-xs font-medium shrink-0">
              {initials}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-white text-xs font-medium truncate">{session.user.name}</p>
              <p className="text-white/40 text-[11px] truncate">{session.user.email}</p>
            </div>
          </div>
          <form action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}>
            <button className="flex items-center gap-2 px-2 py-1 text-white/40 hover:text-white/70 transition text-xs w-full">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sair da conta
            </button>
          </form>
        </div>
      </aside>

      {/* ===== CONTEÚDO PRINCIPAL ===== */}
      <main className="flex-1 p-7 overflow-auto">

        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-medium text-gray-900">
              Bom dia, {session.user.name?.split(" ")[0]} 👋
            </h1>
            <p className="text-xs text-gray-400 mt-0.5 capitalize">{todayFormatted}</p>
          </div>
          {/* Link pra página pública do negócio */}
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

        {/* Cards de métricas — dados reais */}
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

        {/* Grid de conteúdo */}
        <div className="grid grid-cols-3 gap-4">

          {/* Agendamentos de hoje — dados reais */}
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

          {/* Serviços — dados reais */}
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