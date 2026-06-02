---
name: release-readiness-skill
description: Use when evaluating deploy readiness, Prompt 16 gates, release notes, rollback, environment, secrets, Supabase, OpenAI, email, PWA, and production blockers in Proposito em Acao.
---

# Release Readiness Skill

## Quando usar

Use antes de qualquer deploy, release candidate, checklist Prompt 16, preparacao de ambiente ou revisao de pronto para producao.

## Instrucoes praticas

1. Verifique que lint, typecheck, testes, build e E2E passaram frescos.
2. Confirme que secrets nao estao no diff e `.env.example` contem apenas placeholders.
3. Exija Supabase/Auth/RLS aplicado e testado com personas antes de producao.
4. Exija OpenAI real, e-mail real e deploy configurados server-side, com fallback e logs seguros.
5. Registre riscos bloqueantes, riscos aceitos, rollback e decisores.
6. Atualize `docs/RELEASE_READINESS.md`, `docs/DEPLOYMENT_PLAN.md` e `docs/CHANGELOG.md`.
7. Se algo depender do fundador, marque como decisao pendente, nao como concluido.

## Arquivos relacionados

- `docs/RELEASE_READINESS.md`
- `docs/DEPLOYMENT_PLAN.md`
- `docs/CHANGELOG.md`
- `docs/ENVIRONMENT_VARIABLES.md`
- `.env.example`

## Saida esperada

Retorne status por gate, bloqueios, pendencias manuais, decisoes, rollback e recomendacao clara: aprovado, aprovado com restricoes ou bloqueado.
