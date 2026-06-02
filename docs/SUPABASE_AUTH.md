# Supabase Auth

## Fluxo V1

Auth inicial por email/senha, com confirmacao de email. OAuth fica para etapa futura.

## Rotas futuras

- `/auth/sign-up`
- `/auth/sign-in`
- `/auth/callback`
- `/auth/forgot-password`
- `/auth/update-password`
- `/auth/sign-out`
- `/onboarding`
- `/dashboard`

## Profile

`profiles.id` referencia `auth.users.id`. A migration cria trigger `on_auth_user_created` para garantir perfil minimo apos signup.

Consentimentos ficam em `consent_records`, nao embutidos em `profiles`.

## Sessao SSR

O app usa `@supabase/ssr`:

- `src/lib/supabase/client.ts`: browser client com publishable/anon key.
- `src/lib/supabase/server.ts`: server client com cookies.
- `src/lib/supabase/admin.ts`: admin client server-only.

`src/lib/supabase/index.ts` nao reexporta o admin client.

## Redirects manuais no dashboard

Configurar no Supabase:

- Local: `http://localhost:3000/**`.
- Preview Vercel: `https://*-<team-or-account-slug>.vercel.app/**` ou URL exata do preview aprovado.
- Hostinger/alternativa: URL exata do preview aprovado.
- Producao: URL exata do dominio final aprovado, preferencialmente sem wildcard.

O `NEXT_PUBLIC_APP_URL` do ambiente deve corresponder ao Site URL/redirect permitido. Confirmacao de e-mail, login, logout e expiracao de sessao devem ser validados por smoke test publicado antes de beta.

## Regras

- Nao usar `user_metadata` para autorizacao.
- Nao expor `SUPABASE_SERVICE_ROLE_KEY`.
- Usar tabelas server-managed para roles, grants e consentimentos.
- Em acoes sensiveis, validar usuario no servidor.
