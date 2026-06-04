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

## Auditoria transversal do PR #8

Executado localmente em 2026-06-04 na branch `codex/resend-transactional-email`.

Resultado: passou para smoke local de merge preparatorio; nao substitui smoke externo.

- PR #7 confirmado como mergeado; PR #8 confirmado como aberto, draft, `MERGEABLE` e sem checks remotos.
- Subagentes de auditoria foram tentados em cinco recortes, mas todos falharam por sessao expirada do conector. A evidencia abaixo foi coletada pelo agente principal.
- `npm.cmd run lint`: passou.
- `npm.cmd run typecheck`: passou.
- `npm.cmd run test`: passou, 35 arquivos e 215 testes.
- `npm.cmd run build`: passou, 44 rotas, incluindo `/api/email/resend/webhook`.
- `npm.cmd run test:e2e`: passou, 33 testes.
- `git diff --check`: passou.
- `PREVIEW_URL` e `PLAYWRIGHT_BASE_URL` nao estavam definidos; smoke externo ficou N/A.

Medicoes locais com `next start` em `http://127.0.0.1:3000`:

| Viewport | Rota | Status | Tempo local | Console/pageerror |
|---|---|---:|---:|---|
| desktop | `/` | 200 | 3296 ms | 0 |
| desktop | `/auth` | 200 | 1248 ms | 0 |
| desktop | `/dashboard` | 200 | 745 ms | 0 |
| desktop | `/metacognition` | 200 | 1018 ms | 0 |
| desktop | `/accountability` | 200 | 1358 ms | 0 |
| desktop | `/api/health` | 200 | 628 ms | 0 |
| desktop | `/api/ready` | 200 | 549 ms | 0 |
| mobile | `/` | 200 | 1150 ms | 0 |
| mobile | `/auth` | 200 | 687 ms | 0 |
| mobile | `/dashboard` | 200 | 673 ms | 0 |
| mobile | `/metacognition` | 200 | 655 ms | 0 |
| mobile | `/accountability` | 200 | 681 ms | 0 |
| mobile | `/api/health` | 200 | 526 ms | 0 |
| mobile | `/api/ready` | 200 | 523 ms | 0 |

Observacao: o primeiro hit desktop da home ficou mais lento em medicao local fria. Nao foi classificado como bloqueio porque as demais rotas ficaram abaixo de 1,4s e nao houve erro de console; deve ser reavaliado em preview HTTPS com cache/infra reais.

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
