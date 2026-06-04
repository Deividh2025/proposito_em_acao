# Email Notifications

## Estado atual verificado em 2026-06-04

- Adapter Resend server-only foi implementado com `fetch`, sem SDK novo.
- E-mail real continua bloqueado por padrao por `EMAIL_REAL_ENABLED=false`, `EMAIL_DOMAIN_VERIFIED=false`, ausencia de `RESEND_API_KEY` real e dominio/remetente ainda nao verificado.
- Resend continua planejado como SMTP customizado do Supabase Auth, mas a configuracao no dashboard permanece manual e pendente de dominio.
- `.env.example` contem apenas placeholders para `EMAIL_PROVIDER=resend`, remetentes planejados, `RESEND_API_KEY`, `RESEND_WEBHOOK_SECRET` e `RESEND_TEST_RECIPIENT`.
- Notificacoes do Atalaia persistem auditoria/notificacao antes de tentar provider e atualizam status honesto depois da tentativa.

## Regra

Sem provider configurado, dominio verificado, API key server-side e `EMAIL_REAL_ENABLED=true`, nenhuma mensagem externa e enviada. O sistema cria template seguro, previa e status `pending_provider_config` ou `blocked`.

O provider real so pode enviar quando todos os gates abaixo estiverem verdadeiros:

- `EMAIL_PROVIDER=resend`.
- `EMAIL_REAL_ENABLED=true`.
- `EMAIL_DOMAIN_VERIFIED=true`.
- `EMAIL_FROM_NOTIFICATIONS` usa remetente aprovado em `notify.<dominio>`.
- `RESEND_API_KEY` existe apenas em secret server-side.
- Usuario revisou a previa e a action server-side persistiu consentimento, evento, grant e notificacao.

`local-demo` usa mock/pending config e nunca envia.

## Eventos previstos

- Convite ao Atalaia.
- Aceite de convite.
- Marco concluido.
- Atraso relevante.
- Pedido de ajuda.
- Alvo concluido.
- Risco de abandono, se autorizado.

## Templates seguros

E-mails devem conter assunto neutro, texto minimo e link seguro/autenticado/expiravel. Dados sensiveis nao entram no assunto ou corpo:

- Metacognicao.
- Chamado completo.
- Saude.
- Familia.
- Financas.
- Emocoes.
- Revisoes privadas.
- Inbox bruto.
- Agenda completa.

Templates locais minimos:

- Convite de acompanhamento.
- Convite aceito.
- Acesso revogado.
- Pedido de apoio autorizado.
- Atualizacao de acompanhamento.
- Progresso registrado.
- Documento de compromisso compartilhado, quando o fluxo seguro ja existir.

O e-mail nao inclui titulo do alvo, tarefa, calendario, Metacognicao, Chamado, financas, familia, saude, emocoes, inbox bruto, revisoes privadas ou corpo completo da mensagem ao Atalaia.

## Fila e revogacao

Notificacoes pendentes devem ser canceladas quando o grant for revogado. `queued` so deve ser usado quando houver provider real, consentimento ativo e payload sanitizado.

Fluxo de criacao do convite:

1. Validar entrada, previa e escopo.
2. Persistir consentimento, parceiro, grant fechado, evento e notificacao `draft/pending_provider_config`.
3. Persistir token hash e ativar convite/grant como `invited`.
4. Tentar provider.
5. Atualizar `provider_status`, `status`, `blocked_reason` e `sent_payload_redacted` sem armazenar corpo bruto, e-mail de destino ou token.

Falha de provider nao desfaz automaticamente o grant ja persistido, mas tambem nao marca notificacao como enviada.

## Webhook Resend

Rota preparada:

- `POST /api/email/resend/webhook`.

Regras:

- Le o corpo cru com `request.text()` antes de validar assinatura.
- Valida headers Svix (`svix-id`, `svix-timestamp`, `svix-signature`) com `RESEND_WEBHOOK_SECRET`.
- Rejeita assinatura invalida e payload invalido.
- Atualiza apenas metadados redigidos em `accountability_notifications`.
- Mapeia `delivered` para `sent`, `bounced`/`complained`/`delivery_failed` para `blocked` com `blocked_reason`, e `cancelled` para `cancelled`.
- Nao armazena payload bruto do webhook.

## Pendencias

- Comprar/configurar dominio real.
- Verificar dominio/remetente Resend.
- Configurar Resend como SMTP customizado do Supabase Auth.
- Definir secrets server-side.
- Enviar teste real somente para `RESEND_TEST_RECIPIENT` apos aprovacao explicita.
- Confirmar delivered/bounced via webhook ou painel Resend.
- Validar RLS real com Supabase CLI/MCP.
