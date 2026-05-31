---
name: ai-guardrails-skill
description: Use when designing, implementing, or reviewing AI behavior, prompts, schemas, agents, Metacognition/Metacognicao, Chamado/Calling, Desbloqueador de Acao/Action Unblocker, Revisao Semanal/Weekly Review, or Atalaia messages in Proposito em Acao.
---

# AI Guardrails Skill

## Quando usar

Use em toda funcionalidade ou documentacao que defina comportamento de IA.

## Quando nao usar

Nao use para chatbot generico nem para respostas que nao alteram comportamento de IA.

## Instrucoes praticas

1. Identifique qual agente interno de IA e afetado.
2. Exija output estruturado quando a resposta virar dado.
3. Valide schema no servidor quando a stack existir.
4. Bloqueie diagnostico, substituicao terapeutica, culpa espiritual, afirmacao de vontade divina especifica, humilhacao e vazamento ao Atalaia.
5. Para Metacognicao, separar fato, interpretacao, sentimento e impulso.
6. Para Atalaia, revisar previa, consentimento e escopo antes de qualquer mensagem.

## Orquestracao com outras skills

- Mudanca com dados sensiveis, Atalaia, logs ou consentimento: use tambem `security-privacy-skill`.
- Mudanca que altera escopo de produto: use tambem `prd-product-skill`.
- Mudanca que exige atualizar docs: use tambem `docs-sync-skill`.

## Arquivos relacionados

- `AGENTS.md`
- `docs/SECURITY_NOTES.md`
- futuro caminho de specs de prompts: `docs/ai/prompts/`
- futuro caminho de schemas de IA: `docs/ai/schemas/`
- futura documentacao de arquitetura de IA: `docs/ai/ARCHITECTURE.md`

## Formato de saida esperado

Retorne agente afetado, arquivos lidos, schema esperado, guardrails aplicados, riscos bloqueados, casos de teste negativos, verificacoes executadas e pendencias.
