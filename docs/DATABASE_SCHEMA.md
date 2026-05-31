# Database Schema

## Fonte

Schema implementado em `supabase/migrations/202605310001_initial_schema.sql`.

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

## Tipos TypeScript

`src/types/database.ts` permanece como placeholder tipado ate que as migrations sejam aplicadas e os tipos reais sejam gerados:

```powershell
supabase gen types typescript --project-id bceumcfmjftoukzrfthe > src/types/database.ts
```
