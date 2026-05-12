"use client";

import { useState } from "react";


const days = [
  { label: "Seg", value: 1 },
  { label: "Ter", value: 2 },
  { label: "Qua", value: 3 },
  { label: "Qui", value: 4 },
  { label: "Sex", value: 5 },
  { label: "Sáb", value: 6 },
  { label: "Dom", value: 0 },
];


const defaultTimes = [
  "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00",
  "16:00", "17:00", "18:00",
];

export default function HorariosClient() {

  
  const [activeDays, setActiveDays] = useState<number[]>([1, 2, 3, 4, 5]);

  
  const [selectedTimes, setSelectedTimes] = useState<string[]>([
    "08:00", "09:00", "10:00", "11:00",
    "13:00", "14:00", "15:00", "16:00", "17:00",
  ]);

  
  const [availableTimes, setAvailableTimes] = useState<string[]>(defaultTimes);

 
  const [newTime, setNewTime] = useState("08:00");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function toggleDay(day: number) {
    setActiveDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  }

  
  function toggleTime(time: string) {
    setSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  }

 
  function addTime() {
    if (!newTime) return;
    if (availableTimes.includes(newTime)) return;
    setAvailableTimes((prev) => [...prev, newTime].sort());
    setSelectedTimes((prev) => [...prev, newTime].sort());
  }

  async function handleSave() {
    setLoading(true);
    setSuccess(false);

    const slots: { dateTime: string }[] = [];
    const today = new Date();

    for (let week = 0; week < 4; week++) {
      for (const day of activeDays) {

        const date = new Date(today);
        const diff = (day - today.getDay() + 7) % 7 + week * 7;
        date.setDate(today.getDate() + diff);

        for (const time of selectedTimes) {
          const [hours, minutes] = time.split(":").map(Number);
          const slotDate = new Date(date);
          slotDate.setHours(hours, minutes, 0, 0);
          slots.push({ dateTime: slotDate.toISOString() });
        }
      }
    }

    try {
      const res = await fetch("/api/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slots }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }

    } catch (error) {
      console.error("Erro ao salvar horários:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-medium text-gray-900">Horários</h1>
          <p className="text-xs text-gray-400 mt-0.5">Configure os dias e horários disponíveis para agendamento</p>
        </div>
        <div className="flex items-center gap-3">
          {success && (
            <span className="text-xs text-green-600 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Horários salvos!
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-[#0C447C] text-white text-sm px-5 py-2.5 rounded-lg hover:bg-[#185FA5] transition disabled:opacity-60"
          >
            {loading ? "Salvando..." : "Salvar horários"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-5">
        {days.map((day) => {
          const active = activeDays.includes(day.value);
          return (
            <button
              key={day.value}
              onClick={() => toggleDay(day.value)}
              className={`rounded-xl py-3 px-2 text-center transition border ${
                active
                  ? "border-[#185FA5] bg-[#E6F1FB]"
                  : "border-gray-100 bg-white hover:border-gray-200"
              }`}
            >
        
              <p className={`text-[11px] uppercase tracking-wider mb-2 ${active ? "text-[#0C447C]" : "text-gray-400"}`}>
                {day.label}
              </p>

              <div className={`w-7 h-4 rounded-full mx-auto flex items-center px-0.5 transition ${active ? "bg-[#0C447C] justify-end" : "bg-gray-200 justify-start"}`}>
                <div className="w-3 h-3 rounded-full bg-white" />
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-gray-900">Horários disponíveis</p>
            <p className="text-xs text-gray-400 mt-0.5">Clique para selecionar ou remover um horário</p>
          </div>
          <span className="text-xs text-gray-400">
            {selectedTimes.length} horário{selectedTimes.length !== 1 ? "s" : ""} selecionado{selectedTimes.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="grid grid-cols-6 gap-2 mb-5">
          {availableTimes.map((time) => {
            const selected = selectedTimes.includes(time);
            return (
              <button
                key={time}
                onClick={() => toggleTime(time)}
                className={`relative rounded-lg py-2.5 text-center transition border ${
                  selected
                    ? "border-[#185FA5] bg-[#E6F1FB]"
                    : "border-gray-100 bg-gray-50 hover:border-gray-200"
                }`}
              >
                <span className={`text-xs font-medium ${selected ? "text-[#0C447C]" : "text-gray-600"}`}>
                  {time}
                </span>
                {selected && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-400 flex items-center justify-center text-white text-[8px]">
                    ×
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
          <span className="text-xs text-gray-400">Adicionar horário:</span>
          <input
            type="time"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#185FA5] transition"
          />
          <button
            onClick={addTime}
            className="bg-[#E6F1FB] text-[#0C447C] text-xs px-3 py-2 rounded-lg hover:bg-[#B5D4F4] transition"
          >
            Adicionar
          </button>
        </div>
      </div>
    </>
  );
}