# Proposito em Acao

SaaS desktop-first de vida intencional, foco, execucao, habitos, autorregulacao e produtividade assistida por IA, com PWA/mobile complementar para acoes rapidas.

Status atual: fontes de verdade, governanca tecnica, stack Next.js, fundacao Supabase/Auth/RLS em arquivos versionados, onboarding/direcao do Prompt 6, camada central de IA do Prompt 7, nucleo inicial de execucao do Prompt 8, calendario/inbox do Prompt 9, Desbloqueador/Metacognicao do Prompt 10, Foco/Habitos/Placar do Prompt 11, Revisao Semanal/Jardim do Prompt 12, Atalaia/Compromissos do Prompt 13 e PWA/mobile complementar do Prompt 14. A migration remota do Prompt 14 foi aplicada no Supabase `proposito_em_acao`; migrations anteriores, testes RLS completos, Auth visual completo, deploy, e-mail real, push notifications e OpenAI real ainda nao foram ativados.

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
- OpenAI server-side em etapa futura, com structured outputs.
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

## Contribuicao

O trabalho deve ocorrer por branches pequenas e PRs revisaveis. Cada mudanca relevante deve manter documentacao sincronizada e respeitar o PRD. Nenhum PR deve expandir escopo fora do PRD sem aprovacao explicita.

## Seguranca

Nunca commitar `.env`, chaves, tokens ou secrets. Dados de fe, saude, familia, financas, emocoes, Chamado, Metacognicao, calendario, habitos, revisoes e Atalaia sao sensiveis e privados por padrao.

## GitHub

Fluxo local primeiro. O repositorio remoto informado pelo fundador e `Deividh2025/proposito_em_acao`.

Remote local esperado:

```powershell
git remote add origin https://github.com/Deividh2025/proposito_em_acao.git
```

Push inicial, PRs e configuracoes do repositorio privado devem ocorrer em etapa propria, com autenticacao GitHub validada.
