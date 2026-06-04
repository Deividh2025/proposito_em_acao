# Smoke Test Report

Data de sincronizacao: 2026-06-04.

## Veredito

Smoke externo publicado: nao executado. Ainda nao existe URL HTTPS publicada em Hostinger/Coolify.

Smoke local: gates locais cobrem fallback local/dev e renderizacao, nao comprovam Auth real, Supabase principal, RLS completa, Resend, IA real, analytics real ou deploy.

## Evidencia atual desta auditoria transversal

Agente principal:

- `npm.cmd run lint`: passou.
- `npm.cmd run typecheck`: passou.
- `npm.cmd run test`: passou, 32 arquivos e 194 testes.
- `npm.cmd run build`: passou, 44 rotas.
- `npm.cmd run test:e2e`: passou, build + 33 testes.
- `git diff --check`: passou.

Medições locais com `next start` em `http://127.0.0.1:3000`:

| Rota | Status | Tempo local |
|---|---:|---:|
| `/` | 200 | 108 ms |
| `/dashboard` | 200 | 369 ms |
| `/metacognition` | 200 | 100 ms |
| `/review` | 200 | 685 ms |
| `/mobile` | 200 | 73 ms |
| `/settings` | 200 | 72 ms |
| `/api/health` | 200 | 19 ms |
| `/api/ready` | 200 | 24 ms |

Console/pageerror check com Playwright em `/`, `/dashboard`, `/metacognition`, `/review`, `/mobile` e `/settings`: 0 erros/0 warnings coletados.

Limitacao: estes gates sao locais. Eles nao substituem smoke externo contra URL HTTPS publicada, Auth real, Supabase/RLS remoto, Resend, IA real, analytics real ou deploy.

## Supabase e Auth

- Supabase CLI disponivel (`2.98.2`).
- Projeto `proposito_em_acao` (`bceumcfmjftoukzrfthe`) listado em modo read-only.
- Branches lidas: `main` e `preview-release-readiness`.
- Harness RLS nao foi executado nesta auditoria porque cria/remove fixtures remotas.
- Auth real publicado nao foi validado porque nao ha URL HTTPS publicada, callback/confirmacao/recuperacao completos nem redirects finais.

## GitHub e release

- Repositorio privado: `Deividh2025/proposito_em_acao`.
- Branch `main` sem protecao efetiva pela API.
- Zero workflows GitHub Actions.
- Sem releases/tags/deployments publicados.

## Smoke externo pendente

Quando houver URL HTTPS publicada:

```powershell
$env:PREVIEW_URL="https://URL-APROVADA"
npm.cmd run test:e2e:external
```

Ou:

```powershell
$env:PLAYWRIGHT_BASE_URL="https://URL-APROVADA"
npm.cmd run test:e2e:external
```

## Criterios minimos para beta real

- URL HTTPS publicada.
- Auth real: signup, confirmacao/callback, login, logout, recuperacao e refresh centralizado.
- Secrets configurados no provedor, sem `.env` real no Git.
- Supabase/RLS rerodado com evidencia fresca.
- Tipos Supabase reais gerados.
- Docker/Coolify e rollback ensaiados.
- Health/readiness valida dependencias relevantes.
- Smoke externo passa contra URL publicada.
- S0/S1 de `docs/BUG_TRIAGE.md` corrigidos ou formalmente bloqueados antes de convite real.
