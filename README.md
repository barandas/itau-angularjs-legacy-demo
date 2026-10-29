# Itaú (demo) — Front-end legado em AngularJS 1.x

> **Projeto demonstrativo.** Clone visual inspirado na home do Itaú, criado para demonstrar uma **migração de front-end de AngularJS para React com o Devin**. Não possui vínculo com o Itaú Unibanco. Todos os dados, telefones e endereços são fictícios; nenhum dado de formulário sai do navegador.

## Stack (intencionalmente legada)

| Item | Versão / padrão |
|---|---|
| Framework | AngularJS **1.8.3** (`angular`, `ngRoute`, `ngSanitize`, `angular-i18n` pt-BR) |
| UI | **Bootstrap 3.4.1** + **jQuery 1.12.4** (glyphicons, `.modal()` via jQuery) |
| Build | **Nenhum** — `<script>` manuais no `index.html`, ordem importa |
| Estado | `$scope`, `$rootScope`, `$watch`/`$watchGroup`, eventos `$broadcast` |
| Rotas | `$routeProvider` com hashbang (`#!/rota`) |
| Testes | Karma + Jasmine + `angular-mocks` (ChromeHeadless) |

## Rodando

```bash
npm install
npm start          # http://localhost:8080
npm test           # Karma (single run)
```

## Estrutura

```
index.html                 # shell + script tags
app/
  app.module.js            # módulo global `itauApp`, constantes, run block
  app.routes.js            # rotas ngRoute
  controllers/             # MainController, HeaderController, Home, Cartoes, Emprestimos, Agencias, AbraConta
  services/                # ApiService ($http + cache), Produtos, Cartoes, Agencias, Simulador (Tabela Price), Validacao, CookieConsent
  directives/              # heroCarousel, cardCarousel, cookieBanner, whatsappButton, uiMascara, cpfValido/celularValido/maiorIdade
  filters/                 # brl, cpf
  views/                   # templates de cada rota
  partials/                # header, footer, carrosséis, cookie banner
assets/css/itau.css        # CSS global único
data/*.json                # "API" mockada
test/unit/                 # specs Karma/Jasmine
```

## Páginas

- `#!/` — Home: banner rotativo (pausar/navegar), atalhos do dia a dia, produtos, cartões mais pedidos (carrossel), destaques feito.itaú, apps, busca de agências, banner de cookies, botão WhatsApp.
- `#!/cartoes` — Catálogo com filtros (renda, benefício, sem anuidade), ordenação e modal Bootstrap.
- `#!/emprestimos` — Simulador de empréstimo (Tabela Price, IOF, CET, cronograma).
- `#!/agencias` — Busca de agências (sem acento, nº da agência, CEP), filtro de acessibilidade.
- `#!/abra-sua-conta` — Wizard em 3 etapas com validação de CPF, celular, maioridade e máscaras.

## Pontos de atenção para a migração (AngularJS → React)

Padrões legados presentes de propósito, bons para mostrar na demo:

- **`$scope` / two-way binding** em todos os controllers → `useState` / formulários controlados.
- **`$watch(..., true)` e `$watchGroup`** (Cartões, Empréstimos) → estado derivado / `useMemo` / `useEffect`.
- **jQuery dentro de Angular**: `$('#modalPedido').modal('show')`, listener de scroll em `HeaderController`, troca de classe no `heroCarousel`.
- **Diretivas com `link`, `$interval`, `templateUrl`, `ng-include` dinâmico** (`cardCarousel` recebe o template por atributo) → componentes + `children`/render props.
- **Validadores de `ngModel`** (`$validators`, `$parsers`/`$formatters` na máscara) → React Hook Form / Zod.
- **`$rootScope` como estado global** (`pageTitle`, `menuAberto`) e eventos `$broadcast` (cookies) → Context / store.
- **`ApiService` com cache manual sobre `$http`/`$q`** → `fetch` + React Query (ou similar).
- **Filtros (`brl`, `cpf`, `orderBy`, `filter`)** → funções utilitárias puras / `Intl.NumberFormat`.
- **Script tags manuais, sem bundler** → Vite.
- **Specs Karma/Jasmine** servem de rede de segurança: as regras de negócio (services/filtros) devem continuar passando após a migração (ex.: portar para Vitest + Testing Library).

### Sugestão de prompt para a demo

> Migre este app AngularJS 1.x para React 18 + TypeScript + Vite, mantendo o mesmo visual e comportamento de todas as rotas. Substitua Bootstrap 3/jQuery por CSS Modules (ou Tailwind), `ngRoute` por React Router, e porte os testes Karma/Jasmine para Vitest + Testing Library. Faça a migração de forma incremental, página por página, abrindo um PR por etapa.
