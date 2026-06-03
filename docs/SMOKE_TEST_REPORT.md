# Smoke Test Report

Data de sincronizacao: 2026-06-03.

## Veredito

Smoke externo publicado: nao executado. Ainda nao existe URL HTTPS publicada em Hostinger/Coolify.

Smoke local: gates locais cobrem fallback local/dev e renderizacao, nao comprovam Auth real, Supabase principal, RLS completa, Resend, IA real, analytics real ou deploy.

## Evidencia atual desta auditoria

Agente principal:

- `npm.cmd run lint`: passou.
- `npm.cmd run typecheck`: passou.
- `npm.cmd run test`: passou, 14 arquivos e 81 testes.
- `npm.cmd run build`: passou, 39 paginas.
- `npm.cmd run test:e2e`: passou, 29 testes.

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
