# Bug Triage

Data de sincronizacao: 2026-06-03.

## Objetivo

Padronizar registro, severidade, reproducao e fechamento de bugs do beta fechado. Bugs S0/S1 abaixo bloqueiam beta real ate correcao e verificacao.

## Severidades

- S0 Critico: expoe dados, quebra RLS/Auth, permite Atalaia ver ou ampliar dado privado, expõe secret ou quebra deploy.
- S1 Alto: impede fluxo central, cria falso sucesso em persistencia real, enfraquece seguranca/release ou bloqueia beta real.
- S2 Medio: atrapalha uso com contorno claro ou cria risco localizado.
- S3 Baixo: ajuste visual, copy, docs ou melhoria menor.

## Ledger atual

| ID | Sev | Dominio | Titulo | Evidencia | Proximo passo | Criterio de fechamento |
|---|---|---|---|---|---|---|
| SEC-ATL-001 | S0 | Atalaia/RLS | Atalaia pode ampliar escopo no aceite | `202606010010_accountability_commitment_prompt13_alignment.sql` permite update do grant convidado sem restringir colunas; `accountability/actions.ts` ativa grants por parceiro/status | Corrigir policy/action para imutabilidade de `permissions`, `goal_id`, `user_id`, parceiro e consentimento | Teste negativo RLS com `atalia_invited` nao altera escopo e so ativa grant do convite |
| SEC-ATL-002 | S0 | Atalaia/UX | Tela de aceite usa grant demonstrativo, nao convite real | `src/app/accountability/partner/[inviteToken]/page.tsx` constroi draft local pelo token | Buscar previa real sanitizada e validar token/expiracao/grant especifico | E2E/integ mostra previa real e nao inventa permissoes |
| SEC-ATL-003 | S1 | Atalaia | Permissoes desmarcadas podem voltar por defaults do nivel | `normalizePermissions` adiciona defaults; `PermissionSelector` permite desmarcar | Ajustar UX/regra para consentimento granular explicito | Teste garante que permissao removida nao retorna sem acao do dono |
| SEC-CONSENT-001 | S1 | Consentimento/auditoria | Consentimento e auditoria nao sao persistidos de forma confiavel | Nao ha escrita de `consent_records`; inserts de eventos/notificacoes ignoram erro | Persistir consentimentos versionados e checar erros de auditoria/notificacao | Falha de consentimento/auditoria retorna `ok:false`; teste cobre erro |
| AUTH-SSR-001 | S1 | Auth | Auth SSR incompleto | Ausencia de proxy/middleware, callback, confirmacao e recuperacao; `server.ts` menciona refresh externo | Implementar fluxo SSR completo conforme Supabase Auth | Smoke Auth em URL HTTPS cobre signup, confirmacao, login, logout, recovery e refresh |
| DATA-WRITE-001 | S1 | Persistencia | Falhas reais podem virar `local-draft` positivo | Actions fazem `catch { return localDraft(...) }` em fluxos com Supabase configurado | Separar ausencia de configuracao/sessao de falha real | Testes simulam erro Supabase e recebem `ok:false` |
| DATA-WRITE-002 | S1 | Persistencia | Updates/deletes retornam sucesso sem confirmar linha afetada | Goals/projects/tasks/habits/focus/Atalaia checam apenas `error` | Usar `.select("id").maybeSingle()` ou equivalente e tratar zero linhas | Testes owner/nao owner validam erro quando nenhuma linha muda |
| DB-TYPES-001 | S1 | Supabase | Tipos de banco continuam genericos | `src/types/database.ts` usa `Record<string, ...>` | Gerar tipos reais apos cutover preview aprovado | Diff de tipos reais revisado e typecheck passa com schema concreto |
| OPS-HEALTH-001 | S1 | Operacao | Health check nao valida dependencias | `/api/health` retorna sempre `ok:true` | Separar liveness/readiness e validar dependencias no readiness | Smoke externo usa endpoint que detecta Supabase/Auth/config ausente |
| SEC-CSP-001 | S1 | Seguranca | CSP permissiva para producao | `script-src` inclui `unsafe-inline` e `unsafe-eval` | Endurecer CSP com estrategia compatível com Next | Build/E2E passam sem `unsafe-eval` em producao ou risco aceito documentado |
| QA-INT-001 | S1 | Testes | Testes de integracao reais insuficientes | `src/tests/integration/README.md` e pasta sem suites executaveis | Criar testes de actions/server/Supabase mockado e/ou preview | Gate `npm.cmd run test` inclui integracao real relevante |
| OPS-GH-001 | S1 | GitHub/release | Sem CI, branch protection efetiva ou releases | API GitHub: `main` protected false, zero workflows, zero releases | Criar workflow/gates, tags/release process ou registrar limitacao operacional aceita | PR/release exige CI verde e rollback referenciavel |
| OPS-DOCKER-001 | S1 | Deploy | Docker/rollback nao ensaiados | Dockerfile sem `HEALTHCHECK`; imagem nao validada nesta auditoria; sem releases/deployments | Validar build da imagem, healthcheck e rollback Coolify | Smoke de container e rollback rehearsal documentados |
| AI-GUARD-001 | S1 | IA | Provider path registra guardrails como `not_run` | `src/lib/openai/safeInvoke.ts` retorna auditoria com `guardrail_status: "not_run"` | Integrar guardrail reviewer antes/depois do provider | Evals negativos e teste do provider comprovam guardrails executados |
| AI-DEEPSEEK-001 | S1 | IA | DeepSeek decidido, mas nao implementado | Variaveis existem; tipos aceitam apenas `mock`/`openai` | Implementar adapter DeepSeek server-only ou manter desativado no beta | Provider `deepseek` testado ou explicitamente bloqueado por feature flag |
| ANALYTICS-001 | S1 | Analytics/LGPD | Analytics nao bloqueia coleta sem consentimento | Contrato local ainda aceita evento sem persistencia; docs exigem bloqueio | Implementar opt-in off, revogacao e retencao 90 dias antes de persistir | Teste confirma ausencia/revogacao de consentimento bloqueia evento |
| EMAIL-RESEND-001 | S1 | Email/Auth | Resend decidido, mas nao implementado/configurado | Docs atualizados; codigo ainda sem adapter Resend/SMTP Auth | Implementar adapter server-only, dominio, SMTP Auth e templates seguros | E-mail real passa smoke com dominio verificado e sem dados sensiveis |
| UX-INBOX-001 | S1 | Inbox | UI atualiza estado local sem verificar `result.ok` | `InboxCapture.tsx` usa resultado para alterar estado mesmo em falha | Tratar `ok:false` sem marcar sucesso local | Teste/UI mostra erro e nao converte item em falha |
| PROD-DEMO-001 | S1 | Produto/dados | Paginas principais usam dados demonstrativos | Goals/projects/tasks/habits/scoreboard/garden/accountability usam `sample*` | Substituir por dados reais do usuario ou rotular claramente no beta | Smoke autenticado mostra dados do usuario ou vazio real |
| CAL-VAL-001 | S2 | Calendario | Validacao pode lançar antes do tratamento | Schemas `.parse()` antes do `try` em actions de calendario | Capturar `ZodError` e retornar erro controlado | Teste cobre input invalido sem exception nao tratada |
| A11Y-MAIN-001 | S2 | A11y/mobile | Rotas mobile podem ter `<main>` aninhado | `AppShell/MainContent` e `components/mobile/MobileShell` criam `<main>` | Ajustar semantica do shell mobile | Smoke/a11y nao encontra main aninhado |

## Regras de fechamento

- Fechar bug apenas com evidencia no arquivo certo (`BUG_FIX_LOG.md`, `SECURITY_AUDIT_REPORT.md`, `RLS_TEST_REPORT.md`, `SMOKE_TEST_REPORT.md` ou PR).
- Para S0/S1, exigir teste focado e gate proporcional.
- Nao fechar com base em plano, SQL versionado, mock local ou evidencia historica sem rerun no ambiente correto.
