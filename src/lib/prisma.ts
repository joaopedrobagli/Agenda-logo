// Importa o PrismaClient
import { PrismaClient } from "@prisma/client";

// Importa o adapter do PostgreSQL para o Prisma 7
import { PrismaPg } from "@prisma/adapter-pg";

// Importa o Pool do pg para gerenciar conexões
import { Pool } from "pg";

// Cria o pool de conexões com a URL do banco
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Cria o adapter passando o pool
const adapter = new PrismaPg(pool);

// Padrão singleton — evita múltiplas conexões no desenvolvimento
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Reutiliza a instância existente ou cria uma nova com o adapter
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter });

// Em desenvolvimento, salva na variável global pra reutilizar
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}