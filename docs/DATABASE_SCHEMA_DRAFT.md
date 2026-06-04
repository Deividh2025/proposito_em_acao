# Database Schema Draft

## Escopo

Este documento preserva o rascunho conceitual. O schema SQL inicial agora esta em `docs/DATABASE_SCHEMA.md` e `supabase/migrations/202605310001_initial_schema.sql`.

## Convencoes preliminares

- Tabelas em snake_case.
- `id` UUID.
- `user_id` em todas as tabelas com dados do usuario, inclusive filhas, para RLS simples.
- `created_at`, `updated_at` onde fizer sentido.
- RLS obrigatoria em tabelas expostas.
- Soft delete apenas se houver necessidade de auditoria/recuperacao.

## Tabelas candidatas

| Tabela | Proposito | Chaves principais |
|---|---|---|
| user_profiles | Perfil estendido | user_id |
| life_areas | Areas da vida do usuario | user_id |
| life_map_assessments | Historico do Mapa | user_id |
| callings | Chamado/hipoteses | user_id |
| goals | Alvos SMART-E | user_id, calling_id, life_area_id |
| projects | Projetos | user_id, goal_id |
| tasks | Tarefas | user_id, project_id, goal_id |
| microtasks | Microtarefas | user_id, task_id |
| calendar_blocks | Agenda | user_id, task_id, habit_id |
| inbox_items | Capturas | user_id |
| focus_sessions | Sessoes de foco | user_id, task_id |
| habits | Habitos | user_id, goal_id |
| habit_logs | Marcacoes de habito | user_id, habit_id |
| discipline_scoreboards | Placares | user_id |
| scoreboard_entries | Entradas do Placar | user_id, scoreboard_id |
| metacognition_sessions | Reflexoes privadas | user_id, related ids |
| action_unblock_sessions | Desbloqueios | user_id, task_id |
| weekly_reviews | Revisoes semanais | user_id |
| accountability_partners | Atalaias | user_id |
| accountability_grants | Permissoes por alvo | user_id, partner_id, goal_id |
| commitment_documents | Compromissos | user_id, goal_id |
| garden_states | Estado visual derivado | user_id |
| consent_records | Consentimentos | user_id |
| ai_run_audits | Auditoria tecnica minima de IA | user_id, schema_name |

## Campos criticos

### accountability_grants

- `permissions`: escopos permitidos.
- `goal_id`: obrigatorio.
- `revoked_at`: revogacao efetiva.
- `accepted_at`: aceite do Atalaia, se houver fluxo autenticado.

### metacognition_sessions

- `raw_thought`: altamente sensivel.
- `privacy_level`: private por padrao.
- `crisis_flag`: futuro indicador para encaminhamento adequado.
- `share_summary`: somente se usuario gerar resumo manual.

### consent_records

- `consent_type`
- `version`
- `scope`
- `subject_type`
- `subject_id`
- `accepted_at`
- `revoked_at`

### ai_run_audits

Salvar metadados, nao prompts brutos:

- `schema_name`
- `schema_version`
- `agent_name`
- `provider`
- `model`
- `invocation_mode`
- `status`
- `guardrail_status`
- `latency_ms`
- `error_code`
- `fallback_reason`
- `consent_version`
- `created_at`/timestamp

## RLS planejada/aplicavel

Politicas minimas por tabela:

- Dono: `user_id = auth.uid()`.
- Outro usuario: negar.
- Anonimo: negar dados privados.
- Atalaia autorizado: permitir apenas leitura limitada via `accountability_grants` ativo.
- Atalaia revogado: negar.

## Views e funcoes

- Views expostas devem usar `security_invoker = true` quando disponivel.
- Funcoes `security definer` devem ficar fora de schemas expostos.
- Funcoes privilegiadas devem receber parametros explicitamente validados.

## Indices preliminares

- `user_id`.
- `goal_id`.
- `project_id`.
- `task_id`.
- `habit_id`.
- `week_start`.
- `status`.
- `revoked_at`.
- Pares de unicidade onde houver risco de duplicidade, como `user_id + slug` em `life_areas`.

## Fora deste draft

- Ajustes finais apos aplicar migrations e gerar tipos reais.
- Evolucoes de schema depois dos testes RLS.
