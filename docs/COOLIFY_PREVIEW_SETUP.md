# Coolify Preview Setup

Data: 2026-06-02.

## Objetivo

Publicar um preview controlado do `codex/preview-release-readiness` antes de qualquer beta com usuarios reais.

## Build

Configuracao recomendada no Coolify:

- Build Pack: Dockerfile.
- Branch: `codex/preview-release-readiness`.
- Dockerfile: `Dockerfile`.
- Porta interna: `3000`.
- Health check path: `/api/health`.
- HTTPS: obrigatorio para preview externo.

O Dockerfile usa build multi-stage e executa o servidor de producao do Next.js no container final.

## Variaveis de preview

Configurar no cofre do Coolify, nunca no Git.

Runtime obrigatorias:

- `NODE_ENV=production`
- `NEXT_PUBLIC_APP_NAME`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_PROJECT_ID`

Runtime que devem permanecer vazias/desativadas no primeiro preview, salvo aprovacao explicita:

- `NEXT_PUBLIC_BETA_FEEDBACK_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `DEEPSEEK_API_KEY`
- `DEEPSEEK_BASE_URL`
- `DEEPSEEK_MODEL_FLASH`
- `DEEPSEEK_MODEL_PRO`
- `EMAIL_PROVIDER`
- `EMAIL_FROM`

Exposicao:

- `NEXT_PUBLIC_*` vai para o browser e so pode conter valores publicos.
- Service role, OpenAI, DeepSeek, e-mail, webhooks e tokens ficam server-side e sem `NEXT_PUBLIC_`.

## Supabase Auth

Depois que o Coolify gerar a URL HTTPS de preview:

1. Ajustar `NEXT_PUBLIC_APP_URL` para a URL publicada.
2. Configurar Site URL/redirect no Supabase Auth para a URL publicada.
3. Manter `password_hibp_enabled` ativo.
4. Validar signup, confirmacao de e-mail, login, sessao SSR e logout com conta ficticia.

## Smoke externo

Rodar a partir do workspace local:

```powershell
$env:PLAYWRIGHT_BASE_URL="https://URL-DE-PREVIEW"
npm.cmd run test:e2e:external
```

O script recusa URL externa sem HTTPS.

## Rollback

Se o smoke falhar:

1. Remover usuarios ficticios criados no Supabase preview.
2. Reverter para o deployment anterior no Coolify.
3. Remover URL de redirect insegura no Supabase Auth.
4. Reexecutar smoke minimo em `/`, `/auth`, `/dashboard`, `/mobile` e `/api/health`.
