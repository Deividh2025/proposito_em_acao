---
name: nextjs-tailwind-skill
description: Use when writing or reviewing Next.js, React, TypeScript, Tailwind, routes, layouts, components, responsiveness, App Router, or frontend conventions in Proposito em Acao.
---

# Next.js Tailwind Skill

## Quando usar

Use para App Router, componentes React, layouts, rotas, Tailwind, responsividade, PWA futura, formularios e UI tecnica.

## Quando nao usar

Nao use para criar tela final de produto antes de prompt proprio, nem para adicionar biblioteca visual pesada sem justificativa.

## Instrucoes praticas

1. Preferir Server Components por padrao.
2. Usar Client Components somente quando houver estado, evento ou API do browser.
3. Manter rotas pequenas e orientadas ao fluxo do usuario.
4. Usar Tailwind para tokens e utilitarios; evitar CSS solto sem motivo.
5. Preservar desktop-first com mobile/PWA complementar.
6. Evitar poluicao visual e excesso de escolhas.
7. Rodar lint, typecheck e build quando alterar frontend.

## Arquivos relacionados

- `src/app/`
- `src/components/`
- `src/styles/`
- `tailwind.config.ts`
- `docs/FRONTEND_ARCHITECTURE.md`

## Formato de saida esperado

Retorne rotas, componentes, responsividade, bibliotecas, riscos de UX, comandos executados e pendencias.
