"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Service = {
  id: string;
  name: string;
  price: number;
  duration: number;
};

type Slot = {
  id: string;
  dateTime: string;
};

type Business = {
  id: string;
  name: string;
  description: string | null;
  slug: string;
};

type Props = {
  business: Business;
  services: Service[];
  slots: Slot[];
};

export default function NegocioClient({ business, services, slots }: Props) {

  // Serviço selecionado pelo cliente
  const [selectedService, setSelectedService] = useState<string | null>(null);

  // Slot selecionado pelo cliente
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // Estado do agendamento
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  // Formata a data do slot — ex: "Seg, 13/05 às 08:00"
  function formatSlot(dateTime: string) {
    const date = new Date(dateTime);
    const weekday = date.toLocaleDateString("pt-BR", { weekday: "short" });
    const day = date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
    const time = date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    return { weekday: weekday.replace(".", ""), day, time };
  }

  // Confirma o agendamento
  async function handleConfirm() {
    if (!selectedService) { setError("Selecione um serviço"); return; }
    if (!selectedSlot) { setError("Selecione um horário"); return; }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedService,
          slotId: selectedSlot,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Erro ao agendar");
        return;
      }

      // Mostra confirmação
      setSuccess(true);

    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  // Tela de sucesso após agendar
  if (success) {
    return (
      <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 text-center max-w-sm w-full border border-gray-100">
          <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-lg font-medium text-gray-900 mb-2">Agendamento confirmado!</h2>
          <p className="text-sm text-gray-400 mb-6">Seu agendamento foi realizado com sucesso.</p>
          <button
            onClick={() => router.push("/")}
            className="w-full bg-[#0C447C] text-white text-sm py-3 rounded-lg hover:bg-[#185FA5] transition"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F4F8]">

      {/* NAVBAR */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#0C447C] rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-sm font-medium text-gray-900">Agenda Logo</span>
        </div>
        <span className="text-xs text-gray-300">Powered by Agenda Logo</span>
      </nav>

      {/* HERO do negócio */}
      <div className="bg-[#0C447C] px-6 py-10 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-4 text-3xl">
          ✂️
        </div>
        <h1 className="text-2xl font-medium text-white mb-2">{business.name}</h1>
        {business.description && (
          <p className="text-sm text-[#B5D4F4]">{business.description}</p>
        )}
      </div>

      {/* CONTEÚDO */}
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Passo 1 — Serviço */}
        <p className="text-sm font-medium text-gray-900 mb-3">1. Escolha o serviço</p>
        <div className="grid grid-cols-2 gap-3 mb-8">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => setSelectedService(service.id)}
              className={`text-left border rounded-xl p-4 transition ${
                selectedService === service.id
                  ? "border-[#185FA5] bg-[#E6F1FB]"
                  : "border-gray-100 bg-white hover:border-gray-200"
              }`}
            >
              <p className={`text-sm font-medium mb-1 ${selectedService === service.id ? "text-[#0C447C]" : "text-gray-900"}`}>
                {service.name}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[#0C447C]">
                  R$ {service.price.toFixed(2).replace(".", ",")}
                </span>
                <span className="text-xs text-gray-400">· {service.duration} min</span>
              </div>
            </button>
          ))}
        </div>

        {/* Passo 2 — Horário */}
        <p className="text-sm font-medium text-gray-900 mb-3">2. Escolha o horário</p>
        {slots.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-xl p-8 text-center mb-8">
            <p className="text-sm text-gray-400">Nenhum horário disponível no momento</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2 mb-8">
            {slots.map((slot) => {
              const { weekday, day, time } = formatSlot(slot.dateTime);
              return (
                <button
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot.id)}
                  className={`border rounded-xl py-3 px-2 text-center transition ${
                    selectedSlot === slot.id
                      ? "border-[#185FA5] bg-[#E6F1FB]"
                      : "border-gray-100 bg-white hover:border-gray-200"
                  }`}
                >
                  <p className={`text-sm font-medium ${selectedSlot === slot.id ? "text-[#0C447C]" : "text-gray-900"}`}>
                    {time}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5 capitalize">{weekday}, {day}</p>
                </button>
              );
            })}
          </div>
        )}

        {/* Erro */}
        {error && (
          <p className="text-xs text-red-500 mb-4">{error}</p>
        )}

        {/* Botão confirmar */}
        <button
          onClick={handleConfirm}
          disabled={loading || !selectedService || !selectedSlot}
          className="w-full bg-[#0C447C] text-white text-sm py-3.5 rounded-xl hover:bg-[#185FA5] transition disabled:opacity-50"
        >
          {loading ? "Confirmando..." : "Confirmar agendamento"}
        </button>

      </div>
    </div>
  );
}