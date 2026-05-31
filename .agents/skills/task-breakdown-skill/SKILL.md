---
name: task-breakdown-skill
description: Padronizar quebra de tarefas em microtarefas e proxima acao.
---

# Task Breakdown Skill

## Quando usar

Use ao criar, revisar ou alterar tarefas, microtarefas, tarefa travada, energia, tempo estimado, primeira microacao ou integracao futura com Desbloqueador/Metacognicao.

## Regras

1. Tarefa grande deve virar microtarefas antes de ser tratada como executavel.
2. Cada tarefa deve ter motivo, energia, tempo estimado, status e proxima acao.
3. Cada microtarefa deve ser pequena, ordenada e concluivel.
4. Primeira microacao deve aparecer em lista e detalhe.
5. Estado `stuck` deve oferecer rota de apoio sem vergonha: reduzir escopo, Desbloqueador futuro ou Metacognicao futura.
6. Status de tarefa: `pending`, `scheduled`, `in_focus`, `completed`, `deferred`, `stuck`, `cancelled`.
7. Status de microtarefa: `pending`, `completed`, `skipped`.
8. Nao implementar calendario funcional, foco real ou Metacognicao funcional nesta skill.

## Arquivos relacionados

- `src/domain/tasks/`
- `src/ai/schemas/task-breakdown.ts`
- `src/components/tasks/`
- `docs/TASKS_MODULE.md`
- `docs/MICROTASKS_MODULE.md`

## Saida esperada

Retorne tarefa, microtarefas, primeira microacao, status, baixa energia, tarefa travada, testes e pendencias.
