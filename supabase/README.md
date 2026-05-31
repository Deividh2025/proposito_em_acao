# Supabase

Fundacao Supabase do Proposito em Acao.

## Estado atual

- Projeto remoto informado pelo fundador, mas nao aplicado por este agente porque nao ha access token, service role ou senha de banco disponivel neste workspace.
- Migrations versionadas foram criadas em `supabase/migrations/`.
- RLS foi definido para tabelas expostas do schema `public`.
- Storage privado foi preparado para buckets futuros.
- `supabase` CLI nao esta instalada neste ambiente local.

## Migrations

Ordem de aplicacao:

1. `202605310001_initial_schema.sql`
2. `202605310002_rls_policies.sql`
3. `202605310003_private_storage.sql`
4. `202605310004_onboarding_calling_metadata.sql`
5. `202605310005_execution_prompt8_alignment.sql`

## Aplicacao manual

Quando o Supabase CLI estiver instalado e autenticado:

```powershell
supabase --version
supabase link --project-ref bceumcfmjftoukzrfthe
supabase db push
supabase gen types typescript --project-id bceumcfmjftoukzrfthe > src/types/database.ts
```

Quando usar SQL Editor no dashboard, aplicar as migrations na ordem acima e depois executar os cenarios de `supabase/tests/README.md`.

## Regras

- Nunca commitar `.env`, service role, DB password ou access token.
- `SUPABASE_SERVICE_ROLE_KEY` e server-only.
- Atalaia nao recebe acesso direto a tabelas sensiveis.
- Metacognicao permanece privada por padrao.
- Storage e privado por padrao.
