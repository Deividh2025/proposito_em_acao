---
name: docs-sync-skill
description: Use when code, architecture, scope, database, AI behavior, UX, security, roadmap, or governance changes require README or docs updates in Proposito em Acao.
---

# Docs Sync Skill

## Quando usar

Use sempre que uma mudanca tornar documentacao obsoleta ou incompleta.

## Quando nao usar

Nao use para mudancas triviais sem impacto em comportamento, arquitetura, seguranca, UX ou escopo.

## Instrucoes praticas

1. Identifique docs afetadas antes de editar.
2. Atualize a fonte de verdade correta, evitando duplicacao.
3. Registre decisoes em `docs/DECISIONS.md`.
4. Atualize `docs/CHANGELOG.md` para mudancas relevantes.
5. Atualize `docs/SECURITY_NOTES.md` para dados sensiveis, IA, Supabase, Atalaia ou LGPD.

## Arquivos relacionados

- `README.md`
- `docs/PROJECT_OVERVIEW.md`
- `docs/ROADMAP_EXECUTION.md`
- `docs/DECISIONS.md`
- `docs/CHANGELOG.md`
- `docs/SECURITY_NOTES.md`
- `docs/CODEX_WORKFLOW.md`

## Formato de saida esperado

Retorne docs revisadas, arquivos lidos, inconsistencias encontradas, decisoes registradas, comandos/verificacoes executadas e pendencias.
