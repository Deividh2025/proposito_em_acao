# Release Readiness

Data de sincronizacao: 2026-06-05.

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

## Evidencia da Etapa 5 - IA real preparada com roteamento seguro

Executado localmente em 2026-06-04 na branch `codex/real-ai-provider-routing`:

- PR #6 da Etapa 4 foi marcado pronto e mergeado antes do inicio da Etapa 5.
- Branch criada de `main`: `codex/real-ai-provider-routing`.
- Gate de entrada confirmou PRs #1 a #6 mergeados na `main`.
- OpenAI e DeepSeek foram modelados como providers server-side, com DeepSeek adapter mockado/testado e chamadas reais bloqueadas por default.
- Roteamento `automatic|openai|deepseek`, consentimento versionado por provider, kill switch, timeout, redaction e auditoria minima foram implementados localmente.
- Evals/testes focados cobrem provider routing, consentimento ausente/revogado, kill switch, falha sem fallback cruzado, schema invalido, timeout, redaction e guardrails IO.
- `npm.cmd run lint`: passou.
- `npm.cmd run typecheck`: passou.
- `npm.cmd run test`: passou, 32 arquivos e 190 testes.
- `npm.cmd run build`: passou, 44 paginas/rotas geradas.
- `npm.cmd run test:e2e`: passou, build + 33 testes.
- `git diff --check`: passou, apenas avisos CRLF do Windows.
- Secret scan do diff: nenhum padrao sensivel real encontrado.

Limitacao: nenhuma chamada real a OpenAI/DeepSeek foi executada. Consentimento persistido, auditoria persistida, rate limit persistente e evals contra modelos reais seguem pendentes de etapa/aprovacao propria. Esta etapa nao libera IA real, beta real ou producao.

## Auditoria transversal do PR #7

Executado localmente em 2026-06-04 na branch `codex/real-ai-provider-routing`:

- PR #7 estava aberto em draft, base `main`, head `codex/real-ai-provider-routing`, `MERGEABLE` e sem checks remotos configurados.
- Subagentes revisaram bugs/regressoes, testes/cobertura, performance/UX, seguranca/Auth/RLS/privacidade e IA/e-mail/analytics/integracoes.
- Achados de IA no PR foram corrigidos antes do merge: sanitizacao de chaves sensiveis antes de provider, timeout abortavel, limite diario stub antes de chamada real, guardrail de saida para Atalaia e fallback de crise sem eco de pensamento/impulso bruto.
- `npm.cmd run test -- src/tests/unit/ai-provider-routing.test.ts`: passou, 20 testes.
- `npm.cmd run lint`: passou.
- `npm.cmd run typecheck`: passou.
- `npm.cmd run test`: passou, 32 arquivos e 194 testes.
- `npm.cmd run build`: passou, 44 rotas.
- `npm.cmd run test:e2e`: passou, build + 33 testes.
- Timings locais com `next start`: `/api/health` 19 ms, `/api/ready` 24 ms, rotas principais 72-685 ms em medicao local.
- Console/pageerror check local em rotas principais: 0 erros/0 warnings.
- Secret scan por `git grep` encontrou apenas placeholders/documentacao/testes; nenhuma chave real foi identificada no diff.

Veredito desta auditoria: PR #7 fica aprovado com restricoes para merge preparatorio porque IA real continua desligada por default e os achados de fronteira foram corrigidos/testados. Beta real continua bloqueado pelos S1/S2 abertos em `docs/BUG_TRIAGE.md`, especialmente Auth/RLS externo, tipos Supabase reais, CI/release, IA com consentimento/auditoria persistidos, Resend, analytics/feedback consentidos e smoke HTTPS.

## Evidencia da Etapa 6 - Resend transacional seguro

Executado localmente em 2026-06-04 na branch `codex/resend-transactional-email`:

- Gate de entrada confirmou PRs #1 a #7 mergeados na `main`.
- `git pull --ff-only origin main`: `Already up to date`.
- Branch criada de `main`: `codex/resend-transactional-email`.
- Adapter Resend server-only foi criado com `fetch`, sem SDK novo.
- `EMAIL_REAL_ENABLED=false` e `EMAIL_DOMAIN_VERIFIED=false` seguem default e bloqueiam envio real.
- Templates transacionais de Atalaia foram reduzidos para linguagem neutra, sem titulo do alvo, tarefa, calendario, Metacognicao, Chamado, saude, familia, financas, emocoes ou corpo privado.
- Webhook Resend foi criado em `/api/email/resend/webhook`, validando assinatura Svix com corpo cru e persistindo somente metadados redigidos.
- Teste focado: `npm.cmd run test -- src/tests/unit/email-provider.test.ts src/tests/unit/email-templates.test.ts src/tests/integration/resend-webhook.test.ts src/tests/integration/accountability-secure-actions.test.ts` passou, 4 arquivos e 33 testes.
- `npm.cmd run lint`: passou.
- `npm.cmd run typecheck`: passou.
- `npm.cmd run test`: passou, 35 arquivos e 215 testes.
- `npm.cmd run build`: passou, 44 rotas, incluindo `/api/email/resend/webhook`.
- `npm.cmd run test:e2e`: primeira tentativa falhou por concorrencia com `next build`; rerun isolado passou, 33 testes.
- `git diff --check`: passou, apenas avisos CRLF do Windows.
- Secret scan estrito do diff: nenhum formato real de API key/webhook secret encontrado; somente placeholders vazios e nomes de variaveis aparecem no diff.

Limitacao: nenhum e-mail real foi enviado. SMTP Auth do Supabase nao foi configurado no dashboard. Dominio/remetente Resend, secrets no provedor, smoke externo e webhook real delivered/bounced seguem pendentes.

## Auditoria transversal do PR #8

Executado localmente em 2026-06-04 na branch `codex/resend-transactional-email`:

- PR #7 foi confirmado como mergeado em `main` em 2026-06-04T18:23:45Z.
- PR #8 estava aberto em draft, base `main`, head `codex/resend-transactional-email`, `MERGEABLE` e sem checks remotos configurados.
- Subagentes foram tentados para bugs/regressoes, testes/CI, performance/UX, seguranca/Auth/RLS e IA/e-mail/analytics, mas todos falharam por erro externo de sessao encerrada do conector. A auditoria foi concluida pelo agente principal com evidencias locais.
- Gates locais frescos da Etapa 6: `npm.cmd run lint` passou; `npm.cmd run typecheck` passou; `npm.cmd run test` passou com 35 arquivos/215 testes; `npm.cmd run build` passou com 44 rotas; `npm.cmd run test:e2e` passou com 33 testes; `git diff --check` passou.
- `PREVIEW_URL` e `PLAYWRIGHT_BASE_URL` nao estavam definidos; `npm.cmd run test:e2e:external` ficou N/A.
- Secret scan do diff e varredura em `src`, `docs`, `.env.example` e `public` encontraram apenas placeholders, documentacao e fixtures de teste; nenhum secret real foi identificado.
- Varredura de `service_role` confirmou uso server-only em `src/lib/supabase/admin.ts` e referencias em docs/testes; nenhum uso client-side novo foi identificado.
- Varredura CSP confirmou risco residual `SEC-CSP-001`: `unsafe-inline` continua em scripts/estilos; `unsafe-eval` fica limitado a ambiente nao-producao.
- Smoke local com `next start` em `http://127.0.0.1:3000` e Playwright desktop/mobile retornou 200 para `/`, `/auth`, `/dashboard`, `/metacognition`, `/accountability`, `/api/health` e `/api/ready`, sem console warnings/errors ou pageerrors capturados.

Tempos locais observados no smoke do PR #8:

| Viewport | Rota | Status | Tempo |
|---|---|---:|---:|
| desktop | `/` | 200 | 3296 ms |
| desktop | `/auth` | 200 | 1248 ms |
| desktop | `/dashboard` | 200 | 745 ms |
| desktop | `/metacognition` | 200 | 1018 ms |
| desktop | `/accountability` | 200 | 1358 ms |
| desktop | `/api/health` | 200 | 628 ms |
| desktop | `/api/ready` | 200 | 549 ms |
| mobile | `/` | 200 | 1150 ms |
| mobile | `/auth` | 200 | 687 ms |
| mobile | `/dashboard` | 200 | 673 ms |
| mobile | `/metacognition` | 200 | 655 ms |
| mobile | `/accountability` | 200 | 681 ms |
| mobile | `/api/health` | 200 | 526 ms |
| mobile | `/api/ready` | 200 | 523 ms |

Veredito desta auditoria: PR #8 fica aprovado com restricoes para merge preparatorio. Beta real e release continuam bloqueados pelos S1/S2 abertos em `docs/BUG_TRIAGE.md`, especialmente Auth/RLS externo, CI/release, Docker/rollback, tipos Supabase reais, Resend/SMTP real, analytics/feedback consentidos, LGPD/exportacao/exclusao e smoke HTTPS.

## Evidencia da Etapa 8 - rollback/docs Hostinger/Coolify

Executado localmente em 2026-06-05 na branch `codex/ci-docker-hostinger-preview`:

- Subagente 5 atualizou a documentacao operacional permitida para preview Hostinger/Coolify, rollback, KVM gate e limitacoes de release.
- `docs/ROLLBACK_PLAN.md` passou a listar triggers especificos de rollback Coolify, rehearsal obrigatorio e gate da Hostinger KVM 1.
- `docs/OPERATIONS_RUNBOOK.md` passou a exigir evidencia de VPS/Coolify, dominio HTTPS, secrets de preview, logs, `/api/health`, `/api/ready`, rollback e upgrade se KVM 1 nao sustentar o ambiente.
- Bugs `OPS-GH-001`, `OPS-DOCKER-001` e `OPS-HEALTH-001` continuam abertos como bloqueadores, com status documental sincronizado.

Limitacao: nao houve deploy real, URL HTTPS publicada, acesso Hostinger/Coolify, smoke externo, Docker image validation, branch protection efetiva, release/tag ou rerun Supabase/Auth/RLS. Esta etapa nao libera beta real nem producao.

## Decisoes atuais de release

- Plataforma: Hostinger VPS KVM 1 com Coolify.
- Gate de infraestrutura: upgrade obrigatorio se KVM 1 nao sustentar build, runtime, logs, HTTPS e rollback com estabilidade.
- Dominio: sera adquirido na Hostinger; dominio exato ainda e gate manual.
- Supabase: projeto principal somente apos cutover validado e aprovado.
- IA: provider selecionavel planejado `automatic`, `openai` ou `deepseek`, padrao `automatic`, sem fallback automatico entre providers.
- IA Etapa 5: camada server-side de roteamento existe localmente, mas `AI_REAL_ENABLED=false` continua default e provider real exige secrets, consentimento, evals aprovados e kill switch explicito.
- Consentimento de IA: separado, versionado e revogavel por provider.
- E-mail: Resend para transacional e SMTP customizado do Supabase Auth; adapter local preparado, envio real bloqueado ate dominio/secrets/smoke.
- Analytics: first-party no Supabase, opt-in desligado por padrao.
- Retencao: 90 dias para analytics, feedback beta e metadados de auditoria de IA.
- Etapa 7: `/settings` preparado localmente para preferencias, consentimentos versionados, analytics opt-in, feedback beta, export JSON e solicitacao de exclusao; validacao remota ainda pendente.
- Etapa 8: rollback/docs de Hostinger/Coolify sincronizados; preview continua pendente sem dominio/VPS/Coolify/smoke externo.

## Bloqueadores antes do beta real

- Corrigir/validar S0/S1 do `docs/BUG_TRIAGE.md`, especialmente Auth SSR, tipos Supabase, health/readiness, CI/release, consentimento persistido, dados demonstrativos e integracoes reais.
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
- Validar em preview aprovado as tabelas/policies de `product_analytics_events`, `beta_feedback_items`, `account_deletion_requests`, `user_preferences` e consentimentos ampliados.
- Confirmar que analytics/feedback reais bloqueiam sem consentimento e que exportacao nao inclui secrets/tokens/hashes/logs internos.
- Ensaiar Docker/Coolify/rollback com release/tag ou deployment anterior conhecido.
- Configurar CI ou registrar limitacao operacional aceita antes de qualquer release publica.
- Validar gate da Hostinger KVM 1: build, runtime, logs, HTTPS, restart, recursos e rollback estaveis; fazer upgrade se falhar.

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
- Resend real configurado com dominio/remetente, SMTP Auth e smoke de entrega.
- Analytics real consentido.
- Feedback beta real consentido e sem persistir indicio sensivel.
- Exportacao/exclusao validadas remotamente.
- Health/readiness produtivo.
- Docker/Coolify validado.
- Branch protection/release/rollback referenciavel.
- Preview HTTPS Hostinger/Coolify publicado.
- Beta real com usuarios.

## Auditoria transversal PR #10

Data: 2026-06-05.

Status: aprovado com restricoes para merge preparatorio; bloqueado para beta/release real.

Contexto GitHub:

- Branch: `codex/ci-docker-hostinger-preview`.
- PR: `#10`, draft antes da auditoria, merge state `CLEAN`.
- Commit auditado antes do registro documental: `243805c`.
- CI remoto: `Lint, test, build and E2E` passou no GitHub.

Gates frescos locais:

- `npm.cmd run lint`: passou.
- `npm.cmd run typecheck`: passou.
- `npm.cmd run test`: passou, 39 arquivos e 233 testes.
- `npm.cmd run build`: passou; build local total observado ~66s, compilacao 23,4s, TypeScript 14,8s, 45 paginas em 3,2s.
- `npm.cmd run test:e2e`: passou, 35 testes e 5 external-smoke pulados por design.
- `git diff --check`: passou.
- Secret scan do diff: sem padroes reais de secrets.

Smoke/performance:

- `npm.cmd run test:e2e:external` sem URL abortou corretamente.
- Smoke local dedicado com `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000` passou 5 testes em 6,5s.
- Rotas principais apos warmup responderam entre 67 ms e 207 ms; `/api/health` e `/api/ready` responderam em 18 ms.

Achados:

- Nenhum S0 novo encontrado.
- Nenhum S1 novo de codigo funcional encontrado.
- `OPS-GH-001` reduziu porque o CI remoto existe e passou, mas segue S1 para beta/release sem branch protection/governanca equivalente, release/tag/deployment anterior e rollback referenciavel.
- `OPS-DOCKER-001` segue S1 porque Docker daemon local estava indisponivel e Coolify/rollback nao foram ensaiados.
- `OPS-HEALTH-001` reduziu localmente, mas segue S1 externo sem URL HTTPS publicada.
- `SEC-CSP-001` segue S2 por `unsafe-inline`.
- `OPS-START-001` registrado como S3: `npm.cmd run start` avisa que `output: standalone` deve usar `node .next/standalone/server.js`.

Subagentes:

- Foram tentados cinco subagentes conforme a auditoria, mas todos falharam por sessao expirada do conector. A auditoria foi concluida pelo agente principal com evidencias locais.

Recomendacao:

- Merge preparatorio do PR #10 pode seguir apos atualizar estes registros e CI verde.
- Nao liberar beta real, preview publico com usuarios ou producao aberta sem URL HTTPS, Docker/Coolify, secrets no provedor, Supabase/Auth/RLS fresco, smoke externo, KVM gate e rollback ensaiado.
