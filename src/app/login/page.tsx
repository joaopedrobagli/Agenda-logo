// Importa a função auth para verificar se o usuário está logado
import { auth, signIn } from "@/lib/auth";

// Importa o redirect do Next.js para redirecionar o usuário
import { redirect } from "next/navigation";

// Página de login — async porque busca a sessão antes de renderizar
export default async function LoginPage() {

  // Busca a sessão atual do usuário
  const session = await auth();

  // Se já estiver logado, manda direto pro dashboard
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="flex w-full max-w-3xl rounded-2xl overflow-hidden shadow-sm min-w-[700px]">

        {/* ===== PAINEL ESQUERDO ===== */}
        <div className="w-96 bg-[#0C447C] p-11 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-9">
              <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-white font-medium text-lg">Agenda Logo</span>
            </div>
            <h1 className="text-white text-2xl font-medium leading-snug mb-3">
              Agendamentos simples para o seu negócio
            </h1>
            <p className="text-[#B5D4F4] text-sm leading-relaxed">
              Gerencie horários, clientes e serviços em um só lugar. Sem complicação.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              {[
                "Agendamentos online 24h",
                "Painel de controle completo",
                "Notificações automáticas",
                "Acesso pelo celular",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#85B7EB]" />
                  <span className="text-[#E6F1FB] text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-[#378ADD] text-xs">© 2025 Agenda Logo</p>
        </div>

        {/* ===== PAINEL DIREITO ===== */}
        <div className="flex-1 bg-white p-11 flex flex-col justify-center border border-gray-100 border-l-0">
          <p className="text-xs text-gray-600 uppercase tracking-widest mb-2">Acesso à plataforma</p>
          <h2 className="text-xl font-medium text-gray-900 mb-1">Entrar na sua conta</h2>
          <p className="text-sm text-gray-600 mb-7">Acesse seu painel de agendamentos</p>

          <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3 mb-5">
            <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-xs text-gray-700">Login seguro via Google — sem senha para lembrar</span>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-500">continue com</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Botão Google */}
          <form action={async () => {
            "use server";
            await signIn("google");
          }}>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2.5 px-4 text-sm text-gray-800 hover:bg-gray-50 transition"
            >
              <svg width="16" height="16" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Entrar com Google
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center mt-5 leading-relaxed">
            Ao entrar, você concorda com os<br />
            Termos de Uso e Política de Privacidade
          </p>
        </div>

      </div>
    </main>
  );
}