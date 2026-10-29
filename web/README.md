# Itaú (demo) — app React (`web/`)

Novo front-end em **Vite + React 18 + TypeScript**, criado ao lado do app AngularJS legado (raiz do
repositório), que **não foi alterado**. A migração é incremental: por enquanto só a rota **Home**
está em React; as demais rotas mostram um aviso com link para a página equivalente no app legado.

## Stack

| Item         | Legado (raiz)                                | React (`web/`)                                                  |
| ------------ | -------------------------------------------- | --------------------------------------------------------------- |
| Framework    | AngularJS 1.8.3 (`ngRoute`, `ngSanitize`)    | React 18 + TypeScript (`strict`)                                |
| Build        | nenhum (`<script>` manuais)                  | Vite 7                                                          |
| Rotas        | `$routeProvider` com hashbang (`#!/rota`)    | React Router 7 (`createBrowserRouter`, URLs limpas)             |
| UI           | Bootstrap 3.4.1 + jQuery 1.12.4 + Glyphicons | CSS próprio (`src/styles`) + ícones SVG inline (`Icon`)         |
| Dados        | `ApiService` (`$http` + cache) em `data/`    | `src/api/client.ts` (`fetch` + cache) nos mesmos `data/`        |
| Testes       | Karma + Jasmine                              | Vitest + Testing Library (jsdom)                                |
| Lint/formato | —                                            | ESLint (flat config, typescript-eslint, react-hooks) + Prettier |

## Rodando

Requer Node **>= 20.19**.

```bash
cd web
npm ci
npm run dev            # http://localhost:5173
```

Os JSON mockados **não são duplicados**: um plugin em `vite.config.ts` serve `../data/*.json` em
`/data/` no dev server e copia os arquivos para `dist/data/` no build.

Para usar os links "Abrir na versão AngularJS" das rotas ainda não migradas, suba também o legado
na raiz (`npm install && npm start`, porta 8080).

### Scripts

| Comando                 | O que faz                                           |
| ----------------------- | --------------------------------------------------- |
| `npm run dev`           | dev server com HMR                                  |
| `npm run build`         | typecheck (`tsc -b`) + build de produção em `dist/` |
| `npm run preview`       | serve o `dist/` gerado                              |
| `npm test`              | Vitest (single run)                                 |
| `npm run test:watch`    | Vitest em modo watch                                |
| `npm run test:coverage` | Vitest com cobertura (v8)                           |
| `npm run typecheck`     | `tsc -b`                                            |
| `npm run lint`          | ESLint                                              |
| `npm run format`        | Prettier (escreve)                                  |
| `npm run format:check`  | Prettier (só verifica; usado no CI)                 |

O job `web` em `.github/workflows/ci.yml` roda `lint`, `format:check`, `typecheck`, `test` e `build`.

### Variáveis de ambiente (opcionais)

| Variável              | Padrão                   | Uso                                                   |
| --------------------- | ------------------------ | ----------------------------------------------------- |
| `VITE_API_BASE`       | `${BASE_URL}data/`       | base do `ApiClient` (equivale a `APP_CONFIG.apiBase`) |
| `VITE_LEGACY_APP_URL` | `http://localhost:8080/` | app AngularJS usado nas rotas ainda não migradas      |

## Estrutura

```
src/
  main.tsx                 # createRoot + RouterProvider + CSS
  router.tsx               # rotas (Home + placeholders + redirect equivalente ao otherwise)
  config.ts                # APP_CONFIG (apiBase, carouselInterval, legacyAppUrl)
  api/
    client.ts              # ApiClient genérico: GET `${baseUrl}${recurso}.json` + cache
    home.ts                # carregarConteudoHome(): os 5 recursos usados pela Home
    types.ts               # tipos dos JSON de data/ usados pela Home
  components/              # Layout, Header, Footer, HeroCarousel, CardCarousel, cards, Icon
  hooks/                   # useScrolled (substitui o listener jQuery), useWindowWidth
  pages/
    HomePage.tsx           # app/views/home.html + app/controllers/home.controller.js
    PendingMigrationPage.tsx
  utils/
    format.ts              # filtros brl e cpf
    routes.ts              # legacyHrefToPath: '#!/cartoes' -> '/cartoes'
  styles/                  # base.css (substitui Bootstrap 3) + itau.css (tema)
```

## Mapeamento legado → React

| Legado                                                | React                                                                   |
| ----------------------------------------------------- | ----------------------------------------------------------------------- |
| `app/views/home.html` + `HomeController`              | `src/pages/HomePage.tsx`                                                |
| `app/app.routes.js` (`$routeProvider`)                | `src/router.tsx`                                                        |
| `MainController` (`$rootScope.pageTitle`, breadcrumb) | `Layout` (`handle.title` da rota + `document.title`)                    |
| `HeaderController` + `partials/header.html`           | `components/Header.tsx` + `hooks/useScrolled.ts`                        |
| `partials/footer.html`                                | `components/Footer.tsx`                                                 |
| diretiva `heroCarousel` (`$interval`, jQuery)         | `components/HeroCarousel.tsx` (`setInterval` em `useEffect`)            |
| diretiva `cardCarousel` + `ng-include` dinâmico       | `components/CardCarousel.tsx` com render prop `renderItem`              |
| `partials/card-*.html`                                | `CartaoCard`, `DestaqueCard`, `ProdutoCard`                             |
| `ApiService`                                          | `api/client.ts`                                                         |
| `ProdutosService.get*` / `CartoesService.maisPedidos` | `api/home.ts` (`carregarConteudoHome`)                                  |
| filtros `brl` / `cpf`                                 | `formatBRL` / `formatCPF` em `utils/format.ts`                          |
| Glyphicons                                            | `components/Icon.tsx` (SVG inline, mesmos nomes `glyphicon-*` dos JSON) |

### `ApiClient` × `ApiService`

Mantido do legado:

- `get(recurso)` busca `${baseUrl}${recurso}.json` e devolve o corpo JSON;
- cache em memória por recurso (segunda chamada não vai à rede);
- `limparCache()`;
- falhas são logadas (`[ApiClient] Falha ao carregar <recurso>`) e propagadas como rejeição.

Diferenças intencionais:

- chamadas **concorrentes** ao mesmo recurso compartilham a mesma requisição (o legado dispararia
  duas `$http`);
- uma falha **não** fica no cache: a próxima chamada tenta de novo;
- erros HTTP viram `ApiError` com `status` e `recurso`;
- o cliente é genérico (`get<T>`): não conhece endpoints. Só os 5 recursos que a Home realmente
  consome (`banners`, `atalhos`, `produtos`, `destaques`, `cartoes`) estão em `api/home.ts`; os
  demais (`agencias`, `taxas`, …) entram junto com as páginas que os usam.

### `format.ts` × filtros

- `formatBRL(valor, semSimbolo?)` usa `Intl.NumberFormat('pt-BR')` (moeda BRL) e normaliza os
  espaços Unicode (NBSP/NNBSP) para espaço comum, reproduzindo a saída do filtro:
  `1234.5 → "R$ 1.234,50"`, `-10 → "-R$ 10,00"`, `semSimbolo → "1.234,50"`,
  `null`/`''`/não numérico → `""`. Aceita string numérica como o filtro. Uma diferença: valores
  que arredondam para zero (ex.: `-0.001`) saem `"R$ 0,00"` em vez de `"-R$ 0,00"`.
- `formatCPF(valor)` mantém a formatação progressiva do filtro (`123.456.789-09`, parciais como
  `123.4`), descartando não dígitos e limitando a 11 dígitos. Não há API `Intl` para CPF, então é
  feito com regex como no legado.

## Comparação funcional da Home

| Comportamento                                                         | Legado (AngularJS)                   | React                                                           |
| --------------------------------------------------------------------- | ------------------------------------ | --------------------------------------------------------------- |
| Carrega `banners`, `atalhos`, `produtos`, `destaques`, `cartoes`      | `$q.all` via services                | `Promise.all` em `carregarConteudoHome`                         |
| Cartões mais pedidos = `cartoes` com `maisPedido: true`               | `CartoesService.maisPedidos()`       | filtro em `carregarConteudoHome`                                |
| "Carregando..." enquanto carrega                                      | `ng-show="carregando"`               | estado `carregando` (`role="status"`)                           |
| Erro: "Não foi possível carregar o conteúdo. Tente novamente."        | `ng-show="erro"`                     | igual (`role="alert"`); seções estáticas seguem visíveis        |
| Banner rotativo: autoavanço 6 s, pausar/continuar, ‹ ›, indicadores   | diretiva `heroCarousel`              | `HeroCarousel` (mesmo intervalo, `APP_CONFIG.carouselInterval`) |
| Temas/arte do banner (`tema-*`)                                       | CSS                                  | mesmo CSS portado                                               |
| Atalhos do dia a dia (6 cards com ícone)                              | `ng-repeat`                          | `map` + `Icon`                                                  |
| Produtos: 2 primeiros grandes, demais pequenos, cor de fundo          | `$index < 2`                         | `indice < 2`                                                    |
| Carrossel de cartões: 3/2/1 por página (≥992/≥768/<768 px), paginação | diretiva `cardCarousel`              | `CardCarousel` (mesmos breakpoints)                             |
| Destaques feito.itaú em carrossel + "Acesse o feito.itaú"             | `cardCarousel` + `ng-include`        | `CardCarousel` + `DestaqueCard`                                 |
| Apps (Itaú, Personnalité, Empresas) + "Conheça os canais"             | lista fixa no controller             | lista fixa em `HomePage`                                        |
| Busca de agência → `/agencias?q=<termo>` (sem `q` se vazio)           | `$location.path().search()`          | `useNavigate` → `/agencias?q=...`                               |
| Barra "Abra sua conta"                                                | link `#!/abra-sua-conta`             | `<Link to="/abra-sua-conta">`                                   |
| Título da aba e breadcrumb "Abra sua conta no Banco Itaú"             | `MainController` + `title` da rota   | `Layout` + `handle.title` da rota                               |
| Header: sombra ao rolar, "Mais acessos", menu lateral                 | `HeaderController` (jQuery `scroll`) | `Header` + `useScrolled`                                        |
| Links internos dos JSON (`#!/cartoes`)                                | hashbang                             | convertidos com `legacyHrefToPath` (`/cartoes`)                 |

### Fora do escopo desta etapa

- **Banner de cookies** (`cookieBanner` + `CookieConsentService`) e **botão do WhatsApp**: ficam no
  shell `index.html`, não na Home; serão migrados à parte.
- **Cartões, Empréstimos, Agências e Abra sua conta**: rotas existem, mas renderizam
  `PendingMigrationPage` com link para a versão AngularJS (preservando a query string, ex.
  `/agencias?q=paulista` → `#!/agencias?q=paulista`).
- **Deep links hashbang** (`/#!/cartoes`) não são redirecionados; em produção o servidor precisa
  de fallback SPA para `index.html`.

## Testes

```bash
npm test
```

- `utils/format.test.ts` — paridade com os filtros `brl` e `cpf`.
- `api/client.test.ts` — URL, cache, concorrência, `limparCache`, erros HTTP/rede/JSON.
- `api/home.test.ts` — recursos carregados, filtro `maisPedido`, falha de um recurso.
- `components/*.test.tsx` — carrosséis (autoavanço, pausa, navegação, breakpoints) e Header.
- `pages/HomePage.test.tsx` — carregando, conteúdo, erro e busca de agência.
- `router.test.tsx` — Home, redirect de rota desconhecida, título e rotas pendentes.
