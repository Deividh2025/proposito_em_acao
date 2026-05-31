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
- Schema valido/invalido.
- Mock provider e fallback seguro.
- Logs sem prompt bruto ou resposta bruta.

## Pendencias

Antes de producao, ampliar evals com exemplos reais aprovados, red teaming de prompt injection, casos por agente e execucao contra modelo real em ambiente controlado.
