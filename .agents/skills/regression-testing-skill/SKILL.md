---
name: regression-testing-skill
description: Use when creating or running regression tests across V1 modules, Playwright, Vitest, AI evals, RLS static checks, build gates, and bug-fix verification in Proposito em Acao.
---

# Regression Testing Skill

## Quando usar

Use ao corrigir bug, fechar QA final, validar regressao entre modulos ou preparar release candidate.

## Instrucoes praticas

1. Reproduza a falha antes da correcao quando possivel.
2. Adicione teste focado para bug critico, seguranca, IA, RLS, mobile ou fluxo principal.
3. Rode teste focado, depois suite ampla.
4. Para RLS sem Supabase CLI, adicione teste estatico apenas como rede minima e registre que nao substitui persona real.
5. Para UI, cubra viewport desktop e mobile com Playwright quando o fluxo renderizado existir.
6. Nunca relaxe seguranca, schema ou RLS para passar teste.
7. Registre em `docs/BUG_FIX_LOG.md` o bug, causa, correcao e verificacao.

## Arquivos relacionados

- `src/tests/unit/`
- `src/tests/e2e/`
- `src/ai/evals/`
- `supabase/tests/README.md`
- `docs/BUG_FIX_LOG.md`

## Saida esperada

Retorne testes criados, falhas reproduzidas, comandos, resultados, cobertura restante e riscos de regressao.
