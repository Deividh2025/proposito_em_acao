# AI Agents

## Principio

A IA do Proposito em Acao e uma rede de agentes internos especializados. Nenhum agente deve operar como chatbot generico ou chamar OpenAI direto do client.

## Catalogo

| Agente | Prompt | Schema principal | Revisa usuario? | Limite central |
|---|---|---|---|---|
| Copiloto de Jornada | `journey_copilot_prompt_v1` | N/A | Nao | Orienta proximo passo sem virar chatbot solto. |
| Chamado | `calling_prompt_v1` | `calling_output_v1` | Sim | Hipotese em discernimento, nunca vontade divina especifica. |
| Mapa da Vida | `life_map_prompt_v1` | `life_map_analysis_output_v1` | Sim | Leitura sem culpa ou diagnostico. |
| SMART-E | `smart_goal_prompt_v1` | `smart_goal_output_v1` | Sim | Alvos ecologicos e revisaveis. |
| Planejador | `planner_prompt_v1` | `project_plan_output_v1` | Sim | Nao sobrecarregar agenda. |
| Microtarefas | `planner_prompt_v1` | `task_breakdown_output_v1` | Sim | Quebrar tarefa grande em primeira microacao. |
| Inbox | `inbox_classifier_prompt_v1` | `inbox_classification_output_v1` | Sim | Captura e sensivel e nao confiavel. |
| Desbloqueador | `action_unblocker_prompt_v1` | `action_unblocker_output_v1` | Sim | Primeiro passo curto; crise sai do fluxo produtivo. |
| Metacognicao | `metacognition_prompt_v1` | `metacognition_output_v1` | Sim | Privada por padrao, sem terapia/diagnostico. |
| Habitos | `habits_prompt_v1` | `habit_plan_output_v1` | Sim | Retomada sem vergonha. |
| Revisao Semanal | `weekly_review_prompt_v1` | `weekly_review_output_v1` | Sim | Falhas viram aprendizado, nao humilhacao. |
| Atalaia | `accountability_prompt_v1` | `accountability_message_output_v1` | Sim | Previa por alvo, escopo e consentimento. |
| Guardrail/Revisor | `guardrail_reviewer_prompt_v1` | `guardrail_review_output_v1` | Nao | Bloqueia risco clinico, pastoral, privacidade e Atalaia. |

## Implementacao

- Catalogo: `src/ai/agents/catalog.ts`.
- Entrypoints por agente: `src/ai/agents/*/index.ts`.
- Prompts: `src/ai/prompts/*.md`.
- Schemas: `src/ai/schemas/*.ts`.
- Providers: `src/lib/openai/`.

## Limites

OpenAI real permanece server-side e nao e acionada por UI nesta etapa. O provider mock permite testar contratos sem enviar dados sensiveis a terceiros.
