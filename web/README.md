# Aplicação React (migração gradual)

Este diretório inicia a migração do demo AngularJS para React 18, TypeScript e
Vite. A aplicação AngularJS na raiz permanece intacta durante as etapas
incrementais.

## Executar

```bash
npm ci
npm run dev
```

O Vite abre em `http://localhost:5173`. Verificações disponíveis:

```bash
npm run typecheck
npm test
npm run build
```

## Estrutura

- `src/components/layout/`: cabeçalho, rodapé e componentes compartilhados.
- `src/pages/`: telas em migração.
- `src/lib/`: regras de negócio e acesso/cache de dados.
- `src/hooks/`: integração de dados com React.
- `src/styles/global.css`: tokens, reset, tipografia e botões compartilhados.
- `public/data/` e `public/assets/img/`: cópias temporárias dos dados e imagens
  usados pelo AngularJS.

## Situação das rotas

| Rota              | AngularJS         | React                   |
| ----------------- | ----------------- | ----------------------- |
| `/`               | Home              | Placeholder de migração |
| `/cartoes`        | Cartões           | Placeholder de migração |
| `/emprestimos`    | Empréstimos       | Placeholder de migração |
| `/agencias`       | Agências          | Placeholder de migração |
| `/abra-sua-conta` | Abertura de conta | Placeholder de migração |

## AngularJS → React

| Conceito legado        | Equivalente React                        |
| ---------------------- | ---------------------------------------- |
| `ngRoute`              | React Router 6                           |
| Controllers e `$scope` | Componentes funcionais e hooks           |
| Services e `$http`     | Funções tipadas em `src/lib/` e `useApi` |
| Diretivas              | Componentes React                        |
| Bootstrap 3 e jQuery   | CSS Modules e estado/eventos React       |
| Scripts manuais        | Vite e módulos ES                        |
| Karma/Jasmine          | Vitest e Testing Library                 |
