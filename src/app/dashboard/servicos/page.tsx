// Importa a função auth para verificar se o usuário está logado
import { auth } from "@/lib/auth";

// Importa o redirect para redirecionar se não estiver logado
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

// Página de serviços — async porque busca dados do banco
export default async function ServicosPage() {

  // Busca a sessão atual
  const session = await auth();

  // Se não estiver logado, manda pra página de login
  if (!session?.user) {
    redirect("/login");
  }

  // Busca o negócio do dono logado no banco
  // include: { services: true } traz os serviços junto
  const business = await prisma.business.findUnique({
    where: { ownerId: session.user.id },
    include: { services: true },
  });

  // Pega as iniciais do nome do usuário para o avatar
  const initials = session.user.name
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() ?? "?";

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
            { label: "Início", href: "/dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
            { label: "Agendamentos", href: "/dashboard/agendamentos", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
            { label: "Horários", href: "/dashboard/horarios", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
          ].map((item) => (
            <a key={item.label} href={item.href} className="flex items-center gap-2.5 px-2 py-2 rounded-lg cursor-pointer mb-0.5 hover:bg-white/8 transition">
              <svg className="w-4 h-4 text-white/55 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              <span className="text-sm text-white/55">{item.label}</span>
            </a>
          ))}
        </div>

        <div className="px-3 mb-2">
          <p className="text-[10px] text-white/35 uppercase tracking-widest px-2 mb-1">Negócio</p>
          {[
            { label: "Serviços", href: "/dashboard/servicos", active: true, icon: "M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" },
            { label: "Clientes", href: "/dashboard/clientes", active: false, icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
            { label: "Meu link", href: "#", active: false, icon: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" },
          ].map((item) => (
            <a key={item.label} href={item.href} className={`flex items-center gap-2.5 px-2 py-2 rounded-lg cursor-pointer mb-0.5 transition ${item.active ? "bg-white/15" : "hover:bg-white/8"}`}>
              <svg className={`w-4 h-4 shrink-0 ${item.active ? "text-white" : "text-white/55"}`} fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              <span className={`text-sm ${item.active ? "text-white" : "text-white/55"}`}>{item.label}</span>
            </a>
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

      {/* ===== CONTEÚDO ===== */}
      <main className="flex-1 p-7">

        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-medium text-gray-900">Serviços</h1>
            <p className="text-xs text-gray-400 mt-0.5">Gerencie os serviços que você oferece</p>
          </div>
          <button className="flex items-center gap-2 bg-[#0C447C] text-white text-sm px-4 py-2.5 rounded-lg hover:bg-[#185FA5] transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Novo serviço
          </button>
        </div>

        {/* Se não tem negócio cadastrado ainda */}
        {!business ? (
          <div className="bg-white border border-dashed border-[#B5D4F4] rounded-xl p-12 text-center">
            <p className="text-gray-400 text-sm mb-1">Você ainda não configurou seu negócio</p>
            <p className="text-gray-300 text-xs">Configure seu negócio primeiro para adicionar serviços</p>
          </div>
        ) : business.services.length === 0 ? (
          // Se tem negócio mas não tem serviços
          <div className="bg-white border border-dashed border-[#B5D4F4] rounded-xl p-12 text-center">
            <p className="text-gray-400 text-sm mb-1">Nenhum serviço cadastrado ainda</p>
            <p className="text-gray-300 text-xs">Clique em "Novo serviço" para começar</p>
          </div>
        ) : (
          // Grid com os serviços do banco
          <div className="grid grid-cols-3 gap-4">
            {business.services.map((service, i) => {

              // Cores para os ícones dos cards — alterna entre as cores
              const colors = [
                { bg: "#E1F5EE", color: "#0F6E56" },
                { bg: "#E6F1FB", color: "#185FA5" },
                { bg: "#EEEDFE", color: "#534AB7" },
                { bg: "#FAEEDA", color: "#854F0B" },
              ];
              const c = colors[i % colors.length];

              return (
                <div key={service.id} className="bg-white border border-gray-100 rounded-xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    {/* Ícone do serviço */}
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: c.bg }}>
                      <svg className="w-5 h-5" fill="none" stroke={c.color} strokeWidth={1.75} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
                      </svg>
                    </div>
                    {/* Botões de editar e deletar */}
                    <div className="flex gap-1.5">
                      <button className="w-7 h-7 rounded-lg border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition">
                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button className="w-7 h-7 rounded-lg border border-gray-100 flex items-center justify-center hover:bg-red-50 transition">
                        <svg className="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Nome do serviço — vem do banco */}
                  <p className="text-sm font-medium text-gray-900 mb-1">{service.name}</p>

                  {/* Rodapé com preço e duração — vem do banco */}
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-50">
                    <span className="text-base font-medium text-[#0C447C]">
                      R$ {service.price.toFixed(2).replace(".", ",")}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {service.duration} min
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Card de adicionar novo serviço */}
            <div className="bg-white border border-dashed border-[#B5D4F4] rounded-xl p-5 flex flex-col items-center justify-center min-h-[160px] cursor-pointer hover:bg-blue-50/30 transition">
              <svg className="w-6 h-6 text-[#B5D4F4] mb-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-sm text-[#B5D4F4]">Adicionar serviço</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}