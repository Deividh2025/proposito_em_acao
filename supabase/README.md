# Supabase

Fundacao Supabase do Proposito em Acao.

## Estado atual

- Projeto remoto informado pelo fundador: `bceumcfmjftoukzrfthe`.
- Migrations versionadas existem em `supabase/migrations/`.
- RLS foi definido para tabelas expostas do schema `public`.
- Storage privado foi preparado para buckets futuros.
- Nesta inspecao de 2026-06-03, `supabase --version` esta disponivel (`2.98.2`) e `supabase projects list` listou `proposito_em_acao` em modo read-only.
- O checkout nao esta linkado ao projeto e nao deve executar comandos mutaveis sem etapa propria, variaveis operacionais e aprovacao.
- Branches lidas em modo read-only: `main` e `preview-release-readiness`.
- O cutover seguro para branch preview esta documentado em `docs/SUPABASE_PREVIEW_CUTOVER.md`.
- Etapa 2 criou a migration local `20260603211654_accountability_acceptance_rls_hardening.sql`; ela ainda nao foi aplicada em preview remoto.
- Etapa 7 preparou contratos de privacidade para `product_analytics_events`, `beta_feedback_items`, `account_deletion_requests`, preferencias e consentimentos ampliados; aplicacao/typegen/RLS preview ainda exigem evidencia fresca antes de beta real.

## Migrations

Ordem de aplicacao:

1. `202605310001_initial_schema.sql`
2. `202605310002_rls_policies.sql`
3. `202605310003_private_storage.sql`
4. `202605310004_onboarding_calling_metadata.sql`
5. `202605310005_execution_prompt8_alignment.sql`
6. `202605310006_calendar_inbox_prompt9_alignment.sql`
7. `202605310007_action_unblocker_metacognition_prompt10_alignment.sql`
8. `202605310008_focus_habits_scoreboard_prompt11_alignment.sql`
9. `202605310009_weekly_review_garden_prompt12_alignment.sql`
10. `202606010010_accountability_commitment_prompt13_alignment.sql`
11. `202606010011_mobile_pwa_prompt14_alignment.sql`
12. `20260602214345_accountability_partner_active_select_policy.sql`
13. `20260603211654_accountability_acceptance_rls_hardening.sql`

As migrations da Etapa 7 devem ser adicionadas/aplicadas somente no escopo aprovado da etapa de banco/RLS e validadas em branch preview antes de qualquer uso com usuarios reais.

## Aplicacao manual

Quando o Supabase CLI estiver instalado e autenticado, siga primeiro `docs/SUPABASE_PREVIEW_CUTOVER.md`.

Comandos base do pack:

```powershell
npx.cmd -y supabase --version
npx.cmd -y supabase db push --dry-run --db-url "$env:SUPABASE_PREVIEW_DB_URL"
npx.cmd -y supabase db push --db-url "$env:SUPABASE_PREVIEW_DB_URL"
npm.cmd run supabase:types:preview
npm.cmd run supabase:validate:preview
```

Evite SQL Editor para cutover completo, salvo fallback aprovado. Se for inevitavel, aplicar as migrations na ordem acima, registrar evidencia de cada arquivo e depois executar `supabase/tests/README.md` e o harness `npm.cmd run supabase:validate:preview`.

Nao aplicar a migration de hardening do Atalaia no Supabase principal nesta etapa. O caminho aprovado e dry-run, push e harness somente em branch preview/ambiente explicitamente autorizado.

## Regras

- Nunca commitar `.env`, service role, DB password ou access token.
- `SUPABASE_SERVICE_ROLE_KEY` e server-only.
- Atalaia nao recebe acesso direto a tabelas sensiveis.
- Atalaia convidado nao executa update direto para aceitar convite; aceite/revogacao ficam em action server-side auditavel.
- Metacognicao permanece privada por padrao.
- Storage e privado por padrao.
- Analytics/feedback first-party exigem consentimento ativo, owner-only, allowlist/minimizacao e retencao de 90 dias.
- Exportacao/exclusao devem rodar server-side, sem expor service role, secrets, tokens, hashes ou dados de terceiros.
