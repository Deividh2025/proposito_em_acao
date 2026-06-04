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

## Regras de execucao

- Nao avancar fase sem criterio de aceite verificavel.
- Nao usar stack ainda nao aprovada.
- Nao criar banco, auth ou chamadas reais de IA sem plano proprio.
- Mudanca relevante sem doc atualizada nao esta pronta.
- Risco de privacidade sem mitigacao bloqueia merge.
- Atalaia exige plano proprio com RLS, consentimento, previa e revogacao.
- Metacognicao exige revisao de guardrails e privacidade.
