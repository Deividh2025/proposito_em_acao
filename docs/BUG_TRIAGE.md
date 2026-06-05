# Bug Triage

Data de sincronizacao: 2026-06-05.

## Objetivo

Padronizar registro, severidade, reproducao e fechamento de bugs do beta fechado. Bugs S0/S1 abaixo bloqueiam beta real ate correcao e verificacao.

## Severidades

- S0 Critico: expoe dados, quebra RLS/Auth, permite Atalaia ver ou ampliar dado privado, expoe secret ou quebra deploy.
- S1 Alto: impede fluxo central, cria falso sucesso em persistencia real, enfraquece seguranca/release ou bloqueia beta real.
- S2 Medio: atrapalha uso com contorno claro ou cria risco localizado.
- S3 Baixo: ajuste visual, copy, docs ou melhoria menor.

## Fechados ou reduzidos na Etapa 1

| ID | Status | Evidencia |
|---|---|---|
| DATA-WRITE-001 | Fechado no escopo da Etapa 1 | Helpers de runtime/fallback e testes focados garantem que erro real de Supabase configurado retorna `ok:false`, nao `local-draft ok:true`. |
| DATA-WRITE-002 | Fechado nos updates/deletes priorizados | Goals/projects/tasks/habits/focus/Atalaia confirmam linha afetada nos updates/deletes alterados; teste cobre zero linha em task. |
| UX-INBOX-001 | Fechado | `InboxCapture` respeita `result.ok` e teste de UI cobre falha sem sucesso visual. |
| CAL-VAL-001 | Fechado | Calendar actions usam `safeParse`; teste cobre input invalido sem exception nao tratada. |
| A11Y-MAIN-001 | Fechado | `MobileShell` usa `section`; E2E cobre um unico `<main>` em `/mobile`. |
| SEC-CSP-001 | Reduzido | `unsafe-eval` foi removido de producao; `unsafe-inline` permanece como risco residual ate nonce/hash. |
| QA-INT-001 | Reduzido | Criada suite executavel `src/tests/integration/runtime-error-contracts.test.ts`; integracao real ampla ainda deve crescer antes do beta. |

## Fechados ou reduzidos na Etapa 2

| ID | Status | Evidencia |
|---|---|---|
| SEC-ATL-001 | Corrigido localmente, pendente preview | Migration `20260603211654_accountability_acceptance_rls_hardening.sql` remove update direto de aceite pelo convidado, adiciona token hash no grant e triggers de imutabilidade; actions aceitam apenas grant vinculado a token/e-mail/parceiro; testes locais cobrem escalada negada. Fechamento completo exige aplicar e validar em Supabase preview aprovado. |
| SEC-ATL-002 | Reduzido | A tela `partner/[inviteToken]` deixou de criar grant demonstrativo e usa preview real sanitizada quando Supabase/Auth esta configurado. Auth SSR completo e E2E autenticado real continuam em `AUTH-SSR-001`. |
| SEC-ATL-003 | Corrigido localmente | `normalizePermissions` preserva exatamente as permissoes revisadas pelo dono; teste garante que permissao removida nao volta por default de nivel. Fechamento para beta acompanha a validacao do fluxo de Atalaia em preview. |
| SEC-CONSENT-001 | Reduzido | Criacao, aceite e revogacao do Atalaia passam a registrar consentimento/evento/notificacao obrigatoria ou retornar `ok:false`; consentimentos amplos de IA/analytics/feedback seguem fora desta etapa. |
| QA-INT-001 | Reduzido | Harness preview inclui `atalia_invited`, tentativa de escalada, aceite especifico e revogacao cortando leituras futuras. Execucao remota fresca continua pendente. |

## Fechados ou reduzidos na Etapa 3

| ID | Status | Evidencia |
|---|---|---|
| AUTH-SSR-001 | Reduzido localmente | `proxy.ts`, `src/lib/supabase/proxy.ts`, rotas `/auth/callback`, `/auth/confirm`, `/auth/error`, `/auth/forgot-password`, `/auth/update-password`, redirects seguros e testes Auth SSR foram implementados. Fechamento completo exige URL HTTPS publicada, redirects Supabase configurados, smoke Auth externo e evidencia de cookies reais. |
| OPS-HEALTH-001 | Reduzido localmente | `/api/ready` foi criado separado de `/api/health`, com falha fechada fora de `local-demo` quando Supabase/Auth essencial ou `NEXT_PUBLIC_APP_URL` HTTPS publicado estao ausentes. Fechamento completo exige smoke externo em preview/deploy aprovado. |
| QA-INT-001 | Reduzido | Suites Auth SSR/unit/integration/E2E foram adicionadas; ainda falta cobertura Auth/RLS real em preview aprovado. |

## Fechados ou reduzidos na Etapa 4

| ID | Status | Evidencia |
|---|---|---|
| PROD-DEMO-001 | Reduzido fortemente localmente | Dashboard, goals, projects, tasks, calendar, inbox, focus, habits, scoreboard, review history, garden, metacognition history, accountability, commitments e mobile/today passam a usar queries server-only autenticadas ou empty states reais; amostras ficam encapsuladas e rotuladas apenas em `local-demo`. Fechamento completo exige smoke autenticado em preview HTTPS com Supabase/Auth/RLS real. |
| QA-INT-001 | Reduzido | Adicionados testes unitarios de contrato de dados autenticados, mappers Supabase, queries de execucao/rotina/mobile/Atalaia e privacidade de Atalaia; suites locais passaram, mas preview/Auth/RLS real segue pendente. |
| PWA-AUTH-CACHE-001 | Mantido como pendente | Mobile usa dados minimos autenticados ou vazio real, mas a prova negativa em HTTPS/CacheStorage ainda depende de preview publicado. |

## Fechados ou reduzidos na Etapa 5

| ID | Status | Evidencia |
|---|---|---|
| AI-GUARD-001 | Fechado localmente | `safeInvokeAi` executa guardrails de entrada/saida e `ai_run_audit_v1` aceita apenas `passed`, `blocked` ou `failed`; teste focado cobre provider/mock sem `not_run`, crise antes do provider, schema invalido, timeout e fallback seguro. |
| AI-DEEPSEEK-001 | Fechado localmente | `src/lib/deepseek/provider.ts` implementa adapter server-only com API compativel OpenAI, JSON parse e validacao Zod; teste mockado cobre DeepSeek sem chamada real. Ativacao real segue bloqueada por secrets/evals/consentimento/kill switch. |
| SEC-CONSENT-001 | Reduzido para IA | Roteamento/invoker real de IA checa consentimento versionado por provider antes da chamada e retorna fallback local seguro quando ausente/revogado; persistencia ampla de consentimentos segue gate de LGPD/banco. |
| QA-INT-001 | Reduzido | Evals e unit tests de provider routing cobrem OpenAI/DeepSeek mockados, roteamento, consentimento, kill switch, falha sem fallback cruzado, schema invalido, timeout, redaction e guardrails IO. |

## Auditoria transversal do PR #7

Data: 2026-06-04.

Status geral: aprovado com restricoes para merge preparatorio; bloqueado para beta/release real.

| ID | Status | Evidencia |
|---|---|---|
| AI-GUARD-001 | Reauditado e mantido fechado localmente | A auditoria encontrou lacunas em timeout abortavel, sanitizacao de input antes de provider, limite diario stub e saida de Atalaia. Foram corrigidas em `src/lib/openai/safeInvoke.ts`, `src/lib/ai/invoke.ts`, providers OpenAI/DeepSeek e testes focados. |
| AI-DEEPSEEK-001 | Reauditado e mantido fechado localmente | Adapter DeepSeek segue server-only, recebe `AbortSignal`, valida JSON com Zod e permanece bloqueado por kill switch/secrets/consentimento. |
| AI-CRISIS-001 | Fechado localmente | Fallback de crise de Metacognicao deixou de reecoar impulso/pensamento bruto do usuario quando a entrada foi bloqueada por guardrail. |
| QA-INT-001 | Reduzido | Suite local passou apos auditoria com 32 arquivos/194 testes; E2E passou com 33 testes. |

## Fechados ou reduzidos na Etapa 6

| ID | Status | Evidencia |
|---|---|---|
| EMAIL-RESEND-001 | Reduzido localmente | Adapter Resend server-only, templates neutros, webhook assinado e status de provider foram implementados. Envio real segue bloqueado por default e fechamento completo exige dominio/remetente verificado, SMTP Auth Supabase, secrets no provedor e smoke com `RESEND_TEST_RECIPIENT`. |
| AUTH-SSR-001 | Reduzido no eixo SMTP | Procedimento manual de SMTP Auth via Resend foi documentado, mas Auth externo continua bloqueado sem URL HTTPS, dashboard Supabase configurado e smoke real de signup/confirm/recovery. |
| QA-INT-001 | Reduzido | Testes focados cobrem provider bloqueado/mock/Resend, templates sem termos sensiveis, webhook com assinatura invalida/valida e Atalaia nao marcando provider falho como enviado. |

## Auditoria transversal do PR #8

Data: 2026-06-04.

Status geral: aprovado com restricoes para merge preparatorio; bloqueado para beta/release real.

| ID | Status | Evidencia |
|---|---|---|
| EMAIL-RESEND-001 | Reauditado e mantido reduzido localmente | PR #8 estava `MERGEABLE`, mas ainda em draft, sem checks remotos. Gates locais passaram com 35 arquivos/215 testes, build e E2E. Nenhum e-mail real foi enviado e o fechamento segue pendente de dominio/remetente verificado, SMTP Auth Supabase, secrets no provedor e smoke com `RESEND_TEST_RECIPIENT`. |
| QA-INT-001 | Reduzido | `npm.cmd run lint`, `npm.cmd run typecheck`, `npm.cmd run test`, `npm.cmd run build`, `npm.cmd run test:e2e` e `git diff --check` passaram localmente. Smoke local com `next start` e Playwright desktop/mobile cobriu `/`, `/auth`, `/dashboard`, `/metacognition`, `/accountability`, `/api/health` e `/api/ready`, sem console/pageerror. |
| SEC-CSP-001 | Mantido como S2 | Varredura confirmou `script-src 'self' 'unsafe-inline'` em producao e `unsafe-eval` apenas fora de producao. Nao bloqueia merge preparatorio, mas permanece risco antes de beta/producao publica. |
| OPS-GH-001 | Mantido como S1 | PR #8 nao tinha checks remotos configurados no `statusCheckRollup`; CI/branch protection/release continuam bloqueadores de beta/release, nao de merge preparatorio local auditado. |

Subagentes de auditoria foram tentados para cinco recortes, mas todos falharam por erro externo de sessao encerrada do conector. A classificacao acima se baseia em inspecao e comandos locais reproduziveis.

## Ledger aberto

| ID | Sev | Dominio | Titulo | Evidencia | Proximo passo | Criterio de fechamento |
|---|---|---|---|---|---|---|
| AUTH-SSR-001 | S1 | Auth | Auth SSR local implementado, externo nao validado | Fundacao local existe e gates locais passaram, mas nao houve URL HTTPS, Site URL/Redirect URLs Supabase, SMTP/Resend nem smoke externo de cookies reais | Publicar preview aprovado, configurar redirects Auth e validar fluxo real completo | Smoke Auth em URL HTTPS cobre signup, confirmacao, login, rota protegida, logout, recovery, redirects seguros e refresh/getClaims |
| DB-TYPES-001 | S1 | Supabase | Tipos de banco continuam genericos | `src/types/database.ts` usa `Record<string, ...>` | Gerar tipos reais apos cutover preview aprovado | Diff de tipos reais revisado e typecheck passa com schema concreto |
| OPS-HEALTH-001 | S1 | Operacao | Readiness externo nao validado | `/api/ready` existe localmente e valida Supabase/Auth essencial mais URL HTTPS publicada fora de `local-demo`, mas ainda nao foi validado em preview/deploy aprovado | Rodar smoke externo em URL HTTPS e confirmar falha fechada quando config essencial faltar | Smoke externo usa endpoint que detecta Supabase/Auth/config/app URL ausente |
| OPS-GH-001 | S1 | GitHub/release | CI/branch protection/release ainda nao efetivos para beta | Workflow local pode estar preparado, mas ainda faltam branch protection efetiva ou governanca equivalente, checks remotos obrigatorios, releases/tags e deployment anterior referenciavel | Validar workflow remoto, exigir gates, criar tags/release process ou registrar limitacao operacional aceita | PR/release exige CI verde obrigatorio e rollback referenciavel |
| OPS-DOCKER-001 | S1 | Deploy | Docker/rollback nao ensaiados | Dockerfile pode estar preparado com healthcheck, mas `docker build -t proposito-em-acao:codex-preview .` falhou porque o daemon `dockerDesktopLinuxEngine` nao estava disponivel; imagem, container e rollback Coolify ainda nao foram validados em VPS; sem releases/deployments publicados | Validar build da imagem, healthcheck em container real e rollback Coolify | Smoke de container e rollback rehearsal documentados |
| ANALYTICS-001 | S1 | Analytics/LGPD | Reduzido localmente; validacao remota pendente | Etapa 7 prepara persistencia somente com `product_analytics_v1`, allowlist, metadata minimizada, migration/RLS local e retencao 90 dias; falta aplicacao/typegen e preview fresco | Validar tabelas/policies em Supabase preview aprovado e rodar harness/smoke | Preview confirma ausencia/revogacao de consentimento bloqueia evento e user B/Atalaia/anon nao acessam |
| AI-CONSENT-AUDIT-001 | S1 | IA/LGPD | Consentimento e auditoria de IA ainda nao sao persistidos | A rota checa `consentRecords`, mas os fluxos reais ainda nao consultam/persistem consentimento/auditoria em banco | Implementar persistencia de consentimento por provider e `ai_run_audits` com retencao 90 dias em etapa aprovada | IA real so chama provider quando consentimento versionado/revogavel e auditoria minima persistida estiverem validados |
| EMAIL-RESEND-001 | S1 | Email/Auth | Resend preparado localmente, mas nao configurado em dominio/SMTP real | Etapa 6 adicionou adapter Resend server-only, templates neutros, webhook assinado e testes locais; envio real segue bloqueado por `EMAIL_REAL_ENABLED=false`, `EMAIL_DOMAIN_VERIFIED=false`, sem dominio/remetente verificado e sem SMTP Auth dashboard | Configurar dominio/remetente Resend, SMTP Auth Supabase e smoke aprovado com `RESEND_TEST_RECIPIENT` | E-mail real passa smoke com dominio verificado, webhook delivered/bounced e sem dados sensiveis |
| PROD-DEMO-001 | S1 | Produto/dados | Smoke autenticado externo ainda nao comprovou ausencia de demo | Etapa 4 removeu `sample*` direto de `src/app`/`src/components` e usa empty states/queries, mas faltam URL HTTPS, Auth real e RLS remoto fresco | Rodar smoke autenticado contra preview aprovado cobrindo dashboard, goals/tasks, calendar/inbox, accountability e mobile | Smoke autenticado mostra dados do usuario ou vazio real; nenhuma amostra aparece fora de `local-demo` |
| SEC-CSP-001 | S2 | Seguranca | CSP ainda permite `unsafe-inline` | `unsafe-eval` saiu de producao, mas `script-src`/`style-src` ainda mantem `unsafe-inline` | Implementar nonce/hash ou decisao formal de risco antes de deploy publico | Build/E2E passam com nonce/hash ou risco residual aprovado |
| QA-INT-001 | S2 | Testes | Integracao real ampla ainda insuficiente | Suite mockada de runtime existe, mas preview/Auth/RLS real ainda nao tem cobertura fresca | Expandir actions/server/Supabase mockado e, em ambiente aprovado, preview RLS/Auth | Gate inclui integracao relevante por modulo e evidencia fresca de preview |
| AI-RATE-PERSIST-001 | S2 | IA/custos | Limite diario de IA ainda depende de contador externo | `AI_DAILY_USER_LIMIT` e `checkAiDailyLimit` bloqueiam chamada quando `usedToday` e informado, mas ainda nao ha contador persistido por usuario | Implementar contador diario server-side antes de ativar IA real | Teste de integracao prova bloqueio por usuario/dia sem chamada externa |
| AI-READY-001 | S2 | Operacao/IA | `/api/ready` ainda nao valida provider real quando IA for ativada | Readiness local cobre app/Supabase/Auth, mas nao valida chaves/modelos OpenAI/DeepSeek sob `AI_REAL_ENABLED=true` | Expandir readiness ou smoke operacional de IA real em ambiente isolado | Preview com IA real falha fechado quando provider/model/API key obrigatorio faltar |
| FEEDBACK-REAL-001 | S2 | Feedback/LGPD | Reduzido localmente; feedback externo ainda pendente | Etapa 7 prepara feedback first-party somente com aviso, `beta_feedback_v1`, envio explicito e bloqueio de indicio sensivel; canal externo segue sem aprovacao | Validar persistencia/RLS em preview aprovado e aprovar canal externo se houver | Feedback real nao salva sem opt-in/aviso, nao persiste indicio sensivel e nao envia a ferramenta externa sem politica aprovada |
| UX-BOUNDARY-001 | S2 | UX/operacao | Rotas App Router ainda nao possuem boundary global de erro/loading | Componentes `ErrorState`/`LoadingState` existem, mas nao ha `src/app/error.tsx`/`loading.tsx` globais | Adicionar boundaries com copy segura e sem vazamento tecnico | Falha de query/action renderiza estado controlado sem stack/overlay |
| PWA-AUTH-CACHE-001 | S2 | PWA/Auth | Cache PWA precisa de prova negativa para Auth | Docs exigem cache apenas de assets seguros, mas smoke publicado ainda nao provou que `/auth`, callbacks, recovery, APIs autenticadas, server actions e payloads privados ficam fora do cache | Validar service worker em HTTPS e adicionar smoke/regressao quando houver preview | Evidencia mostra que rotas Auth e respostas privadas nao entram em CacheStorage/offline |

## Regras de fechamento

- Fechar bug apenas com evidencia no arquivo certo (`BUG_FIX_LOG.md`, `SECURITY_AUDIT_REPORT.md`, `RLS_TEST_REPORT.md`, `SMOKE_TEST_REPORT.md` ou PR).
- Para S0/S1, exigir teste focado e gate proporcional.
- Nao fechar com base em plano, SQL versionado, mock local ou evidencia historica sem rerun no ambiente correto.

## Etapa 7 - reducoes locais

Data: 2026-06-04.

| ID | Status | Evidencia |
|---|---|---|
| ANALYTICS-001 | Reduzido localmente | `src/domain/analytics/` agora prepara persistencia somente com consentimento ativo `product_analytics_v1`, evento allowlisted, metadata minimizada e `expiresAt` de 90 dias; bloqueia consentimento ausente/revogado, evento fora da allowlist e metadata sensivel. Fechamento completo exige aplicar migration/RLS local, gerar typegen e validar Supabase preview com evidencia fresca. |
| FEEDBACK-REAL-001 | Reduzido localmente | `src/domain/feedback/` e actions de settings preparam feedback first-party somente apos aviso/consentimento `beta_feedback_v1`, envio explicito e ausencia de indicio sensivel; envio externo continua bloqueado por politica/canal aprovado. |
| AI-CONSENT-AUDIT-001 | Reduzido no eixo consentimento | `/settings` passa a registrar/revogar consentimentos `ai_provider_openai_v1` e `ai_provider_deepseek_v1`; auditoria persistida de IA real e validacao remota ainda seguem pendentes. |

## Etapa 8 - rollback/docs Hostinger/Coolify

Data: 2026-06-05.

Esta etapa nao fechou bugs S1. Ela sincronizou criterios documentais de operacao, rollback e release para evitar liberar preview/beta sem evidencia externa.

| ID | Status | Evidencia |
|---|---|---|
| OPS-GH-001 | Mantido como S1 | CI/branch protection/release continuam insuficientes para release publica. A documentacao agora exige branch protection efetiva ou governanca equivalente, release/tag/deployment anterior conhecido e rollback referenciavel antes de beta/producao. |
| OPS-DOCKER-001 | Mantido como S1 | Rollback Coolify, Docker image validation, healthcheck operacional e rehearsal em VPS ainda nao foram executados. `docs/ROLLBACK_PLAN.md` e `docs/OPERATIONS_RUNBOOK.md` passaram a exigir ensaio com deployment anterior conhecido. |
| OPS-HEALTH-001 | Mantido como S1 | `/api/ready` foi endurecido para URL HTTPS publicada fora de `local-demo`, mas continua sem evidencia em preview real. A Etapa 8 exige smoke externo em URL HTTPS e falha fechada quando configuracao essencial faltar antes de qualquer beta real. |

Preview Hostinger/Coolify segue pendente sem dominio/URL HTTPS, VPS provisionada, secrets no provedor, smoke externo, Supabase/Auth/RLS fresco e KVM gate validado.

## Auditoria transversal do PR #10

Data: 2026-06-05.

Status geral: aprovado com restricoes para merge preparatorio; bloqueado para beta/release real.

PR auditado: `#10` (`codex/ci-docker-hostinger-preview`), commit local `243805c`, CI remoto `Lint, test, build and E2E` concluido com sucesso.

Subagentes: cinco frentes foram solicitadas, mas todas falharam por erro externo de sessao encerrada do conector. A auditoria foi concluida pelo agente principal com comandos locais reproduziveis.

| ID | Status | Evidencia |
|---|---|---|
| `OPS-GH-001` | Reduzido, ainda S1 para beta/release | Workflow CI existe e passou no PR #10. Ainda faltam branch protection efetiva ou governanca equivalente, release/tag/deployment anterior conhecido e regra operacional de merge para beta/release. |
| `OPS-DOCKER-001` | Mantido como S1 | `docker build -t proposito-em-acao:audit-preview .` falhou porque o daemon `dockerDesktopLinuxEngine` nao estava disponivel; imagem/container/rollback Coolify ainda nao foram ensaiados. |
| `OPS-HEALTH-001` | Reduzido localmente, ainda S1 externo | `/api/health` e `/api/ready` passaram no smoke local dedicado; readiness HTTPS real ainda depende de URL publicada em preview. |
| `SEC-CSP-001` | Mantido como S2 | `next.config.ts` ainda permite `unsafe-inline` em `script-src` e `style-src`; `unsafe-eval` permanece restrito a ambiente nao produtivo. |
| `PWA-AUTH-CACHE-001` | Reduzido localmente, ainda S2 externo | Smoke local dedicado validou service worker sem `cache.put` e sem rotas Auth/API/export em precache; prova final em HTTPS/CacheStorage real segue pendente. |
| `OPS-START-001` | Novo S3 | `npm.cmd run start` ainda usa `next start` e o Next 16 avisa que `output: standalone` deve usar `node .next/standalone/server.js`. Dockerfile ja usa o runtime standalone; ajustar script local/Coolify preset em PR pequeno se o aviso atrapalhar operacao. |

Gates executados nesta auditoria:

- `npm.cmd run lint`: passou.
- `npm.cmd run typecheck`: passou.
- `npm.cmd run test`: passou, 39 arquivos e 233 testes.
- `npm.cmd run build`: passou; build local total observado ~66s, compilacao 23,4s, TypeScript 14,8s, 45 paginas geradas em 3,2s.
- `npm.cmd run test:e2e`: passou; 35 testes, 5 external-smoke pulados por design.
- `git diff --check`: passou.
- Secret scan do diff: sem padroes reais de OpenAI, Supabase JWT, Resend, URL Postgres com senha, private key ou `.env*` adicionado.
- Smoke local dedicado com `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000`: passou, 5 testes em 6,5s.

Performance local observada apos warmup:

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
| `/settings` | 200 | 157 ms |
| `/mobile` | 200 | 92 ms |
| `/api/health` | 200 | 18 ms |
| `/api/ready` | 200 | 18 ms |

Nao foram encontrados novos S0/S1 de codigo funcional nesta auditoria. O merge preparatorio pode seguir se o objetivo for incorporar CI/Docker/docs/smoke local; beta real e producao permanecem bloqueados pelos S1 abertos do ledger.
