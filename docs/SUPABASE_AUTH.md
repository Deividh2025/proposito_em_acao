# Supabase Auth

## Estado atual verificado em 2026-06-04

- `/auth` existe como superficie basica para email/senha.
- Fundacao local de Auth SSR foi implementada: `proxy.ts`, `src/lib/supabase/proxy.ts`, refresh/claims via `auth.getClaims()`, rotas de callback/confirmacao/recuperacao, `next` seguro, rotas protegidas e `/api/ready`.
- Auth real nao foi validado em URL HTTPS publicada com redirects reais, SMTP real e cookies de ambiente final.
- Resend foi decidido como SMTP customizado do Supabase Auth. A Etapa 6 preparou adapter transacional e documentacao, mas o dashboard Supabase ainda nao foi configurado porque falta dominio/remetente verificado.
- `src/types/database.ts` permanece generico ate typegen real em preview aprovado.
- Esse estado bloqueia beta real.

## Fluxo V1

Auth inicial por email/senha, com confirmacao de email. OAuth fica para etapa futura.

## Rotas Auth implementadas localmente

- `/auth`
- `/auth/callback`
- `/auth/confirm`
- `/auth/error`
- `/auth/forgot-password`
- `/auth/update-password`

## Profile

`profiles.id` referencia `auth.users.id`. A migration cria trigger `on_auth_user_created` para garantir perfil minimo apos signup.

Consentimentos ficam em `consent_records`, nao embutidos em `profiles`.

## Sessao SSR

O app usa `@supabase/ssr`:

- `src/lib/supabase/client.ts`: browser client com publishable/anon key.
- `src/lib/supabase/server.ts`: server client com cookies.
- `src/lib/supabase/admin.ts`: admin client server-only.

`src/lib/supabase/index.ts` nao reexporta o admin client.

Contrato local implementado para SSR Auth:

- `proxy.ts` chama `src/lib/supabase/proxy.ts`, que cria client por request, le cookies da request, escreve cookies na response e aplica headers retornados pelo `@supabase/ssr`.
- Usar `auth.getClaims()` ou mecanismo equivalente de validacao local de JWT quando o ambiente estiver configurado para validar claims sem depender de metadata editavel pelo usuario; em acoes sensiveis, confirmar usuario no servidor com chamada apropriada antes de gravar ou compartilhar dados.
- Tratar sessao ausente, token expirado, cookie invalido, erro de refresh e falha de Supabase como `ok:false`, redirect seguro ou bloqueio de fluxo em `preview`, `beta` e `production`.
- Permitir fallback positivo `local-draft` apenas em `APP_RUNTIME_MODE=local-demo` quando a ausencia de configuracao/sessao for esperada e explicitamente comunicada ao usuario.
- Nao confiar em `user_metadata` para roles, Atalaia, consentimentos, grants ou autorizacao sensivel.
- Nao ler, registrar ou expor access token, refresh token, invite token, recovery token, magic link ou querystring sensivel em logs, analytics, feedback, PWA cache ou URLs de terceiros.

Rotas/handlers locais:

- Callback de confirmacao/login/recovery com allowlist de destinos internos.
- Recuperacao e update de senha com token consumido apenas no servidor/SSR seguro.
- Logout que limpa cookies de sessao e nao deixa estado autenticado em cache.
- Redirecionamento pos-login para destino relativo aprovado, nunca URL arbitraria recebida do cliente.

Pendencia externa antes de beta real: validar esses fluxos em URL HTTPS publicada com Site URL/Redirect URLs configurados no Supabase, SMTP/Resend definido ou explicitamente desativado no beta, cookies reais e smoke externo fresco.

## Redirects seguros

Regras obrigatorias:

- `next`/`redirectTo` deve aceitar apenas path relativo interno ou item de allowlist por ambiente.
- Nao usar wildcard amplo em producao; preferir URL exata do dominio aprovado.
- Preview deve usar URL HTTPS exata publicada pelo provedor aprovado; localhost so vale para desenvolvimento local.
- Querystrings com tokens de confirmacao, recovery, convite ou callback nao devem ser propagadas para analytics, feedback, logs ou links externos.
- PWA/service worker nao deve interceptar nem cachear rotas `/auth`, callbacks, recovery, API auth, server actions ou respostas autenticadas.

## Redirects manuais no dashboard

Configurar no Supabase:

- Local: `http://localhost:3000/**`.
- Preview Hostinger/Coolify: URL exata HTTPS do preview aprovado.
- Vercel/alternativa de contingencia: `https://*-<team-or-account-slug>.vercel.app/**` ou URL exata do preview aprovado, somente se essa alternativa for aprovada.
- Producao: URL exata do dominio final aprovado, preferencialmente sem wildcard.

O `NEXT_PUBLIC_APP_URL` do ambiente deve corresponder ao Site URL/redirect permitido. Confirmacao de e-mail, login, logout e expiracao de sessao devem ser validados por smoke test publicado antes de beta.

## SMTP Auth via Resend

Configuracao manual pendente ate existir dominio aprovado:

1. Comprar/definir o dominio de preview/producao.
2. Verificar o dominio no Resend.
3. Criar remetente de Auth no padrao `acesso@notify.<dominio>`.
4. Obter credenciais SMTP do Resend no painel.
5. Configurar SMTP customizado do Supabase Auth no dashboard do projeto aprovado.
6. Atualizar templates de Auth para usar o fluxo do app, especialmente `/auth/confirm?token_hash=...` quando aplicavel.
7. Configurar Site URL e Redirect URLs exatos do ambiente HTTPS publicado.
8. Testar signup, confirmacao, login, recovery/update password, logout, callback e redirects seguros.

Nao configurar SMTP automaticamente via script nesta etapa. `RESEND_API_KEY`, senha SMTP e `RESEND_WEBHOOK_SECRET` ficam apenas em secret server-side/provedor e nunca em Git, logs ou `NEXT_PUBLIC_*`.

Checklist minimo de readiness para beta:

- URL HTTPS publicada e configurada em `NEXT_PUBLIC_APP_URL`, Site URL e Redirect URLs do Supabase.
- SMTP customizado do Supabase Auth via Resend configurado com dominio/remetente verificado, ou e-mail real explicitamente mantido fora do beta.
- Smoke externo cobre signup, confirmacao de e-mail, login, refresh/claims, rota protegida, logout, recovery/update de senha e redirects seguros.
- `npm.cmd run supabase:types:preview` gera tipos reais a partir de preview aprovado e o diff de `src/types/database.ts` e revisado.
- `npm.cmd run supabase:validate:preview` roda em branch/preview aprovado, com fixtures ficticios e evidencia fresca.
- PWA validado em HTTPS sem cache de rotas Auth, cookies, tokens ou respostas autenticadas.

## Regras

- Nao usar `user_metadata` para autorizacao.
- Nao expor `SUPABASE_SERVICE_ROLE_KEY`.
- Usar tabelas server-managed para roles, grants e consentimentos.
- Em acoes sensiveis, validar usuario no servidor.
