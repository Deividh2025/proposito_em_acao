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

### Changed

- `README.md`, `AGENTS.md`, `PLANS.md` e `docs/ROADMAP_EXECUTION.md` sincronizados com as fontes de verdade da Fase 0.
- Atalaia documentado como parte basica da V1, com expansoes avancadas reservadas para V1.1/V2.
- Helpers Supabase separados entre browser, server SSR e admin server-only.
- `.env.example` atualizado com `SUPABASE_PROJECT_ID` placeholder.
- `docs/UX_UI_GUIDE.md` sincronizado com os componentes e modos do design system.
- `docs/FRONTEND_ARCHITECTURE.md` atualizado com rotas placeholder, estrutura de componentes e gates de frontend.
- `docs/CODEX_WORKFLOW.md` atualizado com o remote GitHub informado.

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
- Chave publicavel Supabase registrada apenas em `.env.local`; nenhuma `service_role` foi adicionada.

### Notes

- Nenhuma funcionalidade do SaaS foi implementada nesta etapa.
- Projeto Supabase remoto nao foi modificado por falta de credenciais administrativas/CLI no workspace.
- Nenhuma chamada real a OpenAI API foi criada.
- Nenhum deploy foi realizado.
- Nenhum fluxo completo de onboarding, calendario, Metacognicao, Desbloqueador, Atalaia, Supabase ou OpenAI foi implementado pelo design system inicial.
