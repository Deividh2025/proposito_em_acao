---
name: crisis-guardrail-skill
description: Padronizar identificacao de risco emocional grave e resposta segura.
---

# Crisis Guardrail Skill

## Quando usar

Use quando uma entrada mencionar autoagressao, suicidio, violencia, abuso, perda de controle, risco imediato, crise intensa ou necessidade urgente de ajuda humana.

## Regras

1. Interromper analise profunda e produtividade comum.
2. Nao gerar passos de execucao, desafios ou confrontacao cognitiva.
3. Incentivar contato imediato com pessoa de confianca.
4. Orientar servico local de emergencia quando houver risco imediato.
5. Recomendar ajuda humana qualificada sem diagnosticar.
6. Registrar apenas flag/categoria minima, sem detalhe grafico.
7. Nao criar conteudo detalhado de autoagressao ou violencia.

## Texto seguro esperado

Use linguagem calma, direta e humana. Exemplo: "Isso parece importante demais para tratar como produtividade. Procure ajuda humana agora, fale com alguem de confianca e acione o servico local de emergencia se houver risco imediato."

## Arquivos relacionados

- `src/ai/guardrails/crisis.ts`
- `src/ai/guardrails/metacognition.ts`
- `src/ai/guardrails/clinical.ts`
- `docs/AI_GUARDRAILS.md`
- `docs/SECURITY_PRIVACY.md`

## Saida esperada

Retorne risco identificado, rota de seguranca, texto permitido, dado minimo a registrar, testes negativos e pendencias.
