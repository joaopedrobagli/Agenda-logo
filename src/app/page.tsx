import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-white min-h-screen font-sans">

      {/* ===== NAVBAR ===== */}
      <nav className="flex items-center justify-between px-12 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#0C447C] rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-[15px] font-medium text-gray-900">Agenda Logo</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-sm text-gray-500 cursor-pointer hover:text-gray-800 transition">Como funciona</span>
          <span className="text-sm text-gray-500 cursor-pointer hover:text-gray-800 transition">Recursos</span>
          <Link href="/login" className="bg-[#0C447C] text-white text-sm px-5 py-2 rounded-lg hover:bg-[#185FA5] transition">
            Entrar
          </Link>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="flex items-center justify-between px-12 py-12 gap-8">
        <div className="max-w-lg">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#E6F1FB] text-[#0C447C] text-xs px-3 py-1.5 rounded-full mb-5">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M11.983 1.907a.75.75 0 00-1.292-.657l-8.5 9.5A.75.75 0 002.75 12h6.572l-1.305 6.093a.75.75 0 001.292.657l8.5-9.5A.75.75 0 0017.25 8h-6.572l1.305-6.093z"/>
            </svg>
            Simples e rápido
          </div>

          {/* Título */}
          <h1 className="text-4xl font-medium text-gray-900 leading-tight mb-4">
            Agendamentos online para o seu{" "}
            <span className="text-[#0C447C]">negócio</span>
          </h1>

          {/* Subtítulo */}
          <p className="text-[15px] text-gray-500 leading-relaxed mb-8">
            Chega de agenda no papel ou WhatsApp. Seus clientes agendam sozinhos, você foca no que importa.
          </p>

  
          <div className="flex gap-3">
            <Link href="/login" className="bg-[#0C447C] text-white text-sm px-6 py-3 rounded-lg hover:bg-[#185FA5] transition">
              Começar agora
            </Link>
            <button className="border border-[#185FA5] text-[#0C447C] text-sm px-6 py-3 rounded-lg hover:bg-blue-50 transition">
              Ver demonstração
            </button>
          </div>
        </div>

        <div className="bg-[#F8FAFC] border border-[#B5D4F4] rounded-2xl p-6 w-[420px] shrink-0">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] font-medium text-gray-900">Agendamentos de hoje</span>
            <span className="text-[11px] bg-[#E6F1FB] text-[#0C447C] px-2 py-0.5 rounded-full">4 confirmados</span>
          </div>
          {[
            { name: "Maria Silva", time: "09:00 — Corte de cabelo", status: "Confirmado", color: "bg-green-500", badge: "bg-[#E1F5EE] text-[#0F6E56]" },
            { name: "João Pedro", time: "10:30 — Barba", status: "Confirmado", color: "bg-green-500", badge: "bg-[#E1F5EE] text-[#0F6E56]" },
            { name: "Ana Costa", time: "14:00 — Coloração", status: "Pendente", color: "bg-blue-400", badge: "bg-[#E6F1FB] text-[#185FA5]" },
            { name: "Carlos Lima", time: "16:00 — Corte", status: "Confirmado", color: "bg-green-500", badge: "bg-[#E1F5EE] text-[#0F6E56]" },
          ].map((appt, i) => (
            <div key={i} className="flex items-center gap-3 py-3 border-b border-[#E6F1FB] last:border-0">
              <div className={`w-2 h-2 rounded-full shrink-0 ${appt.color}`} />
              <div className="flex-1">
                <p className="text-[13px] text-gray-900">{appt.name}</p>
                <p className="text-[12px] text-gray-400 mt-0.5">{appt.time}</p>
              </div>
              <span className={`text-[11px] px-2.5 py-1 rounded-full ${appt.badge}`}>{appt.status}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="px-12 py-16 bg-gray-50 border-t border-gray-100">
        <p className="text-xl font-medium text-gray-900 text-center mb-2">Tudo que você precisa</p>
        <p className="text-sm text-gray-400 text-center mb-10">Recursos pensados para pequenos negócios que querem crescer</p>
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", title: "Agendamento online", desc: "Seus clientes agendam pelo celular a qualquer hora do dia." },
            { icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", title: "Painel de controle", desc: "Veja todos os agendamentos do dia, semana ou mês." },
            { icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9", title: "Notificações", desc: "Cliente e dono recebem confirmação automática." },
            { icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", title: "Gestão de clientes", desc: "Histórico completo de cada cliente e agendamentos." },
            { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", title: "Horários flexíveis", desc: "Configure seus horários de atendimento como preferir." },
            { icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z", title: "Acesso pelo celular", desc: "Gerencie seu negócio de qualquer lugar, a qualquer hora." },
          ].map((f, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-xl p-5">
              <div className="w-9 h-9 bg-[#E6F1FB] rounded-lg flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-[#0C447C]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">{f.title}</p>
              <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-12 py-16 border-t border-gray-100">
        <p className="text-xl font-medium text-gray-900 text-center mb-2">Como funciona</p>
        <p className="text-sm text-gray-400 text-center mb-12">Comece a usar em menos de 5 minutos</p>
        <div className="grid grid-cols-4 gap-6 relative">
          {[
            { n: "1", title: "Crie sua conta", desc: "Entre com o Google e configure seu negócio em minutos." },
            { n: "2", title: "Cadastre seus serviços", desc: "Adicione os serviços que oferece com duração e preço." },
            { n: "3", title: "Defina os horários", desc: "Configure seus horários disponíveis para atendimento." },
            { n: "4", title: "Compartilhe o link", desc: "Envie o link para seus clientes e receba agendamentos." },
          ].map((s, i) => (
            <div key={i} className="text-center relative">
              {/* Linha conectora entre os passos */}
              {i < 3 && <div className="absolute top-5 left-1/2 w-full h-px bg-[#B5D4F4]" />}
              <div className="w-10 h-10 rounded-full bg-[#0C447C] text-white text-sm font-medium flex items-center justify-center mx-auto mb-4 relative z-10">
                {s.n}
              </div>
              <p className="text-sm font-medium text-gray-900 mb-2">{s.title}</p>
              <p className="text-xs text-gray-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-[#0C447C] px-12 pt-12 pb-8">
        <div className="flex justify-between items-start mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-white/15 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-white font-medium text-sm">Agenda Logo</span>
            </div>
            <p className="text-[#B5D4F4] text-sm leading-relaxed max-w-xs">
              Agendamentos simples para pequenos negócios que querem crescer.
            </p>
          </div>
          <div>
            <p className="text-white text-xs font-medium uppercase tracking-wider mb-4">Produto</p>
            {["Como funciona", "Recursos", "Entrar"].map((l) => (
              <p key={l} className="text-[#85B7EB] text-sm mb-2 cursor-pointer hover:text-white transition">{l}</p>
            ))}
          </div>

          <div>
            <p className="text-white text-xs font-medium uppercase tracking-wider mb-4">Suporte</p>
            {["Contato", "Termos de uso", "Privacidade"].map((l) => (
              <p key={l} className="text-[#85B7EB] text-sm mb-2 cursor-pointer hover:text-white transition">{l}</p>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex items-center justify-between">
          <span className="text-[#378ADD] text-xs">© 2025 Agenda Logo. Todos os direitos reservados.</span>
        </div>
      </footer>

    </div>
  );
}