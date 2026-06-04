# AI Evals Report - Prompt 15

Data: 2026-06-04.

## Estado atual verificado na Etapa 5

- Evals locais validam schemas/guardrails de contrato e providers mockados, nao chamadas reais.
- `safeInvoke` registra `guardrail_status` como `passed`, `blocked` ou `failed`; `not_run` foi removido do contrato atual.
- DeepSeek possui adapter server-only e teste mockado; nenhuma chamada real foi executada.
- O seletor `automatic`/`openai`/`deepseek` e a checagem de consentimento por provider foram implementados em camada server-side.
- Ativacao real de OpenAI/DeepSeek continua bloqueada ate secrets server-side, consentimento persistido, evals reais aprovados, custos/rate limits, logs seguros e kill switch explicitamente ligado.

## Escopo

Revisao da camada central de IA, guardrails, schemas estruturados, evals locais e pontos onde output vira dado persistido.

## Resultado

- Testes locais de IA passaram no suite geral.
- Evals e unit tests cobrem guardrails clinicos, pastorais, crise, Metacognicao e Atalaia.
- Evals e unit tests cobrem roteamento de provider, kill switch, consentimento ausente/revogado, falha sem fallback cruzado, timeout abortavel, schema invalido, redaction recursiva, minimizacao de input de provider, limite diario local e output de Atalaia sem vazamento.
- Structured outputs seguem validados por Zod antes de virar dado.
- Prompts permanecem versionados por agente, sem prompt gigante unico.
- Verificacao final da Etapa 5: `npm.cmd run test` passou com 32 arquivos/190 testes e `npm.cmd run test:e2e` passou com 33 testes.

## Correcoes aplicadas

- Criado `src/ai/guardrails/owner-persistence.ts`.
- `persistActionUnblockerResultAction` e `persistMetacognitionResultAction` agora revisam structured output recebido do cliente antes de salvar.
- Adicionado teste que bloqueia output malicioso com vontade divina especifica/culpa espiritual em persistencia de Metacognicao.
- Etapa 5 adicionou `src/lib/ai/`, `src/lib/deepseek/`, roteamento `automatic|openai|deepseek`, consentimento versionado por provider, `invocation_mode` e auditoria sem prompt/resposta bruta.
- Etapa 5 adicionou evals declarativos de runtime/consentimento/guardrails IO e testes unitarios de OpenAI/DeepSeek mockados.
- Auditoria transversal do PR #7 adicionou testes para limite diario antes da chamada externa, sanitizacao de chaves sensiveis no input do provider, abort de timeout por `AbortSignal` e bloqueio de output de Atalaia com Metacognicao privada.

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
| OpenAI real | Preparado server-side, bloqueado por default |
| DeepSeek real | Adapter server-only mockado/testado, bloqueado por default |
| Roteamento por preferencia | OK local |
| Consentimento por provider | Checado localmente antes da rota real |

## Pendencias

- Ampliar fixtures positivas por agente antes de ativar OpenAI real.
- Persistir consentimento real por provider e auditoria minima quando etapa de banco/LGPD aprovar.
- Persistir contador diario por usuario para `AI_DAILY_USER_LIMIT` antes de ativar IA real.
- Executar evals contra modelos reais em ambiente isolado com custo autorizado antes de beta.
- Aprovar base de conhecimento real e politica de versionamento.
