# Projects Module

## Escopo Prompt 8

Projetos convertem alvos revisados em fases, marcos, riscos, recursos, tarefas iniciais e plano de retomada. A implementacao inicial e simples e editavel.

## Campos principais

- titulo;
- descricao;
- alvo vinculado;
- fase;
- marcos;
- riscos;
- recursos necessarios;
- tarefas iniciais;
- status;
- proxima acao;
- plano de retomada.

## Status

`draft`, `active`, `paused`, `completed`, `archived`, `needs_review`.

## IA e limites

O planejador mock usa `project_plan_output_v1`. Ele nao cria calendario funcional, habitos, Placar, Atalaia ou mensagens externas. O usuario revisa antes de salvar.

## Persistencia

Projetos usam `projects`, com `user_id` e FK composta para `goals`. Tarefas iniciais podem ser criadas em `tasks` depois da revisao.
