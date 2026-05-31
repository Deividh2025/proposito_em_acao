---
name: ai-agent-architecture-skill
description: Use when creating, reviewing, or changing internal AI agents, agent catalogs, agent responsibilities, agent inputs/outputs, prompt/schema links, guardrail routing, or AI orchestration boundaries in Proposito em Acao.
---

# AI Agent Architecture Skill

## Principio

IA e camada operacional integrada, nao chatbot solto. Cada agente deve ter responsabilidade unica, contexto minimo, schema de saida quando virar dado e guardrails explicitos.

## Checklist

1. Identifique o fluxo e o modulo do PRD.
2. Defina `agentKey`, nome, responsabilidade, entrada permitida e entrada proibida.
3. Vincule prompt versionado, schema de output, guardrails e evals.
4. Marque se escreve dados e se exige revisao humana.
5. Bloqueie acoplamento direto entre UI/client e provider OpenAI.
6. Registre logs apenas com metadados: agente, schema, prompt, status, latencia e erro categorizado.

## Limites

- Nao criar agente generico para tudo.
- Nao mandar Chamado completo, Metacognicao, saude, familia, financas ou emocoes fora do escopo minimo.
- Nao permitir Atalaia sem alvo, escopo, previa e consentimento.
- Nao ativar OpenAI real em client/browser/mobile.

## Saida Esperada

Retorne agentes afetados, responsabilidades, schema, prompt version, guardrails, contexto permitido/proibido, riscos e testes/evals necessarios.
