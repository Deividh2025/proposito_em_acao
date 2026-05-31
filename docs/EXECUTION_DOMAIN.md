# Execution Domain

## Fluxo

`Chamado -> Alvo SMART-E -> Projeto -> Tarefa -> Microtarefa -> Proxima acao`.

O Prompt 8 materializa esse nucleo sem implementar calendario, inbox, habitos, Placar, Desbloqueador, Metacognicao funcional, Atalaia funcional, deploy ou OpenAI real.

## Implementacao

- Rotas: `/goals`, `/goals/new`, `/goals/[goalId]`, `/projects`, `/projects/new`, `/projects/[projectId]`, `/tasks`, `/tasks/new`, `/tasks/[taskId]`.
- Dominio: `src/domain/goals`, `src/domain/projects`, `src/domain/tasks`, `src/domain/execution`.
- Componentes: `src/components/goals`, `src/components/projects`, `src/components/tasks`, `src/components/execution`.
- Server actions: `src/app/goals/actions.ts`, `src/app/projects/actions.ts`, `src/app/tasks/actions.ts`.
- Migration: `supabase/migrations/202605310005_execution_prompt8_alignment.sql`.

## Supabase e RLS

Tabelas usadas: `goals`, `projects`, `tasks`, `microtasks`.

Todas usam `user_id`, policies owner-only ja preparadas e FKs compostas para reduzir risco de filho apontar para parent de outro usuario. A migration do Prompt 8 adiciona coerencia entre `tasks.project_id` e `tasks.goal_id` quando ambos existem.

## IA

Mocks deterministas validam `smart_goal_output_v1`, `project_plan_output_v1` e `task_breakdown_output_v1`. OpenAI real permanece desativada na UI.

## Privacidade

Chamado completo, Mapa da Vida, analise ecologica, rotina, tarefas e microtarefas sao privados por padrao. Atalaia nao acessa estas tabelas diretamente nesta etapa.
