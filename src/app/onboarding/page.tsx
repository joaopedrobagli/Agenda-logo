"use client";

// Importa hooks do React para gerenciar estado e navegação
import { useState } from "react";
import { useRouter } from "next/navigation";

// Tipos de negócio disponíveis para seleção
const businessTypes = [
  { emoji: "✂️", label: "Barbearia" },
  { emoji: "💆", label: "Salão" },
  { emoji: "🏥", label: "Clínica" },
  { emoji: "💪", label: "Academia" },
  { emoji: "🐾", label: "Pet shop" },
  { emoji: "✨", label: "Outro" },
];

export default function OnboardingPage() {

  // Estado do formulário
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Hook de navegação do Next.js
  const router = useRouter();

  // Função chamada ao clicar em "Próximo"
  async function handleSubmit() {

    // Validação básica
    if (!name.trim()) {
      setError("Digite o nome do seu negócio");
      return;
    }
    if (!type) {
      setError("Selecione o tipo do seu negócio");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Chama a API que vai criar o negócio no banco
      const res = await fetch("/api/business", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, type }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Erro ao salvar. Tente novamente.");
        return;
      }

      // Redireciona pro dashboard após salvar
      router.push("/dashboard/servicos");

    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl border border-gray-100 w-[520px] overflow-hidden">

        {/* ===== HEADER COM STEPS ===== */}
        <div className="bg-[#0C447C] px-8 py-7">
          {/* Indicador de passos */}
          <div className="flex items-center gap-0 mb-5">
            {[1, 2, 3].map((s, i) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${s === 1 ? "bg-white text-[#0C447C]" : "bg-white/20 text-white/60"}`}>
                  {s}
                </div>
                {i < 2 && <div className="flex-1 h-px bg-white/20 mx-1" />}
              </div>
            ))}
          </div>
          <h1 className="text-lg font-medium text-white mb-1">Vamos configurar seu negócio</h1>
          <p className="text-sm text-[#B5D4F4]">Passo 1 de 3 — Informações básicas</p>
        </div>

        {/* ===== FORMULÁRIO ===== */}
        <div className="px-8 py-7">

          {/* Nome do negócio */}
          <div className="mb-5">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Nome do negócio
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Barbearia do João"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#185FA5] transition"
            />
            <p className="text-[11px] text-gray-400 mt-1">Esse nome vai aparecer para seus clientes</p>
          </div>

          {/* Tipo de negócio */}
          <div className="mb-5">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Tipo de negócio
            </label>
            <div className="grid grid-cols-3 gap-2">
              {businessTypes.map((b) => (
                <button
                  key={b.label}
                  onClick={() => setType(b.label)}
                  className={`border rounded-lg py-2.5 px-2 text-center transition ${
                    type === b.label
                      ? "border-[#185FA5] bg-[#E6F1FB]"
                      : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <div className="text-lg mb-1">{b.emoji}</div>
                  <div className={`text-[11px] ${type === b.label ? "text-[#0C447C]" : "text-gray-500"}`}>
                    {b.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Descrição */}
          <div className="mb-0">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Descrição <span className="text-gray-300 font-normal">(opcional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Conte um pouco sobre seu negócio..."
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#185FA5] transition resize-none"
            />
          </div>

          {/* Mensagem de erro */}
          {error && (
            <p className="text-xs text-red-500 mt-3">{error}</p>
          )}
        </div>

        {/* ===== FOOTER ===== */}
        <div className="px-8 py-5 border-t border-gray-50 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 bg-[#0C447C] text-white text-sm px-6 py-2.5 rounded-lg hover:bg-[#185FA5] transition disabled:opacity-60"
          >
            {loading ? "Salvando..." : "Próximo"}
            {!loading && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}