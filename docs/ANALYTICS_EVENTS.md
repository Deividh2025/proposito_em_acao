# Analytics Events - Prompt 17

## Estado atual verificado em 2026-06-03

- Analytics real ainda nao esta ativo.
- Decisao atual: analytics first-party no Supabase, opt-in desligado por padrao.
- Retencao de raw events: 90 dias.
- Eventos devem ser bloqueados quando consentimento estiver ausente ou revogado.
- Nenhum evento pode conter texto do usuario, prompt/resposta de IA, dados de Chamado, Metacognicao, Atalaia, inbox bruto, calendario detalhado ou dados sensiveis.

## Estado

Contrato preparado em `src/domain/analytics/`. Nenhum provider externo foi ativado.

Analytics de produto só deve ser persistido após consentimento, LGPD mínima, retenção definida e ambiente preview/produtivo seguro.

## Contrato comum

Campos permitidos:

- `event_name`
- `schema_version`
- `occurred_at`
- `module`
- `source`
- `surface`
- `device`
- `route` como padrão sem IDs sensíveis
- `status`
- `step`
- `score`
- `count`
- `durationSeconds`
- `durationMinutes`
- `alignedToCalling` booleano
- `consentVersion`

## Eventos de ativação

- `user_signed_up`
- `profile_completed`
- `life_map_completed`
- `calling_started`
- `calling_completed`
- `first_goal_created`
- `first_project_created`
- `first_task_created`
- `first_task_scheduled`
- `first_action_unblocker_used`
- `first_metacognition_completed`
- `first_focus_started`
- `first_habit_created`
- `first_scoreboard_marked`
- `first_weekly_review_completed`

## Eventos de retenção

- `next_day_returned`
- `weekly_returned`
- `weekly_review_completed`
- `recurring_calendar_used`
- `recurring_action_unblocker_used`
- `recurring_metacognition_used`
- `focus_completed`
- `habit_logged`
- `scoreboard_marked`
- `restart_logged`

## Eventos operacionais de produto

- `goal_created`
- `project_created`
- `task_created`
- `task_scheduled`
- `task_completed`
- `inbox_item_captured`
- `inbox_item_processed`
- `action_unblocker_used`
- `metacognition_started`
- `metacognition_completed`
- `focus_started`
- `habit_created`
- `garden_viewed`
- `accountability_invite_created`
- `mobile_capture_used`

## Proibido

- Texto livre.
- Títulos.
- Notas.
- Conteúdo de Chamado.
- Conteúdo de Metacognição.
- Inbox bruto.
- Calendário detalhado.
- Dados de saúde, família, finanças, fé ou emoções.
- Prompts/respostas de IA.
- Tokens, e-mails, URLs completas e IDs de convite.

## Próximo passo técnico

Quando aprovado, criar camada server-side first-party com allowlist, consentimento, RLS ou schema não exposto, rollups agregados e retenção curta. Não usar ferramenta externa antes de revisar LGPD/subprocessador.
