# Release Readiness

Data de sincronizacao: 2026-06-04.

## Veredito

- Status do produto: V1 local ampla / pre-beta real.
- Proximo objetivo: beta real fechado.
- Producao aberta: bloqueada.
- Beta com usuarios reais: bloqueado ate corrigir/validar S0/S1 de `docs/BUG_TRIAGE.md` e concluir gates externos.

## Evidencia atual desta auditoria

Executado no agente principal em 2026-06-03:

- `git status --short --branch`: limpo em `codex/docs-audit-source-of-truth` antes das edicoes.
- `git fetch origin --prune`: executado.
- `git pull --ff-only origin main`: `Already up to date`.
- Branch criada de `main`: `codex/docs-audit-source-of-truth`.
- GitHub remoto: `origin` em `https://github.com/Deividh2025/proposito_em_acao.git`.
- GitHub API: repo privado, `main` sem protecao efetiva, zero workflows, zero releases; branch protection/rulesets retornaram `403` pelo plano/repo privado.
- Supabase CLI: `2.98.2`; `supabase projects list` mostrou `proposito_em_acao` (`bceumcfmjftoukzrfthe`); branches lidas: `main` e `preview-release-readiness`.
- `npm.cmd run lint`: passou.
- `npm.cmd run typecheck`: passou.
- `npm.cmd run test`: passou, 14 arquivos e 81 testes.
- `npm.cmd run build`: passou, 39 paginas.
- `npm.cmd run test:e2e`: passou, 29 testes.

Evidencia complementar de subagentes nesta mesma auditoria:

- Testes focados de IA, RLS estatico e dominios foram reportados como aprovados.

Limitacao: gates com Supabase real, smoke externo, Docker image e Auth publicado nao foram executados nesta auditoria documental.

## Evidencia da Etapa 1 - runtime/error contracts

Executado localmente em 2026-06-03 na branch `codex/runtime-error-contracts`:

- `gh pr view 2`: PR documental da Etapa 0 confirmado como mergeado em `2026-06-03T18:48:25Z`.
- `git pull --ff-only origin main`: `main` atualizada por fast-forward antes da branch da Etapa 1.
- Branch criada de `main`: `codex/runtime-error-contracts`.
- `npm.cmd run test -- src/tests/unit/runtime-action-results.test.ts src/tests/integration/runtime-error-contracts.test.ts src/tests/unit/inbox-capture-ui.test.ts`: passou, 3 arquivos e 13 testes.
- `npm.cmd run lint`: passou.
- `npm.cmd run typecheck`: passou.
- `npm.cmd run test`: passou, 17 arquivos e 94 testes.
- `npm.cmd run build`: passou, 39 paginas.
- `npm.cmd run test:e2e`: passou, 30 testes.

Limitacao: estes gates sao locais. Eles nao substituem Supabase/Auth/RLS remoto, smoke externo, secrets, LGPD, Docker/Coolify ou rollback.

## Evidencia da Etapa 2 - Supabase/RLS/Atalaia

Executado localmente em 2026-06-03 na branch `codex/supabase-rls-accountability-hardening`:

- `gh pr view 2`: mergeado na `main` em `2026-06-03T18:48:25Z`.
- `gh pr view 3`: mergeado na `main` em `2026-06-03T20:45:18Z`.
- Branch criada de `main`: `codex/supabase-rls-accountability-hardening`.
- Migration criada: `20260603211654_accountability_acceptance_rls_hardening.sql`.
- Teste focado de Atalaia/RLS/UI/harness: passou, 5 arquivos e 18 testes.
- `npm.cmd run typecheck`: passou.

Limitacao: nesta etapa nao houve `db push`, typegen real nem `supabase:validate:preview` contra Supabase remoto. O projeto principal nao foi alterado.

## Evidencia historica que nao libera beta sozinha

- Em 2026-06-02, docs registram branch preview Supabase `preview-release-readiness`, migrations locais alinhadas e matriz RLS dinamica minima aprovada.
- Essa evidencia e util como historico, mas deve ser repetida antes de beta real porque o projeto principal, Auth publicado, secrets e smoke externo ainda nao foram validados.

## Evidencia da Etapa 3 - Auth SSR local

Executado localmente em 2026-06-04 na branch `codex/auth-ssr-data-foundation`:

- PR #4 da Etapa 2 foi marcado pronto e mergeado antes do inicio da Etapa 3.
- `git pull --ff-only`: `main` atualizada ate `6200fce` antes da branch da Etapa 3.
- Branch criada de `main`: `codex/auth-ssr-data-foundation`.
- `npm.cmd run lint`: passou.
- `npm.cmd run typecheck`: passou.
- `npm.cmd run test`: passou, 23 arquivos e 135 testes.
- `npm.cmd run build`: passou, 44 paginas/rotas geradas.
- `npm.cmd run test:e2e`: passou, build + 33 testes.
- `git diff --check`: passou, apenas avisos CRLF do Windows.

Limitacao: estes gates sao locais. `npm.cmd run supabase:types:preview` e `npm.cmd run supabase:validate:preview` nao foram executados porque `SUPABASE_PREVIEW_DB_URL`, `SUPABASE_PROJECT_ID`, anon/publishable URL e confirmacao de preview nao estavam disponiveis no processo. Auth externo real segue pendente sem URL HTTPS publicada, Site URL/Redirect URLs Supabase, SMTP/Resend operacional e smoke de cookies reais.

## Evidencia da Etapa 4 - dados autenticados nas interfaces

Executado localmente em 2026-06-04 na branch `codex/real-authenticated-data-ui`:

- PR #5 da Etapa 3 foi marcado pronto e mergeado antes do inicio da Etapa 4.
- Branch criada de `main`: `codex/real-authenticated-data-ui`.
- `npm.cmd run lint`: passou.
- `npm.cmd run typecheck`: passou.
- `npm.cmd run test`: passou, 31 arquivos e 170 testes.
- `npm.cmd run build`: passou, 44 paginas/rotas geradas.
- `npm.cmd run test:e2e`: passou, build + 33 testes.
- `git diff --check`: passou, apenas avisos CRLF do Windows.
- Secret scan do diff: nenhum padrao sensivel real encontrado.

Limitacao: smoke externo, `supabase:types:preview` e `supabase:validate:preview` nao foram executados porque nao ha URL HTTPS/ambiente preview aprovado para Auth/RLS real neste momento. A validacao autenticada externa segue bloqueada por essa ausencia.

## Decisoes atuais de release

- Plataforma: Hostinger VPS KVM 1 com Coolify.
- Gate de infraestrutura: upgrade obrigatorio se KVM 1 nao sustentar build, runtime, logs, HTTPS e rollback com estabilidade.
- Dominio: sera adquirido na Hostinger; dominio exato ainda e gate manual.
- Supabase: projeto principal somente apos cutover validado e aprovado.
- IA: provider selecionavel planejado `automatic`, `openai` ou `deepseek`, padrao `automatic`, sem fallback automatico entre providers.
- Consentimento de IA: separado, versionado e revogavel por provider.
- E-mail: Resend para transacional e SMTP customizado do Supabase Auth.
- Analytics: first-party no Supabase, opt-in desligado por padrao.
- Retencao: 90 dias para analytics, feedback beta e metadados de auditoria de IA.

## Bloqueadores antes do beta real

- Corrigir/validar S0/S1 do `docs/BUG_TRIAGE.md`, especialmente Atalaia, Auth SSR, tipos Supabase, health/readiness, CI/release, guardrails de IA, consentimento, dados demonstrativos e integracoes reais.
- Confirmar por smoke autenticado que a Etapa 4 nao mostra amostras fora de `local-demo`.
- Publicar URL HTTPS de preview.
- Configurar secrets no provedor, sem commitar `.env` real.
- Validar Auth real publicado: signup, login, confirmacao, callback, recuperacao, logout, redirects, refresh/getClaims e cookies reais.
- Validar proxy/middleware SSR em URL HTTPS com falha fechada fora de `local-demo`.
- Repetir cutover/harness Supabase em branch/preview ou ambiente aprovado e anexar evidencia fresca.
- Aplicar e validar a migration de hardening do Atalaia em branch preview aprovada antes de beta real.
- Gerar tipos reais do Supabase e revisar diff.
- Rodar smoke externo contra URL HTTPS.
- Confirmar que PWA/service worker nao cacheia `/auth`, callback, recovery, APIs autenticadas, server actions ou payloads privados.
- Aprovar LGPD minima: termos, privacidade, consentimentos, revogacao, exportacao, exclusao e retencao.
- Ensaiar Docker/Coolify/rollback com release/tag ou deployment anterior conhecido.
- Configurar CI ou registrar limitacao operacional aceita antes de qualquer release publica.

## Bloqueadores antes de producao aberta

- Todos os bloqueadores do beta real.
- Branch protection ou alternativa de governanca de release aprovada.
- Releases/tags e rollback verificavel.
- Monitoramento e incident response testados.
- E-mail/IA/analytics reais ativados apenas depois de smoke, consentimento, custos/rate limits, logs seguros e evals reais.

## Nao declarar como pronto

- Auth SSR externo completo.
- Auth externo com URL HTTPS, redirects reais, SMTP Auth/Resend e recovery validado.
- Supabase principal alinhado.
- RLS completa no ambiente atual.
- Tipos reais gerados.
- Atalaia seguro em ambiente remoto.
- IA real segura.
- Resend configurado.
- Analytics real consentido.
- Health/readiness produtivo.
- Docker/Coolify validado.
- Beta real com usuarios.
