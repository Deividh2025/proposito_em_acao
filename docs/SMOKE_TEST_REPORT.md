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

## Etapa 8 - preparo do smoke externo

Status em 2026-06-05: preparado, nao executado contra URL real. `PREVIEW_URL` e `PLAYWRIGHT_BASE_URL` estavam ausentes no ambiente local desta passada; por contrato, `npm.cmd run test:e2e:external` deve abortar antes de abrir navegador quando nenhuma URL for informada.

Cobertura preparada em `src/tests/e2e/external-smoke.spec.ts`:

- `/api/health` e `/api/ready` com resposta JSON, headers basicos de seguranca e readiness `ok:true`.
- Rotas criticas desktop: home, auth, dashboard, alvos, projetos, tarefas, calendario, inbox, Desbloqueador, Metacognicao, foco, habitos, Placar, Revisao, Jardim, Atalaia e configuracoes.
- Rotas mobile/PWA: `/mobile`, atalhos mobile principais, `/offline`, `/manifest.json` e `/sw.js`.
- Verificacao de console/pageerror durante renderizacao das rotas publicadas.
- Service worker sem `cache.put` e sem precache explicito de rotas autenticadas, Auth, API ou exportacao.
- `/settings/export`, callbacks de Auth e service worker com politica de cache bloqueando armazenamento.

Limitacao: esta suite nao substitui validacao manual de signup, confirmacao por e-mail, recovery, Supabase/RLS remoto, Resend, IA real, analytics real ou rollback. Ela e o gate de smoke HTTP/browser para a URL HTTPS publicada.

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

## Auditoria transversal PR #10

Data: 2026-06-05.

URL HTTPS publicada: indisponivel. Smoke externo real: nao executado. Smoke local dedicado: executado contra `http://127.0.0.1:3000`.

Comandos/resultados:

- `npm.cmd run test:e2e`: passou; 35 testes, 5 external-smoke pulados por design.
- `npm.cmd run test:e2e:external` sem URL: abortou corretamente com `Set PLAYWRIGHT_BASE_URL or PREVIEW_URL to the published preview URL.`
- `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 npm.cmd run test:e2e:external`: passou, 5 testes em 6,5s.

Cobertura do smoke local dedicado:

- `/api/health` e `/api/ready`.
- Rotas desktop principais e mobile/PWA.
- Headers basicos de seguranca.
- Console/pageerror durante renderizacao.
- Manifest, service worker e pagina offline.
- Export/Auth callbacks com politica de cache nao armazenavel.

Tempos locais apos warmup:

| Rota | Status | Tempo |
|---|---:|---:|
| `/` | 200 | 207 ms |
| `/auth` | 200 | 173 ms |
| `/dashboard` | 200 | 101 ms |
| `/goals` | 200 | 130 ms |
| `/tasks` | 200 | 159 ms |
| `/calendar` | 200 | 107 ms |
| `/inbox` | 200 | 67 ms |
| `/metacognition` | 200 | 68 ms |
| `/action-unblocker` | 200 | 80 ms |
| `/focus` | 200 | 143 ms |
| `/habits` | 200 | 70 ms |
| `/scoreboard` | 200 | 75 ms |
| `/review` | 200 | 83 ms |
| `/garden` | 200 | 90 ms |
| `/accountability` | 200 | 73 ms |
| `/settings` | 200 | 157 ms |
| `/mobile` | 200 | 92 ms |
| `/api/health` | 200 | 18 ms |
| `/api/ready` | 200 | 18 ms |

Limitacao: smoke local nao substitui URL HTTPS publicada, Auth real, Supabase/RLS remoto, Resend real, IA real, analytics real, Docker/Coolify ou rollback.

## Etapa 9 - smoke final integrado

Data: 2026-06-05.

Smoke externo publicado: nao executado. `PREVIEW_URL` e `PLAYWRIGHT_BASE_URL` nao estavam definidos.

Comandos/resultados:

- `npm.cmd run test:e2e`: passou; 35 testes e 5 external-smoke pulados por design.
- `npm.cmd run test:e2e:external`: abortou corretamente com `Set PLAYWRIGHT_BASE_URL or PREVIEW_URL to the published preview URL.`
- `npm.cmd run build`: passou, 45 paginas/rotas.

Cobertura local do E2E:

- Auth surface, callback/confirmacao invalida sem eco de token e dashboard em `local-demo`.
- Feedback beta local sem envio externo.
- Calendario, inbox, execucao, foco, habitos, Placar, mobile/PWA, onboarding, Metacognicao, Desbloqueador, revisao, jardim e settings/privacidade.
- Atalaia e Documento de Compromisso em estados seguros/empty states.

Bloqueios de smoke para beta real:

- Home/Auth/dashboard e demais rotas ainda nao foram validadas em URL HTTPS publicada.
- Signup, confirmacao, login, recovery, logout, cookies reais e redirects Supabase nao foram testados externamente.
- Supabase/RLS, Resend/SMTP Auth, IA real, analytics/feedback real, Docker/Coolify, KVM gate, logs e rollback nao foram testados em preview.
