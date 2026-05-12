"use client";

import { useState } from "react";

type Service = {
  id: string;
  name: string;
  price: number;
  duration: number;
};

type Props = {
  initialServices: Service[];
};

const colors = [
  { bg: "#E1F5EE", color: "#0F6E56" },
  { bg: "#E6F1FB", color: "#185FA5" },
  { bg: "#EEEDFE", color: "#534AB7" },
  { bg: "#FAEEDA", color: "#854F0B" },
];

export default function ServicosClient({ initialServices }: Props) {

  const [services, setServices] = useState<Service[]>(initialServices);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Estado de edição — null = novo serviço, Service = editando
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Abre modal de novo serviço
  function openNewModal() {
    setEditingService(null);
    setName("");
    setPrice("");
    setDuration("");
    setError("");
    setModalOpen(true);
  }

  // Abre modal de edição preenchido com os dados do serviço
  function openEditModal(service: Service) {
    setEditingService(service);
    setName(service.name);
    setPrice(service.price.toString());
    setDuration(service.duration.toString());
    setError("");
    setModalOpen(true);
  }

  // Salva — cria ou edita dependendo do estado
  async function handleSave() {
    if (!name.trim()) { setError("Nome é obrigatório"); return; }
    if (!price) { setError("Preço é obrigatório"); return; }
    if (!duration) { setError("Duração é obrigatória"); return; }

    setLoading(true);
    setError("");

    try {
      // Se tem editingService, é edição (PUT), senão é criação (POST)
      const method = editingService ? "PUT" : "POST";
      const body = editingService
        ? { id: editingService.id, name, price, duration }
        : { name, price, duration };

      const res = await fetch("/api/services", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Erro ao salvar");
        return;
      }

      const savedService = await res.json();

      if (editingService) {
        // Atualiza o serviço na lista
        setServices(services.map((s) => s.id === savedService.id ? savedService : s));
      } else {
        // Adiciona o novo serviço na lista
        setServices([...services, savedService]);
      }

      setModalOpen(false);
      setEditingService(null);
      setName("");
      setPrice("");
      setDuration("");

    } catch {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  }

  function confirmDelete(id: string) {
    setDeleteId(id);
  }

  async function handleDelete() {
    if (!deleteId) return;
    await fetch(`/api/services?id=${deleteId}`, { method: "DELETE" });
    setServices(services.filter((s) => s.id !== deleteId));
    setDeleteId(null);
  }

  return (
    <>
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-medium text-gray-900">Serviços</h1>
          <p className="text-xs text-gray-400 mt-0.5">Gerencie os serviços que você oferece</p>
        </div>
        <button
          onClick={openNewModal}
          className="flex items-center gap-2 bg-[#0C447C] text-white text-sm px-4 py-2.5 rounded-lg hover:bg-[#185FA5] transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Novo serviço
        </button>
      </div>

      {/* Grid de serviços */}
      {services.length === 0 ? (
        <div className="bg-white border border-dashed border-[#B5D4F4] rounded-xl p-12 text-center">
          <p className="text-gray-400 text-sm mb-1">Nenhum serviço cadastrado ainda</p>
          <p className="text-gray-300 text-xs">Clique em "Novo serviço" para começar</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {services.map((service, i) => {
            const c = colors[i % colors.length];
            return (
              <div key={service.id} className="bg-white border border-gray-100 rounded-xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: c.bg }}>
                    <svg className="w-5 h-5" fill="none" stroke={c.color} strokeWidth={1.75} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
                    </svg>
                  </div>
                  <div className="flex gap-1.5">
                    {/* Botão de editar */}
                    <button
                      onClick={() => openEditModal(service)}
                      className="w-7 h-7 rounded-lg border border-gray-100 flex items-center justify-center hover:bg-blue-50 transition"
                    >
                      <svg className="w-3.5 h-3.5 text-[#185FA5]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    {/* Botão de deletar */}
                    <button
                      onClick={() => confirmDelete(service.id)}
                      className="w-7 h-7 rounded-lg border border-gray-100 flex items-center justify-center hover:bg-red-50 transition"
                    >
                      <svg className="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <p className="text-sm font-medium text-gray-900 mb-1">{service.name}</p>

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

          <div
            onClick={openNewModal}
            className="bg-white border border-dashed border-[#B5D4F4] rounded-xl p-5 flex flex-col items-center justify-center min-h-[160px] cursor-pointer hover:bg-blue-50/30 transition"
          >
            <svg className="w-6 h-6 text-[#B5D4F4] mb-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-sm text-[#B5D4F4]">Adicionar serviço</span>
          </div>
        </div>
      )}

      {/* ===== MODAL DE NOVO / EDITAR SERVIÇO ===== */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-[420px] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                {/* Título muda dependendo se é novo ou edição */}
                <h2 className="text-sm font-medium text-gray-900">
                  {editingService ? "Editar serviço" : "Novo serviço"}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">Preencha as informações do serviço</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-gray-300 hover:text-gray-500 transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-5">
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Nome do serviço</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Corte de cabelo"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#185FA5] transition"
                />
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Preço (R$)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0,00"
                    min="0"
                    step="0.01"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#185FA5] transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Duração (min)</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="30"
                    min="1"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#185FA5] transition"
                  />
                </div>
              </div>
              {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex gap-2 justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 text-sm text-white bg-[#0C447C] rounded-lg hover:bg-[#185FA5] transition disabled:opacity-60"
              >
                {loading ? "Salvando..." : editingService ? "Salvar alterações" : "Salvar serviço"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL DE CONFIRMAÇÃO DE EXCLUSÃO ===== */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-[380px] p-6">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h2 className="text-sm font-medium text-gray-900 mb-1">Excluir serviço</h2>
            <p className="text-xs text-gray-400 mb-6">Tem certeza que deseja excluir este serviço? Esta ação não pode ser desfeita.</p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2.5 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2.5 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 transition"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}