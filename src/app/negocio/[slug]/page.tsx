// Importa o prisma para buscar dados do banco
import { prisma } from "@/lib/prisma";

// Importa o notFound para mostrar 404 se o negócio não existir
import { notFound } from "next/navigation";

// Importa o Client Component que vai ter a interatividade
import NegocioClient from "./NegocioClient";

// Recebe o slug da URL — ex: /negocio/barbearia-do-joao
type Props = {
  params: Promise<{ slug: string }>;
};

export default async function NegocioPage({ params }: Props) {

  // Pega o slug da URL
  const { slug } = await params;

  // Busca o negócio pelo slug com serviços e slots disponíveis
  const business = await prisma.business.findUnique({
    where: { slug },
    include: {
      services: true,
      slots: {
        // Só mostra slots disponíveis e futuros
        where: {
          available: true,
          dateTime: { gte: new Date() },
        },
        orderBy: { dateTime: "asc" },
        // Limita a 50 slots
        take: 50,
      },
    },
  });

  // Se não encontrar o negócio, mostra 404
  if (!business) notFound();

  return (
    <NegocioClient
      business={{
        id: business.id,
        name: business.name,
        description: business.description,
        slug: business.slug,
      }}
      services={business.services.map((s) => ({
        id: s.id,
        name: s.name,
        price: s.price,
        duration: s.duration,
      }))}
      slots={business.slots.map((s) => ({
        id: s.id,
        dateTime: s.dateTime.toISOString(),
      }))}
    />
  );
}