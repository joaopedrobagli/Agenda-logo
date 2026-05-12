import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Sidebar from "@/components/Sidebar";

export default async function ClientesPage() {

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
      },
    },
  });

  if (!business) redirect("/onboarding");

  const initials = session.user.name
    ?.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() ?? "?";

  // Monta lista de clientes únicos com seus agendamentos
  const clientsMap = new Map<string, {
    id: string;
    name: string;
    email: string;
    totalAppointments: number;
    totalSpent: number;
    lastAppointment: Date | null;
  }>();

  business.slots.forEach((slot) => {
    slot.appointments.forEach((appt) => {
      const existing = clientsMap.get(appt.clientId);
      if (existing) {
        existing.totalAppointments += 1;
        existing.totalSpent += appt.service.price;
        if (!existing.lastAppointment || slot.dateTime > existing.lastAppointment) {
          existing.lastAppointment = slot.dateTime;
        }
      } else {
        clientsMap.set(appt.clientId, {
          id: appt.clientId,
          name: appt.client.name ?? "Cliente",
          email: appt.client.email ?? "",
          totalAppointments: 1,
          totalSpent: appt.service.price,
          lastAppointment: slot.dateTime,
        });
      }
    });
  });

  const clients = Array.from(clientsMap.values()).sort(
    (a, b) => (b.lastAppointment?.getTime() ?? 0) - (a.lastAppointment?.getTime() ?? 0)
  );

  return (
    <div className="flex min-h-screen bg-[#F0F4F8]">

      <Sidebar
        userName={session.user.name ?? ""}
        userEmail={session.user.email ?? ""}
        initials={initials}
        activePage="clientes"
      />

      <main className="flex-1 p-7">

        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-medium text-gray-900">Clientes</h1>
            <p className="text-xs text-gray-400 mt-0.5">{clients.length} cliente{clients.length !== 1 ? "s" : ""} no total</p>
          </div>
        </div>

        {/* Lista de clientes */}
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">

          {/* Header */}
          <div className="grid grid-cols-4 px-5 py-3 border-b border-gray-50 bg-gray-50">
            <p className="text-xs font-medium text-gray-400">Cliente</p>
            <p className="text-xs font-medium text-gray-400">Agendamentos</p>
            <p className="text-xs font-medium text-gray-400">Total gasto</p>
            <p className="text-xs font-medium text-gray-400">Último agendamento</p>
          </div>

          {clients.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <p className="text-sm text-gray-400">Nenhum cliente ainda</p>
              <p className="text-xs text-gray-300 mt-1">Os clientes aparecerão aqui quando realizarem agendamentos</p>
            </div>
          ) : (
            clients.map((client) => {
              const clientInitials = client.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
              const lastDate = client.lastAppointment
                ? new Date(client.lastAppointment).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" })
                : "—";

              return (
                <div key={client.id} className="grid grid-cols-4 px-5 py-3.5 border-b border-gray-50 last:border-0 items-center">

                  {/* Cliente */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#E6F1FB] flex items-center justify-center text-xs font-medium text-[#185FA5] shrink-0">
                      {clientInitials}
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">{client.name}</p>
                      <p className="text-xs text-gray-400">{client.email}</p>
                    </div>
                  </div>

                  {/* Total de agendamentos */}
                  <p className="text-sm text-gray-900">{client.totalAppointments} agendamento{client.totalAppointments !== 1 ? "s" : ""}</p>

                  {/* Total gasto */}
                  <p className="text-sm font-medium text-[#0C447C]">
                    R$ {client.totalSpent.toFixed(2).replace(".", ",")}
                  </p>

                  {/* Último agendamento */}
                  <p className="text-sm text-gray-500">{lastDate}</p>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}