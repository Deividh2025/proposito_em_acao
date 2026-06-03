# Database Schema

## Fonte

Schema implementado em:

- `supabase/migrations/202605310001_initial_schema.sql`
- `supabase/migrations/202605310004_onboarding_calling_metadata.sql`
- `supabase/migrations/202605310005_execution_prompt8_alignment.sql`
- `supabase/migrations/202605310006_calendar_inbox_prompt9_alignment.sql`
- `supabase/migrations/202605310007_action_unblocker_metacognition_prompt10_alignment.sql`
- `supabase/migrations/202605310008_focus_habits_scoreboard_prompt11_alignment.sql`
- `supabase/migrations/202605310009_weekly_review_garden_prompt12_alignment.sql`
- `supabase/migrations/202606010010_accountability_commitment_prompt13_alignment.sql`
- `supabase/migrations/202606010011_mobile_pwa_prompt14_alignment.sql`
- `supabase/migrations/20260602214345_accountability_partner_active_select_policy.sql`
- `supabase/migrations/20260603211654_accountability_acceptance_rls_hardening.sql`

## Estado atual verificado em 2026-06-03

- As migrations locais representam o contrato versionado da V1, mas SQL versionado nao equivale a ambiente remoto validado.
- O Supabase CLI esta disponivel localmente (`2.98.2`) e listou o projeto `proposito_em_acao` (`bceumcfmjftoukzrfthe`) em modo read-only.
- O checkout nao esta linkado ao projeto; `supabase migration list --linked` nao foi usado nesta auditoria.
- Branches Supabase lidas em 2026-06-03: `main` e `preview-release-readiness`.
- A evidencia de branch preview com migrations/RLS aprovadas e historica de 2026-06-02 e deve ser repetida antes de beta real.
- O projeto/base principal so deve ser usado pelo beta apos cutover validado e aprovado.
- `src/types/database.ts` continua generico; gerar tipos reais e revisar diffs antes de declarar schema remoto alinhado.

## Principios

- `auth.users` e a fonte de identidade.
- `profiles.id` referencia `auth.users.id`.
- Tabelas de usuario usam `user_id`.
- Tabelas filhas usam FKs compostas com `user_id` quando ha parent de usuario.
- Metacognicao, Chamado, revisoes, inbox e calendario sao privados por padrao.
- Atalaia usa tabelas proprias e grant por alvo.

## Tabelas criadas

- Perfil e consentimento: `profiles`, `user_preferences`, `consent_records`.
- Mapa da Vida: `life_areas`, `life_map_assessments`, `life_map_area_scores`.
- Chamado: `callings`, `calling_session_entries`.
- Execucao: `goals`, `projects`, `tasks`, `microtasks`, `calendar_blocks`, `inbox_items`.
- Foco: `focus_sessions`, `focus_distractions`.
- Habitos e placar: `habits`, `habit_logs`, `discipline_scoreboards`, `scoreboard_items`, `scoreboard_entries`.
- Autorregulacao: `metacognition_sessions`, `action_unblock_sessions`, `weekly_reviews`.
- Atalaia: `accountability_partners`, `accountability_grants`, `accountability_events`, `accountability_notifications`.
- Compromisso: `commitment_documents`, `commitment_levers`.
- Jardim: `garden_states`, `garden_events`.
- Auditoria minima: `audit_events`, `ai_run_audits`.

## Dados sensiveis

Campos como `raw_thought`, `fact`, `interpretation`, `feeling`, `impulse`, `answers`, `ai_summary`, `ecological_analysis`, `content`, `completion_note`, `metadata_minimal` e `preview_payload` devem ser tratados com minimizacao e sem log bruto.

## Prompt 6 - Chamado

`202605310004_onboarding_calling_metadata.sql` adiciona metadados para hipotese de Chamado:

- `schema_version`
- `confidence_level`
- `guardrail_status`
- `pastoral_safety_note`
- `accepted_at`
- `reviewed_at`
- `prompt_version`
- `position`

A migration esta versionada no repositorio, mas ainda precisa ser aplicada e testada em Supabase local/remoto.

## Prompt 8 - Execucao

`202605310005_execution_prompt8_alignment.sql` alinha o nucleo de execucao:

- status de `goals`, `projects` e `tasks` com os contratos TypeScript;
- `goals.ecological_analysis` como `jsonb`;
- `tasks.priority` e `tasks.reason`;
- `microtasks.estimated_minutes`;
- trigger privada para impedir tarefa com `project_id` e `goal_id` desalinhados entre dono e alvo.

A migration esta versionada, mas ainda precisa ser aplicada e testada em Supabase local/remoto antes de producao.

## Prompt 9 - Calendario e Inbox/GTD

`202605310006_calendar_inbox_prompt9_alignment.sql` alinha o centro operacional:

- `calendar_blocks.block_type` passa a aceitar `task`, `focus`, `habit_placeholder`, `recurring_work`, `rest`, `family`, `spirituality`, `health`, `learning`, `service`, `appointment` e `buffer`;
- `calendar_blocks` recebe `energy_level`, `recurrence_rule` e `recurrence_parent_id`;
- constraints impedem bloco com `end_at <= start_at` e bloqueiam `recurrence_rule` para tipos nao recorrentes;
- indices cobrem agenda por usuario/periodo, tarefa agendada e blocos recorrentes;
- `calendar_blocks` limita titulo e notas para reduzir retencao de conteudo sensivel;
- `inbox_items.content_type` passa a preparar `text`, `voice_note`, `image_placeholder`, `file` e `link`;
- `inbox_items` recebe `classification`, `recommended_action`, `confidence_level`, `summary`, `suggested_title`, `life_area`, `estimated_minutes`, `energy_level`, `due_date_suggestion`, `clarifying_question`, `safety_note`, `processing_note`, `processed_at`, `destination_type` e `destination_id`;
- `inbox_items` limita captura, resumo, nota de processamento e campos auxiliares de IA para reduzir retencao de conteudo sensivel;
- indices cobrem inbox nao processada e itens por classificacao.

As tabelas continuam owner-only por `user_id` nas policies existentes. A migration esta versionada, mas ainda precisa ser aplicada e testada em Supabase local/remoto.

## Prompt 10 - Desbloqueador e Metacognicao

`202605310007_action_unblocker_metacognition_prompt10_alignment.sql` alinha sessoes de autorregulacao:

- `action_unblock_sessions` recebe campos de entrada, energia, minutos disponiveis, obstaculo, tom, vinculos opcionais, plano estruturado, microtarefas, rota recomendada, crise, ajuda humana e status de foco iniciado.
- `metacognition_sessions` recebe categoria, intensidade, fato, interpretacao, sentimento, impulso, pensamento automatico, padroes cognitivos, desmonte logico, pergunta confrontadora, reformulacao, proxima acao, rota recomendada, ancora crista opcional, flags de seguranca e privacidade.
- Constraints reforcam tempo curto, valores permitidos, privacidade da Metacognicao e rota emergencial em crise.
- Indices cobrem historico por usuario, vinculos com tarefa/projeto/alvo/calendario e sessoes com flags de seguranca.

As policies owner-only ja existentes continuam sendo o modelo. A migration esta versionada, mas ainda precisa ser aplicada e testada em Supabase local/remoto.

## Prompt 11 - Foco, Habitos e Placar

`202605310008_focus_habits_scoreboard_prompt11_alignment.sql` alinha a camada diaria de constancia:

- `focus_sessions` recebe vinculo opcional com bloco de calendario e Desbloqueador, energia pos-foco, contador de pausas e limites de duracao.
- `focus_distractions` recebe tipo de distracao, flag de roteamento para Inbox e limite de texto.
- `habits` passa a guardar o contrato completo de `habit_plan_output_v1`: identidade, motivo, area, sugestao de agenda, obstaculo, plano se/entao, ambiente, retomada, risco e itens de Placar.
- `habit_logs` passa a aceitar `paused_consciously`.
- `discipline_scoreboards` recebe rastreamento de retomada, guia visual, notas de risco e revisao obrigatoria.
- `scoreboard_items` passa a aceitar `behavior` e `commitment`, alem de frequencia alvo e minimo de sucesso.
- `scoreboard_entries` recebe status textual e unique por usuario, item e data.

As tabelas continuam owner-only. Atalaia nao recebe acesso direto a foco, distracoes, habitos, logs ou Placar bruto.

## Prompt 12 - Revisao Semanal e Jardim

`202605310009_weekly_review_garden_prompt12_alignment.sql` alinha o ciclo semanal:

- `weekly_reviews` recebe `schema_version`, `status`, listas estruturadas de vitorias/travamentos, ajustes, alerta de sobrecarga, revisao obrigatoria e timestamps de revisao/conclusao.
- `garden_states` recebe `schema_version`, resumo semanal, origem opcional em `weekly_reviews`, derivacao, privacidade e constraint owner-only por FK composta.
- `garden_events` recebe origem opcional da revisao semanal, tipo de fonte, fonte, impacto, `metadata_minimal` e FK composta para impedir evento de revisao de outro usuario.
- RLS e `force row level security` sao reforcados em `weekly_reviews`, `garden_states` e `garden_events`.

As tabelas continuam privadas por padrao. Atalaia nao recebe policy direta para Revisao Semanal nem Jardim nesta etapa.

## Prompt 13 - Atalaia, compromisso e notificacoes

`202606010010_accountability_commitment_prompt13_alignment.sql` alinha responsabilidade externa saudavel:

- `accountability_partners` recebe hash de token de convite e expiracao.
- `accountability_grants` recebe nivel de acompanhamento, frequencia de notificacao, versao de consentimento, data de consentimento e permissoes de compartilhamento.
- `accountability_notifications` recebe status de provider, template, agendamento, motivo de bloqueio e `privacy_check`.
- `commitment_documents` recebe `structured_content`, permissoes, `privacy_check`, revisao, compartilhamento e versao de consentimento.
- `commitment_levers` recebe subtipo, status de seguranca e notas de revisao.
- Constraints bloqueiam chaves sensiveis em JSONs de notificacao/documento.

Atalaia continua sem policy direta em tabelas brutas de alvos, tarefas, habitos, Placar, Revisao Semanal, Jardim, Metacognicao, calendario, inbox ou distracoes. Compartilhamento ocorre somente por linhas de accountability/documento explicitamente revisadas.

## Prompt 14 - PWA/Mobile

`202606010011_mobile_pwa_prompt14_alignment.sql` cria `energy_checkins`:

- `user_id`, `energy_level`, `note`, `source`, `captured_at`, `client_created_at` e `client_mutation_id`.
- Constraints limitam energia a `low`, `medium`, `high`, origem a `mobile`, `focus`, `daily_checkin`, `manual` e nota a 500 caracteres.
- Indice por usuario/data e indice unico opcional por `client_mutation_id` reduzem duplicidade de double tap.

As demais acoes mobile reutilizam tabelas existentes: `inbox_items`, `habit_logs`, `scoreboard_entries`, `focus_sessions`, `focus_distractions`, `action_unblock_sessions` e `metacognition_sessions`.

Status remoto: aplicada em 2026-06-02 no projeto Supabase `proposito_em_acao` (`bceumcfmjftoukzrfthe`) como migration `mobile_pwa_prompt14_alignment`, versao `20260602134002`.

## Prompt 15 - RLS Atalaia

`20260602214345_accountability_partner_active_select_policy.sql` ajusta leitura de Atalaia ativo para grants aceitos.

## Etapa 2 - aceite seguro do Atalaia

`20260603211654_accountability_acceptance_rls_hardening.sql` endurece a transicao `invited -> active`:

- `accountability_grants` recebe `invite_token_hash` para vincular aceite a um grant especifico.
- Indice unico parcial impede reutilizacao de token hash ativo em multiplos grants.
- Constraint limita token hash a grants `invited`.
- Policies diretas `accountability_partners_invitee_accept_pending` e `accountability_grants_invitee_accept_pending` sao removidas.
- Triggers em `app_private` bloqueiam alteracao de `permissions`, `sharing_permissions`, `goal_id`, `accountability_partner_id`, `user_id`, `tracking_level`, `notification_frequency`, `consent_version`, `consent_recorded_at`, `expires_at` e campos equivalentes do parceiro durante aceite.
- `app_private.has_active_accountability_grant` e recriada com `search_path = pg_catalog, public`.

Rollback local antes de aplicar em preview: remover esta migration do branch. Rollback preview, se aplicada apenas em branch sem dados reais: descartar/recriar a branch preview e remover fixtures do harness.

## Tipos TypeScript

`src/types/database.ts` permanece como placeholder tipado ate que as migrations sejam aplicadas e os tipos reais sejam gerados:

```powershell
supabase gen types typescript --project-id bceumcfmjftoukzrfthe > src/types/database.ts
```
