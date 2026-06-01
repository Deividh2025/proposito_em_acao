# AI Schemas

## Principio

Tudo que virar dado do produto deve usar structured output, validacao local com Zod e revisao humana quando afetar agenda, alvos, tarefas, Chamado, Metacognicao ou Atalaia.

## Schemas do Prompt 7

| Schema | Arquivo | Uso |
|---|---|---|
| `calling_output_v1` | `src/ai/schemas/calling-output.ts` | Hipotese de Chamado revisavel. |
| `life_map_analysis_output_v1` | `src/ai/schemas/life-map.ts` | Leitura do Mapa da Vida. |
| `smart_goal_output_v1` | `src/ai/schemas/smart-goal.ts` | Alvo SMART-E. |
| `project_plan_output_v1` | `src/ai/schemas/project-plan.ts` | Plano de projeto. |
| `task_breakdown_output_v1` | `src/ai/schemas/task-breakdown.ts` | Microtarefas e primeira acao. |
| `inbox_classification_output_v1` | `src/ai/schemas/inbox-classification.ts` | Destino de captura. |
| `schedule_overload_output_v1` | `src/ai/schemas/schedule-overload.ts` | Alerta simples de sobrecarga da agenda. |
| `action_unblocker_output_v1` | `src/ai/schemas/action-unblocker.ts` | Primeiro passo e rota. |
| `metacognition_output_v1` | `src/ai/schemas/metacognition.ts` | Sessao privada de Metacognicao. |
| `habit_plan_output_v1` | `src/ai/schemas/habit-plan.ts` | Plano de habito. |
| `weekly_review_output_v1` | `src/ai/schemas/weekly-review.ts` | Sintese semanal. |
| `accountability_message_output_v1` | `src/ai/schemas/accountability-message.ts` | Previa ao Atalaia. |
| `guardrail_review_output_v1` | `src/ai/schemas/guardrail-review.ts` | Revisao de seguranca. |
| `ai_run_audit_v1` | `src/ai/schemas/base.ts` | Metadados tecnicos sem prompt/resposta bruta. |

## Regras

- `schema_version` e obrigatorio.
- Campos sensiveis nao devem ir para logs.
- Atalaia nunca recebe Metacognicao, Chamado completo, saude, familia, financas, emocoes ou revisoes privadas por padrao.
- Para compatibilidade futura com Structured Outputs, evitar schema raiz com union e tratar opcionais com cuidado.

## Prompt 8 - Execucao

- `smart_goal_output_v1` exige `title`, `status`, `life_area`, campos SMART-E, `ecological_analysis`, `calling_alignment`, `first_action`, `suggested_projects`, `confidence_level`, `assumptions`, `overload_warning` e `user_review_required`.
- `project_plan_output_v1` exige `goal_id`, lista de `projects`, cada projeto com tarefas e microtarefas sugeridas, `restart_plan`, `overload_warning` e `user_review_required`.
- `task_breakdown_output_v1` exige `task_title`, `reason`, `estimated_minutes`, `energy_level`, microtarefas ordenadas, `first_micro_action`, `if_stuck_suggestion`, `fallback_minimum_version` e `user_review_required`.

Esses schemas sao validados por Zod antes de qualquer persistencia e continuam mockados ate autorizacao/configuracao de OpenAI real.

## Prompt 9 - Calendario, Inbox e Sobrecarga

- `inbox_classification_output_v1` agora exige classificacao entre `task`, `project`, `calendar_event`, `habit`, `reference`, `future_idea`, `concern`, `discard` e `needs_clarification`.
- O schema tambem exige `confidence`, `suggested_title`, `summary`, `recommended_action`, `life_area`, `estimated_minutes`, `energy_level`, `due_date_suggestion`, `clarifying_question`, `safety_note` e `user_review_required`.
- `schedule_overload_output_v1` registra `overload_level`, `message`, `reasons`, `recommended_adjustments` e `user_review_required`.
- A classificacao de inbox usa mock deterministico seguro por enquanto; OpenAI real nao e acionada por UI.
- Alertas de sobrecarga usam regra local simples, linguagem de cuidado e revisao humana.

## Prompt 10 - Desbloqueador e Metacognicao

- `action_unblocker_output_v1` agora exige primeiro passo curto, versao minima aceitavel, microtarefas, foco recomendado, recompensa saudavel, frase de reorientacao, plano de retomada, sugestao de Metacognicao e nota de seguranca.
- O schema valida que crise exige `next_route = human_help` e recomendacao de ajuda humana.
- `metacognition_output_v1` agora usa campos singulares de fato, interpretacao, sentimento e impulso, alem de pensamento automatico, padroes cognitivos, desmonte logico, pergunta confrontadora, reformulacao, proxima acao, rota recomendada, ancora crista opcional e flags de seguranca.
- O schema valida que rota `emergency_support` exige flags de seguranca e que sessoes seguem privadas por padrao.
- Ambos continuam com `user_review_required = true` e mock seguro na UI; OpenAI real permanece preparada apenas server-side.

## Prompt 11 - Foco, Habitos e Placar

- `habit_plan_output_v1` foi ampliado para identidade, motivo, area da vida, gatilho, versao minima, ideal, sugestao de agenda, recompensa, obstaculo, plano se/entao, ambiente, frequencia, metrica, itens de Placar, plano de retomada, risco de sobrecarga, ajustes e revisao humana.
- `scoreboard_plan_output_v1` foi criado para sugerir Placar privado, revisavel e leve, com itens de habito, tarefa, foco, retomada, comportamento, compromisso ou manual.
- Placar futuro para Atalaia nao usa dado bruto; exigira resumo limitado, consentimento e previa.
