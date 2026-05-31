---
name: auth-security-skill
description: Padronizar autenticacao, sessao, perfis, roles e separacao client/server no Proposito em Acao.
---

# Auth Security Skill

## Quando usar

Use em qualquer trabalho com Supabase Auth, perfil, sessao Next.js, cookies, middleware, redirects, OAuth, service role ou autorizacao server-side.

## Quando nao usar

Nao use para telas sem fluxo de Auth real ou para configuracoes que nao toquem identidade, sessao ou dados privados.

## Instrucoes praticas

1. Email/senha e confirmacao de email sao o fluxo inicial da V1.
2. OAuth deve ser preparado como futuro, sem depender de metadata externa para autorizacao.
3. `profiles` fica separado de `auth.users`; consentimentos ficam em `consent_records`.
4. SSR usa cookies e cliente server-side; browser usa apenas publishable/anon key.
5. `SUPABASE_SERVICE_ROLE_KEY` fica apenas em modulos server-only.
6. Nao exportar admin client por barrel publico.
7. Autorizacao sensivel deve chamar `getUser()` no servidor quando aplicavel.
8. Redirect URLs devem ser documentadas por ambiente.

## Arquivos relacionados

- `src/lib/supabase/client.ts`
- `src/lib/supabase/server.ts`
- `src/lib/supabase/admin.ts`
- `src/lib/supabase/guards.ts`
- `docs/SUPABASE_AUTH.md`
- `.env.example`

## Formato de saida esperado

Retorne fluxo Auth, arquivos tocados, variaveis, riscos, separacao client/server, testes executados e configuracoes manuais pendentes no dashboard Supabase.
