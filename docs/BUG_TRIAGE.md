# Bug Triage

Data de sincronizacao: 2026-06-04.

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
| OPS-HEALTH-001 | Reduzido localmente | `/api/ready` foi criado separado de `/api/health`, com falha fechada fora de `local-demo` quando Supabase/Auth essencial esta ausente. Fechamento completo exige smoke externo em preview/deploy aprovado. |
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

## Ledger aberto

| ID | Sev | Dominio | Titulo | Evidencia | Proximo passo | Criterio de fechamento |
|---|---|---|---|---|---|---|
| AUTH-SSR-001 | S1 | Auth | Auth SSR local implementado, externo nao validado | Fundacao local existe e gates locais passaram, mas nao houve URL HTTPS, Site URL/Redirect URLs Supabase, SMTP/Resend nem smoke externo de cookies reais | Publicar preview aprovado, configurar redirects Auth e validar fluxo real completo | Smoke Auth em URL HTTPS cobre signup, confirmacao, login, rota protegida, logout, recovery, redirects seguros e refresh/getClaims |
| DB-TYPES-001 | S1 | Supabase | Tipos de banco continuam genericos | `src/types/database.ts` usa `Record<string, ...>` | Gerar tipos reais apos cutover preview aprovado | Diff de tipos reais revisado e typecheck passa com schema concreto |
| OPS-HEALTH-001 | S1 | Operacao | Readiness externo nao validado | `/api/ready` existe localmente, mas ainda nao foi validado em preview/deploy aprovado | Rodar smoke externo em URL HTTPS e confirmar falha fechada quando config essencial faltar | Smoke externo usa endpoint que detecta Supabase/Auth/config ausente |
| OPS-GH-001 | S1 | GitHub/release | Sem CI, branch protection efetiva ou releases | API GitHub: `main` protected false, zero workflows, zero releases | Criar workflow/gates, tags/release process ou registrar limitacao operacional aceita | PR/release exige CI verde e rollback referenciavel |
| OPS-DOCKER-001 | S1 | Deploy | Docker/rollback nao ensaiados | Dockerfile sem `HEALTHCHECK`; imagem nao validada nesta auditoria; sem releases/deployments | Validar build da imagem, healthcheck e rollback Coolify | Smoke de container e rollback rehearsal documentados |
| ANALYTICS-001 | S1 | Analytics/LGPD | Analytics nao bloqueia coleta sem consentimento | Contrato local ainda aceita evento sem persistencia; docs exigem bloqueio | Implementar opt-in off, revogacao e retencao 90 dias antes de persistir | Teste confirma ausencia/revogacao de consentimento bloqueia evento |
| EMAIL-RESEND-001 | S1 | Email/Auth | Resend decidido, mas nao implementado/configurado | Docs atualizados; codigo ainda sem adapter Resend/SMTP Auth | Implementar adapter server-only, dominio, SMTP Auth e templates seguros | E-mail real passa smoke com dominio verificado e sem dados sensiveis |
| PROD-DEMO-001 | S1 | Produto/dados | Smoke autenticado externo ainda nao comprovou ausencia de demo | Etapa 4 removeu `sample*` direto de `src/app`/`src/components` e usa empty states/queries, mas faltam URL HTTPS, Auth real e RLS remoto fresco | Rodar smoke autenticado contra preview aprovado cobrindo dashboard, goals/tasks, calendar/inbox, accountability e mobile | Smoke autenticado mostra dados do usuario ou vazio real; nenhuma amostra aparece fora de `local-demo` |
| SEC-CSP-001 | S2 | Seguranca | CSP ainda permite `unsafe-inline` | `unsafe-eval` saiu de producao, mas `script-src`/`style-src` ainda mantem `unsafe-inline` | Implementar nonce/hash ou decisao formal de risco antes de deploy publico | Build/E2E passam com nonce/hash ou risco residual aprovado |
| QA-INT-001 | S2 | Testes | Integracao real ampla ainda insuficiente | Suite mockada de runtime existe, mas preview/Auth/RLS real ainda nao tem cobertura fresca | Expandir actions/server/Supabase mockado e, em ambiente aprovado, preview RLS/Auth | Gate inclui integracao relevante por modulo e evidencia fresca de preview |
| PWA-AUTH-CACHE-001 | S2 | PWA/Auth | Cache PWA precisa de prova negativa para Auth | Docs exigem cache apenas de assets seguros, mas smoke publicado ainda nao provou que `/auth`, callbacks, recovery, APIs autenticadas, server actions e payloads privados ficam fora do cache | Validar service worker em HTTPS e adicionar smoke/regressao quando houver preview | Evidencia mostra que rotas Auth e respostas privadas nao entram em CacheStorage/offline |

## Regras de fechamento

- Fechar bug apenas com evidencia no arquivo certo (`BUG_FIX_LOG.md`, `SECURITY_AUDIT_REPORT.md`, `RLS_TEST_REPORT.md`, `SMOKE_TEST_REPORT.md` ou PR).
- Para S0/S1, exigir teste focado e gate proporcional.
- Nao fechar com base em plano, SQL versionado, mock local ou evidencia historica sem rerun no ambiente correto.
