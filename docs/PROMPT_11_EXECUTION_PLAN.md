# Plano de Execucao - Prompt 11: Foco, Habitos e Placar

## Objetivo

Implementar a camada diaria de execucao e constancia: Modo Foco/Pomodoro, Habitos com IA mockada segura e Placar da Disciplina.

## Contexto

- Prompt 10 deixou Desbloqueador e Metacognicao preparados, mas Foco, Habitos e Placar ainda estavam como placeholders.
- As tabelas base de foco, habitos e placar ja existem no schema inicial.
- A entrega deve manter profundidade controlada: sem Atalaia funcional, sem Revisao Semanal funcional, sem Jardim funcional, sem deploy e sem OpenAI real acionada pela UI.
- Sem Auth/Supabase ativo, actions devem retornar fallback `local-draft` e nao prometer persistencia produtiva.

## Arquivos envolvidos

- `src/app/focus/page.tsx`
- `src/app/focus/actions.ts`
- `src/components/focus/*`
- `src/domain/focus/*`
- `src/app/habits/page.tsx`
- `src/app/habits/actions.ts`
- `src/components/habits/*`
- `src/domain/habits/*`
- `src/app/scoreboard/page.tsx`
- `src/app/scoreboard/actions.ts`
- `src/components/scoreboard/*`
- `src/domain/scoreboard/*`
- `src/ai/schemas/habit-plan.ts`
- `src/ai/schemas/scoreboard.ts`
- `src/ai/prompts/habits.md`
- `src/ai/prompts/scoreboard.md`
- `src/ai/agents/catalog.ts`
- `src/ai/agents/scoreboard/index.ts`
- `supabase/migrations/202605310008_focus_habits_scoreboard_prompt11_alignment.sql`
- docs de foco, habitos, placar, IA, seguranca, schema, RLS, aceite, changelog e decisoes.

## Subagentes necessarios

1. Produto/Constancia: validar contra PRD e evitar Placar punitivo.
2. UX TDAH-first: reduzir friccao, manter baixa energia e retomada.
3. Frontend/Foco: orientar tela, timer e captura.
4. Frontend/Habitos e Placar: orientar marcacoes rapidas.
5. Backend/Supabase: alinhar tabelas, actions e RLS owner-only.
6. IA/Habitos e Placar: schemas, prompts, mocks e guardrails.
7. Seguranca/Privacidade: dados sensiveis, logs e Atalaia futuro.
8. QA/Testes: unitarios, E2E e riscos de validacao.
9. Documentacao: docs, changelog, decisoes e lacunas herdadas.

## Skills necessarias

- `prd-product-skill`
- `ux-tdah-first-skill`
- `design-system-skill`
- `supabase-rls-skill`
- `security-privacy-skill`
- `ai-structured-output-skill`
- `ai-guardrails-skill`
- `docs-sync-skill`
- `execution-plan-skill`
- `focus-mode-skill`
- `habit-design-skill`
- `scoreboard-skill`
- `distraction-capture-skill`
- `restart-tracking-skill`
- `action-unblocker-skill`
- `private-reflection-data-skill`

## Riscos

- Transformar Placar em punicao, ranking ou streak moralizante.
- Reter conteudo sensivel de distracoes, habitos ou placar em logs.
- Criar acesso de Atalaia antes de consentimento granular e resumo limitado.
- Duplicar entradas de placar por clique repetido.
- Persistir habito incompleto sem plano se/entao e plano de retomada.
- Tratar OpenAI real como ativo quando a etapa so exige mock seguro.
- Divergir entre schema de IA, schema Supabase e tipos TypeScript.

## Estrategia

1. Documentar o recorte do Prompt 11 e lacunas herdadas.
2. Alinhar schemas Zod e mocks deterministas.
3. Criar migration incremental com campos faltantes e constraints leves.
4. Implementar server actions com validacao owner-only e fallback local/dev.
5. Substituir placeholders por telas funcionais, densas e sem excesso de escolha.
6. Adicionar testes unitarios de dominio e E2E de fluxo feliz local/dev.
7. Rodar lint, typecheck, test e build.

## Criterios de aceite

- Usuario inicia foco de 5, 15, 25, 50 ou personalizado.
- Usuario captura distracao sem sair do foco.
- Usuario pausa, retoma e conclui sessao.
- Conclusao registra sessao e pode marcar tarefa/bloco quando aplicavel.
- Usuario gera plano de habito por mock seguro e revisa antes de salvar.
- Habito possui minimo, ideal, gatilho, recompensa, plano se/entao, ambiente, metrica e retomada.
- Usuario marca habito como minimo, ideal, retomado ou pausado conscientemente.
- Usuario cria Placar e marca item como feito, parcial, nao feito, retomado ou pausado conscientemente.
- Retomadas aparecem como progresso.
- Dados usam Supabase owner-only quando autenticado e fallback local/dev quando nao autenticado.
- Docs, changelog e decisoes ficam sincronizados.

## Testes e verificacoes

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`
- E2E Playwright quando o ambiente permitir.
- Revisao de `git status --short --branch`.

## Rollback

- Reverter arquivos do Prompt 11.
- Remover migration `202605310008_focus_habits_scoreboard_prompt11_alignment.sql` se ainda nao aplicada.
- Manter docs com nota de rollback caso migrations ja tenham sido aplicadas em ambiente real.

## Documentacao a atualizar

- `docs/FOCUS_MODE_MODULE.md`
- `docs/HABITS_MODULE.md`
- `docs/SCOREBOARD_MODULE.md`
- `docs/ACTION_UNBLOCKER_MODULE.md`
- `docs/AI_ARCHITECTURE.md`
- `docs/AI_SCHEMAS.md`
- `docs/AI_GUARDRAILS.md`
- `docs/DATABASE_SCHEMA.md`
- `docs/RLS_POLICIES.md`
- `docs/SECURITY_PRIVACY.md`
- `docs/DATA_SENSITIVITY_MATRIX.md`
- `docs/ACCEPTANCE_CRITERIA.md`
- `docs/CHANGELOG.md`
- `docs/DECISIONS.md`
- `AGENTS.md`
