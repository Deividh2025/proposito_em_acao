# Prompt 9 Execution Plan

## Objetivo

Implementar Calendario de Execucao e Caixa de Entrada/GTD adaptado em profundidade inicial, com mocks seguros, server actions preparadas para Supabase e documentacao sincronizada.

## Contexto

Prompt 8 deixou alvos, projetos, tarefas, microtarefas e proxima acao prontos. Prompt 9 coloca a proxima acao no tempo e permite capturar ruido mental sem sobrecarregar o usuario.

Fontes consultadas: `AGENTS.md`, `PLANS.md`, `README.md`, `docs/PRD.md`, `docs/MVP_SCOPE.md`, `docs/USER_FLOWS.md`, `docs/DOMAIN_MODEL.md`, `docs/DATABASE_SCHEMA.md`, `docs/RLS_POLICIES.md`, `docs/SECURITY_PRIVACY.md`, `docs/DATA_SENSITIVITY_MATRIX.md`, `docs/UX_UI_GUIDE.md`, `docs/DESIGN_SYSTEM.md`, `docs/AI_ARCHITECTURE.md`, `docs/AI_SCHEMAS.md`, `docs/AI_GUARDRAILS.md`, `docs/GOALS_MODULE.md`, `docs/PROJECTS_MODULE.md`, `docs/TASKS_MODULE.md`, `docs/MICROTASKS_MODULE.md`, `docs/EXECUTION_DOMAIN.md`, `docs/ACCEPTANCE_CRITERIA.md`, `docs/CHANGELOG.md` e `docs/DECISIONS.md`.

## Arquivos envolvidos

- Criar: `src/components/calendar/*`, `src/components/inbox/*`, `src/domain/calendar/index.ts`, `src/domain/calendar/persistence.ts`, `src/domain/inbox/index.ts`, `src/domain/inbox/persistence.ts`, `src/app/calendar/actions.ts`, `src/app/inbox/actions.ts`, `src/ai/schemas/schedule-overload.ts`, `src/ai/agents/schedule-reviewer/`, `src/ai/prompts/schedule-reviewer.md`, migration Prompt 9, docs e skills locais.
- Modificar: rotas `/calendar` e `/inbox`, schemas de IA, catalogo de agentes, navegacao, testes, docs de escopo, seguranca, RLS e aceite.
- Nao tocar: deploy, service role no frontend, OpenAI real em UI, Atalaia funcional, Metacognicao funcional, Desbloqueador funcional, Foco funcional, habitos completos e Placar completo.

## Subagentes necessarios

- Produto/Calendario e GTD.
- UX TDAH-first.
- Frontend Calendario.
- Frontend Inbox.
- Backend/Supabase.
- IA Classificadora/Planejadora.
- Seguranca/Privacidade.
- QA/Testes.
- Documentacao.

## Skills necessarias

`prd-product-skill`, `ux-tdah-first-skill`, `design-system-skill`, `domain-model-skill`, `supabase-rls-skill`, `security-privacy-skill`, `ai-structured-output-skill`, `ai-guardrails-skill`, `docs-sync-skill`, `execution-plan-skill`, `calendar-execution-skill`, `gtd-inbox-skill`, `recurring-work-skill`, `schedule-overload-skill` e `inbox-classifier-skill`.

## Riscos

- Virar agenda generica ou app de tarefas sem Chamado.
- Lotar visualmente a tela com muitas decisoes simultaneas.
- Inbox virar cobranca de inbox zero.
- Classificacao automatica tomar decisao sem revisao.
- Dados de calendario/inbox vazarem para logs, URLs, localStorage ou Atalaia.
- Divergencia entre tipos TypeScript e constraints do banco.

## Estrategia

1. Criar dominio puro e schemas com TDD.
2. Implementar UI headless sem biblioteca nova e sem drag-and-drop.
3. Preparar server actions owner-only com fallback local/dev.
4. Alinhar migration para tipos de bloco, inbox e indices.
5. Atualizar docs, skills e testes.
6. Rodar lint, typecheck, testes, build e E2E.

## Criterios de aceite

- Usuario visualiza semana e dia.
- Usuario cria, conclui, cancela e reagenda bloco local/dev.
- Usuario ve proxima acao e alerta de sobrecarga cuidadoso.
- Usuario captura item na inbox rapidamente.
- Usuario classifica por mock seguro e revisa destino.
- Usuario converte item em tarefa ou bloco local/dev.
- Dados permanecem privados por padrao e owner-only quando Supabase existir.

## Testes e verificacoes

- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd run test`
- `npm.cmd run build`
- `npm.cmd run test:e2e`

Observacao historica: na execucao deste prompt, RLS real permanecia pendente. Em 2026-06-03, Supabase CLI esta disponivel e o projeto remoto foi listado em modo read-only, mas a validacao fresca de RLS/Auth em ambiente aprovado continua pendente antes de beta real.

## Rollback

Reverter a migration Prompt 9 antes de aplicar em ambiente real ou criar migration reversa removendo constraints/colunas/indices novos. Para UI, reverter rotas `/calendar` e `/inbox` aos placeholders.

## Documentacao a atualizar

`docs/CALENDAR_MODULE.md`, `docs/INBOX_GTD_MODULE.md`, `docs/SCHEDULE_OVERLOAD.md`, `docs/AI_ARCHITECTURE.md`, `docs/AI_SCHEMAS.md`, `docs/SECURITY_PRIVACY.md`, `docs/DATABASE_SCHEMA.md`, `docs/RLS_POLICIES.md`, `docs/ACCEPTANCE_CRITERIA.md`, `docs/CHANGELOG.md`, `docs/DECISIONS.md`, `docs/USER_FLOWS.md`, `docs/TESTING_STRATEGY.md`, `docs/FRONTEND_ARCHITECTURE.md`, `docs/ROADMAP_EXECUTION.md` e `supabase/tests/README.md`.
