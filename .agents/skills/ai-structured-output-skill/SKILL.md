---
name: ai-structured-output-skill
description: Use when deciding whether AI flows in Proposito em Acao require structured outputs, schema validation, guardrail review, or persisted AI-generated data.
---

# AI Structured Output Skill

## Quando usar

Use em qualquer fluxo de IA cuja saida vire dado persistido, altere agenda, alvos, projetos, tarefas, habitos, Placar, Revisao, Metacognicao, mensagem ao Atalaia, consentimento, alerta ou decisao operacional.

## Quando nao usar

Nao use para respostas puramente explicativas que nao viram dado, nao acionam efeito no produto e nao precisam ser comparadas ou auditadas. Mesmo nesses casos, aplique guardrails de seguranca quando houver conteudo sensivel.

## Instrucoes praticas

1. Exija schema quando a resposta for salva, enviada, comparada, revisada, compartilhada ou usada para acao.
2. O usuario deve revisar mudancas em agenda, alvos, tarefas, habitos e mensagens ao Atalaia.
3. Valide schemas no servidor quando a stack existir.
4. Inclua campos de confianca, avisos, fonte de contexto minima e fallback manual quando fizer sentido.
5. Nunca salve prompt/resposta bruta por padrao; salve resultado estruturado, metadados minimos e versao do schema.
6. Em Atalaia, gere primeiro uma previa estruturada e bloqueie envio se consentimento, escopo ou guardrail falhar.
7. Em Metacognicao, diferencie reflexao privada de dado compartilhavel.

## Arquivos relacionados

- `docs/AI_ARCHITECTURE.md`
- `docs/AI_GUARDRAILS.md`
- `docs/METACOGNITION_MODULE.md`
- `docs/TESTING_STRATEGY.md`
- `docs/SECURITY_PRIVACY.md`

## Formato de saida esperado

Retorne fluxo de IA, necessidade de schema, nome sugerido do schema, campos conceituais, validacoes, revisao humana, logs permitidos, fallback e testes/evals necessarios.
