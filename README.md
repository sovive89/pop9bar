# PØP9 Bar — Gestão de Balcão

## Stack

- Vite + React 18 + TypeScript
- React Router DOM
- Tailwind CSS
- API via `fetch` com fallback local (localStorage)

## Funcionalidades entregues

- **Tela inicial/dashboard** (`/dashboard`) com cards de visão operacional.
- **CRUD de produtos** (`/products`) com criar, editar e excluir.
- **Login/autenticação** (`/login`) com proteção de rotas privadas.
- **Integração com API/backend**:
  - se `VITE_API_BASE_URL` existir, usa endpoints REST (`/products`).
  - sem backend configurado, usa fallback local para desenvolvimento.
- **Deploy/build de produção** com `npm run build` e workflow de CI.

## Como rodar localmente

```bash
npm install
npm run dev
```

Abra: `http://localhost:8080`

## Variáveis de ambiente

Crie `.env` (opcional):

```bash
VITE_API_BASE_URL=https://sua-api.com
```

Endpoints esperados:

- `GET /products`
- `POST /products`
- `PUT /products/:id`
- `DELETE /products/:id`

## Scripts

- `npm run dev` — desenvolvimento
- `npm run build` — build de produção
- `npm run preview` — preview da build
- `npm run lint` — lint
- `npm run test` — testes (Vitest)

## Deploy

### Build local de produção

```bash
npm run build
npm run preview
```

### CI (GitHub Actions)

O repositório inclui workflow que instala dependências, roda lint/test e build em pushes e PRs para `main`.
