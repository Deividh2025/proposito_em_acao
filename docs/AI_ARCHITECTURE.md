# AI Architecture

## Papel da IA

A IA e uma camada operacional integrada. Ela conduz sessoes, transforma entradas vagas em estrutura, sugere proximas acoes, revisa riscos, ajuda a retomar e usa structured outputs quando a resposta vira dado.

Nao e chatbot solto e nao deve operar fora dos limites de privacidade, consentimento e guardrails.

## Agentes internos

| Agente | Responsabilidade | Saida estruturada principal |
|---|---|---|
| Copiloto de Jornada | Orientar o usuario pela plataforma e manter coerencia da experiencia | `JourneyStepSuggestion` |
| Agente do Chamado | Conduzir descoberta e refinamento do Chamado | `CallingDraft` |
| Agente do Mapa da Vida | Interpretar notas, areas fortes/fracas e desequilibrios | `LifeMapReading` |
| Agente SMART-E | Converter desejo vago em alvo ecologico | `SmartEGoal` |
| Agente Planejador | Converter alvo em projeto, tarefas, microtarefas e blocos | `ProjectPlan`, `TaskBreakdown` |
| Agente Classificador de Inbox | Classificar captura e sugerir destino | `InboxClassification` |
| Agente Revisor de Agenda | Detectar sobrecarga e sugerir ajustes cuidadosos | `ScheduleOverload` |
| Agente Desbloqueador | Gerar proximo passo imediato | `ActionUnblockPlan` |
| Agente de Metacognicao | Examinar pensamento/sentimento e devolver acao responsavel | `MetacognitionSession` |
| Agente de Habitos | Criar habito minimo/ideal com gatilho e recompensa | `HabitPlan` |
| Agente Revisor Semanal | Sintetizar semana e propor ajustes | `WeeklyReviewSummary` |
| Agente Atalaia | Gerar mensagens limitadas e consentidas | `AtalaiaMessagePreview` |
| Agente Guardrail/Revisor | Revisar schema, tom, risco e privacidade | `GuardrailReview` |

## Fluxos que usam IA

- Perfil progressivo e preferencias.
- Mapa da Vida.
- Chamado.
- Alvos SMART-E.
- Projetos e decomposicao de tarefas.
- Classificacao de inbox.
- Desbloqueador.
- Metacognicao.
- Habitos.
- Placar.
- Revisao semanal.
- Jardim da Vida.
- Atalaia.
- Alertas de sobrecarga.

## Fluxos que exigem structured outputs

Exigem schema quando a resposta for salva, enviada, comparada, auditada, usada para acao ou compartilhada:

- `CallingDraft`
- `LifeMapReading`
- `SmartEGoal`
- `ProjectPlan`
- `TaskBreakdown`
- `InboxClassification`
- `ActionUnblockPlan`
- `MetacognitionSession`
- `HabitPlan`
- `ScoreboardPlan`
- `WeeklyReviewSummary`
- `GardenState`
- `AtalaiaMessagePreview`
- `CommitmentDocument`
- `OverloadAlert`
- `GuardrailReview`
- `AiRunAudit`

## Base de conhecimento

Base futura deve conter materiais proprios e revisados sobre:

- Chamado, proposito, servico e dons.
- Mordomia do tempo, dominio proprio, descanso e familia.
- TDAH-first e autorregulacao.
- Neurociencia aplicada a atencao e execucao.
- Habitos, foco e planejamento semanal.
- TCC aplicada a pensamentos automaticos.
- Metacognicao e perguntas socraticas.
- Linguagem pastoral segura.

## Logs e privacidade

- Chamadas reais a modelo devem ocorrer no backend quando a stack existir.
- Enviar o minimo necessario ao modelo.
- Nao armazenar prompt/resposta bruta por padrao.
- Registrar metadados tecnicos: schema, versao, latencia, status, erro categorizado e guardrail aplicado.
- Conteudo de Metacognicao e Chamado completo permanece privado por padrao.

## Prompt 6 - Chamado

O Prompt 6 materializa `calling_draft_v1` em `src/ai/schemas/calling.ts`.

- A saida e hipotese provisoria e exige revisao humana.
- O mock deterministico substitui IA real enquanto OpenAI nao estiver autorizada/configurada.
- Guardrails bloqueiam vontade divina especifica, certeza absoluta, diagnostico e culpa espiritual.
- Persistencia registra schema, confianca, status de guardrail e nota pastoral segura.

## Prompt 7 - Camada central de IA

O Prompt 7 cria a fundacao tecnica para agentes internos, structured outputs, prompts versionados, guardrails e providers real/mock.

- Catalogo de agentes: `src/ai/agents/catalog.ts`.
- Entrypoints por agente: `src/ai/agents/*/index.ts`.
- Schemas Zod: `src/ai/schemas/*.ts`.
- Prompts versionados: `src/ai/prompts/*.md`.
- Guardrails deterministas iniciais: `src/ai/guardrails/*.ts`.
- Providers e safe invoke: `src/lib/openai/`.
- Evals iniciais: `src/ai/evals/` e `src/tests/unit/ai-central-layer.test.ts`.
- Base de conhecimento placeholder: `knowledge/`.

Fluxo previsto:

1. UI ou server action chama uma camada server-side.
2. A camada resolve agente, prompt, schema e contexto minimo.
3. Provider mock ou OpenAI server-side gera saida.
4. Saida e validada com Zod.
5. Guardrails revisam risco clinico, pastoral, privacidade, Atalaia e crise.
6. Persistencia futura salva apenas dado estruturado e metadados minimos.

OpenAI real nao foi ativada em fluxo de produto nesta etapa.

## Prompt 8 - SMART-E e Planejador

O Prompt 8 integra os contratos de IA ao nucleo de execucao:

- `smart_goal_output_v1`: transforma desejo vago em alvo SMART-E com ecologia, alinhamento com Chamado, primeira acao e revisao humana.
- `project_plan_output_v1`: sugere projetos vinculados a `goal_id`, fases, marcos, riscos, recursos, tarefas iniciais e plano de retomada.
- `task_breakdown_output_v1`: quebra tarefa grande em microtarefas ordenadas, primeira microacao e sugestao caso trave.

A UI usa mocks deterministos em `src/domain/goals`, `src/domain/projects` e `src/domain/tasks`. OpenAI real permanece server-side e nao e acionada por fluxo de produto. Nenhum prompt/resposta bruta deve ser salvo; apenas dados estruturados revisados e metadados minimos.

## Prompt 9 - Inbox e Agenda

O Prompt 9 adiciona dois fluxos operacionais:

- `inbox_classification_output_v1`: classifica capturas em tarefa, projeto, evento, habito futuro, referencia, ideia futura, preocupacao, descarte ou necessidade de clareza.
- `schedule_overload_output_v1`: revisa a semana/dia e emite alerta simples de sobrecarga sem culpa.

Ambos usam mock/regra local segura nesta etapa. OpenAI real continua preparada apenas server-side e nao e chamada por rotas de produto. Capturas brutas, preocupacoes, calendario e links nao devem ir para logs; a persistencia salva dados estruturados e revisaveis.

## Prompt 10 - Desbloqueador e Metacognicao

O Prompt 10 ativa os dois agentes de destravamento com mocks seguros:

- Agente Desbloqueador: transforma uma tarefa travada em primeiro passo, versao minima, microtarefas, foco recomendado e plano de retomada.
- Agente de Metacognicao: separa fato, interpretacao, sentimento e impulso; identifica pensamento automatico; aponta padroes cognitivos provaveis; confronta sem humilhar; reformula e devolve rota responsavel.

Fluxo tecnico:

1. Client component coleta entrada minima.
2. Server action valida entrada com Zod.
3. Mock seguro gera structured output.
4. Guardrails deterministas bloqueiam crise, diagnostico, culpa espiritual e vontade divina especifica.
5. Server action tenta persistir dado estruturado em Supabase com `user_id = auth.uid()`.
6. Sem Auth/Supabase, retorna fallback `local-draft` explicito.

OpenAI real continua fora da UI nesta etapa. Quando ativada, deve ser chamada somente server-side, com contexto minimo e sem logs de prompts/respostas brutas.

## Prompt 11 - Habitos e Placar

- Agente de Habitos usa `habit_plan_output_v1` ampliado para plano realista, versao minima, ambiente e retomada.
- Agente do Placar da Disciplina usa `scoreboard_plan_output_v1` para sugerir itens leves, privados e revisaveis.
- Ambos usam mock deterministico nesta etapa; OpenAI real nao e acionada pela UI.
- Guardrails bloqueiam diagnostico, culpa espiritual, vergonha, ranking punitivo, streak como identidade e qualquer compartilhamento bruto com Atalaia.
- Logs devem manter apenas metadados tecnicos, nunca distracoes, notas intimas, prompt bruto ou resposta bruta.

## Prompt 12 - Revisao Semanal e Jardim da Vida

- Agente Revisor Semanal usa `weekly_review_output_v1` para sintetizar semana, vitorias, travamentos, padroes, sobrecarga, areas negligenciadas, retomadas, foco da proxima semana e primeira acao.
- O fluxo usa mock deterministico seguro na UI; OpenAI real permanece server-side e desativada para produto.
- Contexto permitido deve ser minimizado: respostas da revisao, progresso agregado de alvos/projetos/tarefas, resumo de habitos/foco/Placar, sobrecarga e retomadas.
- Contexto proibido: Metacognicao bruta, distracoes completas, calendario sensivel, prompt/resposta bruta, dados de Atalaia e Chamado completo.
- Jardim da Vida usa `garden_state_output_v1` como snapshot derivado da revisao/eventos, sem agente OpenAI separado nesta etapa.
- Persistencia deve salvar dados estruturados e metadados minimos; logs continuam proibidos de conter conteudo sensivel.

## Prompt 13 - Atalaia e Compromisso

- Agente Atalaia usa `accountability_message_output_v1` com `message_type`, `shared_fields`, `privacy_check`, tom e chamada para acao.
- Documento de Compromisso usa `commitment_document_output_v1` como contrato estruturado revisavel.
- UI usa mock/contrato local; OpenAI real permanece server-side e desativada para produto.
- Contexto permitido: alvo autorizado, prazo, status, progresso, marcos, pedido de ajuda, mensagem personalizada revisada, resumo limitado do Placar e Documento de Compromisso.
- Contexto proibido: Chamado completo, Metacognicao, saude, familia, financas, emocoes, Revisao Semanal privada, inbox bruto, calendario completo, distracoes e logs brutos.
- Fallback de e-mail nao envia nada sem provider configurado.

## Evals futuros

- Aderencia a schema.
- Guardrails clinicos, pastorais e LGPD.
- Qualidade de proxima acao.
- Confronto sem humilhacao.
- Nao vazamento ao Atalaia.
- Fallback manual.
- Deteccao de crise.
- Resistencia a prompt injection.

## Fallbacks quando IA falhar

- Mostrar erro claro e nao culpabilizante.
- Salvar rascunho local/servidor quando aplicavel.
- Oferecer criacao manual.
- Permitir tentar novamente com menos contexto.
- Bloquear envio ao Atalaia se schema/consentimento/guardrail falhar.

## Limites clinicos, pastorais e juridicos

- Clinico: sem diagnostico, terapia substitutiva ou promessa de cura.
- Pastoral: sem afirmar vontade divina especifica, sem culpa espiritual e sem moralismo.
- Juridico/LGPD: minimizacao, consentimento, retencao definida, direitos do titular e operadores documentados antes de producao.
