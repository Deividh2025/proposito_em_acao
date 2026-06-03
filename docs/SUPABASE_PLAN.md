# Supabase Plan

## Uso previsto

Supabase e o backend principal planejado:

- Supabase Auth para usuarios.
- Postgres para dados de produto.
- RLS para isolamento por usuario, alvo, grant e consentimento.
- Storage privado para anexos, se a V1 realmente precisar.
- Edge Functions ou rotas server-side para integracoes sensiveis.

## Estado Prompt 4

- Projeto remoto informado: `https://bceumcfmjftoukzrfthe.supabase.co`.
- Project ref: `bceumcfmjftoukzrfthe`.
- Chaves reais nao devem ser versionadas; `.env.local` pode ser preenchido localmente quando a etapa exigir teste autenticado.
- Migrations criadas em `supabase/migrations/`.
- RLS/policies preparadas em SQL.
- Storage privado preparado.
- Aplicacao remota pendente por falta de credenciais administrativas/CLI neste workspace.
- Tipos reais pendentes ate executar `supabase gen types`.

## Auth

- Usar Supabase Auth com email/senha e confirmacao de email como fluxo inicial.
- `profiles.id` referencia `auth.users.id`.
- Trigger `app_private.handle_new_user()` cria perfil minimo.
- Evitar autorizacao baseada em metadata editavel pelo usuario.
- Preferir `app_metadata` ou tabelas server-managed para roles/permissoes.
- Definir politica de sessao e revogacao para acoes sensiveis.

## RLS

- Toda tabela em schema exposto deve ter RLS.
- Politicas devem refletir modelo real, nao apenas `auth.uid()` generico.
- Atalaia deve usar grants por alvo, com permissao granular e revogacao.
- Metacognicao, Chamado completo, saude, familia, financas, emocoes e revisoes privadas ficam excluidos por padrao do Atalaia.

## Postgres

As entidades conceituais iniciais vem do PRD original:

- User/UserProfile.
- LifeArea/LifeMapAssessment.
- Calling.
- Goal/Project/Task/Microtask/CalendarBlock.
- InboxItem.
- FocusSession.
- Habit/HabitLog.
- DisciplineScoreboard/ScoreboardEntry.
- MetacognitionSession/ActionUnblockSession.
- WeeklyReview.
- AccountabilityPartner/AccountabilityGrant.
- CommitmentDocument.
- GardenState.
- ConsentRecord.

## Storage

- Privado por padrao.
- Buckets publicos exigem justificativa.
- Uploads sensiveis devem ter politicas claras, expiracao quando aplicavel e auditoria.

## Edge Functions

Considerar para:

- Webhooks.
- Email transacional.
- Tarefas agendadas.
- Fluxos com service role que nao devem viver no browser.

## Migrations

- `202605310001_initial_schema.sql`
- `202605310002_rls_policies.sql`
- `202605310003_private_storage.sql`
- `202605310004_onboarding_calling_metadata.sql`
- `202605310005_execution_prompt8_alignment.sql`
- `202605310006_calendar_inbox_prompt9_alignment.sql`
- `202605310007_action_unblocker_metacognition_prompt10_alignment.sql`
- `202605310008_focus_habits_scoreboard_prompt11_alignment.sql`
- `202605310009_weekly_review_garden_prompt12_alignment.sql`
- `202606010010_accountability_commitment_prompt13_alignment.sql`
- `202606010011_mobile_pwa_prompt14_alignment.sql`
- `20260602214345_accountability_partner_active_select_policy.sql`

## Status remoto Prompt 16

Consulta em 2026-06-02:

- Projeto `bceumcfmjftoukzrfthe` (`proposito_em_acao`) ativo e saudavel em `sa-east-1`.
- Migrations remotas listadas: apenas `20260602134002 mobile_pwa_prompt14_alignment`.
- Tabelas publicas remotas visiveis: `energy_checkins`.

Conclusao: o Supabase remoto ainda nao esta alinhado com todas as migrations locais da V1. Producao aberta fica bloqueada ate aplicar/alinha-las em branch/preview e rodar RLS dinamica.

## Tipos

- `src/types/database.ts` contem placeholder preparatorio.
- Tipos reais devem ser gerados a partir do Supabase apos aplicar as migrations.

## Variaveis necessarias

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_PROJECT_ID`

`.env.example` deve continuar apenas com placeholders. Valores reais pertencem a `.env.local`, secrets do provedor de deploy ou cofre operacional.

## Proximos passos

1. Instalar/autenticar Supabase CLI ou usar conector operacional aprovado.
2. Seguir `docs/SUPABASE_PREVIEW_CUTOVER.md`.
3. Aplicar migrations em branch/preview isolada, com backup quando houver dados reais.
4. Rodar advisors/lints e testes RLS por persona.
5. Gerar tipos reais via `npm.cmd run supabase:types:preview`.
6. Rodar harness dinamico via `npm.cmd run supabase:validate:preview`.
7. Configurar redirects de Auth no dashboard.
8. Revisar backups antes de producao.
9. Registrar resultado em `docs/SMOKE_TEST_REPORT.md` e `docs/RLS_TEST_REPORT.md`.
