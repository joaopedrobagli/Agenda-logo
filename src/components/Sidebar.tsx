// Importa o Link do Next.js para navegação
import Link from "next/link";

// Importa a função signOut para logout
import { signOut } from "@/lib/auth";

// Props do componente
type Props = {
  userName: string;
  userEmail: string;
  initials: string;
  activePage: "dashboard" | "agendamentos" | "horarios" | "servicos" | "clientes" | "configuracoes";
  appointmentsCount?: number;
  businessSlug?: string;
};

export default function Sidebar({ userName, userEmail, initials, activePage, appointmentsCount = 0, businessSlug = "" }: Props) {
  return (
    <aside className="w-56 bg-[#0C447C] flex flex-col shrink-0 fixed top-0 left-0 h-screen overflow-y-auto">

      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-6">
        <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <span className="text-white font-medium text-sm">Agenda Logo</span>
      </div>

      {/* Seção Principal */}
      <div className="px-3 mb-2">
        <p className="text-[10px] text-white/35 uppercase tracking-widest px-2 mb-1">Principal</p>
        {[
          { label: "Início", href: "/dashboard", page: "dashboard", badge: null, icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
          { label: "Agendamentos", href: "/dashboard/agendamentos", page: "agendamentos", badge: appointmentsCount > 0 ? appointmentsCount.toString() : null, icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
          { label: "Horários", href: "/dashboard/horarios", page: "horarios", badge: null, icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
        ].map((item) => (
          <Link key={item.label} href={item.href} className={`flex items-center gap-2.5 px-2 py-2 rounded-lg mb-0.5 transition ${activePage === item.page ? "bg-white/15" : "hover:bg-white/8"}`}>
            <svg className={`w-4 h-4 shrink-0 ${activePage === item.page ? "text-white" : "text-white/55"}`} fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
            </svg>
            <span className={`text-sm flex-1 ${activePage === item.page ? "text-white" : "text-white/55"}`}>{item.label}</span>
            {item.badge && (
              <span className="bg-[#378ADD] text-white text-[10px] px-1.5 py-0.5 rounded-full">{item.badge}</span>
            )}
          </Link>
        ))}
      </div>

      {/* Seção Negócio */}
      <div className="px-3 mb-2">
        <p className="text-[10px] text-white/35 uppercase tracking-widest px-2 mb-1">Negócio</p>
        {[
          { label: "Serviços", href: "/dashboard/servicos", page: "servicos", icon: "M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" },
          { label: "Clientes", href: "/dashboard/clientes", page: "clientes", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
        ].map((item) => (
          <Link key={item.label} href={item.href} className={`flex items-center gap-2.5 px-2 py-2 rounded-lg mb-0.5 transition ${activePage === item.page ? "bg-white/15" : "hover:bg-white/8"}`}>
            <svg className={`w-4 h-4 shrink-0 ${activePage === item.page ? "text-white" : "text-white/55"}`} fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
            </svg>
            <span className={`text-sm ${activePage === item.page ? "text-white" : "text-white/55"}`}>{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Seção Conta */}
      <div className="px-3">
        <p className="text-[10px] text-white/35 uppercase tracking-widest px-2 mb-1">Conta</p>
        <Link href="/dashboard/configuracoes" className={`flex items-center gap-2.5 px-2 py-2 rounded-lg mb-0.5 transition ${activePage === "configuracoes" ? "bg-white/15" : "hover:bg-white/8"}`}>
          <svg className={`w-4 h-4 shrink-0 ${activePage === "configuracoes" ? "text-white" : "text-white/55"}`} fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className={`text-sm ${activePage === "configuracoes" ? "text-white" : "text-white/55"}`}>Configurações</span>
        </Link>
      </div>

      {/* Usuário + logout */}
      <div className="mt-auto px-3 py-4 border-t border-white/10">
        <div className="bg-white/8 rounded-xl p-3 flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-full bg-[#378ADD] flex items-center justify-center text-white text-xs font-medium shrink-0">
            {initials}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-white text-xs font-medium truncate">{userName}</p>
            <p className="text-white/40 text-[11px] truncate">{userEmail}</p>
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
  );
}