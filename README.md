# Proposito em Acao

SaaS desktop-first de vida intencional, foco, execucao, habitos, autorregulacao e produtividade assistida por IA, com PWA/mobile complementar para acoes rapidas.

Status atual: V1 local ampla e pre-beta real. As rotas e gates locais possuem cobertura relevante, mas varias paginas ainda usam dados demonstrativos/fallback local-dev e isso nao comprova jornada real persistida do usuario. A plataforma decidida e Hostinger VPS KVM 1 com Coolify, dominio a adquirir na Hostinger e gate de upgrade obrigatorio se a KVM 1 nao sustentar a aplicacao com estabilidade. OpenAI API e DeepSeek API estao planejados server-side, selecionaveis por `automatic`, `openai` ou `deepseek` no futuro, mas desativados por padrao. Resend foi decidido para e-mail transacional e SMTP customizado do Supabase Auth. Analytics sera first-party no Supabase, opt-in desligado por padrao, com retencao de 90 dias para analytics, feedback beta e auditoria de IA. Beta com usuarios reais e producao aberta seguem bloqueados ate URL HTTPS publicada, Auth real validado, smoke externo, secrets no provedor, LGPD minima, rollback aprovado e evidencia fresca de Supabase/RLS. Consulte `docs/RELEASE_READINESS.md` para o status vivo.

## Visao

O produto ajuda o usuario a transformar direcao em execucao diaria, tendo o Chamado Pessoal como eixo central. A jornada prevista e:

perfil -> Mapa da Vida -> Chamado Pessoal -> alvos SMART-E -> projetos -> tarefas e microtarefas -> calendario -> foco -> habitos -> Placar da Disciplina -> Atalaia -> revisao semanal -> Jardim da Vida.

## Modulos da V1

- Perfil e autenticacao.
- Mapa da Vida.
- Chamado Pessoal.
- Alvos SMART-E.
- Projetos.
- Tarefas e microtarefas.
- Calendario de execucao.
- Inbox/GTD adaptado.
- Desbloqueador de Acao.
- Metacognicao.
- Modo Foco/Pomodoro.
- Habitos com IA.
- Placar da Disciplina.
- Atalaia.
- Documento de compromisso e alavancas.
- Revisao semanal.
- Jardim da Vida.
- Dashboard principal.
- PWA/mobile complementar.
- Camada crista configuravel.
- Seguranca, privacidade, consentimento e LGPD.

## Stack

Stack definida para a fundacao inicial:

- Next.js App Router.
- React.
- TypeScript strict.
- Tailwind CSS.
- Supabase para Auth, Postgres, RLS e Storage.
- OpenAI e DeepSeek server-side em etapa futura, com structured outputs, consentimento por provider e sem fallback automatico entre providers.
- Resend para e-mail transacional e SMTP customizado do Supabase Auth.
- Analytics first-party no Supabase, opt-in desligado por padrao e retencao operacional de 90 dias.
- Zod, React Hook Form, Vitest, Playwright, ESLint e Prettier.

## Organizacao do repositorio

- `AGENTS.md`: regras operacionais para Codex e agentes.
- `PLANS.md`: modelo obrigatorio para planos de execucao.
- `docs/source/`: fontes originais registradas.
- `docs/`: fontes de verdade derivadas, roadmap, seguranca, criterios e fluxo de trabalho.
- `.agents/skills/`: skills locais do projeto.
- `supabase/migrations/`: migrations versionadas de schema, RLS e storage.
- `src/lib/supabase/`: clients Supabase separados por browser, server e admin server-only.
- `src/components/onboarding/`: fluxo inicial de perfil, Mapa da Vida e Chamado em discernimento.
- `src/app/goals/`, `src/app/projects/` e `src/app/tasks/`: nucleo inicial de execucao com fallback local/dev.
- `src/app/calendar/` e `src/app/inbox/`: centro operacional do Prompt 9 com fallback local/dev.
- `src/app/action-unblocker/` e `src/app/metacognition/`: destravamento e autorregulacao do Prompt 10 com mocks seguros.
- `src/app/focus/`, `src/app/habits/` e `src/app/scoreboard/`: camada diaria do Prompt 11 com fallback local/dev.
- `src/app/review/` e `src/app/garden/`: fechamento semanal, padroes, retomada e Jardim da Vida do Prompt 12 com fallback local/dev.
- `src/app/accountability/` e `src/app/commitments/`: Atalaia, grants por alvo, Documento de Compromisso, alavancas e fallback de e-mail do Prompt 13.
- `src/app/mobile/`, `src/components/mobile/` e `src/domain/energy/`: PWA/mobile complementar, acoes rapidas, check-in de energia e fallback local/dev do Prompt 14.

## Fontes de verdade principais

- `docs/source/prd_proposito_em_acao.md`
- `docs/PRODUCT_VISION.md`
- `docs/PRD.md`
- `docs/MVP_SCOPE.md`
- `docs/USER_FLOWS.md`
- `docs/DOMAIN_MODEL.md`
- `docs/AI_ARCHITECTURE.md`
- `docs/AI_AGENTS.md`
- `docs/AI_SCHEMAS.md`
- `docs/AI_EVALS.md`
- `docs/KNOWLEDGE_BASE.md`
- `docs/METACOGNITION_MODULE.md`
- `docs/ACTION_UNBLOCKER_MODULE.md`
- `docs/FOCUS_MODE_MODULE.md`
- `docs/HABITS_MODULE.md`
- `docs/SCOREBOARD_MODULE.md`
- `docs/WEEKLY_REVIEW_MODULE.md`
- `docs/LIFE_GARDEN_MODULE.md`
- `docs/PATTERN_DETECTION.md`
- `docs/ACCOUNTABILITY_MODULE.md`
- `docs/COMMITMENT_DOCUMENT_MODULE.md`
- `docs/COMMITMENT_LEVERS.md`
- `docs/EMAIL_NOTIFICATIONS.md`
- `docs/PWA_MOBILE_MODULE.md`
- `docs/MOBILE_PRIVACY.md`
- `docs/MOBILE_UX_GUIDE.md`
- `docs/SECURITY_PRIVACY.md`
- `docs/DATA_SENSITIVITY_MATRIX.md`
- `docs/UX_UI_GUIDE.md`
- `docs/TESTING_STRATEGY.md`
- `docs/ACCEPTANCE_CRITERIA.md`
- `docs/OPEN_QUESTIONS.md`
- `docs/ONBOARDING_FLOW.md`
- `docs/LIFE_MAP_MODULE.md`
- `docs/CALLING_MODULE.md`
- `docs/PROGRESSIVE_UNLOCK.md`
- `docs/EXECUTION_DOMAIN.md`
- `docs/GOALS_MODULE.md`
- `docs/PROJECTS_MODULE.md`
- `docs/TASKS_MODULE.md`
- `docs/MICROTASKS_MODULE.md`
- `docs/CALENDAR_MODULE.md`
- `docs/INBOX_GTD_MODULE.md`

## Governanca e suporte

- `docs/ROADMAP_EXECUTION.md`
- `docs/PR_CHECKLIST.md`
- `docs/SECURITY_NOTES.md`
- `docs/DECISIONS.md`
- `docs/CHANGELOG.md`
- `docs/CODEX_WORKFLOW.md`
- `docs/DATABASE_SCHEMA_DRAFT.md`
- `docs/AI_GUARDRAILS.md`
- `docs/PRODUCTION_DEPLOYMENT.md`
- `docs/PRODUCTION_ENVIRONMENT.md`
- `docs/OPERATIONS_RUNBOOK.md`
- `docs/ROLLBACK_PLAN.md`
- `docs/SMOKE_TEST_REPORT.md`
- `docs/BETA_CHECKLIST.md`
- `docs/BETA_PLAN.md`
- `docs/BETA_FEEDBACK_PLAN.md`
- `docs/PRODUCT_METRICS.md`
- `docs/ANALYTICS_EVENTS.md`
- `docs/PRIVACY_SAFE_ANALYTICS.md`
- `docs/BUG_TRIAGE.md`
- `docs/FEEDBACK_TRIAGE.md`
- `docs/SUPPORT_RUNBOOK.md`
- `docs/INCIDENT_RESPONSE.md`
- `docs/POST_DEPLOY_MONITORING.md`
- `docs/V1_1_ROADMAP.md`

## Contribuicao

O trabalho deve ocorrer por branches pequenas e PRs revisaveis. Cada mudanca relevante deve manter documentacao sincronizada e respeitar o PRD. Nenhum PR deve expandir escopo fora do PRD sem aprovacao explicita.

## Seguranca

Nunca commitar `.env`, chaves, tokens ou secrets. Dados de fe, saude, familia, financas, emocoes, Chamado, Metacognicao, calendario, habitos, revisoes e Atalaia sao sensiveis e privados por padrao.

## GitHub

Fluxo local primeiro, com branches pequenas e PRs revisaveis. O repositorio remoto atual e `origin` em `https://github.com/Deividh2025/proposito_em_acao.git`; a branch principal e `main`.

Estado verificado em 2026-06-03: repositorio privado, `main` sem branch protection efetiva pela API, zero workflows GitHub Actions e sem releases publicadas. Isso bloqueia producao aberta ate existir governanca de release/rollback suficiente.
