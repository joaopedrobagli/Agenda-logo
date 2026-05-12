import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Sidebar from "@/components/Sidebar";

export default async function AgendamentosPage() {

  const session = await auth();
  if (!session?.user) redirect("/login");

  const business = await prisma.business.findUnique({
    where: { ownerId: session.user.id },
    include: {
      slots: {
        include: {
          appointments: {
            include: {
              client: true,
              service: true,
            },
          },
        },
        orderBy: { dateTime: "asc" },
      },
    },
  });

  if (!business) redirect("/onboarding");

  const initials = session.user.name
    ?.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() ?? "?";

  // Pega todos os slots que têm agendamento
  const appointments = business.slots
    .filter((slot) => slot.appointments.length > 0)
    .map((slot) => ({
      id: slot.id,
      dateTime: slot.dateTime,
      appointment: slot.appointments[0],
    }));

  return (
    <div className="flex min-h-screen bg-[#F0F4F8]">

      <Sidebar
        userName={session.user.name ?? ""}
        userEmail={session.user.email ?? ""}
        initials={initials}
        activePage="agendamentos"
        appointmentsCount={appointments.length}
      />

      <main className="flex-1 p-7">

        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-medium text-gray-900">Agendamentos</h1>
            <p className="text-xs text-gray-400 mt-0.5">Todos os agendamentos do seu negócio</p>
          </div>
        </div>

        {/* Lista de agendamentos */}
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">

          {/* Header da tabela */}
          <div className="grid grid-cols-5 px-5 py-3 border-b border-gray-50 bg-gray-50">
            <p className="text-xs font-medium text-gray-400">Data e hora</p>
            <p className="text-xs font-medium text-gray-400">Cliente</p>
            <p className="text-xs font-medium text-gray-400">Serviço</p>
            <p className="text-xs font-medium text-gray-400">Valor</p>
            <p className="text-xs font-medium text-gray-400">Status</p>
          </div>

          {/* Linhas */}
          {appointments.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <p className="text-sm text-gray-400">Nenhum agendamento ainda</p>
              <p className="text-xs text-gray-300 mt-1">Os agendamentos aparecerão aqui quando os clientes agendarem</p>
            </div>
          ) : (
            appointments.map(({ id, dateTime, appointment }) => {
              const date = new Date(dateTime);
              const dateStr = date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" });
              const timeStr = date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
              const clientInitials = appointment.client.name?.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase() ?? "?";

              return (
                <div key={id} className="grid grid-cols-5 px-5 py-3.5 border-b border-gray-50 last:border-0 items-center">

                  {/* Data e hora */}
                  <div>
                    <p className="text-sm text-gray-900">{dateStr}</p>
                    <p className="text-xs text-gray-400">{timeStr}</p>
                  </div>

                  {/* Cliente */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#E6F1FB] flex items-center justify-center text-[10px] font-medium text-[#185FA5] shrink-0">
                      {clientInitials}
                    </div>
                    <p className="text-sm text-gray-900">{appointment.client.name}</p>
                  </div>

                  {/* Serviço */}
                  <div>
                    <p className="text-sm text-gray-900">{appointment.service.name}</p>
                    <p className="text-xs text-gray-400">{appointment.service.duration} min</p>
                  </div>

                  {/* Valor */}
                  <p className="text-sm font-medium text-[#0C447C]">
                    R$ {appointment.service.price.toFixed(2).replace(".", ",")}
                  </p>

                  {/* Status */}
                  <span className={`text-[11px] px-2.5 py-1 rounded-full w-fit ${
                    appointment.status === "CONFIRMED"
                      ? "bg-green-50 text-green-700"
                      : appointment.status === "CANCELLED"
                      ? "bg-red-50 text-red-700"
                      : "bg-blue-50 text-blue-700"
                  }`}>
                    {appointment.status === "CONFIRMED" ? "Confirmado" : appointment.status === "CANCELLED" ? "Cancelado" : "Pendente"}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}