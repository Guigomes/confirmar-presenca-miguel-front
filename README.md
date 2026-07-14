# Confirmar Presença – Aniversário do Miguel

Site para os convidados confirmarem presença no aniversário do Miguel, com painel para os organizadores acompanharem as confirmações.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Front-end | Next.js 15 (App Router) + TypeScript |
| Estilo | Tailwind CSS |
| Estado / cache | TanStack Query v5 |
| Backend / Auth | Supabase (PostgreSQL + Auth + RLS) |
| Formulários | React Hook Form + Zod |
| Deploy | Vercel |

---

## Funcionalidades

### Públicas
- Página inicial com informações da festa (data, horário, local)
- Formulário de confirmação de presença (nome, acompanhantes, mensagem)
- Modo escuro / claro

### Administrativas
- Login dos organizadores
- Painel com lista de confirmações e total de convidados
- Remoção de confirmações

---

## Setup local

### 1. Pré-requisitos

- Node.js 20+
- Conta no [Supabase](https://supabase.com) (plano gratuito funciona)

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

```bash
cp .env.local.example .env.local
```

Edite `.env.local` com os valores do seu projeto Supabase:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Configurar banco de dados no Supabase

No **SQL Editor** do Supabase, execute os arquivos na ordem:

```
supabase/migrations/001_initial_schema.sql
supabase/migrations/002_rls_policies.sql
```

### 5. Criar o acesso do organizador

1. Acesse `/login` no site e crie uma conta (aba "Cadastre-se").
2. No SQL Editor do Supabase, promova essa conta a organizador:

```sql
UPDATE user_profiles
SET role = 'admin'
WHERE email = 'seuemail@exemplo.com';
```

### 6. Editar os dados da festa

Edite `lib/config/party.ts` com o nome, data, horário e local reais da festa.

### 7. Rodar em desenvolvimento

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

## Estrutura do projeto

```
confirmar-presenca-miguel-front/
├── app/
│   ├── layout.tsx                  # Root layout + Providers
│   ├── page.tsx                    # Home + formulário de RSVP
│   ├── not-found.tsx
│   ├── error.tsx
│   ├── providers.tsx               # TanStack Query provider
│   ├── login/page.tsx
│   └── admin/
│       ├── layout.tsx              # Guard de autenticação/role
│       └── page.tsx                # Painel: resumo + lista de confirmações
│
├── components/
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   └── admin-sign-out.tsx
│   ├── ui/
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── empty-state.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── spinner.tsx
│   │   └── theme-toggle.tsx
│   └── rsvp/
│       ├── rsvp-form.tsx
│       ├── rsvp-summary.tsx
│       └── rsvp-table.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                # Browser client
│   │   ├── server.ts                # Server Component client
│   │   └── middleware.ts            # Session refresh + guard de /admin
│   ├── hooks/
│   │   ├── use-auth.ts
│   │   └── use-rsvp.ts
│   ├── utils/
│   │   ├── cn.ts
│   │   └── date.ts
│   └── config/
│       └── party.ts                 # Dados da festa (editar aqui)
│
├── types/
│   └── database.ts                  # Tipos TypeScript do schema
│
└── supabase/
    ├── migrations/
    │   ├── 001_initial_schema.sql
    │   └── 002_rls_policies.sql
    └── seed.sql
```

---

## Modelagem do banco

| Tabela | Descrição |
|---|---|
| `user_profiles` | Perfis de usuário (roles: admin, guest) |
| `rsvps` | Confirmações de presença (nome, acompanhantes, mensagem) |

- Qualquer pessoa pode inserir uma confirmação (`rsvps_insert_public`).
- Apenas contas com `role = 'admin'` conseguem ler, editar ou remover confirmações — protegendo os dados dos convidados.

---

## Deploy no Vercel

```bash
npm i -g vercel
vercel
```

Adicione no painel do Vercel as variáveis de ambiente listadas em `.env.local.example`, e configure a **Site URL** / **Redirect URLs** no Supabase (Authentication → URL Configuration) apontando para a URL de produção.

---

## Limitações do MVP

| Limitação | Observação |
|---|---|
| Sem lista de presentes | Este MVP cobre apenas confirmação de presença (RSVP) |
| Sem confirmação de e-mail para convidados | Não há envio de e-mail/WhatsApp automático ao confirmar |
| Sem edição de confirmação pelo próprio convidado | Alterações precisam ser feitas pelo organizador no painel |
