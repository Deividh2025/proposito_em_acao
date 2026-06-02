# Email Notifications

## Status Prompt 13

Infraestrutura de e-mail real ainda nao esta configurada. `.env.example` tem `EMAIL_PROVIDER` e `EMAIL_FROM`, mas nao ha adapter real nem dependencia de provedor.

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

- Escolher provedor.
- Implementar adapter server-only.
- Definir secrets server-side.
- Testar cancelamento por revogacao.
- Validar RLS real com Supabase CLI/MCP.
