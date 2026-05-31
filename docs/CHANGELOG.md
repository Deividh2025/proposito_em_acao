# Changelog

Todas as mudancas relevantes deste projeto serao registradas aqui.

Formato baseado em Keep a Changelog, com secoes `Added`, `Changed`, `Fixed`, `Security` e `Docs`.

## [Unreleased]

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

### Changed

- `README.md`, `AGENTS.md`, `PLANS.md` e `docs/ROADMAP_EXECUTION.md` sincronizados com as fontes de verdade da Fase 0.
- Atalaia documentado como parte basica da V1, com expansoes avancadas reservadas para V1.1/V2.
- Helpers Supabase separados entre browser, server SSR e admin server-only.
- `.env.example` atualizado com `SUPABASE_PROJECT_ID` placeholder.
- `docs/UX_UI_GUIDE.md` sincronizado com os componentes e modos do design system.
- `docs/FRONTEND_ARCHITECTURE.md` atualizado com rotas placeholder, estrutura de componentes e gates de frontend.
- `docs/CODEX_WORKFLOW.md` atualizado com o remote GitHub informado.
- `/dashboard` mudou de placeholder para dashboard inicial de direcao/progressao assistida.
- `/onboarding` mudou de placeholder para fluxo interativo do Prompt 6.
- `docs/OPENAI_INTEGRATION_PLAN.md` atualizado de plano conceitual para plano tecnico preparado com Responses API, Structured Outputs e limites server-side.
- `vitest.config.ts` agora inclui testes de evals em `src/ai/evals/**/*.test.ts`.
- Prompts `smart-goal` e `planner` refinados com contexto permitido/proibido, limites de Prompt 8 e fallback seguro.

### Docs

- Documentacao inicial de overview, roadmap, workflow Codex, checklist de PR, decisoes e seguranca.
- Criada matriz de dados sensiveis e fonte principal de seguranca/privacidade.
- Criados criterios de aceite e estrategia de testes para orientar implementacao futura.

### Security

- Definicao inicial de que secrets nao devem ser commitados.
- Classificacao de dados de Metacognicao, fe, saude, familia, financas, emocoes, Chamado e Atalaia como sensiveis.
- Regras de consentimento, Atalaia, logs, RLS futura e structured outputs documentadas.
- RLS preparado em todas as tabelas expostas do schema `public`.
- Atalaia limitado a grants por alvo, sem policy em Chamado completo, Metacognicao, revisoes privadas, inbox bruto ou calendario completo.
- Storage privado preparado para uploads, anexos e documentos de compromisso.
- `.env.local` mantido fora do Git e com placeholders; nenhuma chave Supabase server-side deve ser versionada.
- OpenAI client fortalecido com barreira server-only.
- Logs de IA limitados a metadados `ai_run_audit_v1`, sem prompt bruto ou resposta bruta.

### Notes

- Nenhuma funcionalidade do SaaS foi implementada nesta etapa.
- A entrega do Prompt 6 usa mock seguro e server action preparada; Supabase remoto, Auth visual e OpenAI real continuam pendentes.
- Projeto Supabase remoto nao foi modificado por falta de credenciais administrativas/CLI no workspace.
- Nenhuma chamada real a OpenAI API foi criada.
- Nenhum deploy foi realizado.
- Calendario, Metacognicao funcional, Desbloqueador funcional, Atalaia, Placar completo, Supabase remoto aplicado e OpenAI real nao foram implementados no Prompt 6.
- No Prompt 7, OpenAI real foi preparada em provider server-side, mas nao acionada por fluxo de produto.
- No Prompt 7, Metacognicao, Atalaia, Planejador e demais agentes ganharam contratos tecnicos, nao UI/fluxos finais.
- No Prompt 8, calendario, inbox, habitos, Placar completo, Metacognicao funcional, Desbloqueador funcional e Atalaia funcional continuam fora de escopo.
