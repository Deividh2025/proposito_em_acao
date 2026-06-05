# Integration Tests

Este diretorio ja cobre contratos de integracao local/mocado para server actions, Supabase clients, runtime fail-closed, Auth SSR, Atalaia seguro e webhook Resend.

Escopo atual:

- Validar que actions retornam `ok:false` em erro real fora de `local-demo`.
- Validar que ausencia de sessao em `preview`/`beta`/`production` nao vira fallback positivo.
- Validar escritas sensiveis de Atalaia, notificacoes e webhooks sem usar provider real.

Limites:

- Estes testes nao substituem Supabase preview com personas reais.
- Estes testes nao validam Auth publicado, SMTP Auth real, RLS dinamico remoto, smoke HTTPS, e-mail real ou IA real.
