# Bug Triage

Data de sincronizacao: 2026-06-03.

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

## Ledger aberto

| ID | Sev | Dominio | Titulo | Evidencia | Proximo passo | Criterio de fechamento |
|---|---|---|---|---|---|---|
| SEC-ATL-001 | S0 | Atalaia/RLS | Atalaia pode ampliar escopo no aceite | `202606010010_accountability_commitment_prompt13_alignment.sql` permite update do grant convidado sem restringir colunas; `accountability/actions.ts` ativa grants por parceiro/status | Corrigir policy/action para imutabilidade de `permissions`, `goal_id`, `user_id`, parceiro e consentimento | Teste negativo RLS com `atalia_invited` nao altera escopo e so ativa grant do convite |
| SEC-ATL-002 | S0 | Atalaia/UX | Tela de aceite usa grant demonstrativo, nao convite real | `src/app/accountability/partner/[inviteToken]/page.tsx` constroi draft local pelo token | Buscar previa real sanitizada e validar token/expiracao/grant especifico | E2E/integ mostra previa real e nao inventa permissoes |
| SEC-ATL-003 | S1 | Atalaia | Permissoes desmarcadas podem voltar por defaults do nivel | `normalizePermissions` adiciona defaults; `PermissionSelector` permite desmarcar | Ajustar UX/regra para consentimento granular explicito | Teste garante que permissao removida nao retorna sem acao do dono |
| SEC-CONSENT-001 | S1 | Consentimento/auditoria | Consentimento e auditoria nao sao persistidos de forma confiavel | Nao ha escrita de `consent_records`; Etapa 1 passou a checar erros de eventos/notificacoes ja existentes, mas consentimento versionado ainda nao foi implementado | Persistir consentimentos versionados e checar erros de auditoria/notificacao em toda rota sensivel | Falha de consentimento/auditoria retorna `ok:false`; teste cobre erro |
| AUTH-SSR-001 | S1 | Auth | Auth SSR incompleto | Ausencia de proxy/middleware, callback, confirmacao e recuperacao; `server.ts` menciona refresh externo | Implementar fluxo SSR completo conforme Supabase Auth | Smoke Auth em URL HTTPS cobre signup, confirmacao, login, logout, recovery e refresh |
| DB-TYPES-001 | S1 | Supabase | Tipos de banco continuam genericos | `src/types/database.ts` usa `Record<string, ...>` | Gerar tipos reais apos cutover preview aprovado | Diff de tipos reais revisado e typecheck passa com schema concreto |
| OPS-HEALTH-001 | S1 | Operacao | Health check nao valida dependencias | `/api/health` retorna sempre `ok:true` | Separar liveness/readiness e validar dependencias no readiness | Smoke externo usa endpoint que detecta Supabase/Auth/config ausente |
| OPS-GH-001 | S1 | GitHub/release | Sem CI, branch protection efetiva ou releases | API GitHub: `main` protected false, zero workflows, zero releases | Criar workflow/gates, tags/release process ou registrar limitacao operacional aceita | PR/release exige CI verde e rollback referenciavel |
| OPS-DOCKER-001 | S1 | Deploy | Docker/rollback nao ensaiados | Dockerfile sem `HEALTHCHECK`; imagem nao validada nesta auditoria; sem releases/deployments | Validar build da imagem, healthcheck e rollback Coolify | Smoke de container e rollback rehearsal documentados |
| AI-GUARD-001 | S1 | IA | Provider path registra guardrails como `not_run` | `src/lib/openai/safeInvoke.ts` retorna auditoria com `guardrail_status: "not_run"` | Integrar guardrail reviewer antes/depois do provider | Evals negativos e teste do provider comprovam guardrails executados |
| AI-DEEPSEEK-001 | S1 | IA | DeepSeek decidido, mas nao implementado | Variaveis existem; tipos aceitam apenas `mock`/`openai` | Implementar adapter DeepSeek server-only ou manter desativado no beta | Provider `deepseek` testado ou explicitamente bloqueado por feature flag |
| ANALYTICS-001 | S1 | Analytics/LGPD | Analytics nao bloqueia coleta sem consentimento | Contrato local ainda aceita evento sem persistencia; docs exigem bloqueio | Implementar opt-in off, revogacao e retencao 90 dias antes de persistir | Teste confirma ausencia/revogacao de consentimento bloqueia evento |
| EMAIL-RESEND-001 | S1 | Email/Auth | Resend decidido, mas nao implementado/configurado | Docs atualizados; codigo ainda sem adapter Resend/SMTP Auth | Implementar adapter server-only, dominio, SMTP Auth e templates seguros | E-mail real passa smoke com dominio verificado e sem dados sensiveis |
| PROD-DEMO-001 | S1 | Produto/dados | Paginas principais usam dados demonstrativos | Goals/projects/tasks/habits/scoreboard/garden/accountability usam `sample*` | Substituir por dados reais do usuario ou rotular claramente no beta | Smoke autenticado mostra dados do usuario ou vazio real |
| SEC-CSP-001 | S2 | Seguranca | CSP ainda permite `unsafe-inline` | `unsafe-eval` saiu de producao, mas `script-src`/`style-src` ainda mantem `unsafe-inline` | Implementar nonce/hash ou decisao formal de risco antes de deploy publico | Build/E2E passam com nonce/hash ou risco residual aprovado |
| QA-INT-001 | S2 | Testes | Integracao real ampla ainda insuficiente | Suite mockada de runtime existe, mas preview/Auth/RLS real ainda nao tem cobertura fresca | Expandir actions/server/Supabase mockado e, em ambiente aprovado, preview RLS/Auth | Gate inclui integracao relevante por modulo e evidencia fresca de preview |

## Regras de fechamento

- Fechar bug apenas com evidencia no arquivo certo (`BUG_FIX_LOG.md`, `SECURITY_AUDIT_REPORT.md`, `RLS_TEST_REPORT.md`, `SMOKE_TEST_REPORT.md` ou PR).
- Para S0/S1, exigir teste focado e gate proporcional.
- Nao fechar com base em plano, SQL versionado, mock local ou evidencia historica sem rerun no ambiente correto.
