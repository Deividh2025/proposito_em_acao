# AI Evals

## Principio

Evals de IA existem para impedir regressao de seguranca antes de ativar fluxos reais.

## Implementacao inicial

- Casos: `src/ai/evals/*.cases.ts`.
- Smoke test: `src/ai/evals/schema-validation.test.ts`.
- Teste unitario central: `src/tests/unit/ai-central-layer.test.ts`.

## Casos cobertos

- Diagnostico clinico.
- Substituicao de ajuda humana.
- Vontade divina especifica.
- Culpa espiritual.
- Compartilhamento privado com Atalaia.
- Crise emocional grave.
- Desbloqueador com primeiro passo curto.
- Desbloqueador sugerindo Metacognicao para bloqueio cognitivo/emocional.
- Metacognicao separando fato, interpretacao, sentimento e impulso.
- Metacognicao confrontando sem humilhar.
- Metacognicao sem culpa espiritual e sem vontade divina especifica.
- Schema valido/invalido.
- Mock provider e fallback seguro.
- Logs sem prompt bruto ou resposta bruta.
- OpenAI mockado e DeepSeek mockado sem chamada real.
- Roteamento `automatic`, `openai` e `deepseek`.
- Kill switch `AI_REAL_ENABLED=false` bloqueando provider real.
- Consentimento ausente, revogado e de outro provider bloqueando rota real.
- Falha/timeout de provider usando fallback local sem fallback cruzado entre OpenAI e DeepSeek.
- Redaction recursiva case-insensitive de metadados sensiveis.
- Guardrail de entrada antes do provider e guardrail de saida depois do schema.

## Prompt 10

- `src/ai/evals/action-unblocker.cases.ts` cobre microacao, retomada e sugestao de Metacognicao.
- `src/ai/evals/metacognition.cases.ts` cobre separacao cognitiva, privacidade e linguagem pastoral segura.
- `src/ai/evals/crisis-guardrail.cases.ts` cobre crise, autoagressao, violencia e necessidade de ajuda humana.
- `src/ai/evals/schema-validation.test.ts` valida registro, guardrails e schemas principais.

## Pendencias

Antes de producao, ampliar evals com exemplos reais aprovados, red teaming de prompt injection, casos por agente e execucao contra modelo real em ambiente controlado.

## Etapa 5

- `src/ai/evals/provider-runtime.cases.ts` registra cenarios positivos e negativos de roteamento por provider.
- `src/ai/evals/consent.cases.ts` registra consentimento ausente, revogado e restrito ao provider correto.
- `src/ai/evals/guardrail-io.cases.ts` registra bloqueios antes do provider e depois da validacao de schema.
- `src/tests/unit/ai-provider-routing.test.ts` executa contratos de roteamento, consentimento, guardrails, timeout, redaction, schema invalido e DeepSeek mockado.
