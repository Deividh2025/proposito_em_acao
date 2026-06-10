# Deploy Smoke And Healthcheck

Data: 2026-06-10.

## Objetivo

Esta fundacao valida liveness, renderizacao basica e sinais de deploy em Coolify/Oracle sem depender de Supabase real, Auth real, OpenAI real, HTTPS, dominio proprio ou secrets.

Ela e paralela ao PR #16 e deve continuar funcionando com:

- `APP_RUNTIME_MODE=local-demo`
- `NEXT_PUBLIC_APP_URL` apontando para a URL temporaria do Coolify
- HTTP em host temporario `sslip.io`
- Sem `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`, Resend ou Auth real

## Rotas Cobertas

Rotas principais existentes no App Router:

| Area solicitada | Rota real |
|---|---|
| Home | `/` |
| Dashboard | `/dashboard` |
| Settings | `/settings` |
| Onboarding | `/onboarding` |
| Alvos | `/goals` |
| Projetos | `/projects` |
| Tarefas | `/tasks` |
| Calendario | `/calendar` |
| Inbox | `/inbox` |
| Mobile | `/mobile` |
| Acesso | `/auth` |

Observacao: `/alvos`, `/projetos`, `/tarefas`, `/calendario` e `/acesso` nao existem como paths em portugues nesta base. O smoke usa os paths reais em ingles para nao criar rotas desnecessarias.

## Healthcheck

Endpoint:

```text
/api/health
```

Contrato esperado:

```json
{
  "ok": true,
  "app": "Propósito em Ação",
  "service": "proposito-em-acao",
  "runtime": "local-demo",
  "timestamp": "2026-06-10T00:00:00.000Z",
  "version": "0.1.0",
  "environment": "sanitized"
}
```

Regras:

- Nao consulta Supabase.
- Nao exige Auth.
- `/api/health` e `/api/ready` passam pelo proxy sem renovar Auth ou chamar `getClaims()`.
- Nao exige OpenAI, DeepSeek, Resend ou secrets.
- Nao expoe `process.env`, tokens, chaves, senhas ou URLs privadas.
- `runtime` e sanitizado para um dos modos permitidos; valor invalido cai para `local-demo`.
- `environment` deve ser sempre `sanitized`.

## Como Rodar Localmente

Instalar dependencias:

```powershell
npm.cmd ci
```

Gates principais:

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run test
npm.cmd run build
```

Smoke local completo com build, `next start` e Playwright:

```powershell
npm.cmd run smoke
```

Healthcheck contra um servidor local ja ativo:

```powershell
npm.cmd run healthcheck
```

Ou apontando explicitamente:

```powershell
$env:HEALTHCHECK_URL="http://127.0.0.1:3000/api/health"
npm.cmd run healthcheck
```

## Como Rodar Contra Coolify

URL temporaria atual:

```text
http://op2shbecaxu92eru7u6n7px9.137.131.242.245.sslip.io
```

Healthcheck:

```powershell
$env:HEALTHCHECK_URL="http://op2shbecaxu92eru7u6n7px9.137.131.242.245.sslip.io/api/health"
npm.cmd run healthcheck
```

Smoke externo:

```powershell
$env:PREVIEW_URL="http://op2shbecaxu92eru7u6n7px9.137.131.242.245.sslip.io"
npm.cmd run smoke:external
```

Tambem e aceito:

```powershell
$env:PLAYWRIGHT_BASE_URL="http://op2shbecaxu92eru7u6n7px9.137.131.242.245.sslip.io"
npm.cmd run smoke:external
```

`PREVIEW_URL` e `PLAYWRIGHT_BASE_URL` devem ser apenas a origem, sem path, query, hash, usuario ou senha.

## HTTP Temporario

HTTP no `sslip.io` e aceitavel somente nesta fase operacional:

- smoke tecnico de operador;
- `APP_RUNTIME_MODE=local-demo`;
- sem usuarios reais;
- sem Auth real;
- sem Supabase/RLS real;
- sem OpenAI/DeepSeek real;
- sem e-mail real;
- sem declarar beta ou producao aberta.

HTTPS e dominio proprio continuam gates obrigatorios para preview canonico, Auth real, beta fechado com usuarios e producao.

## Checklist Pos-Deploy

1. Coolify mostra build completed.
2. Coolify mostra rolling update completed.
3. Variaveis seguem em `APP_RUNTIME_MODE=local-demo`.
4. `/api/health` retorna HTTP 200 e `ok:true`.
5. `/` abre no host `sslip.io`.
6. `/settings` abre sem Supabase/Auth real.
7. `/dashboard` abre sem login real.
8. Console do navegador nao mostra erro fatal.
9. Smoke externo passa com `PREVIEW_URL` ou `PLAYWRIGHT_BASE_URL`.
10. Nenhum secret foi adicionado em Git ou logs.

## Diagnostico Rapido

| Sinal | Interpretacao |
|---|---|
| IP puro retorna 404 | Pode ser apenas roteamento por `Host` no proxy/Coolify. Teste o host `*.sslip.io` antes de concluir falha da app. |
| Host `*.sslip.io` retorna 404 em `/` | Roteamento ou app errado. Verificar dominio associado no Coolify e porta interna `3000`. |
| Build completed | A imagem/build terminou; ainda nao prova que o container novo esta servindo trafego. |
| Rolling update completed | Troca do container terminou; validar `/api/health` em seguida. |
| `/api/health` 200 | Liveness basico ok. Nao prova Supabase/Auth/RLS. |
| `/api/ready` 503 | Pode ser esperado fora de `local-demo` quando URL HTTPS/Supabase/Auth essencial falta. Em `local-demo`, deve continuar permissivo. |
| Erro de env no build | Corrigir variavel obrigatoria ou fallback seguro antes de novo deploy; nao mascarar com secret fake. |
| Erro de prerender/build | Bloqueia deploy. Corrigir rota/import/config e rodar `npm.cmd run build`. |
| Container reinicia em loop | Conferir logs do `next start`, porta interna e variaveis runtime. |
| Console com erro fatal | Bloqueia smoke; reproduzir localmente com `npm.cmd run smoke`. |

## O Que Esta Etapa Nao Valida

- Supabase real.
- Auth real.
- RLS remoto.
- OpenAI/DeepSeek real.
- Resend/e-mail real.
- HTTPS definitivo.
- Dominio proprio.
- Rollback ensaiado com usuarios reais.
- Beta fechado ou producao.

Esses itens continuam gates de etapa futura.
