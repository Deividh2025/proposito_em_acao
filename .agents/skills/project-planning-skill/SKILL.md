---
name: project-planning-skill
description: Padronizar criacao de projetos, fases, marcos, riscos, recursos e plano de retomada.
---

# Project Planning Skill

## Quando usar

Use ao criar, revisar ou alterar projetos derivados de alvos, fases, marcos, riscos, recursos, tarefas iniciais ou plano de retomada.

## Regras

1. Projeto deve estar vinculado a um alvo revisado.
2. Projeto precisa ter fase atual, marcos, riscos, recursos, status e proxima acao.
3. IA deve sugerir plano editavel, nunca obrigacao escondida.
4. Riscos devem incluir energia, descanso, familia, saude e financas quando relevantes.
5. Plano de retomada deve responder: menor retorno honesto, ajuste e microacao.
6. Status canonicos: `draft`, `active`, `paused`, `completed`, `archived`, `needs_review`.
7. Nao criar calendario funcional, habitos, Placar ou Atalaia nesta etapa.

## Arquivos relacionados

- `src/domain/projects/`
- `src/ai/schemas/project-plan.ts`
- `src/ai/prompts/planner.md`
- `docs/PROJECTS_MODULE.md`
- `docs/EXECUTION_DOMAIN.md`

## Saida esperada

Retorne vinculo com alvo, projeto sugerido, fases, marcos, riscos, recursos, tarefas, retomada, RLS e testes.
