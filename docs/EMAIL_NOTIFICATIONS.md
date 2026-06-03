# Email Notifications

## Estado atual verificado em 2026-06-03

- E-mail real ainda nao esta configurado.
- Resend foi decidido como provider transacional, com dominio verificado antes de envio real.
- Resend tambem sera usado como SMTP customizado do Supabase Auth.
- `.env.example` tem `EMAIL_PROVIDER` e `EMAIL_FROM`, mas ainda nao ha adapter real, `RESEND_API_KEY` documentada no exemplo ou dependencia de provedor.
- Notificacoes do Atalaia continuam em fallback `pending_provider_config` ate adapter, secrets, dominio/remetente, templates, consentimento e logs seguros serem aprovados.

## Regra

Sem provider configurado, nenhuma mensagem externa e enviada. O sistema cria template seguro, previa e status `pending_provider_config`.

## Eventos previstos

- Convite ao Atalaia.
- Aceite de convite.
- Marco concluido.
- Atraso relevante.
- Pedido de ajuda.
- Alvo concluido.
- Risco de abandono, se autorizado.

## Templates seguros

E-mails devem conter assunto neutro, resumo minimo autorizado e link seguro. Dados sensiveis nao entram no corpo:

- Metacognicao.
- Chamado completo.
- Saude.
- Familia.
- Financas.
- Emocoes.
- Revisoes privadas.
- Inbox bruto.
- Agenda completa.

## Fila e revogacao

Notificacoes pendentes devem ser canceladas quando o grant for revogado. `queued` so deve ser usado quando houver provider real, consentimento ativo e payload sanitizado.

## Pendencias

- Implementar adapter Resend server-only.
- Adicionar placeholders documentais de Resend sem secrets quando a implementacao for aprovada.
- Verificar dominio/remetente Resend.
- Configurar Resend como SMTP customizado do Supabase Auth.
- Definir secrets server-side.
- Testar cancelamento por revogacao.
- Validar RLS real com Supabase CLI/MCP.
