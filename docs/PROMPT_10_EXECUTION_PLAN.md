# Plano de Execucao - Prompt 10: Desbloqueador e Metacognicao

## Objetivo

Implementar Desbloqueador de Acao e Metacognicao como fluxos funcionais, privados por padrao, com IA mockada segura, structured outputs, persistencia Supabase preparada por server actions, historico privado, guardrails, evals e documentacao sincronizada.

## Contexto

Fontes consultadas: `AGENTS.md`, `PLANS.md`, `README.md`, `docs/PRD.md`, `docs/MVP_SCOPE.md`, `docs/PRODUCT_VISION.md`, `docs/USER_FLOWS.md`, `docs/DOMAIN_MODEL.md`, `docs/DATABASE_SCHEMA.md`, `docs/RLS_POLICIES.md`, `docs/SECURITY_PRIVACY.md`, `docs/DATA_SENSITIVITY_MATRIX.md`, `docs/UX_UI_GUIDE.md`, `docs/DESIGN_SYSTEM.md`, `docs/AI_ARCHITECTURE.md`, `docs/AI_SCHEMAS.md`, `docs/AI_GUARDRAILS.md`, `docs/METACOGNITION_MODULE.md`, `docs/GOALS_MODULE.md`, `docs/PROJECTS_MODULE.md`, `docs/TASKS_MODULE.md`, `docs/CALENDAR_MODULE.md`, `docs/INBOX_GTD_MODULE.md`, `docs/ACCEPTANCE_CRITERIA.md`, `docs/CHANGELOG.md` e `docs/DECISIONS.md`.

Estado atual identificado:

- Prompt 9 esta presente no checkout com alteracoes ainda nao commitadas.
- `metacognition_sessions` e `action_unblock_sessions` ja existem na migration inicial e estao cobertas por RLS owner-only.
- `src/ai/schemas/action-unblocker.ts`, `src/ai/schemas/metacognition.ts`, prompts e catalogo de agentes existem como base tecnica do Prompt 7, mas ainda nao cobrem todo o contrato do Prompt 10.
- `/metacognition` ainda usa placeholder visual; `/action-unblocker` ainda nao existe como pagina propria.
- OpenAI real permanece preparada somente server-side e nao deve ser acionada pela UI nesta etapa.

## Arquivos envolvidos

- Criar:
  - `src/app/action-unblocker/page.tsx`
  - `src/app/action-unblocker/actions.ts`
  - `src/app/metacognition/actions.ts`
  - `src/app/metacognition/history/page.tsx`
  - `src/components/action-unblocker/ActionUnblockerForm.tsx`
  - `src/components/action-unblocker/ActionUnblockerResult.tsx`
  - `src/components/action-unblocker/TinyStepCard.tsx`
  - `src/components/action-unblocker/MinimumViableActionCard.tsx`
  - `src/components/metacognition/MetacognitionForm.tsx`
  - `src/components/metacognition/MetacognitionResult.tsx`
  - `src/components/metacognition/MetacognitionHistoryList.tsx`
  - `src/domain/action-unblocker/index.ts`
  - `src/domain/action-unblocker/types.ts`
  - `src/domain/action-unblocker/persistence.ts`
  - `src/domain/metacognition/index.ts`
  - `src/domain/metacognition/persistence.ts`
  - `src/ai/evals/action-unblocker.cases.ts`
  - `src/ai/evals/crisis-guardrail.cases.ts`
  - `supabase/migrations/202605310007_action_unblocker_metacognition_prompt10_alignment.sql`
  - `docs/ACTION_UNBLOCKER_MODULE.md`
  - `.agents/skills/action-unblocker-skill/SKILL.md`
  - `.agents/skills/cbt-reflection-skill/SKILL.md`
  - `.agents/skills/crisis-guardrail-skill/SKILL.md`
  - `.agents/skills/private-reflection-data-skill/SKILL.md`
- Modificar:
  - `src/ai/schemas/action-unblocker.ts`
  - `src/ai/schemas/metacognition.ts`
  - `src/ai/prompts/action-unblocker.md`
  - `src/ai/prompts/metacognition.md`
  - `src/ai/guardrails/metacognition.ts`
  - `src/ai/evals/metacognition.cases.ts`
  - `src/ai/evals/schema-validation.test.ts`
  - `src/tests/unit/ai-central-layer.test.ts`
  - `src/tests/unit/*prompt10*.test.ts`
  - `src/app/metacognition/page.tsx`
  - `src/components/metacognition/MetacognitionComponents.tsx`
  - `src/components/action-unblocker/ActionUnblockerComponents.tsx`
  - `src/lib/design/navigation.ts`
  - `docs/METACOGNITION_MODULE.md`
  - `docs/AI_ARCHITECTURE.md`
  - `docs/AI_SCHEMAS.md`
  - `docs/AI_GUARDRAILS.md`
  - `docs/AI_EVALS.md`
  - `docs/SECURITY_PRIVACY.md`
  - `docs/DATA_SENSITIVITY_MATRIX.md`
  - `docs/DATABASE_SCHEMA.md`
  - `docs/RLS_POLICIES.md`
  - `docs/TESTING_STRATEGY.md`
  - `docs/ACCEPTANCE_CRITERIA.md`
  - `docs/CHANGELOG.md`
  - `docs/DECISIONS.md`
  - `README.md`
- Nao tocar:
  - `.env.local`
  - Credenciais, secrets, deploy, provider OpenAI real, Atalaia funcional, Foco completo, habitos completos e Placar completo.

## Subagentes necessarios

- Produto/Autorregulacao.
- UX TDAH-first.
- IA/TCC/Metacognicao.
- IA/Desbloqueador.
- Seguranca Clinica/Pastoral.
- Frontend.
- Backend/Supabase.
- QA/Evals.
- Documentacao.

## Skills necessarias

`prd-product-skill`, `ux-tdah-first-skill`, `design-system-skill`, `supabase-rls-skill`, `database-migration-skill`, `auth-security-skill`, `rls-testing-skill`, `security-privacy-skill`, `ai-structured-output-skill`, `ai-guardrails-skill`, `metacognition-skill`, `pastoral-safety-skill`, `ai-evals-skill`, `openai-integration-skill`, `nextjs-tailwind-skill`, `testing-architecture-skill`, `frontend-playwright-qa-skill`, `docs-sync-skill`, `execution-plan-skill`.

## Riscos

- Metacognicao virar terapia, diagnostico ou aconselhamento pastoral definitivo.
- Crise emocional ser tratada como produtividade.
- Culpa espiritual, humilhacao ou afirmacao de vontade divina especifica.
- Conteudo sensivel em logs, URLs, localStorage ou Atalaia.
- RLS permitir acesso cruzado a sessoes privadas.
- UI ficar longa demais para TDAH ou intensificar sobrecarga emocional.
- Confundir fallback local/dev com persistencia produtiva.
- Conflito com alteracoes nao commitadas do Prompt 9.

## Estrategia

1. Escrever testes/evals para o contrato do Prompt 10 antes de alterar producao.
2. Atualizar schemas Zod e mocks deterministos para Desbloqueador e Metacognicao.
3. Criar guardrail deterministico de crise mais amplo e rotas seguras.
4. Criar server actions que validem input, usem `auth.getUser()`, filtrem por `user_id`, persistam output estruturado e caiam para `local-draft` quando Auth/Supabase nao estiver disponivel.
5. Implementar UI desktop-first com modo rapido e modo profundo, resultados estruturados, historico privado e avisos discretos de privacidade.
6. Adicionar migration de alinhamento Prompt 10 com campos/constraints/indices necessarios sem abrir policy de Atalaia.
7. Sincronizar docs, changelog, decisoes e skills locais.
8. Rodar `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build` e QA frontend quando possivel.

## Criterios de aceite

- Desbloqueador gera primeiro passo de 2 a 5 minutos, versao minima, microtarefas, foco recomendado, recompensa, frase de reorientacao, plano de retomada e sugestao de Metacognicao quando fizer sentido.
- Metacognicao separa fato, interpretacao, sentimento e impulso, identifica pensamento automatico e padroes cognitivos sem diagnosticar, confronta sem humilhar, reformula e termina com rota segura.
- Crise grave aciona guardrail, sem analise profunda nem produtividade.
- Metacognicao e historico sao privados por padrao e sem Atalaia.
- Persistencia Supabase e owner-only; sem sessao, fallback local/dev fica explicito.
- Evals negativos cobrem diagnostico, terapia, culpa espiritual, vontade divina especifica, humilhacao, crise, privacidade e schema.
- Documentacao e skills locais refletem a etapa.

## Testes e verificacoes

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`
- `npm run test:e2e` quando a UI estiver renderizavel e dependencias locais permitirem.
- Matriz RLS permanece documentada; aplicacao remota/local das migrations continua pendente sem credenciais/CLI validado.

## Rollback

- Reverter arquivos do Prompt 10 em um commit/patch dedicado.
- Se migration for aplicada em ambiente real futuramente, rollback manual deve remover colunas/constraints/indices adicionados somente apos backup e validacao de ausencia de dados produtivos.
- Como OpenAI real e deploy nao serao ativados, nao ha rollback externo previsto nesta etapa.

## Documentacao a atualizar

`docs/ACTION_UNBLOCKER_MODULE.md`, `docs/METACOGNITION_MODULE.md`, `docs/AI_ARCHITECTURE.md`, `docs/AI_SCHEMAS.md`, `docs/AI_GUARDRAILS.md`, `docs/AI_EVALS.md`, `docs/SECURITY_PRIVACY.md`, `docs/DATA_SENSITIVITY_MATRIX.md`, `docs/DATABASE_SCHEMA.md`, `docs/RLS_POLICIES.md`, `docs/TESTING_STRATEGY.md`, `docs/ACCEPTANCE_CRITERIA.md`, `docs/CHANGELOG.md`, `docs/DECISIONS.md` e `README.md`.
