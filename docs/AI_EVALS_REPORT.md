# AI Evals Report - Prompt 15

Data: 2026-06-02.

## Estado atual verificado em 2026-06-03

- Evals locais validam schemas/guardrails de contrato, nao providers reais.
- `safeInvoke` ainda registra `guardrail_status: "not_run"` no path generico de provider.
- DeepSeek foi decidido como provider planejado, mas ainda nao existe adapter/uso no codigo.
- O seletor `automatic`/`openai`/`deepseek`, consentimento por provider e retencao de 90 dias de auditoria de IA ainda precisam de implementacao.
- Ativacao real de OpenAI/DeepSeek continua bloqueada ate guardrails executados, evals ampliados, custos/rate limits, secrets server-side, logs seguros e fallback local/manual.

## Escopo

Revisao da camada central de IA, guardrails, schemas estruturados, evals locais e pontos onde output vira dado persistido.

## Resultado

- Testes locais de IA passaram no suite geral.
- Evals e unit tests cobrem guardrails clinicos, pastorais, crise, Metacognicao e Atalaia.
- Structured outputs seguem validados por Zod antes de virar dado.
- Prompts permanecem versionados por agente, sem prompt gigante unico.

## Correcoes aplicadas

- Criado `src/ai/guardrails/owner-persistence.ts`.
- `persistActionUnblockerResultAction` e `persistMetacognitionResultAction` agora revisam structured output recebido do cliente antes de salvar.
- Adicionado teste que bloqueia output malicioso com vontade divina especifica/culpa espiritual em persistencia de Metacognicao.

## Checklist IA

| Item | Status |
|---|---|
| Agentes internos separados | OK |
| Structured outputs validados | OK |
| Fallback quando IA falha | OK em mocks/fallbacks locais |
| Nao diagnosticar/terapia/pastoral humano | Guardrails e evals OK |
| Nao afirmar vontade divina/culpa espiritual | Guardrails e teste de persistencia OK |
| Metacognicao separa fato/interpretacao/sentimento/impulso | OK |
| Desbloqueador retorna microacao | OK |
| Atalaia passa por privacy check | OK local; validar fluxo real antes de envio externo |
| OpenAI real | Preparado server-side, nao acionado por UI |

## Pendencias

- `safeInvoke` ainda registra `guardrail_status` como `not_run` quando o fluxo nao chama guardrail composto explicitamente.
- Ampliar fixtures positivas por agente antes de ativar OpenAI real.
- Implementar seletor `automatic`/`openai`/`deepseek` e roteamento do modo `automatic` entre OpenAI, DeepSeek Flash e DeepSeek Pro, com limites de custo/latencia.
- Aprovar base de conhecimento real e politica de versionamento.
