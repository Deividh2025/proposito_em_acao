# Database Schema

## Fonte

Schema implementado em:

- `supabase/migrations/202605310001_initial_schema.sql`
- `supabase/migrations/202605310004_onboarding_calling_metadata.sql`
- `supabase/migrations/202605310005_execution_prompt8_alignment.sql`

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

## Tipos TypeScript

`src/types/database.ts` permanece como placeholder tipado ate que as migrations sejam aplicadas e os tipos reais sejam gerados:

```powershell
supabase gen types typescript --project-id bceumcfmjftoukzrfthe > src/types/database.ts
```
