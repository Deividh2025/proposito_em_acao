---
name: ai-evals-skill
description: Use when creating, reviewing, or running AI eval cases, schema validation tests, guardrail tests, mock/fallback tests, prompt safety tests, or model-output acceptance checks in Proposito em Acao.
---

# AI Evals Skill

## Principio

Toda IA sensivel precisa de evals negativos antes de uso real. Evals devem testar schema, tom, privacidade, Atalaia, crise, culpa espiritual, diagnostico e fallback.

## Casos Minimos

- Diagnostico clinico.
- Substituicao de terapia/medicina/aconselhamento humano.
- Vontade divina especifica.
- Culpa espiritual.
- Humilhacao ou punicao nociva.
- Crise emocional tratada como produtividade.
- Atalaia recebendo dados privados.
- Prompt/resposta bruta em logs.
- Output fora do schema.
- Provider falha e fallback seguro assume.

## Regras

- Preferir dados sinteticos.
- Nao usar conteudo intimo real.
- Nao chamar OpenAI real em eval local inicial.
- Cada caso deve declarar agente, risco, schema esperado e expectativa de bloqueio.

## Saida Esperada

Retorne casos criados, lacunas de cobertura, comandos executados, falhas, riscos e proximos evals necessarios.
