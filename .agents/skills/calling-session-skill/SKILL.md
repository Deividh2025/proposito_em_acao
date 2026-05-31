---
name: calling-session-skill
description: Padronizar sessao de Chamado Pessoal, perguntas, sintese, hipotese provisoria e linguagem crista segura.
---

# Calling Session Skill

## Quando usar

Use ao criar, revisar ou alterar sessao de Chamado, perguntas progressivas, hipotese provisoria, prompt interno, schema de IA ou guardrails cristaos.

## Regras

1. Chamado e direcao em discernimento, nao sentenca imutavel.
2. A IA nunca deve afirmar vontade divina especifica.
3. Bloqueie diagnostico, promessa de cura, culpa espiritual, humilhacao e pressao emocional.
4. Use structured output quando a sintese virar dado persistido.
5. Usuario revisa e edita antes de aceitar.
6. Salve `CallingDraft` minimo, versao do schema, confianca, status de guardrail e nota pastoral segura.
7. Nao salve prompt/resposta bruta por padrao.
8. Chamado completo e privado por padrao e nao vai ao Atalaia.

## Arquivos relacionados

- `src/ai/schemas/calling.ts`
- `src/ai/guardrails/`
- `src/domain/calling/`
- `src/domain/onboarding/questions.ts`
- `docs/CALLING_MODULE.md`
- `docs/AI_GUARDRAILS.md`

## Saida esperada

Retorne perguntas, schema, mock/IA real, guardrails, privacidade, testes negativos e pendencias.
