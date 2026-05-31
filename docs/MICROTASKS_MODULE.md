# Microtasks Module

## Escopo Prompt 8

Microtarefas reduzem friccao de inicio. Elas sao passos ordenados, pequenos e revisaveis, derivados de uma tarefa maior.

## Campos principais

- titulo;
- ordem;
- tempo estimado;
- status;
- tarefa vinculada.

## Status

`pending`, `completed`, `skipped`.

## Regras UX

- A primeira microacao deve aparecer em lista e detalhe.
- Microtarefas devem ser pequenas o bastante para comecar em baixa energia.
- Concluir uma microtarefa atualiza a proxima acao no fluxo local.
- Listas longas devem ser evitadas; expansao progressiva e preferivel.

## Persistencia

Microtarefas usam `microtasks`, com `user_id`, `task_id`, FK composta e RLS owner-only.
