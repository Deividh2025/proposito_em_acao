---
name: weekly-review-skill
description: Padronizar revisao semanal, perguntas, sintese, padroes, ajustes e planejamento da proxima semana.
---

# Weekly Review Skill

## Quando usar

Use ao criar, revisar ou alterar Revisao Semanal, perguntas guiadas, sintese semanal, plano de retomada, foco da proxima semana ou persistencia em `weekly_reviews`.

## Instrucoes praticas

1. Revisao Semanal fecha o ciclo de execucao e prepara a proxima semana.
2. O fluxo deve ser curto, em blocos, com baixa friccao e primeira acao clara.
3. Falhas viram aprendizado; retomadas contam como progresso real.
4. A saida deve usar `weekly_review_output_v1` e exigir `user_review_required = true`.
5. Metacognicao entra apenas como resumo agregado/redigido, nunca conteudo bruto.
6. Placar, habitos, foco, calendario e tarefas devem entrar preferencialmente como agregados.
7. Atalaia nao recebe Revisao Semanal automaticamente.
8. Sem Auth/Supabase, declarar fallback local/dev.

## Arquivos relacionados

- `src/app/review/`
- `src/components/review/`
- `src/domain/review/`
- `src/ai/schemas/weekly-review.ts`
- `src/ai/prompts/weekly-review.md`
- `docs/WEEKLY_REVIEW_MODULE.md`

## Saida esperada

Retorne fluxo, perguntas, schema, persistencia, guardrails, testes e riscos pendentes.
