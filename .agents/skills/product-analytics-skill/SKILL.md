---
name: product-analytics-skill
description: Padronizar eventos, metricas, consentimento, privacidade e analise de produto para beta fechado do Proposito em Acao.
---

# Product Analytics Skill

## Quando usar

Use ao criar, revisar ou instrumentar metricas, eventos de produto, funis de ativacao/retencao, observabilidade de beta ou analytics.

## Instrucoes praticas

1. Exigir consentimento especifico para analytics antes de coleta real.
2. Usar allowlist de eventos e metadados minimos.
3. Nunca registrar conteudo de Chamado, Metacognicao, Inbox, calendario, fe, saude, familia, financas, emocoes, prompts, respostas de IA, tokens ou mensagens ao Atalaia.
4. Medir acoes significativas, nao pageviews com contexto sensivel.
5. Separar auditoria tecnica de analytics de produto; finalidades e retencao sao diferentes.
6. Registrar eventos bloqueados por falta de consentimento ou chave sensivel.

## Arquivos relacionados

- `docs/PRODUCT_METRICS.md`
- `docs/ANALYTICS_EVENTS.md`
- `docs/PRIVACY_SAFE_ANALYTICS.md`
- `src/domain/analytics/`
- `docs/SECURITY_PRIVACY.md`
- `docs/DATA_SENSITIVITY_MATRIX.md`

## Saida esperada

Retorne eventos, metricas, propriedades permitidas/proibidas, riscos de privacidade, consentimento, retencao e plano de implementacao seguro.
