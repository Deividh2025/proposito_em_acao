---
name: testing-architecture-skill
description: Use when defining or reviewing tests, lint, typecheck, build, Playwright, Vitest, QA gates, RLS tests, AI evals, or Definition of Done in Proposito em Acao.
---

# Testing Architecture Skill

## Quando usar

Use para configurar ou revisar ferramentas de teste, scripts, cobertura minima, criterios de pronto tecnico, RLS tests, IA evals e QA por PR.

## Quando nao usar

Nao use para declarar sucesso sem rodar verificacoes atuais.

## Instrucoes praticas

1. Lint, typecheck e build sao gates basicos.
2. Vitest cobre dominio puro, schemas e utilitarios.
3. Playwright cobre jornadas reais quando houver UI funcional.
4. RLS deve ter testes negativos antes de dados reais.
5. IA deve ter evals negativos para fluxos sensiveis.
6. Reportar comandos executados, saidas e falhas.
7. Atualizar `docs/TESTING_SETUP.md` quando estrategia mudar.

## Arquivos relacionados

- `src/tests/`
- `vitest.config.ts`
- `playwright.config.ts`
- `docs/TESTING_SETUP.md`
- `package.json`

## Formato de saida esperado

Retorne ferramentas, comandos, estrutura, cobertura minima, falhas, riscos e proximas verificacoes.
