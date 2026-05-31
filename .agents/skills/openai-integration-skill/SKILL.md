---
name: openai-integration-skill
description: Use when preparing or reviewing OpenAI API integration, internal agents, schemas, structured outputs, prompts, guardrails, evals, privacy, or knowledge base in Proposito em Acao.
---

# OpenAI Integration Skill

## Quando usar

Use em qualquer mudanca envolvendo OpenAI API, agentes internos, prompts, structured outputs, schemas, guardrails, evals, base de conhecimento ou logs de IA.

## Quando nao usar

Nao use para fazer chamada real, criar prompt final ou salvar dados sensiveis sem autorizacao e revisao de guardrails.

## Instrucoes praticas

1. Chamar modelos apenas server-side.
2. Usar schemas estruturados quando a saida virar dado.
3. Validar no servidor antes de persistir.
4. Nao armazenar prompts/respostas brutas por padrao.
5. Enviar o minimo necessario ao modelo.
6. Bloquear diagnostico, culpa espiritual, humilhacao e vazamento ao Atalaia.
7. Criar evals negativos antes de agentes sensiveis.
8. Atualizar `docs/OPENAI_INTEGRATION_PLAN.md` em mudancas relevantes.

## Arquivos relacionados

- `src/lib/openai/`
- `src/ai/agents/`
- `src/ai/schemas/`
- `src/ai/prompts/`
- `src/ai/guardrails/`
- `src/ai/evals/`
- `docs/OPENAI_INTEGRATION_PLAN.md`

## Formato de saida esperado

Retorne agente, schema, guardrails, privacidade, logs permitidos, evals, riscos e comandos/verificacoes.
