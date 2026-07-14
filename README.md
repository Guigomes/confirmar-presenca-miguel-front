# Confirmar Presença – Aniversário do Miguel

Site para os convidados confirmarem presença no aniversário do Miguel, com painel para os organizadores acompanharem as confirmações.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Front-end | Next.js 15 (App Router) + TypeScript |
| Estilo | Tailwind CSS |
| Estado / cache | TanStack Query v5 |
| Backend | Firebase (Firestore + Authentication) |
| Formulários | React Hook Form + Zod |
| Deploy | Vercel |

---

## Funcionalidades

### Públicas
- Página inicial com informações da festa (data, horário, local)
- Formulário de confirmação de presença (nome, acompanhantes, mensagem)
- Modo escuro / claro

### Administrativas
- Login dos organizadores com Google
- Painel com lista de confirmações e total de convidados
- Remoção de confirmações

---

## Setup local

### 1. Pré-requisitos

- Node.js 20+
- Projeto no [Firebase](https://console.firebase.google.com) (plano gratuito Spark funciona)

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar o Firebase

1. Em **Authentication → Sign-in method**, ative o provedor **Google**.
2. Em **Firestore Database**, crie o banco (modo produção).
3. Em **Firestore Database → Regras**, cole o conteúdo de [`firestore.rules`](./firestore.rules).
4. Em **Project Settings → Seus apps → SDK setup**, copie as chaves do app web.

### 4. Configurar variáveis de ambiente

```bash
cp .env.local.example .env.local
```

Edite `.env.local` com os valores do seu projeto Firebase:

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> Essas chaves do app web são públicas por design — a segurança de verdade está nas regras do Firestore (`firestore.rules`), não nessas chaves.

### 5. Liberar o acesso do organizador

1. Abra `lib/config/admins.ts` e coloque o(s) e-mail(s) Google que devem ter acesso ao painel.
2. Copie a mesma lista para a seção `allow read, update, delete` de `firestore.rules` (precisam ficar idênticas) e cole o arquivo atualizado nas regras do Firestore no console.

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
│   ├── login/page.tsx              # "Entrar com Google"
│   └── admin/
│       ├── layout.tsx              # Guard de autenticação (client-side)
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
│   ├── firebase/
│   │   └── client.ts                # Firebase App/Auth/Firestore init
│   ├── hooks/
│   │   ├── use-auth.ts
│   │   └── use-rsvp.ts
│   ├── utils/
│   │   ├── cn.ts
│   │   └── date.ts
│   └── config/
│       ├── party.ts                 # Dados da festa (editar aqui)
│       └── admins.ts                # E-mails com acesso ao painel
│
├── types/
│   └── rsvp.ts
│
└── firestore.rules                  # Regras de segurança (colar no console)
```

---

## Modelagem dos dados

| Coleção Firestore | Descrição |
|---|---|
| `rsvps` | Confirmações de presença (nome, acompanhantes, mensagem, data) |

- Qualquer visitante pode criar uma confirmação (regra `allow create`).
- Só os e-mails listados em `firestore.rules` conseguem ler, editar ou remover confirmações — essa é a proteção real dos dados dos convidados. O arquivo `lib/config/admins.ts` só controla a experiência visual (o que o app mostra), não substitui as regras do Firestore.
- Não existe verificação de sessão no servidor (sem middleware): o guard de `/admin` roda no navegador e a segurança de fato vem do Firestore recusar a leitura para quem não está na lista.

---

## Deploy no Vercel

```bash
npm i -g vercel
vercel
```

Adicione no painel do Vercel as variáveis de ambiente listadas em `.env.local.example`.

Depois do primeiro deploy, adicione o domínio de produção (ex: `seu-projeto.vercel.app` ou o domínio customizado) em **Firebase Console → Authentication → Settings → Authorized domains** — sem isso o "Entrar com Google" falha em produção.

---

## Limitações do MVP

| Limitação | Observação |
|---|---|
| Sem lista de presentes | Este MVP cobre apenas confirmação de presença (RSVP) |
| Sem confirmação de e-mail para convidados | Não há envio de e-mail/WhatsApp automático ao confirmar |
| Sem edição de confirmação pelo próprio convidado | Alterações precisam ser feitas pelo organizador no painel |
| Sem verificação de sessão no servidor | O guard de `/admin` é client-side; a proteção real dos dados é a regra do Firestore |
