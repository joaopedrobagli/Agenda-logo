// Importa o NextResponse para retornar respostas HTTP
import { NextResponse } from "next/server";

// Importa a função auth para verificar se o usuário está logado
import { auth } from "@/lib/auth";

// Importa o prisma para salvar no banco
import { prisma } from "@/lib/prisma";

// Rota GET — busca todos os serviços do negócio do dono logado
export async function GET() {

  // Verifica se o usuário está logado
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    // Busca o negócio do dono logado com os serviços
    const business = await prisma.business.findUnique({
      where: { ownerId: session.user.id },
      include: { services: true },
    });

    // Retorna os serviços ou array vazio
    return NextResponse.json(business?.services ?? []);

  } catch (error) {
    console.error("Erro ao buscar serviços:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// Rota POST — cria um novo serviço
export async function POST(req: Request) {

  // Verifica se o usuário está logado
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  // Pega os dados enviados pelo formulário
  const { name, price, duration } = await req.json();

  // Validação básica
  if (!name?.trim()) {
    return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 });
  }
  if (!price || isNaN(price)) {
    return NextResponse.json({ error: "Preço inválido" }, { status: 400 });
  }
  if (!duration || isNaN(duration)) {
    return NextResponse.json({ error: "Duração inválida" }, { status: 400 });
  }

  try {
    // Busca o negócio do dono logado
    const business = await prisma.business.findUnique({
      where: { ownerId: session.user.id },
    });

    if (!business) {
      return NextResponse.json({ error: "Negócio não encontrado" }, { status: 404 });
    }

    // Cria o serviço ligado ao negócio
    const service = await prisma.service.create({
      data: {
        name: name.trim(),
        price: parseFloat(price),
        duration: parseInt(duration),
        businessId: business.id,
      },
    });

    // Retorna o serviço criado
    return NextResponse.json(service, { status: 201 });

  } catch (error) {
    console.error("Erro ao criar serviço:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// Rota DELETE — deleta um serviço pelo ID
export async function DELETE(req: Request) {

  // Verifica se o usuário está logado
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
  }

  try {
    await prisma.service.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Erro ao deletar serviço:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}


export async function PUT(req: Request) {

  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id, name, price, duration } = await req.json();

  if (!id) {
    return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });
  }

  try {
   
    const service = await prisma.service.update({
      where: { id },
      data: {
        name: name.trim(),
        price: parseFloat(price),
        duration: parseInt(duration),
      },
    });

    return NextResponse.json(service);

  } catch (error) {
    console.error("Erro ao editar serviço:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}