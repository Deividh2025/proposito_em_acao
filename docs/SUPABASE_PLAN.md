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

1. Instalar/autenticar Supabase CLI ou MCP.
2. Aplicar migrations em ambiente controlado.
3. Rodar advisors/lints e testes RLS por persona.
4. Gerar tipos reais.
5. Configurar redirects de Auth no dashboard.
6. Revisar backups antes de producao.
