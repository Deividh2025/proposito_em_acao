# Prompt 8 Execution Plan

## Objetivo

Implementar o nucleo de execucao `Alvos SMART-E -> Projetos -> Tarefas -> Microtarefas -> Proxima acao`, com IA mock segura, persistencia Supabase preparada, RLS respeitado e documentacao sincronizada.

## Contexto

Fontes consultadas: `AGENTS.md`, `PLANS.md`, `README.md`, `docs/PRD.md`, `docs/MVP_SCOPE.md`, `docs/PRODUCT_VISION.md`, `docs/USER_FLOWS.md`, `docs/DOMAIN_MODEL.md`, `docs/DATABASE_SCHEMA.md`, `docs/RLS_POLICIES.md`, `docs/SECURITY_PRIVACY.md`, `docs/DATA_SENSITIVITY_MATRIX.md`, `docs/AI_ARCHITECTURE.md`, `docs/AI_SCHEMAS.md`, `docs/AI_GUARDRAILS.md`, `docs/AI_AGENTS.md`, `docs/UX_UI_GUIDE.md`, `docs/DESIGN_SYSTEM.md`, `docs/ACCEPTANCE_CRITERIA.md`, `docs/CHANGELOG.md` e `docs/DECISIONS.md`.

Estado historico do Prompt 8: o repo ja possuia Next.js App Router, Supabase clients, migrations iniciais, design system, onboarding/direcao inicial, agentes/schemas/prompts do Prompt 7 e worktree com alteracoes pendentes da etapa anterior. Naquela etapa, migrations seriam versionadas e documentadas, mas nao aplicadas remotamente. Estado atual de CLI/Supabase deve ser lido em `docs/SUPABASE_PLAN.md` e `docs/RLS_TEST_REPORT.md`.

## Arquivos envolvidos

- Criar: rotas de `goals`, `projects`, `tasks`; componentes de execucao; dominio de goals/projects/tasks/microtasks; docs dos modulos; skills locais de execucao; migration incremental.
- Modificar: schemas/prompts/agentes de IA do nucleo de execucao, navegacao, docs de IA/seguranca/schema/criterios/changelog/decisoes/testes.
- Nao tocar: deploy, calendario funcional, inbox funcional, habitos, Placar completo, Atalaia funcional, service role no frontend, OpenAI real acionada por UI.

## Subagentes necessarios

- Produto/Execucao: validar escopo, fluxo, aceite e riscos.
- UX TDAH-first: validar baixa carga, proxima acao e microtarefas.
- Frontend: validar rotas, componentes e Server/Client Components.
- Backend/Supabase: validar tabelas, mutations, ownership e RLS.
- IA SMART-E/Planejador: validar schemas, prompts, mock e guardrails.
- Seguranca/Privacidade: validar dados sensiveis, logs e Atalaia futuro.
- QA/Testes: validar cobertura e comandos.
- Documentacao: validar docs alterados e decisoes.

## Skills necessarias

`prd-product-skill`, `ux-tdah-first-skill`, `design-system-skill`, `domain-model-skill`, `supabase-rls-skill`, `security-privacy-skill`, `ai-structured-output-skill`, `ai-guardrails-skill`, `docs-sync-skill`, `execution-plan-skill`, `database-migration-skill`, `auth-security-skill`, `rls-testing-skill`, `nextjs-tailwind-skill`, `testing-architecture-skill`, `frontend-playwright-qa-skill`, `openai-integration-skill`, `superpowers:test-driven-development`, `superpowers:verification-before-completion`.

## Riscos

- Escopo excessivo tentando implementar calendario, Desbloqueador, Metacognicao, habitos, Placar ou Atalaia antes da etapa propria.
- UX cheia demais para usuarios TDAH-like.
- Dados de Chamado, Mapa da Vida, saude, familia, financas ou emocoes vazando para logs ou Atalaia.
- Schemas de IA fora do contrato esperado pelo Prompt 8.
- Status divergentes entre docs, TypeScript e constraints SQL.
- Supabase nao verificavel localmente por ausencia do CLI.

## Estrategia

1. Criar testes RED para regras puras: SMART-E, projeto, tarefa, microtarefa e mock IA.
2. Implementar dominio puro e schemas Zod do Prompt 8 com output estruturado revisavel.
3. Criar actions server-side com Supabase quando houver sessao e fallback local/dev explicito quando Auth/Supabase nao estiver configurado.
4. Criar UI desktop-first simples: lista, novo, detalhe, status, proxima acao e microtarefas visiveis.
5. Criar migration incremental para status/campos do nucleo de execucao sem aplicar remotamente.
6. Criar skills locais de alvos, planejamento, quebra de tarefas e dominio de execucao.
7. Sincronizar docs e gates.

## Criterios de aceite

- Usuario consegue criar alvo manual e gerar alvo com IA mock segura.
- Alvo possui SMART-E, analise ecologica, alinhamento com Chamado, status e primeira acao.
- Usuario consegue criar projeto e aceitar sugestao mock a partir de alvo.
- Usuario consegue criar tarefa, quebrar em microtarefas e marcar microtarefa como concluida.
- Proxima acao fica evidente em listas/detalhes.
- Persistencia Supabase esta implementada em server actions e RLS owner-only permanece aplicavel.
- Testes principais passam ou falhas sao justificadas.
- Docs e skills locais estao atualizadas.

## Testes e verificacoes

- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd run build`
- `npm.cmd run test`
- `npm.cmd run test:e2e` se Playwright conseguir iniciar Next no ambiente local.
- Supabase CLI/RLS real: N/A no workspace atual se `supabase` continuar ausente; registrar checklist manual.

## Rollback

Reverter os arquivos criados/alterados desta etapa em um commit futuro ou remover a migration incremental antes de aplica-la. Como nenhuma migration sera aplicada remotamente nesta etapa, rollback de banco remoto nao e necessario agora.

## Documentacao a atualizar

`docs/GOALS_MODULE.md`, `docs/PROJECTS_MODULE.md`, `docs/TASKS_MODULE.md`, `docs/MICROTASKS_MODULE.md`, `docs/EXECUTION_DOMAIN.md`, `docs/AI_ARCHITECTURE.md`, `docs/AI_SCHEMAS.md`, `docs/AI_GUARDRAILS.md`, `docs/AI_AGENTS.md`, `docs/DATABASE_SCHEMA.md`, `docs/RLS_POLICIES.md`, `docs/SECURITY_PRIVACY.md`, `docs/DATA_SENSITIVITY_MATRIX.md`, `docs/ACCEPTANCE_CRITERIA.md`, `docs/TESTING_STRATEGY.md`, `docs/CHANGELOG.md`, `docs/DECISIONS.md` e `README.md`.
