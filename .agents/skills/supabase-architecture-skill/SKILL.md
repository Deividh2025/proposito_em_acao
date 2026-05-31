---
name: supabase-architecture-skill
description: Use when preparing or reviewing Supabase architecture, Auth, RLS, Postgres, Storage, Edge Functions, clients, environment variables, or migrations in Proposito em Acao.
---

# Supabase Architecture Skill

## Quando usar

Use em qualquer decisao ou implementacao relacionada a Supabase, Auth, Postgres, RLS, Storage, Edge Functions, clients, migrations, tipos ou variaveis.

## Quando nao usar

Nao use para criar projeto Supabase, migrations reais ou policies sem prompt/autorizacao propria.

## Instrucoes praticas

1. RLS obrigatorio em toda tabela de schema exposto.
2. Separar anon/publishable key de service role.
3. Nunca expor service role no browser, mobile ou logs.
4. Modelar Atalaia por alvo e grant granular.
5. Evitar `user_metadata` para autorizacao.
6. Preferir storage privado.
7. Gerar tipos a partir do schema real quando existir.
8. Registrar riscos em `docs/SUPABASE_PLAN.md`.

## Arquivos relacionados

- `src/lib/supabase/`
- `src/types/database.ts`
- `supabase/migrations/`
- `docs/SUPABASE_PLAN.md`
- `.env.example`

## Formato de saida esperado

Retorne plano Supabase, variaveis, separacao de chaves, RLS, riscos, testes de policies e proximos passos.
