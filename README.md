# Agenda Logo

Plataforma SaaS de agendamento online para pequenos negócios como barbearias, clínicas e salões de beleza. Desenvolvido com Next.js, Prisma e Supabase.

---

## Tecnologias

- **Next.js 16** — Framework React fullstack com App Router
- **TypeScript** — Tipagem estática
- **Tailwind CSS** — Estilização utility-first
- **NextAuth v5** — Autenticação com Google OAuth
- **Prisma 7** — ORM para banco de dados
- **Supabase** — PostgreSQL gerenciado na nuvem
- **Vercel** — Deploy e hospedagem

---

## Funcionalidades

- Landing page institucional com apresentação do produto
- Autenticação segura com Google
- Dashboard do dono do negócio
- Cadastro de serviços com duração e preço
- Configuração de horários disponíveis
- Agendamento online pelo cliente
- Gestão e cancelamento de agendamentos

---

## Como rodar localmente

### Pré-requisitos

- Node.js 18 ou superior
- Conta no [Supabase](https://supabase.com)
- Credenciais OAuth configuradas no [Google Cloud Console](https://console.cloud.google.com)

### Passo a passo

1. Clone o repositório

       git clone https://github.com/seu-usuario/agenda-logo.git
       cd agenda-logo

2. Instale as dependências

       npm install

3. Configure as variáveis de ambiente

       cp .env.example .env

   Preencha o arquivo `.env` com suas credenciais (veja a seção abaixo).

4. Rode as migrations do banco

       npx prisma migrate dev

5. Inicie o servidor de desenvolvimento

       npm run dev

6. Acesse http://localhost:3000

---

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

| Variável | Descrição |
|---|---|
| DATABASE_URL | URL de conexão pooled do Supabase |
| DIRECT_URL | URL de conexão direta do Supabase |
| GOOGLE_CLIENT_ID | Client ID do app Google OAuth |
| GOOGLE_CLIENT_SECRET | Client Secret do app Google OAuth |
| NEXTAUTH_SECRET | Chave secreta para o NextAuth |
| NEXTAUTH_URL | URL base da aplicação (ex: http://localhost:3000) |

---

## Estrutura do projeto

    agenda-logo/
    ├── prisma/
    │   ├── schema.prisma         Schema do banco de dados
    │   ├── prisma.config.ts      Configuração do Prisma 7
    │   └── migrations/           Histórico de migrations
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx          Landing page
    │   │   ├── login/
    │   │   │   └── page.tsx      Página de login
    │   │   ├── dashboard/
    │   │   │   └── page.tsx      Dashboard do dono
    │   │   └── api/
    │   │       └── auth/
    │   │           └── [...nextauth]/
    │   │               └── route.ts  Rotas do NextAuth
    │   └── lib/
    │       └── auth.ts           Configuração do NextAuth
    ├── .env.example              Exemplo de variáveis de ambiente
    └── README.md

---

## Deploy

O projeto está configurado para deploy na Vercel.

1. Importe o repositório na [Vercel](https://vercel.com)
2. Configure as variáveis de ambiente no painel da Vercel
3. Adicione a URL de produção no Google Cloud Console como URI de redirecionamento autorizado
4. A Vercel realiza o deploy automaticamente a cada push na branch principal

---

## Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.