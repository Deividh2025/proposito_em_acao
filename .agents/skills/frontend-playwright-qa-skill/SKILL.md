---
name: frontend-playwright-qa-skill
description: Use when defining, creating, or running Playwright/frontend QA for rendered routes, responsive layout, navigation, accessibility smoke checks, console errors, visual regressions, or build validation in Proposito em Acao.
---

# Frontend Playwright QA Skill

## Quando usar

Use quando a tarefa criar ou alterar rotas, App Router, shell, componentes visuais, responsividade, navegacao ou estados renderizados.

## Instrucoes praticas

1. Prefira `npm.cmd` no PowerShell do Windows.
2. Use `npm.cmd run test:e2e` quando precisar buildar, iniciar Next e executar Playwright com encerramento seguro.
3. Se usar Playwright direto, confirme que o servidor correto esta em `http://127.0.0.1:3000`.
4. Cubra smoke de home, dashboard, Metacognicao, navegacao principal, desktop e viewport mobile.
5. Verifique que nao ha 404 acidental, overlay de framework, overflow obvio ou conteudo sensivel exposto em placeholder.
6. Para UI significativa, capture evidencia visual e registre viewports.
7. Rode lint, typecheck e build antes de afirmar pronto.

## Arquivos relacionados

- `playwright.config.ts`
- `scripts/run-e2e.mjs`
- `src/tests/e2e/`
- `src/app/`
- `src/components/`
- `docs/TESTING_SETUP.md`

## Formato de saida esperado

Retorne comandos, resultados, rotas testadas, viewports, achados visuais, pendencias e riscos Windows.
