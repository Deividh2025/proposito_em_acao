---
name: email-notifications-skill
description: Padronizar notificacoes e e-mails seguros, neutros e server-side no Proposito em Acao.
---

# Email Notifications Skill

## Quando usar

Use ao criar, revisar ou alterar convites, notificacoes, templates, filas, providers, webhooks ou e-mails do Atalaia.

## Instrucoes praticas

1. Sem `EMAIL_PROVIDER` e `EMAIL_FROM`, status deve ser `pending_provider_config` e nenhum e-mail real e enviado.
2. Provider real deve ser server-side; secrets nunca entram no client, docs ou logs.
3. Assunto e corpo devem ser neutros e sem dados sensiveis.
4. Conteudo detalhado deve ficar atras de link autenticado, expiravel e auditavel.
5. Previa e consentimento sao obrigatorios antes de qualquer envio externo.
6. Revogacao cancela notificacoes pendentes.
7. Logs guardam metadados minimos: template, status, grant, alvo e erro tecnico redigido.

## Arquivos relacionados

- `src/lib/email/`
- `src/app/accountability/actions.ts`
- `docs/EMAIL_NOTIFICATIONS.md`
- `docs/ENVIRONMENT_VARIABLES.md`
- `.env.example`

## Saida esperada

Retorne template, status de envio, provider, dados excluidos, auditoria, revogacao e riscos pendentes.
