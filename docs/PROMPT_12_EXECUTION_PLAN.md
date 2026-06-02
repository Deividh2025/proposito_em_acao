# Prompt 12 Execution Plan

## Objetivo

Implementar Revisao Semanal, leitura inicial de padroes, plano de retomada, planejamento da proxima semana e Jardim da Vida simples.

## Contexto

Prompt 12 vem depois de Foco, Habitos e Placar. A base atual ja contem `weekly_reviews`, `garden_states` e `garden_events` no schema inicial com RLS owner-only. A etapa deve transformar os placeholders `/review` e `/garden` em fluxos funcionais simples, mantendo OpenAI real desativada na UI e Atalaia fora de escopo.

## Arquivos envolvidos

- Criar/alterar dominio: `src/domain/review/`, `src/domain/garden/`.
- Criar/alterar IA: `src/ai/schemas/weekly-review.ts`, `src/ai/schemas/garden-state.ts`, `src/ai/prompts/weekly-review.md`, `src/ai/prompts/garden-summary.md`.
- Criar/alterar frontend: `src/app/review/`, `src/app/garden/`, `src/components/review/`, `src/components/garden/`.
- Criar migration: `supabase/migrations/202605310009_weekly_review_garden_prompt12_alignment.sql`.
- Criar docs/skills: `docs/WEEKLY_REVIEW_MODULE.md`, `docs/LIFE_GARDEN_MODULE.md`, `docs/PATTERN_DETECTION.md`, `.agents/skills/*`.

## Subagentes necessarios

1. Produto/Revisao.
2. UX TDAH-first.
3. IA/Revisor Semanal.
4. Produto/Jardim da Vida.
5. Frontend.
6. Backend/Supabase.
7. Seguranca/Privacidade.
8. QA/Testes.
9. Documentacao.

## Skills necessarias

`prd-product-skill`, `ux-tdah-first-skill`, `design-system-skill`, `supabase-rls-skill`, `security-privacy-skill`, `ai-structured-output-skill`, `ai-guardrails-skill`, `docs-sync-skill`, `execution-plan-skill`, `scoreboard-skill`, `restart-tracking-skill`, `private-reflection-data-skill`, `database-migration-skill`, `rls-testing-skill`, `testing-architecture-skill`.

## Riscos

- Revisao virar julgamento ou relatorio longo demais.
- Expor Metacognicao, Placar, calendario ou revisoes ao Atalaia.
- Jardim virar ranking, punicao visual ou gamificacao profunda.
- Persistencia Supabase ser confundida com aplicada/testada remotamente.
- OpenAI real ser acionada sem autorizacao/configuracao.

## Estrategia

1. Escrever testes unitarios para schema, padroes, retomadas e Jardim nao punitivo.
2. Implementar mocks estruturados seguros e dominio puro.
3. Implementar server actions com Supabase owner-only e fallback local/dev.
4. Substituir placeholders por UI funcional simples e de baixa friccao.
5. Alinhar migration/docs/skills.
6. Rodar lint, typecheck, test, build e E2E.

## Criterios de aceite

- Usuario inicia Revisao Semanal, responde perguntas e gera sintese estruturada.
- Sistema identifica padroes basicos, sobrecarga, areas negligenciadas e retomadas.
- Sistema sugere foco e primeira acao da proxima semana.
- Jardim inicial existe, lista areas da vida, reflete eventos basicos e usa cuidado sem punicao.
- Dados ficam privados por padrao, com RLS owner-only e sem Atalaia.
- Testes principais passam ou bloqueios reais sao declarados.

## Testes e verificacoes

- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd run test`
- `npm.cmd run build`
- `npm.cmd run test:e2e`
- Revisao manual de migrations, RLS, docs e higiene de secrets.

## Rollback

Reverter o commit da etapa ou remover arquivos criados no Prompt 12. A migration e aditiva; rollback manual seria remover colunas/checks/indices novos e preservar dados exportados antes de qualquer ambiente real.

## Documentacao a atualizar

README, AGENTS, AI docs, database/RLS/security/privacy, acceptance criteria, changelog, decisions, testing strategy, module docs e skills locais.
