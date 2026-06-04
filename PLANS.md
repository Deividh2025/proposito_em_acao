# PLANS.md

Todo trabalho complexo deve ter um plano antes da implementacao. O plano deve ser curto o bastante para ser usado e completo o bastante para outro agente executar sem decidir arquitetura no improviso.

## Quando criar plano

Crie plano antes de qualquer tarefa que:

- toque multiplos arquivos;
- altere comportamento de produto;
- envolva IA, Supabase, RLS, dados sensiveis, Atalaia ou Metacognicao;
- introduza dependencia, stack, deploy, autenticacao ou migracao;
- possa afetar roadmap, seguranca, UX ou documentacao publica.

## Template obrigatorio

```md
# Titulo do plano

## Objetivo

Uma frase dizendo o que sera entregue.

## Contexto

Fonte de verdade consultada, estado atual do repositorio e decisoes ja fixadas.

## Arquivos envolvidos

- Criar:
- Modificar:
- Nao tocar:

## Subagentes necessarios

Liste os subagentes por responsabilidade. Marque `N/A` somente para tarefa pequena e local.

## Skills necessarias

Liste skills do projeto ou skills externas relevantes.

## Riscos

Escopo, seguranca, privacidade, IA, dados, UX, dependencia externa e rollback.

## Estrategia

Passos concretos em ordem, com limites claros do que nao sera feito.

## Criterios de aceite

Comportamentos ou artefatos verificaveis.

## Testes e verificacoes

Comandos exatos, resultado esperado e justificativa para qualquer `N/A`.

## Rollback

Como desfazer com seguranca.

## Documentacao a atualizar

Docs que devem mudar junto com a implementacao.
```

## Roadmap macro

1. Preparacao do repositorio.
2. Fontes de verdade completas.
3. Stack e arquitetura.
4. Supabase, Auth, banco, RLS e storage privado.
5. Design system e shell do app.
6. Onboarding e direcao.
7. IA central e structured outputs.
8. Alvos, projetos e tarefas.
9. Calendario e inbox.
10. Desbloqueador de Acao e Metacognicao.
11. Foco, habitos e Placar.
12. Revisao semanal e Jardim da Vida.
13. Atalaia, compromisso e consentimentos.
14. Mobile/PWA complementar.
15. QA, seguranca e privacidade.
16. Deploy.
17. Beta fechado, observabilidade, feedback, metricas e plano V1.1.

## Plano executado - Etapa 4 dados autenticados nas interfaces

## Objetivo

Substituir dados demonstrativos das rotas principais por dados reais autenticados via Supabase/RLS ou empty states reais, mantendo samples apenas em `local-demo`, fixtures e testes.

## Contexto

Lidos `AGENTS.md`, este arquivo, `docs/PRD.md`, `docs/BACKEND_ARCHITECTURE.md`, `docs/FRONTEND_ARCHITECTURE.md`, `docs/DATABASE_SCHEMA.md`, `docs/BUG_TRIAGE.md`, `docs/RELEASE_READINESS.md` e `docs/TESTING_STRATEGY.md`. PRs das Etapas 0-3 foram confirmadas/mergeadas na `main`; PR #5 de Auth SSR foi validada localmente e mergeada antes desta branch. Supabase/Auth/RLS externo segue pendente de evidencia fresca.

## Arquivos envolvidos

- Criar: queries server-only em `src/lib/supabase/queries/**` e testes focados de contrato/mappers/dados autenticados.
- Modificar: rotas e componentes dos dominios permitidos, docs obrigatorias da etapa e testes unitarios/integracao/E2E proporcionais.
- Nao tocar: migrations, policies RLS, deploy, CI/CD, Docker, provider real de IA, Resend/SMTP e analytics real.

## Subagentes necessarios

- Subagente 1: dashboard, onboarding, goals, projects e tasks.
- Subagente 2: calendar, inbox, focus, habits e scoreboard.
- Subagente 3: review, garden, metacognition e action-unblocker.
- Subagente 4: accountability, commitments e mobile.
- Subagente 5: testes e docs.

## Skills necessarias

`execution-plan-skill`, `nextjs-tailwind-skill`, `supabase-architecture-skill`, `auth-security-skill`, `security-privacy-skill`, `testing-architecture-skill`, `frontend-playwright-qa-skill`, `ux-tdah-first-skill`, `docs-sync-skill` e skills dos dominios tocados.

## Riscos

- Mostrar sample como dado real fora de `local-demo`.
- Tratar erro real de Supabase/Auth/RLS como sucesso local.
- Expor dados sensiveis de Metacognicao, Inbox, Calendario, Revisao ou Chamado ao Atalaia.
- Criar queries amplas demais ou usar `service_role` em fluxo normal.
- Declarar preview/Auth/RLS externo como validado sem smoke fresco.

## Estrategia

1. Criar contrato comum de fonte de dados autenticada por runtime.
2. Criar queries server-only por dominio com usuario validado, mappers e erros sanitizados.
3. Migrar rotas para dados reais ou empty states; preservar samples apenas como `local-demo` honesto.
4. Ampliar testes para mappers, queries, empty states, ausencia de sample fora de `local-demo` e privacidade do Atalaia.
5. Atualizar docs obrigatorias sem fechar validacoes externas pendentes.

## Criterios de aceite

- Rotas principais nao exibem sample data em `preview`, `beta` ou `production`.
- Usuario autenticado ve dados reais via Supabase/RLS ou vazio real.
- Usuario sem dados nao recebe fixtures inventadas.
- Atalaia ve apenas dados autorizados por grant ja existente.
- Mobile nao cacheia dados sensiveis.
- `PROD-DEMO-001` fica fechado ou reduzido com lista clara de pendencias.

## Testes e verificacoes

- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd run test`
- `npm.cmd run build`
- `npm.cmd run test:e2e`
- `git diff --check`
- Smoke externo e `supabase:validate:preview` somente se ambiente aprovado/URL HTTPS/secrets estiverem disponiveis.

Resultado local em 2026-06-04: `lint`, `typecheck`, `test` (31 arquivos/170 testes), `build`, `test:e2e` (33 testes), `git diff --check` e secret scan do diff passaram. Smoke externo/Auth/RLS preview ficou pendente por ausencia de URL HTTPS/ambiente aprovado.

## Rollback

Reverter o commit/PR da Etapa 4. Como nao ha migrations nem policies novas, rollback e limitado a codigo/docs/testes.

## Documentacao a atualizar

`docs/BUG_TRIAGE.md`, `docs/BUG_FIX_LOG.md`, `docs/FRONTEND_ARCHITECTURE.md`, `docs/BACKEND_ARCHITECTURE.md`, `docs/TESTING_STRATEGY.md`, `docs/SECURITY_AUDIT_REPORT.md`, `docs/RELEASE_READINESS.md`, `docs/BETA_CHECKLIST.md`, `docs/CHANGELOG.md` e docs especificas de modulo quando comportamento mudar.

## Plano - Etapa 5 IA real com OpenAI/DeepSeek, consentimento, roteamento e guardrails

## Objetivo

Implementar a camada server-side de providers OpenAI/DeepSeek com roteamento por preferencia, kill switch, consentimento por provider, guardrails antes/depois do provider, schema validation, fallback local seguro e auditoria minima sem prompt/resposta bruta.

## Contexto

Lidos `AGENTS.md`, `PLANS.md`, `docs/AI_ARCHITECTURE.md`, `docs/AI_AGENTS.md`, `docs/AI_GUARDRAILS.md`, `docs/AI_EVALS.md`, `docs/OPENAI_INTEGRATION_PLAN.md`, `docs/SECURITY_PRIVACY.md`, `docs/DATA_SENSITIVITY_MATRIX.md`, `docs/ENVIRONMENT_VARIABLES.md`, `docs/BUG_TRIAGE.md` e `docs/RELEASE_READINESS.md`. PRs #1 a #6 foram confirmados mergeados na `main` em 2026-06-04; a `main` local esta em `ab238cf`. Docs oficiais consultadas: OpenAI Responses API/Structured Outputs/modelos atuais e DeepSeek API/JSON Output. Decisoes fixas: `automatic|openai|deepseek`, default `automatic`, sem fallback automatico entre providers, IA real bloqueada por `AI_REAL_ENABLED=false` ate aprovacao operacional.

## Arquivos envolvidos

- Criar: `src/lib/deepseek/**` ou helpers em `src/lib/ai/**`, testes focados de provider/routing/consentimento/evals.
- Modificar: `src/lib/openai/**`, `src/ai/**`, actions elegiveis que hoje usam mocks, `.env.example`, `src/lib/config/env.ts`, docs obrigatorias da etapa.
- Nao tocar: migrations/RLS/Auth/roles/grants, Resend/e-mail real, analytics/feedback real, deploy/Coolify, CI/CD, chaves reais e qualquer ativacao de provider real por padrao.

## Subagentes necessarios

- Subagente 1: Providers e roteamento, sem UI.
- Subagente 2: Guardrails e structured outputs.
- Subagente 3: Consentimento, privacidade, redaction e auditoria.
- Subagente 4: Evals e testes negativos/positivos.
- Subagente 5: Docs e release readiness.

## Skills necessarias

`execution-plan-skill`, `openai-integration-skill`, `ai-guardrails-skill`, `ai-evals-skill`, `ai-structured-output-skill`, `prompt-versioning-skill`, `security-privacy-skill`, `pastoral-safety-skill`, `metacognition-skill`, `testing-architecture-skill`, `docs-sync-skill`, `github:github`, `github:yeet`, `superpowers:test-driven-development` e `superpowers:verification-before-completion`.

## Riscos

- Chamar OpenAI/DeepSeek real sem kill switch, consentimento, secrets e autorizacao.
- Tratar JSON Output do DeepSeek como schema estrito.
- Fazer fallback automatico entre providers e mascarar falha real.
- Registrar prompt bruto, resposta bruta, conteudo intimo ou secrets em auditoria/logs.
- Registrar `guardrail_status` incorreto ou deixar guardrails como `not_run`.
- Enviar Metacognicao, Chamado, Revisao Semanal, Atalaia ou dados sensiveis sem minimizacao e consentimento.

## Estrategia

1. Escrever testes RED para tipos, env, roteamento, consentimento, kill switch, DeepSeek mockado, OpenAI mockado, falhas sem cross-provider fallback, timeout, schema invalido, redaction recursiva e guardrails.
2. Criar camada server-side unificada para resolver provider/modelo por agente e preferencia, mantendo `mock` como padrao local.
3. Adicionar DeepSeek adapter server-only usando API compativel com OpenAI, validando sempre com Zod e tratando JSON Output apenas como auxilio de formato.
4. Corrigir `safeInvokeAi` para rodar guardrail de entrada, provider/mock, schema validation, guardrail de saida e auditoria minima com `guardrail_status` real.
5. Implementar checagem preparada de consentimento por provider, versionada/revogavel, sem criar consentimento automaticamente.
6. Conectar fluxos elegiveis a camada segura mantendo mocks deterministas/fallback local seguro; nenhuma chamada real acontece com `AI_REAL_ENABLED=false`.
7. Atualizar docs e bug triage com bugs fechados/reduzidos e pendencias externas.

## Criterios de aceite

- Tipos incluem `mock|openai|deepseek`, preferencia `automatic|openai|deepseek`, modos `mock|real|fallback` e guardrails `passed|blocked|failed`.
- OpenAI e DeepSeek ficam representados como providers server-side e bloqueados por default.
- Roteador respeita preferencia, agente, consentimento, kill switch e nunca troca automaticamente entre OpenAI e DeepSeek apos falha.
- Falta/revogacao de consentimento bloqueia chamada real e retorna fallback seguro/estado de revisao.
- `guardrail_status` deixa de ser `not_run` em provider/mock/fallback executado.
- Zod bloqueia saida invalida antes de persistir/usar.
- Redaction recursiva remove chaves sensiveis case-insensitive.
- Evals negativos cobrem Metacognicao, Atalaia, pastoral safety, crise, schema invalido, timeout e provider failure.

## Testes e verificacoes

- RED/GREEN focado com `npm.cmd run test -- <arquivos de teste da camada IA>`.
- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd run test`
- `npm.cmd run build`
- `npm.cmd run test:e2e`
- `git diff --check`
- Sem chamadas reais a OpenAI/DeepSeek; qualquer teste de provider usa mock/stub.

## Rollback

Reverter o commit/PR da Etapa 5. Como nao ha migrations, deploy, secrets ou provider real ativado por default, rollback fica limitado a codigo/docs/testes/env placeholders.

## Documentacao a atualizar

`docs/AI_ARCHITECTURE.md`, `docs/AI_AGENTS.md`, `docs/AI_GUARDRAILS.md`, `docs/AI_EVALS.md`, `docs/AI_EVALS_REPORT.md`, `docs/OPENAI_INTEGRATION_PLAN.md`, `docs/SECURITY_PRIVACY.md`, `docs/DATA_SENSITIVITY_MATRIX.md`, `docs/ENVIRONMENT_VARIABLES.md`, `docs/BUG_TRIAGE.md`, `docs/BUG_FIX_LOG.md`, `docs/RELEASE_READINESS.md`, `docs/BETA_CHECKLIST.md`, `docs/CHANGELOG.md` e `AGENTS.md` se a regra duravel nova precisar ser reforcada.

## Plano - Etapa 6 Resend, SMTP Auth e e-mails transacionais seguros

## Objetivo

Implementar provider Resend server-only, templates transacionais neutros, trilha minima de status/webhook e documentacao de SMTP Auth sem ativar envio real por padrao.

## Contexto

Lidos `AGENTS.md`, `PLANS.md`, `docs/EMAIL_NOTIFICATIONS.md`, `docs/SUPABASE_AUTH.md`, `docs/SECURITY_PRIVACY.md`, `docs/DATA_SENSITIVITY_MATRIX.md`, `docs/ENVIRONMENT_VARIABLES.md`, `docs/BUG_TRIAGE.md`, `docs/RELEASE_READINESS.md` e `docs/BETA_CHECKLIST.md`. GitHub confirmou PRs #1 a #7 mergeados na `main`, incluindo a Etapa 5 em PR #7. `main` local foi atualizada por `git pull --ff-only origin main` e a branch `codex/resend-transactional-email` foi criada. Estado atual: e-mail real decidido como Resend, mas adapter real, SMTP Auth, webhook e dominio/remetente verificado ainda nao existem; `EMAIL_REAL_ENABLED=false` permanece default.

## Arquivos envolvidos

- Criar: `src/lib/email/resendProvider.ts`, `src/lib/email/redaction.ts`, `src/app/api/email/resend/webhook/route.ts` e testes focados de provider/templates/webhook/Atalaia.
- Modificar: `src/lib/config/env.ts`, `src/lib/email/provider.ts`, `src/lib/email/mockProvider.ts`, `src/lib/email/templates/accountability.ts`, `src/domain/notifications/types.ts`, `src/app/accountability/actions.ts`, `.env.example`, `AGENTS.md` se regra duravel precisar ser reforcada, docs obrigatorias da etapa e testes existentes.
- Nao tocar: migrations/RLS/Auth roles/grants/policies, deploy Hostinger/Coolify, dominio real, producao aberta, analytics/feedback, provider IA real, secrets reais e envio real para usuarios beta.

## Subagentes necessarios

- Subagente 1: Provider Resend, envs, timeout e bloqueios de configuracao.
- Subagente 2: Templates, privacidade, linguagem neutra e redaction de tokens/links.
- Subagente 3: Atalaia/notificacoes, ordem persistir-depois-tentar-provider, falha honesta e revogacao.
- Subagente 4: Webhook Resend e delivery status com assinatura valida e payload minimo.
- Subagente 5: Supabase Auth SMTP, secrets, release readiness e docs.

## Skills necessarias

`execution-plan-skill`, `email-notifications-skill`, `auth-security-skill`, `accountability-skill`, `accountability-permission-skill`, `security-privacy-skill`, `production-secrets-skill`, `testing-architecture-skill` e `docs-sync-skill`.

## Riscos

- Envio real acidental sem dominio/remetente verificado, `RESEND_API_KEY` e aprovacao operacional.
- Vazamento de invite token, webhook secret, API key, conteudo privado de Atalaia ou payload bruto em logs/docs/testes.
- Marcar notificacao como enviada antes de registrar auditoria ou apos falha de provider.
- Aceitar webhook falso ou payload invalido e atualizar status indevido.
- Criar dependencia nova desnecessaria ou tocar migrations/RLS sem aprovacao.
- Declarar SMTP Auth/Supabase externo validado sem dominio, dashboard e smoke HTTPS.

## Estrategia

1. Manter `fetch` direto para Resend, sem instalar SDK novo.
2. Expandir env server-only com `EMAIL_FROM_AUTH`, `EMAIL_FROM_NOTIFICATIONS`, `RESEND_API_KEY`, `RESEND_WEBHOOK_SECRET`, `RESEND_TEST_RECIPIENT`, timeout e verificacao conservadora de dominio `notify.example.com` como bloqueado.
3. Implementar adapter Resend com kill switch, provider `resend`, timeout via `AbortController`, erros sanitizados e status normalizado `blocked|pending_provider_config|queued|sent|failed`.
4. Endurecer templates para assunto/corpo neutros, sem dados sensiveis e com link autenticado/expiravel; redigir tokens em logs/metadados.
5. Ajustar Atalaia para criar auditoria/notificacao primeiro, tentar provider depois, atualizar status honestamente e cancelar pendentes na revogacao.
6. Criar webhook Resend validado por HMAC quando houver secret, rejeitando sem secret fora de `local-demo`, sem armazenar payload bruto e atualizando status por referencia interna.
7. Atualizar docs de e-mail, SMTP Auth manual, envs, seguranca, release, beta, bug triage/fix log e changelog sem fechar dominios/SMTP real.

## Criterios de aceite

- Adapter Resend server-only existe e bloqueia envio real por default.
- Ausencia de `EMAIL_REAL_ENABLED`, API key, provider, remetente de dominio aprovado ou dominio verificado retorna status honesto.
- Templates minimos de convite Atalaia, aceite, revogacao e documento de compromisso/status autorizado sao neutros e testados contra termos sensiveis.
- Atalaia respeita consentimento/revogacao antes de envio; falha de provider nao marca como enviado.
- Webhook rejeita assinatura invalida e aceita evento valido com status normalizado.
- Supabase Auth SMTP fica documentado como configuracao manual pendente de dominio/remetente verificado.
- Nenhum secret real aparece no diff.

## Testes e verificacoes

- Focados durante implementacao: `npm.cmd run test -- <arquivos de email/accountability/webhook>`.
- Gates finais: `npm.cmd run lint`, `npm.cmd run typecheck`, `npm.cmd run test`, `npm.cmd run build`, `npm.cmd run test:e2e` e `git diff --check`.
- Smoke externo, SMTP Auth real e envio para `RESEND_TEST_RECIPIENT`: N/A nesta etapa sem dominio/aprovacao explicita.

## Rollback

Reverter o commit/PR da Etapa 6. Como nao ha migrations, deploy, secrets reais nem configuracao remota, rollback fica limitado a codigo/docs/testes/env placeholders. Se algum secret for acidentalmente exposto, rotacionar imediatamente e registrar incidente antes de qualquer novo push.

## Documentacao a atualizar

`docs/EMAIL_NOTIFICATIONS.md`, `docs/SUPABASE_AUTH.md`, `docs/ENVIRONMENT_VARIABLES.md`, `docs/SECURITY_PRIVACY.md`, `docs/SECURITY_AUDIT_REPORT.md`, `docs/RELEASE_READINESS.md`, `docs/BETA_CHECKLIST.md`, `docs/BUG_TRIAGE.md`, `docs/BUG_FIX_LOG.md`, `docs/CHANGELOG.md` e `AGENTS.md` se regra duravel nova precisar ser reforcada.

## Regras de execucao

- Nao avancar fase sem criterio de aceite verificavel.
- Nao usar stack ainda nao aprovada.
- Nao criar banco, auth ou chamadas reais de IA sem plano proprio.
- Mudanca relevante sem doc atualizada nao esta pronta.
- Risco de privacidade sem mitigacao bloqueia merge.
- Atalaia exige plano proprio com RLS, consentimento, previa e revogacao.
- Metacognicao exige revisao de guardrails e privacidade.
