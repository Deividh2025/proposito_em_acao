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

- `http://localhost:3000/auth/callback`
- URL de preview quando existir.
- URL de producao quando existir.

## Regras

- Nao usar `user_metadata` para autorizacao.
- Nao expor `SUPABASE_SERVICE_ROLE_KEY`.
- Usar tabelas server-managed para roles, grants e consentimentos.
- Em acoes sensiveis, validar usuario no servidor.
