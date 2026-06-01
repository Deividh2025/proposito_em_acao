# Calendar Module

## Escopo Prompt 9

O Calendario de Execucao coloca a proxima acao no tempo sem transformar o produto em agenda generica. Ele nasce com visao semanal, visao diaria, criacao de blocos, conclusao, cancelamento, reagendamento sem culpa, tarefas nao agendadas, inbox recente e alerta simples de sobrecarga.

## Tipos de bloco

- `task`
- `focus`
- `habit_placeholder`
- `recurring_work`
- `rest`
- `family`
- `spirituality`
- `health`
- `learning`
- `service`
- `appointment`
- `buffer`

Descanso, familia, espiritualidade, saude e buffer sao compromissos reais, nao tempo improdutivo.

## UX

- Semana e o padrao desktop.
- Dia e o modo de execucao.
- Criacao por formulario acessivel substitui drag-and-drop na V1.
- Reagendar nao e falha; e ajuste de cuidado.
- Primeira dobra deve mostrar proxima acao e sinais de sobrecarga, sem poluir a agenda.

## Persistencia

Tabela principal: `calendar_blocks`.

Server actions usam `auth.getUser()`, `user_id = user.id`, filtros `.eq("user_id", user.id)` em updates/deletes e validacao Zod. Sem sessao ou Supabase configurado, a UI declara fallback local/dev.

Titulos e notas de blocos possuem limite de tamanho no app e na migration para reduzir retencao de dados sensiveis.

## Fora de escopo

Integracao Google/Outlook, convites, calendario compartilhado, drag-and-drop obrigatorio, recorrencia avancada, Foco funcional, habitos funcionais, Atalaia, OpenAI real em UI e automacao autonoma de agenda.
