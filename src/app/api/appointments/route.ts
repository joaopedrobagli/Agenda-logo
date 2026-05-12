// Importa o NextResponse para retornar respostas HTTP
import { NextResponse } from "next/server";

// Importa a função auth para verificar se o usuário está logado
import { auth } from "@/lib/auth";

// Importa o prisma para salvar no banco
import { prisma } from "@/lib/prisma";

// Rota POST — cria um novo agendamento
export async function POST(req: Request) {

  // Verifica se o usuário está logado
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Faça login para agendar" }, { status: 401 });
  }

  // Pega os dados enviados pelo cliente
  const { serviceId, slotId } = await req.json();

  // Validação básica
  if (!serviceId || !slotId) {
    return NextResponse.json({ error: "Serviço e horário são obrigatórios" }, { status: 400 });
  }

  try {
    // Verifica se o slot ainda está disponível
    const slot = await prisma.slot.findUnique({
      where: { id: slotId },
    });

    if (!slot) {
      return NextResponse.json({ error: "Horário não encontrado" }, { status: 404 });
    }

    if (!slot.available) {
      return NextResponse.json({ error: "Esse horário já foi reservado" }, { status: 409 });
    }

    // Cria o agendamento e marca o slot como indisponível
    // Tudo numa transação — ou salva tudo ou não salva nada
    const appointment = await prisma.$transaction(async (tx) => {

      // Cria o agendamento
      const appt = await tx.appointment.create({
        data: {
          clientId: session.user.id,
          serviceId,
          slotId,
          status: "CONFIRMED",
        },
      });

      // Marca o slot como indisponível
      await tx.slot.update({
        where: { id: slotId },
        data: { available: false },
      });

      return appt;
    });

    // Retorna o agendamento criado
    return NextResponse.json(appointment, { status: 201 });

  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}