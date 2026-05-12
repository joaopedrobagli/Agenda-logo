// Importa o NextResponse para retornar respostas HTTP
import { NextResponse } from "next/server";

// Importa a função auth para verificar se o usuário está logado
import { auth } from "@/lib/auth";

// Importa o prisma para salvar no banco
import { prisma } from "@/lib/prisma";

// Rota POST — cria o negócio do dono logado
export async function POST(req: Request) {

  // Verifica se o usuário está logado
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  // Pega os dados enviados pelo formulário
  const { name, description } = await req.json();

  // Validação básica
  if (!name?.trim()) {
    return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 });
  }

  try {
    // Verifica se o dono já tem um negócio cadastrado
    const existing = await prisma.business.findUnique({
      where: { ownerId: session.user.id },
    });

    if (existing) {
      return NextResponse.json({ error: "Negócio já cadastrado" }, { status: 400 });
    }

    // Gera o slug a partir do nome
    // Ex: "Barbearia do João" → "barbearia-do-joao"
    const slug = name
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove acentos
      .replace(/[^a-z0-9\s-]/g, "")   // remove caracteres especiais
      .replace(/\s+/g, "-")            // espaços viram hífens
      .replace(/-+/g, "-");            // remove hífens duplicados

    // Cria o negócio no banco ligado ao usuário logado
    const business = await prisma.business.create({
      data: {
        name: name.trim(),
        slug,
        description: description?.trim() || null,
        ownerId: session.user.id,
      },
    });

    // Retorna o negócio criado
    return NextResponse.json(business, { status: 201 });

  } catch (error) {
    console.error("Erro ao criar negócio:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}