# Prompt 17 Execution Plan

## Objetivo

Preparar o Propósito em Ação para beta fechado, observabilidade segura, feedback, métricas, suporte, triagem e plano V1.1, sem implementar grandes funcionalidades novas.

## Contexto

Documentos lidos: `AGENTS.md`, `PLANS.md`, `README.md`, `docs/PRD.md`, `docs/MVP_SCOPE.md`, `docs/RELEASE_READINESS.md`, `docs/PRODUCTION_DEPLOYMENT.md`, `docs/SMOKE_TEST_REPORT.md`, `docs/OPERATIONS_RUNBOOK.md`, `docs/ROLLBACK_PLAN.md`, `docs/SECURITY_PRIVACY.md`, `docs/QA_FINAL_REPORT.md`, `docs/UX_AUDIT_REPORT.md`, `docs/AI_EVALS_REPORT.md`, `docs/BETA_CHECKLIST.md`, `docs/CHANGELOG.md` e `docs/DECISIONS.md`.

Estado encontrado: gates locais do Prompt 16 estavam verdes nos relatórios, mas beta com usuários reais continua bloqueado até preview publicado, migrations Supabase alinhadas, matriz RLS dinâmica, Auth real, secrets, LGPD mínima e smoke publicado.

Observação de escopo: Prompt 17 não deve alterar migrations. Qualquer diff existente em `supabase/migrations/` deve ser tratado como mudança separada, com plano de banco/RLS próprio, antes de publicação.

## Arquivos envolvidos

- Criar: docs de beta, métricas, analytics, feedback, bug triage, suporte, incidentes, monitoramento, roadmap V1.1 e skills locais do Prompt 17.
- Modificar: `README.md`, `AGENTS.md`, `PLANS.md`, `.env.example`, `docs/BETA_CHECKLIST.md`, `docs/OPERATIONS_RUNBOOK.md`, `docs/SECURITY_PRIVACY.md`, `docs/CHANGELOG.md`, `docs/DECISIONS.md` e componentes/domínios de feedback/analytics.
- Não tocar: migrations produtivas, secrets reais, service role, deploy remoto, OpenAI/DeepSeek real e e-mail real.

## Subagentes necessários

- Produto/Beta.
- Analytics/Métricas.
- Segurança/Privacidade Operacional.
- QA/Bugs.
- UX/Feedback.
- Operação/Suporte.
- Roadmap V1.1.
- Documentação.

## Skills necessárias

`release-readiness-skill`, `qa-final-v1-skill`, `security-privacy-skill`, `docs-sync-skill`, `execution-plan-skill`, `mobile-privacy-skill`, `ai-evals-skill`, `ux-tdah-first-skill` e `skill-creator`.

## Riscos

- Declarar beta pronto apesar de bloqueios externos.
- Coletar conteúdo sensível em analytics ou feedback.
- Criar nova feature grande de analytics/feedback.
- Confundir fallback local/dev com persistência produtiva.
- Expandir V1.1 antes de estabilizar V1.

## Estratégia

1. Ler fontes obrigatórias e registrar lacunas.
2. Consolidar subagentes.
3. Criar contratos seguros de analytics e feedback local/beta.
4. Documentar beta fechado, métricas, eventos, suporte, triagem, incidentes e roadmap V1.1.
5. Criar skills locais novas.
6. Rodar gates locais aplicáveis.

## Critérios de aceite

- Plano beta, métricas, eventos e feedback documentados.
- Analytics sem conteúdo sensível.
- Feedback in-app preparado sem envio real e sem storage sensível.
- Bug triage, feedback triage, suporte, incident response e roadmap V1.1 existem.
- Documentação sincronizada e bloqueios externos preservados.

## Testes e verificações

- `npm.cmd test -- src\tests\unit\beta-operations-domain.test.ts`
- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `npm.cmd run test`
- `npm.cmd run build`

`npm.cmd run test:e2e` deve ser executado se o tempo/ambiente permitir, especialmente após alterar UI global de feedback.

## Rollback

Reverter os arquivos criados/alterados do Prompt 17. Como esta etapa não deve introduzir migration, deploy, provider externo, storage ou coleta real, o rollback esperado é somente de código/docs. Se houver diff em migration no worktree, ele fica fora do escopo deste plano e exige revisão separada.

## Documentação a atualizar

Todos os docs operacionais de beta/observabilidade listados no Prompt 17, além de `CHANGELOG.md`, `DECISIONS.md`, `BETA_CHECKLIST.md`, `OPERATIONS_RUNBOOK.md`, `SECURITY_PRIVACY.md`, `README.md`, `AGENTS.md` e `PLANS.md`.
