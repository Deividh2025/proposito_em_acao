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
