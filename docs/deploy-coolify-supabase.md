# Coolify + Supabase Auth Foundation

Data: 2026-06-10.

## Estado atual preservado

Este runbook prepara a saida progressiva de `local-demo` para Auth/Supabase real sem alterar o deploy atual.

Estado informado nesta etapa:

- Provedor atual: Coolify em VPS Oracle Cloud.
- Build atual: Nixpacks.
- Node: 22.
- Porta interna: 3000.
- Dominio temporario atual: `http://op2shbecaxu92eru7u6n7px9.137.131.242.245.sslip.io`.
- Nao configurar dominio proprio, DNS, HTTPS novo, pagamentos, OpenAI real ou e-mail real nesta etapa.

Variaveis atuais que devem permanecer enquanto o deploy publico continuar em demo:

```text
NIXPACKS_NODE_VERSION=22
NEXT_PUBLIC_APP_NAME=Propósito em Ação
NEXT_PUBLIC_APP_URL=http://op2shbecaxu92eru7u6n7px9.137.131.242.245.sslip.io
APP_RUNTIME_MODE=local-demo
```

Enquanto `APP_RUNTIME_MODE=local-demo`, Supabase, OpenAI, Auth real, e-mail real, analytics real e secrets server-side nao sao obrigatorios. O app deve continuar navegavel com dados demonstrativos rotulados.

## Contrato de runtime

`local-demo`:

- Nao exige `NEXT_PUBLIC_SUPABASE_URL`.
- Nao exige `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Nao exige `SUPABASE_SERVICE_ROLE_KEY`.
- Nao exige OpenAI/DeepSeek.
- Pode usar mocks e rascunhos locais rotulados.
- Nao deve declarar persistencia real.

`preview`:

- Exige Supabase/Auth antes de usar dados reais.
- Exige `NEXT_PUBLIC_SUPABASE_URL`.
- Exige `NEXT_PUBLIC_SUPABASE_ANON_KEY` ou `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- Exige `NEXT_PUBLIC_APP_URL` como URL HTTPS publicada para Auth real, redirects e smoke externo.
- Nao exige OpenAI nesta etapa.
- Deve falhar fechado ou mostrar estado bloqueado quando Auth/Supabase estiver ausente.

`production`:

- Exige Supabase/Auth.
- Exige URL publica HTTPS validada.
- OpenAI/DeepSeek podem permanecer opcionais e desligados enquanto `AI_REAL_ENABLED=false`.
- So pode abrir para usuarios reais depois de smoke externo, rollback, LGPD minima, secrets no provedor e evidencia fresca de Auth/RLS.

## Variaveis futuras para Supabase

Publicas no bundle cliente:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Use `NEXT_PUBLIC_SUPABASE_ANON_KEY` para compatibilidade simples. `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` e aceito pelo codigo como alternativa/futuro. Nunca coloque service role em `NEXT_PUBLIC_*`.

Server-side somente quando houver necessidade aprovada:

```text
SUPABASE_SERVICE_ROLE_KEY=
```

`SUPABASE_SERVICE_ROLE_KEY` nao e obrigatoria para navegar no app, login normal ou leituras owner-only. Ela so deve entrar no runtime server-side se uma etapa aprovar fluxos admin controlados, como consentimentos operacionais, auditoria de IA, webhook server-side ou rotinas de manutencao.

Nao configurar por padrao no runtime do app:

```text
SUPABASE_JWT_SECRET=
```

`SUPABASE_JWT_SECRET` nao e necessario para os helpers SSR atuais. Use apenas se uma etapa futura implementar validacao JWT server-side propria e documentar o risco.

## Coolify

Production Environment Variables do app atual, enquanto preserva demo:

```text
NIXPACKS_NODE_VERSION=22
NEXT_PUBLIC_APP_NAME=Propósito em Ação
NEXT_PUBLIC_APP_URL=http://op2shbecaxu92eru7u6n7px9.137.131.242.245.sslip.io
APP_RUNTIME_MODE=local-demo
AI_REAL_ENABLED=false
EMAIL_REAL_ENABLED=false
EMAIL_DOMAIN_VERIFIED=false
ANALYTICS_REAL_ENABLED=false
FEEDBACK_REAL_ENABLED=false
```

Preview Deployments Environment Variables, somente quando for virar preview real:

```text
NIXPACKS_NODE_VERSION=22
NEXT_PUBLIC_APP_NAME=Propósito em Ação
NEXT_PUBLIC_APP_URL=https://URL-PUBLICADA-DE-PREVIEW
APP_RUNTIME_MODE=preview
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=anon-ou-publishable-key-do-preview
SUPABASE_PROJECT_ID=ref-do-projeto-ou-branch-preview
AI_REAL_ENABLED=false
EMAIL_REAL_ENABLED=false
EMAIL_DOMAIN_VERIFIED=false
ANALYTICS_REAL_ENABLED=false
FEEDBACK_REAL_ENABLED=false
```

Manter vazias ate etapa propria:

```text
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
DEEPSEEK_API_KEY=
RESEND_API_KEY=
RESEND_WEBHOOK_SECRET=
```

Variaveis de operador/CLI nao devem ser cadastradas como runtime do app no Coolify:

```text
SUPABASE_ACCESS_TOKEN=
SUPABASE_PREVIEW_DB_URL=
SUPABASE_PREVIEW_CONFIRM=preview
SUPABASE_TYPES_OUTPUT=src/types/database.ts
PLAYWRIGHT_BASE_URL=
PREVIEW_URL=
```

Essas variaveis sao para terminal do operador, typegen, migrations e smoke externo.

## Supabase

1. Criar ou escolher um projeto/branch preview sem dados reais.
2. Aplicar migrations versionadas em `supabase/migrations/` somente apos dry-run e aprovacao.
3. Gerar tipos reais apenas contra preview aprovado:

```powershell
npm.cmd run supabase:types:preview
```

Esse comando escreve `src/types/database.ts`; revisar diff antes de commit.

4. Validar Auth/RLS com fixtures ficticias somente em preview aprovado:

```powershell
npm.cmd run supabase:validate:preview
```

Esse comando e mutavel e exige service role do ambiente de teste. Nao rodar contra producao.

## Auth

Antes de mudar `APP_RUNTIME_MODE` para `preview`:

- Configurar `NEXT_PUBLIC_SUPABASE_URL`.
- Configurar `NEXT_PUBLIC_SUPABASE_ANON_KEY` ou `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- Configurar `NEXT_PUBLIC_APP_URL` com URL HTTPS publicada.
- No Supabase Auth, cadastrar Site URL e Redirect URLs para:
  - `https://URL-PUBLICADA-DE-PREVIEW/auth/callback`
  - `https://URL-PUBLICADA-DE-PREVIEW/auth/confirm`
  - `https://URL-PUBLICADA-DE-PREVIEW/auth/update-password`
- Usar e-mail/senha como fluxo inicial.
- SMTP Auth customizado via Resend continua futuro ate dominio/remetente verificado e aprovacao operacional.

## Health, readiness e smoke

- `/api/health`: liveness barato para Coolify.
- `/api/ready`: readiness estrito. Em `preview`/`production`, retorna 503 se Supabase/Auth essencial ou URL HTTPS publicada estiverem ausentes.
- Smoke externo exige URL HTTPS publicada:

```powershell
$env:PLAYWRIGHT_BASE_URL="https://URL-PUBLICADA-DE-PREVIEW"
npm.cmd run test:e2e:external
```

Nao usar o dominio `sslip.io` HTTP atual como prova de preview real.

## QA local antes de PR

Com `package-lock.json`, preferir:

```powershell
npm.cmd ci
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run test
npm.cmd run build
git diff --check
```

Se `npm.cmd ci` for pesado ou falhar por cache/rede, registrar o motivo e rodar os demais gates possiveis sem declarar instalacao fresca.

## Rollback

Se o preview real falhar:

1. Manter ou voltar `APP_RUNTIME_MODE=local-demo` no Coolify.
2. Reverter para o deployment anterior no Coolify.
3. Remover Redirect URLs inseguras do Supabase Auth.
4. Limpar usuarios/fixtures ficticios do Supabase preview.
5. Reexecutar `/api/health`, `/api/ready` e smoke externo quando houver HTTPS.

## Pendencias antes de beta real

- URL HTTPS publicada e validada.
- Supabase/Auth/RLS com evidencia fresca.
- Typegen real revisado.
- Smoke externo passando.
- Secrets no cofre do provedor, sem `.env` real no Git.
- Rollback aprovado.
- LGPD minima.
- OpenAI/DeepSeek ainda desligados ate etapa propria.
