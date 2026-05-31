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
- `AtalaiaMessagePreview`
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
