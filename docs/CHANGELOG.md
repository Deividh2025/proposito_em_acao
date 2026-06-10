# Changelog

Todas as mudancas relevantes deste projeto serao registradas aqui.

Formato baseado em Keep a Changelog, com secoes `Added`, `Changed`, `Fixed`, `Security` e `Docs`.

## [Unreleased]

### Added

- Etapa 2 adiciona migration local `20260603211654_accountability_acceptance_rls_hardening.sql` para hardening de aceite do Atalaia, com `invite_token_hash` no grant, triggers de imutabilidade e `search_path` seguro.
- Harness Supabase preview passa a cobrir `atalia_invited`, tentativa de escalada de escopo, aceite de grant especifico e revogacao cortando leituras futuras.
- Etapa 3 adiciona fundacao local de Auth SSR com `proxy.ts`, `src/lib/supabase/proxy.ts`, rotas `/auth/callback`, `/auth/confirm`, `/auth/error`, `/auth/forgot-password`, `/auth/update-password`, helpers server-only de sessao, queries minimas autenticadas e `/api/ready`.
- Etapa 4 adiciona queries server-only por dominio para carregar dados autenticados ou empty states reais nas principais interfaces.
- Etapa 5 adiciona camada server-side de IA com providers `mock`, `openai` e `deepseek`, roteamento `automatic|openai|deepseek`, adapter DeepSeek, consentimento por provider, redaction recursiva e evals de runtime/guardrails.
- Auditoria transversal do PR #7 adiciona regressões de IA para rate limit local, sanitizacao de input de provider, timeout abortavel e bloqueio de output de Atalaia com Metacognicao privada.

- Etapa 6 adiciona adapter Resend server-only com `fetch`, webhook assinado, templates transacionais neutros e testes focados de e-mail.
- Auditoria transversal do PR #8 adiciona registro documental de gates locais, smoke Playwright desktop/mobile, scans de secrets/CSP e status GitHub antes do merge preparatorio.
- Auditoria transversal do PR #10 adiciona registro documental de gates locais/remotos, smoke local dedicado, tempos de rotas, scans de secrets/PWA/service role e status de merge preparatorio.
- PR runner reliability adiciona teste estatico para os contratos dos runners Vitest, E2E local e smoke externo.
- PR de IA adiciona `invokeAiWithPersistentConsentAndAudit` para carregar consentimentos persistidos por provider e gravar auditoria tecnica minima em `ai_run_audits`.
- Fundacao Coolify/Supabase adiciona helper central de status de runtime para `local-demo`, `preview`, `beta` e `production`, com lista sanitizada de variaveis Auth ausentes.
- Fundacao Coolify/Supabase adiciona migration local `20260610020145_auth_foundation_runtime_grants.sql` para alinhar grants de `energy_checkins` e `account_deletion_requests`.

### Changed

- Aceite do Atalaia passa a buscar preview real sanitizada quando Supabase/Auth estao configurados, sem grant demonstrativo.
- Request proxy de Auth passa a viver em `src/proxy.ts`, junto de `src/app`, para ser incluido pelo Next; `/onboarding` passa a respeitar protecao Auth fora de `local-demo`.
- Permissoes do Atalaia passam a persistir exatamente a selecao revisada pelo dono, sem reintroduzir defaults do nivel automaticamente.
- Criacao, aceite e revogacao do Atalaia passam a exigir consentimento/auditoria/notificacao obrigatoria ou retornar `ok:false`.
- Rotas principais deixam de importar amostras diretamente em `src/app`/`src/components`; `local-demo` continua rotulado e separado de dados reais.
- Actions elegiveis de IA passam pela camada `safeInvokeAi` com mock deterministico/fallback seguro para SMART-E, projetos, microtarefas, inbox, Desbloqueador, Metacognicao, Revisao Semanal/Jardim, Atalaia e Documento de Compromisso.
- Providers OpenAI/DeepSeek passam a receber `AbortSignal` e input minimizado antes de qualquer chamada real autorizada.
- Roteamento de IA passa a exigir as versoes persistidas `ai_provider_openai_v1` e `ai_provider_deepseek_v1`, mantendo fallback local seguro sem fallback cruzado.

- Persistencia de convites do Atalaia passa a registrar notificacao antes da tentativa de provider e atualizar `provider_status` depois, sem marcar provider falho como enviado.
- Runner E2E local passa a sobrescrever `PLAYWRIGHT_BASE_URL` para `http://127.0.0.1:3000`, capturar logs do `next start` e falhar cedo quando o servidor encerra antes da readiness.
- Smoke externo passa a exigir origem limpa, sem credenciais, caminho, query ou hash, mantendo HTTPS obrigatorio para URLs nao locais.
- Configs Vitest/Playwright passam a preferir gates seriais, isolamento de mocks/env/globals e artefatos em falha.

### Security

- Etapa 2 remove policies diretas de update do convidado no aceite do Atalaia e concentra ativacao/revogacao em action server-side auditavel.
- Nenhuma migration remota foi aplicada no Supabase principal; validacao preview da Etapa 2 segue pendente.
- Etapa 3 usa `auth.getClaims()` no proxy SSR, `next` seguro apenas para paths internos, falha fechada fora de `local-demo` quando Supabase/Auth essencial falta e mantem `service_role` fora do barrel publico.
- Etapa 4 usa usuario autenticado + RLS para leituras normais de UI, sem `service_role`, e mantem Atalaia limitado a grants sanitizados.
- Etapa 5 mantem `AI_REAL_ENABLED=false` por default, bloqueia provider real sem consentimento versionado e remove `guardrail_status: not_run` dos caminhos provider/mock.
- Auditoria de IA passa a ter caminho server-only/admin para persistir `ai_run_audits` com metadados minimos e sem prompt/resposta bruta; validacao remota segue pendente.
- Etapa 5 proibe fallback automatico entre OpenAI e DeepSeek; falha usa fallback local seguro ou fluxo manual.
- Auditoria transversal do PR #7 reforca que output de Atalaia nao pode incluir Metacognicao/contexto privado, que timeout aborta a chamada quando suportado e que fallback de crise nao reecoa pensamento/impulso bruto.
- Auth real fora de `local-demo` passa a bloquear actions quando `NEXT_PUBLIC_APP_URL` nao e uma URL HTTPS publicada, evitando links de confirmacao ou recovery com URL local/http.

- Etapa 6 mantem `EMAIL_REAL_ENABLED=false` e `EMAIL_DOMAIN_VERIFIED=false` por default, exige Resend server-side, remetente `notify.<dominio>` aprovado e bloqueia corpo sensivel nos templates de e-mail.
- Webhook Resend valida assinatura Svix pelo corpo cru e grava apenas metadados redigidos de entrega.
- Auditoria transversal do PR #8 confirma ausencia de secret real no diff, service role restrito a server-only/docs/testes e risco residual de CSP `unsafe-inline` ainda aberto.
- Auditoria transversal do PR #10 confirma CI remoto verde, smoke local de health/ready/PWA/cache, ausencia de secrets no diff e mantem bloqueios externos de Docker/Coolify/Auth/RLS/HTTPS.
- Analytics e feedback passam a persistir somente por caminho server-only/admin apos consentimento/sanitizacao; insert direto de anon/autenticado fica revogado por migration aditiva.

### Docs

- Sincroniza fontes de verdade para o estado V1 local ampla / pre-beta real em 2026-06-03.
- Registra decisoes atuais: Hostinger VPS KVM 1 com gate de upgrade, dominio Hostinger pendente, Supabase principal apos cutover validado, IA selecionavel `automatic`/`openai`/`deepseek`, consentimento por provider, sem fallback automatico entre providers, Resend transacional/SMTP Auth, analytics first-party Supabase opt-in off e retencao de 90 dias.
- Formaliza bloqueadores de beta real: Auth externo ainda sem URL HTTPS/smoke, tipos Supabase genericos, Atalaia/consentimento/auditoria remotos, escrita sem confirmacao, readiness externo, CSP permissiva, ausencia de CI/branch protection/releases, Docker/rollback nao ensaiados e dados demonstrativos em rotas principais.
- Separa evidencia historica de Supabase preview de evidencia fresca exigida antes de beta com usuarios reais.
- Etapa 3 Subagente 5 detalha readiness documental de Auth/seguranca: SSR proxy/getClaims, falha fechada fora de `local-demo`, redirects seguros, Auth externo pendente sem URL HTTPS/SMTP/redirect real, typegen preview pendente e PWA/cache sem rotas Auth.
- Etapa 5 sincroniza docs de IA, guardrails, evals, seguranca, ambiente, bug triage, release e beta com OpenAI/DeepSeek server-side ainda desativados para chamadas reais.
- Auditoria transversal do PR #7 registra gates locais finais, performance local, console/pageerror check, riscos residuais e bloqueios de beta/release.
- Runbook `docs/deploy-coolify-supabase.md` documenta o estado atual Coolify/Oracle/sslip.io em `local-demo`, variaveis futuras de Supabase e checklist para virar `preview` sem commitar secrets.

- Etapa 6 sincroniza docs de e-mail, SMTP Auth Supabase, variaveis, seguranca, bug triage, beta e release com Resend preparado localmente e envio real ainda pendente de dominio/secrets/smoke.
- Auditoria transversal do PR #8 sincroniza bug triage, bug fix log, security audit, smoke, release readiness e beta checklist; subagentes foram tentados, mas falharam por sessao expirada do conector.
- Etapa 8 sincroniza rollback/docs para Hostinger/Coolify, triggers de rollback, gate da KVM 1, limitacao de CI/branch protection/release e preview ainda pendente sem dominio/VPS/URL HTTPS.
- Auditoria transversal do PR #10 sincroniza bug triage, bug fix log, security audit, smoke report, release readiness e testing strategy antes de merge preparatorio; subagentes foram tentados, mas falharam por sessao expirada do conector.
- PR de hardening sincroniza release readiness, smoke, bug triage, RLS e seguranca com proxy Auth efetivo e persistencia server-only de analytics/feedback.

### Fixed

- Etapa 1 adiciona contratos de runtime/fallback para impedir que erro real de Supabase configurado vire `local-draft ok:true`.
- Onboarding deixa de retornar `local-draft ok:true` em `preview`, `beta` ou `production` quando falta sessao/configuracao Auth real.
- Etapa 1 confirma linha afetada em updates/deletes priorizados de alvos, projetos, tarefas, habitos, foco e Atalaia.
- Etapa 1 corrige Inbox para nao alterar estado local quando a action retorna `ok:false`.
- Etapa 1 corrige validacao do calendario para retornar erro controlado em input invalido.
- Etapa 1 remove `<main>` aninhado no shell mobile.
- `/settings` deixa de lancar erro fatal quando Supabase/Auth esta ausente fora de `local-demo`; a pagina renderiza estado bloqueado e as actions retornam erro seguro.

### Security

- Etapa 1 adiciona `APP_RUNTIME_MODE` e kill switches server-side default `false` para IA, e-mail, analytics e feedback reais.
- Etapa 1 remove `unsafe-eval` do CSP de producao; `unsafe-inline` permanece como risco residual documentado.

### Added

- Estrutura inicial de governanca do repositorio.
- Skills locais do projeto em `.agents/skills/`.
- Registro das fontes iniciais em `docs/source/`.
- Fontes de verdade do produto: Product Vision, PRD, MVP Scope, User Flows, Domain Model, AI Architecture, Database Schema Draft, Security Privacy, UX/UI Guide, Testing Strategy, Metacognition Module, AI Guardrails, Data Sensitivity Matrix, Acceptance Criteria e Open Questions.
- Skills locais novas: `ux-tdah-first-skill`, `metacognition-skill`, `domain-model-skill` e `ai-structured-output-skill`.
- Migrations Supabase para schema inicial, RLS/policies e storage privado.
- Docs tecnicos de Supabase: `DATABASE_SCHEMA.md`, `RLS_POLICIES.md`, `SUPABASE_AUTH.md`, `SUPABASE_STORAGE.md` e `SUPABASE_AUTH_RLS_PLAN.md`.
- Skills locais novas: `supabase-rls-skill`, `database-migration-skill`, `auth-security-skill`, `accountability-permission-skill` e `rls-testing-skill`.
- Tipos de dominio iniciais por modulo.
- Design system inicial com tokens, modos, navegacao, shell desktop-first e mobile complementar.
- Componentes fundacionais de layout, UI basica, execucao, Metacognicao, Desbloqueador, Placar, Jardim e camada crista discreta.
- Rotas placeholder para dashboard, onboarding, calendario, inbox, foco, habitos, Placar, Metacognicao, revisao, Jardim, Atalaia e configuracoes.
- Documentos `docs/DESIGN_SYSTEM.md` e `docs/ACCESSIBILITY.md`.
- Skills locais novas: `design-system-skill`, `accessibility-skill`, `frontend-playwright-qa-skill`, `low-energy-mode-skill` e `restart-mode-skill`.
- Registro do projeto Supabase informado e do repositorio GitHub `Deividh2025/proposito_em_acao` nas docs/metadados do projeto.
- Tokens de design iniciais em `src/lib/design/tokens.ts` para satisfazer o contrato de testes existente.
- Fluxo funcional inicial de onboarding em `/onboarding` com perfil essencial, Mapa da Vida, Chamado em discernimento, mock seguro e dashboard inicial.
- Schema `calling_draft_v1`, guardrails e mock deterministico para hipotese provisoria de Chamado.
- Migration `202605310004_onboarding_calling_metadata.sql` com metadados preparatorios de Chamado.
- Docs do Prompt 6: `ONBOARDING_FLOW.md`, `LIFE_MAP_MODULE.md`, `CALLING_MODULE.md` e `PROGRESSIVE_UNLOCK.md`.
- Skills locais novas: `onboarding-flow-skill`, `life-map-skill`, `calling-session-skill` e `progressive-unlock-skill`.
- Camada central de IA do Prompt 7 com agentes internos, schemas Zod, prompts versionados, guardrails deterministas, provider mock, safe invoke e metadados seguros.
- Docs de IA do Prompt 7: `AI_AGENTS.md`, `AI_SCHEMAS.md`, `AI_EVALS.md` e `KNOWLEDGE_BASE.md`.
- Base de conhecimento placeholder em `knowledge/`, sem material real ou vector store ativo.
- Evals iniciais em `src/ai/evals/` e testes unitarios da camada central de IA.
- Skills locais novas: `ai-agent-architecture-skill`, `prompt-versioning-skill`, `knowledge-base-skill`, `ai-evals-skill` e `pastoral-safety-skill`.
- Nucleo inicial de execucao do Prompt 8 com rotas de alvos, projetos e tarefas, microtarefas, mocks seguros e fallback local/dev.
- Migration `202605310005_execution_prompt8_alignment.sql` para alinhar status, `jsonb` de analise ecologica, prioridade/razao de tarefas e integridade projeto-alvo.
- Calendario de execucao do Prompt 9 em `/calendar` com visao semanal/diaria, blocos, agendamento de tarefas, proxima acao e alerta simples de sobrecarga.
- Caixa de Entrada/GTD do Prompt 9 em `/inbox` com captura rapida, classificacao mockada, processamento e destinos para tarefa, projeto, calendario, referencia, ideia futura ou descarte.
- Migration `202605310006_calendar_inbox_prompt9_alignment.sql` para alinhar `calendar_blocks`, `inbox_items`, tipos de bloco, classificacoes e indices.
- Schemas `inbox_classification_output_v1` atualizado e `schedule_overload_output_v1` criado.
- Skills locais novas: `calendar-execution-skill`, `gtd-inbox-skill`, `recurring-work-skill`, `schedule-overload-skill` e `inbox-classifier-skill`.
- Desbloqueador de Acao do Prompt 10 em `/action-unblocker`, com formulario rapido, mock seguro, resultado estruturado, persistencia Supabase/fallback e inicio futuro de foco.
- Metacognicao funcional do Prompt 10 em `/metacognition`, com modo rapido/profundo, separacao fato/interpretacao/sentimento/impulso, reformulacao, historico privado e exclusao.
- Historico privado em `/metacognition/history`.
- Migration `202605310007_action_unblocker_metacognition_prompt10_alignment.sql` para alinhar `action_unblock_sessions` e `metacognition_sessions`.
- Evals do Desbloqueador, crise e Metacognicao ampliados.
- Skills locais novas: `action-unblocker-skill`, `cbt-reflection-skill`, `crisis-guardrail-skill` e `private-reflection-data-skill`.
- Modo Foco do Prompt 11 em `/focus` com timer, pausa, conclusao e captura de distracoes.
- Habitos do Prompt 11 em `/habits` com plano mock seguro, versao minima, ambiente, retomada e marcacao diaria.
- Placar da Disciplina do Prompt 11 em `/scoreboard` com mock seguro, marcacao rapida e retomadas valorizadas.
- Schema `scoreboard_plan_output_v1`, agente de Placar e prompt `scoreboard_prompt_v1`.
- Migration `202605310008_focus_habits_scoreboard_prompt11_alignment.sql`.
- Docs `FOCUS_MODE_MODULE.md`, `HABITS_MODULE.md`, `SCOREBOARD_MODULE.md` e `ACTION_UNBLOCKER_MODULE.md`.
- Skills locais novas: `focus-mode-skill`, `habit-design-skill`, `scoreboard-skill`, `distraction-capture-skill` e `restart-tracking-skill`.
- Revisao Semanal do Prompt 12 em `/review` e `/review/weekly`, com perguntas guiadas, mock estruturado, padroes, retomadas, foco da proxima semana e fallback local/dev.
- Historico inicial de revisoes em `/review/history`.
- Jardim da Vida inicial em `/garden`, com areas, crescimento, cuidado necessario e eventos recentes.
- Schemas `weekly_review_output_v1` ampliado e `garden_state_output_v1`.
- Migration `202605310009_weekly_review_garden_prompt12_alignment.sql`.
- Docs `WEEKLY_REVIEW_MODULE.md`, `LIFE_GARDEN_MODULE.md` e `PATTERN_DETECTION.md`.
- Skills locais novas: `weekly-review-skill`, `pattern-detection-skill`, `life-garden-skill` e `healthy-progress-visualization-skill`.
- Atalaia do Prompt 13 em `/accountability`, `/accountability/new`, detalhe de grant e aceite de convite, com grants por alvo, previa, permissao granular e revogacao.
- Documento de Compromisso do Prompt 13 em `/commitments`, com alavancas saudaveis, permissoes de compartilhamento e fallback local/dev.
- Schemas `accountability_message_output_v1` atualizado e `commitment_document_output_v1` criado.
- Migration `202606010010_accountability_commitment_prompt13_alignment.sql`.
- Docs `ACCOUNTABILITY_MODULE.md`, `COMMITMENT_DOCUMENT_MODULE.md`, `COMMITMENT_LEVERS.md` e `EMAIL_NOTIFICATIONS.md`.
- Skills locais novas: `accountability-skill`, `consent-permissions-skill`, `commitment-document-skill`, `commitment-levers-skill` e `email-notifications-skill`.
- PWA/mobile complementar do Prompt 14 em `/mobile`, com hub de acoes rapidas, captura, habitos, Placar, foco curto, Desbloqueador rapido, Metacognicao rapida, energia e atalhos de hoje.
- Manifest, icones PWA finais simples, pagina offline e service worker conservador que cacheia apenas assets estaticos seguros.
- Dominio/action/migration `energy_checkins` para check-in de energia owner-only.
- Testes `mobile-energy-domain.test.ts` e `mobile-pwa.spec.ts`.
- Docs `PWA_MOBILE_MODULE.md`, `MOBILE_PRIVACY.md`, `MOBILE_UX_GUIDE.md` e plano `PROMPT_14_EXECUTION_PLAN.md`.
- Skills locais novas: `pwa-mobile-skill`, `mobile-capture-skill`, `fast-interaction-skill`, `mobile-privacy-skill` e `mobile-low-energy-skill`.
- QA final do Prompt 15 com relatorios `QA_FINAL_REPORT.md`, `SECURITY_AUDIT_REPORT.md`, `RLS_TEST_REPORT.md`, `AI_EVALS_REPORT.md`, `UX_AUDIT_REPORT.md`, `RELEASE_READINESS.md` e `BUG_FIX_LOG.md`.
- Rota `/auth` com criacao de conta, login e logout via Supabase Auth server-side, mantendo fallback local/dev seguro quando Supabase nao estiver configurado.
- Teste E2E `auth.spec.ts` para validar a superficie minima de Auth da V1.
- Skills locais novas: `qa-final-v1-skill`, `release-readiness-skill`, `security-audit-skill` e `regression-testing-skill`.
- Documentacao operacional do Prompt 16: `PRODUCTION_DEPLOYMENT.md`, `PRODUCTION_ENVIRONMENT.md`, `SMOKE_TEST_REPORT.md`, `ROLLBACK_PLAN.md`, `OPERATIONS_RUNBOOK.md` e `BETA_CHECKLIST.md`.
- Skills locais novas: `production-deploy-skill`, `hostinger-deploy-skill`, `production-secrets-skill`, `smoke-test-skill` e `rollback-skill`.
- Decisoes operacionais registradas: VPS Hostinger, Coolify, dono Deividh de Sa, e-mail operacional `deividhvianei@gmail.com`, OpenAI API e DeepSeek API com modelos configuraveis por ambiente.
- Documentacao do Prompt 17 para beta fechado, metricas, analytics seguro, feedback, bug triage, feedback triage, suporte, incident response, monitoramento pos-deploy e roadmap V1.1.
- Dominios `src/domain/analytics` e `src/domain/feedback` com allowlist/sanitizacao de eventos e rascunho local de feedback beta.
- Componentes `src/components/feedback/FeedbackButton.tsx` e `src/components/feedback/FeedbackForm.tsx`, expostos no painel desktop e hub mobile.
- Teste unitario `src/tests/unit/beta-operations-domain.test.ts`.
- Skills locais novas: `beta-operations-skill`, `product-analytics-skill`, `feedback-triage-skill`, `bug-triage-skill` e `v1-1-roadmap-skill`.
- Pack de cutover Supabase preview em `docs/SUPABASE_PREVIEW_CUTOVER.md`.
- Scripts `supabase:types:preview` e `supabase:validate:preview` para typegen real e harness Auth/RLS em branch preview.

### Changed

- `README.md`, `AGENTS.md`, `PLANS.md` e `docs/ROADMAP_EXECUTION.md` sincronizados com as fontes de verdade da Fase 0.
- Atalaia documentado como parte basica da V1, com expansoes avancadas reservadas para V1.1/V2.
- Helpers Supabase separados entre browser, server SSR e admin server-only.
- `.env.example` atualizado com `SUPABASE_PROJECT_ID` placeholder.
- `docs/UX_UI_GUIDE.md` sincronizado com os componentes e modos do design system.
- `docs/FRONTEND_ARCHITECTURE.md` atualizado com rotas placeholder, estrutura de componentes e gates de frontend.
- `docs/CODEX_WORKFLOW.md` atualizado com o remote GitHub informado.
- `/dashboard` mudou de placeholder para dashboard inicial de direcao/progressao assistida.
- Navegacao mobile passa a apontar para a superficie complementar `/mobile/*`.
- Prompt 14 teve limites pre-Prompt 15 aprovados: PWA responsivo segue, app nativo/push/fila offline sensivel ficam fora ate prompt proprio.
- Navegacao principal passa a expor `/auth` como acesso basico da V1.
- `README.md`, `DEPLOYMENT_PLAN.md`, `RELEASE_READINESS.md`, `ENVIRONMENT_VARIABLES.md`, `SUPABASE_PLAN.md`, `SUPABASE_AUTH.md` e `DECISIONS.md` sincronizados com o bloqueio de producao do Prompt 16.
- Docs de IA e seguranca sincronizados com DeepSeek como provider planejado adicional, sem ativacao real em fluxo de produto.
- `README.md`, `AGENTS.md`, `PLANS.md`, docs operacionais, seguranca, consentimento, ambiente e aceite sincronizados com Prompt 17.
- `AGENTS.md` reestruturado como guia operacional do repo real, com stack, comandos, pastas importantes, regras de aprovacao, testes, PR e auditoria.
- `README.md`, `RELEASE_READINESS.md`, `BETA_CHECKLIST.md`, `SUPABASE_PLAN.md`, `OPEN_QUESTIONS.md` e `BUG_TRIAGE.md` sincronizados com o estado vivo pre-beta: evidencia anterior de RLS preview existe, mas beta real exige rerun fresco, Auth publicado, smoke externo, secrets, LGPD e rollback.

### Fixed

- Prompt 15 corrigiu divergencia de schema na Revisao Semanal e normalizacao de areas do Jardim.
- Prompt 15 estreitou policies de Atalaia para grant/parceiro especifico e adicionou regressao estatica de RLS.
- Prompt 15 adicionou guardrail de persistencia owner-only para Desbloqueador e Metacognicao antes de salvar structured output enviado pelo cliente.
- Prompt 15 corrigiu warning de build do Next movendo `themeColor` para `viewport`.
- Prompt 16 adicionou headers minimos de seguranca no `next.config.ts`.

### Security

- Prompt 14 limita offline/cache a assets estaticos e pagina offline segura; Metacognicao, Inbox, calendario, Atalaia, tokens, notificacoes e respostas de actions nao devem ser cacheados.
- `energy_checkins` nasce privado por padrao, com RLS owner-only e sem Atalaia.
- Migration remota `mobile_pwa_prompt14_alignment` aplicada em 2026-06-02 no Supabase `proposito_em_acao` (`bceumcfmjftoukzrfthe`), versao `20260602134002`.
- Prompt 15 reforca Auth server-side sem service role no browser e registra que migrations remotas Supabase ainda precisam ser alinhadas antes de producao.
- Prompt 16 confirmou via Supabase que o projeto remoto esta ativo, mas ainda lista somente `20260602134002 mobile_pwa_prompt14_alignment`; producao aberta segue bloqueada.
- Prompt 17 limita analytics a eventos/metadados minimos, consentimento especifico e sem conteudo sensivel. Em 2026-06-03, a retencao operacional foi definida como 90 dias para analytics, feedback beta e metadados de auditoria de IA, mas enforcement tecnico ainda e pendente.
- Feedback beta nasce como rascunho local; formulario externo depende de `NEXT_PUBLIC_BETA_FEEDBACK_URL` aprovado, sem tokens.
- Etapa 7 prepara `/settings` com consentimentos versionados `ai_provider_openai_v1`, `ai_provider_deepseek_v1`, `product_analytics_v1` e `beta_feedback_v1`.
- Etapa 7 reduz `ANALYTICS-001` localmente: analytics first-party exige opt-in, allowlist, metadata minimizada e retencao de 90 dias, sem validar remoto ainda.
- Etapa 7 prepara feedback beta first-party com envio explicito, aviso/consentimento e bloqueio de indicio sensivel antes de persistir.
- Etapa 7 prepara export JSON autenticado sem secrets/tokens/hashes/logs internos e solicitacao de exclusao com confirmacao explicita; remocao Auth/admin segue pendente de operacao segura.
- Harness Supabase preview exige `SUPABASE_PREVIEW_CONFIRM=preview`, usa service role apenas no terminal do operador e remove fixtures ficticios ao final.
- `/onboarding` mudou de placeholder para fluxo interativo do Prompt 6.
- `docs/OPENAI_INTEGRATION_PLAN.md` atualizado de plano conceitual para plano tecnico preparado com Responses API, Structured Outputs e limites server-side.
- `vitest.config.ts` agora inclui testes de evals em `src/ai/evals/**/*.test.ts`.
- Prompts `smart-goal` e `planner` refinados com contexto permitido/proibido, limites de Prompt 8 e fallback seguro.
- Rotas `/calendar` e `/inbox` deixaram de ser placeholders e passam a compor o centro operacional do Prompt 9.
- Catalogo de IA inclui `scheduleReviewer` como agente preparado para revisao de agenda.
- Rota `/metacognition` deixou de ser placeholder e passa a compor o nucleo de autorregulacao do Prompt 10.
- Catalogo de navegacao inclui `/action-unblocker` como acao rapida.
- Rotas `/focus`, `/habits` e `/scoreboard` deixam de ser placeholders e passam a compor a camada diaria do Prompt 11.
- Rotas `/review` e `/garden` deixam de ser placeholders e passam a compor o fechamento semanal e progresso visual do Prompt 12.
- Catalogo de navegacao marca Revisao e Jardim como Prompt 12.
- Rota `/accountability` deixa de ser placeholder e passa a compor o fluxo basico de Atalaia do Prompt 13.
- Catalogo de navegacao inclui Compromissos e marca Atalaia como Prompt 13.

### Docs

- Documentacao inicial de overview, roadmap, workflow Codex, checklist de PR, decisoes e seguranca.
- Criada matriz de dados sensiveis e fonte principal de seguranca/privacidade.
- Criados criterios de aceite e estrategia de testes para orientar implementacao futura.

### Security

- Definicao inicial de que secrets nao devem ser commitados.
- Classificacao de dados de Metacognicao, fe, saude, familia, financas, emocoes, Chamado e Atalaia como sensiveis.
- Regras de consentimento, Atalaia, logs, RLS e structured outputs documentadas.
- RLS preparado em todas as tabelas expostas do schema `public`.
- Atalaia limitado a grants por alvo, sem policy em Chamado completo, Metacognicao, revisoes privadas, inbox bruto ou calendario completo.
- Storage privado preparado para uploads, anexos e documentos de compromisso.
- `.env.local` mantido fora do Git e com placeholders; nenhuma chave Supabase server-side deve ser versionada.
- OpenAI client fortalecido com barreira server-only.
- Logs de IA limitados a metadados `ai_run_audit_v1`, sem prompt bruto ou resposta bruta.
- Inbox e calendario reforcados como dados owner-only, sem policy de Atalaia e sem logs de capturas/agenda.
- Metacognicao reforcada como historico privado, sem Atalaia por padrao e sem logs de conteudo bruto.
- Guardrails de crise reforcados para interromper produtividade comum e orientar ajuda humana.
- Foco, distracoes, habitos e Placar reforcados como owner-only, sem Atalaia bruto e sem logs de conteudo sensivel.
- Revisao Semanal reforcada como privada, sem Metacognicao bruta, sem Atalaia e sem logs de conteudo sensivel.
- Jardim reforcado como snapshot derivado, com `metadata_minimal` e sem banco paralelo de dados intimos.
- Atalaia reforcado como acesso por alvo, permissao granular, previa, revogacao e sem conta inteira.
- Documento de Compromisso reforcado como revisavel, com compartilhamento manual e alavancas sem humilhacao, punicao nociva ou culpa espiritual.
- Notificacoes de e-mail preparadas como fallback `pending_provider_config`, sem envio real sem provider server-side.

### Notes

- As primeiras funcionalidades navegaveis sao restritas a onboarding/direcao e nucleo inicial de execucao, com fallback local/dev quando Supabase/Auth nao estiverem configurados.
- A entrega do Prompt 6 usa mock seguro e server action preparada; Supabase remoto, Auth visual e OpenAI real continuam pendentes.
- Projeto Supabase remoto nao foi modificado por falta de credenciais administrativas/CLI no workspace.
- Nenhuma chamada real a OpenAI API foi criada.
- Nenhum deploy foi realizado.
- Calendario, Metacognicao funcional, Desbloqueador funcional, Atalaia, Placar completo, Supabase remoto aplicado e OpenAI real nao foram implementados no Prompt 6.
- No Prompt 7, OpenAI real foi preparada em provider server-side, mas nao acionada por fluxo de produto.
- No Prompt 7, Metacognicao, Atalaia, Planejador e demais agentes ganharam contratos tecnicos, nao UI/fluxos finais.
- No Prompt 8, calendario, inbox, habitos, Placar completo, Metacognicao funcional, Desbloqueador funcional e Atalaia funcional continuam fora de escopo.
- No Prompt 9, Desbloqueador funcional, Metacognicao funcional, Modo Foco, habitos completos, Placar completo, Revisao Semanal, Jardim funcional, Atalaia funcional, deploy e OpenAI real acionada por UI continuam fora de escopo.
- No Prompt 10, Modo Foco completo, habitos completos, Placar completo, Revisao Semanal, Jardim funcional, Atalaia funcional, deploy e OpenAI real acionada por UI continuam fora de escopo.
- No Prompt 11, Revisao Semanal funcional, Jardim funcional, Atalaia funcional, deploy, integracoes externas e OpenAI real acionada por UI continuam fora de escopo.
- No Prompt 12, Atalaia funcional, compartilhamento externo, gamificacao profunda, mobile/PWA completo, deploy, integracoes externas e OpenAI real acionada por UI continuam fora de escopo.
- No Prompt 13, portal avancado do Atalaia, relatorios profundos, mobile/PWA completo, deploy, integracoes externas, e-mail real e OpenAI real acionada por UI continuam fora de escopo.
- No Prompt 15, os gates locais passaram apos correcoes, mas deploy produtivo permanece condicionado a aplicar/validar migrations Supabase, RLS dinamico, Auth real, secrets, consentimentos LGPD e provider de e-mail.
- No Prompt 16, os gates locais passaram novamente e os documentos operacionais foram criados, mas nenhum deploy real foi realizado porque Supabase remoto, RLS dinamico, Auth real, secrets e decisoes de LGPD/e-mail/IA continuam bloqueantes.
- No Prompt 17, beta fechado com usuarios reais continua bloqueado; a etapa prepara operacao, metricas, feedback e V1.1 sem deploy, coleta real de analytics, migrations ou provider externo.
