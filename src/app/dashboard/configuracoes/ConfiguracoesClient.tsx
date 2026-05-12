"use client";

import { useState } from "react";

type Props = {
  business: {
    id: string;
    name: string;
    description: string;
    slug: string;
  };
  publicUrl: string;
  user: {
    name: string;
    email: string;
    initials: string;
  };
};

export default function ConfiguracoesClient({ business, publicUrl, user }: Props) {

  const [name, setName] = useState(business.name);
  const [description, setDescription] = useState(business.description);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // Salva as alterações do negócio
  async function handleSave() {
    if (!name.trim()) { setError("Nome é obrigatório"); return; }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/business", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Erro ao salvar");
        return;
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

    } catch {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  }

  // Copia o link público para a área de transferência
  async function handleCopy() {
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="max-w-xl space-y-4">

      {/* Card — Informações do negócio */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <p className="text-sm font-medium text-gray-900 mb-1">Informações do negócio</p>
        <p className="text-xs text-gray-400 mb-5">Edite o nome e descrição que aparecem para seus clientes</p>

        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Nome do negócio</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#185FA5] transition"
          />
        </div>

        <div className="mb-5">
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Descrição</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#185FA5] transition resize-none"
          />
        </div>

        {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-[#0C447C] text-white text-sm px-5 py-2.5 rounded-lg hover:bg-[#185FA5] transition disabled:opacity-60"
          >
            {loading ? "Salvando..." : "Salvar alterações"}
          </button>
          {success && (
            <span className="text-xs text-green-600 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Salvo com sucesso!
            </span>
          )}
        </div>
      </div>

      {/* Card — Link público */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <p className="text-sm font-medium text-gray-900 mb-1">Link público</p>
        <p className="text-xs text-gray-400 mb-4">Compartilhe esse link com seus clientes para receberem agendamentos</p>

        <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2.5">
          <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <span className="text-sm text-[#185FA5] flex-1 truncate">{publicUrl}</span>
          <button
            onClick={handleCopy}
            className="text-xs bg-[#E6F1FB] text-[#0C447C] px-3 py-1.5 rounded-md hover:bg-[#B5D4F4] transition shrink-0"
          >
            {copied ? "Copiado!" : "Copiar"}
          </button>
        </div>
      </div>

      {/* Card — Perfil */}
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <p className="text-sm font-medium text-gray-900 mb-1">Perfil</p>
        <p className="text-xs text-gray-400 mb-4">Informações da sua conta Google</p>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#378ADD] flex items-center justify-center text-white text-sm font-medium shrink-0">
            {user.initials}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-400">{user.email}</p>
            <p className="text-xs text-[#B5D4F4] mt-0.5">Login via Google</p>
          </div>
        </div>
      </div>

      {/* Card — Danger zone */}
      <div className="bg-white border border-red-100 rounded-xl p-6">
        <p className="text-sm font-medium text-red-600 mb-1">Zona de perigo</p>
        <p className="text-xs text-red-400 mb-4">Ações irreversíveis — tome cuidado</p>

        <button className="text-sm text-red-500 border border-red-200 px-5 py-2.5 rounded-lg hover:bg-red-50 transition">
          Deletar meu negócio
        </button>
      </div>

    </div>
  );
}