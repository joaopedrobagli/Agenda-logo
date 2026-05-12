
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {

  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const business = await prisma.business.findUnique({
      where: { ownerId: session.user.id },
      include: { slots: true },
    });

    return NextResponse.json(business?.slots ?? []);

  } catch (error) {
    console.error("Erro ao buscar slots:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
export async function POST(req: Request) {

  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { slots } = await req.json();

  if (!slots || !Array.isArray(slots)) {
    return NextResponse.json({ error: "Slots inválidos" }, { status: 400 });
  }

  try {
    const business = await prisma.business.findUnique({
      where: { ownerId: session.user.id },
    });

    if (!business) {
      return NextResponse.json({ error: "Negócio não encontrado" }, { status: 404 });
    }

    await prisma.slot.deleteMany({
      where: { businessId: business.id },
    });

    await prisma.slot.createMany({
      data: slots.map((s: { dateTime: string }) => ({
        dateTime: new Date(s.dateTime),
        businessId: business.id,
        available: true,
      })),
    });

    return NextResponse.json({ success: true }, { status: 201 });

  } catch (error) {
    console.error("Erro ao salvar slots:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}