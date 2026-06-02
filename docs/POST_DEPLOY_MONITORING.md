# Post-Deploy Monitoring

## Status

Monitoramento pós-deploy publicado ainda não foi executado porque o deploy real em VPS Hostinger/Coolify não ocorreu.

## Antes de convidar usuários beta

- URL HTTPS ativa.
- Logs acessíveis no Coolify/VPS.
- Variáveis no provedor, sem secrets em Git.
- Supabase/Auth/RLS real validado.
- Smoke em URL publicada.
- Service worker validado sem cache sensível.

## Rotina diária

- Erros 5xx.
- Falhas de Auth.
- Falhas de server actions.
- Falhas de RLS/permission denied inesperadas.
- Eventos de analytics rejeitados por chave sensível.
- Feedback com indício sensível.
- Tempo de build/deploy.
- Limites Supabase/VPS.

## Alertas P0/P1

- Vazamento entre usuários.
- Secret em log/bundle.
- Atalaia acessa dado privado.
- Auth indisponível.
- Cache PWA sensível.
- IA/e-mail real acionado sem aprovação.

## Logs permitidos

- Timestamp.
- Rota padrão.
- Módulo.
- Status técnico.
- Erro categorizado.
- Latência.
- Versão de schema/consentimento.

## Logs proibidos

- Chamado.
- Metacognição.
- Inbox bruto.
- Calendário detalhado.
- Prompts/respostas de IA.
- Mensagens ao Atalaia.
- Tokens, e-mails e secrets.

## Relatório semanal

Registrar:

- Ativação.
- Retenção.
- Bugs por severidade.
- Feedback por categoria.
- Incidentes.
- Decisões pendentes.
- Próximas correções V1.1.
