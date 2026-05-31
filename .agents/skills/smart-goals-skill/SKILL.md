---
name: smart-goals-skill
description: Padronizar criacao, validacao e analise de alvos SMART-E no Proposito em Acao.
---

# Smart Goals Skill

## Quando usar

Use ao criar, revisar ou alterar alvos SMART-E, analise ecologica, alinhamento com Chamado, primeira acao, status de alvo ou prompts/schemas de SMART-E.

## Regras

1. Todo alvo ativo deve ser especifico, mensuravel, atingivel, relevante, temporal e ecologico.
2. Ecologia deve proteger fe, saude, familia, descanso, emocoes, financas, trabalho, relacionamentos, servico e aprendizado quando houver contexto.
3. Chamado e filtro central; sem Chamado suficiente, o alinhamento deve ser provisoriamente medio/baixo e revisavel.
4. A IA pode reduzir escopo quando o alvo estiver grande, desalinhado ou ecologicamente arriscado.
5. `user_review_required` e obrigatorio antes de persistir output de IA.
6. Status canonicos: `draft`, `active`, `paused`, `completed`, `abandoned`, `needs_review`.
7. Analise ecologica e alinhamento com Chamado sao sensiveis e owner-only.
8. Atalaia nao acessa analise ecologica ou Chamado completo por padrao.

## Arquivos relacionados

- `src/domain/goals/`
- `src/ai/schemas/smart-goal.ts`
- `src/ai/prompts/smart-goal.md`
- `docs/GOALS_MODULE.md`
- `docs/EXECUTION_DOMAIN.md`

## Saida esperada

Retorne contrato SMART-E, ecologia, alinhamento com Chamado, primeira acao, persistencia, RLS, testes e pendencias.
