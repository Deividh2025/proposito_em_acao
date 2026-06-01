---
name: calendar-execution-skill
description: Padronizar calendario de execucao, blocos, tipos, agendamento, reagendamento, descanso protegido e alertas de sobrecarga no Proposito em Acao.
---

# Calendar Execution Skill

## Quando usar

Use ao criar, revisar ou alterar calendario, blocos de tempo, visao diaria/semanal, agendamento de tarefas, reagendamento, blocos pessoais ou alerta de sobrecarga.

## Regras

1. Preserve Chamado antes de agenda: calendario coloca a proxima acao no tempo.
2. Comece por semana e dia; drag-and-drop nao e requisito da V1.
3. Use formulario acessivel para criar, editar, concluir, cancelar e reagendar blocos.
4. Trate descanso, familia, espiritualidade, saude e buffer como compromissos reais.
5. Tipos iniciais: `task`, `focus`, `habit_placeholder`, `recurring_work`, `rest`, `family`, `spirituality`, `health`, `learning`, `service`, `appointment`, `buffer`.
6. Reagendamento deve usar linguagem sem culpa.
7. Calendario completo e privado por padrao; Atalaia nao acessa nesta etapa.
8. Persistencia usa `calendar_blocks` owner-only; sem Auth/Supabase, declarar fallback local/dev.

## Arquivos relacionados

- `src/app/calendar/`
- `src/components/calendar/`
- `src/domain/calendar/`
- `supabase/migrations/`
- `docs/CALENDAR_MODULE.md`
- `docs/SCHEDULE_OVERLOAD.md`

## Saida esperada

Retorne blocos afetados, fluxos de agenda, regras de UX, persistencia/RLS, testes, docs e limites de escopo.
