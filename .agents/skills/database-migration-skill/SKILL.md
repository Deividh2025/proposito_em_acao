---
name: database-migration-skill
description: Padronizar migrations, rollback, versionamento e documentacao de mudancas no banco do Proposito em Acao.
---

# Database Migration Skill

## Quando usar

Use ao criar, alterar, revisar ou aplicar migrations Supabase/Postgres, seeds, indices, constraints, triggers, storage buckets ou rollback.

## Quando nao usar

Nao use para documentos conceituais sem SQL, a menos que eles alterem uma decisao de schema que vira migration.

## Instrucoes praticas

1. Criar migrations versionadas em `supabase/migrations/`.
2. Manter cada migration com objetivo claro: schema, RLS, storage ou ajuste.
3. Preferir constraints e FKs para integridade; nao depender so da UI.
4. Usar `create table if not exists` apenas quando idempotencia local for intencional.
5. Registrar rollback manual quando a operacao for destrutiva.
6. Nao aplicar migration remota sem credenciais, backup e permissao explicita.
7. Depois de mudar schema, sincronizar docs e tipos TypeScript.
8. Rodar lint/typecheck/build e validacoes Supabase quando CLI/MCP estiver disponivel.

## Arquivos relacionados

- `supabase/migrations/`
- `supabase/seed.sql`
- `docs/DATABASE_SCHEMA.md`
- `docs/SUPABASE_PLAN.md`
- `docs/DECISIONS.md`
- `src/types/database.ts`

## Formato de saida esperado

Retorne migrations criadas, ordem de aplicacao, rollback, comandos executados, resultado, docs atualizadas e pendencias manuais.
