# Goals Module

## Escopo Prompt 8

Alvos SMART-E transformam desejo vago em direcao executavel. O alvo nasce revisavel, pode ser criado manualmente ou por mock seguro, e deve manter vinculo conceitual com Chamado, Mapa da Vida e primeira acao.

## SMART-E

- Especifico: formula uma acao concreta.
- Mensuravel: define metrica simples de acompanhamento.
- Atingivel: cabe na energia e contexto atual.
- Relevante: conversa com a hipotese de Chamado.
- Temporal: tem janela de revisao.
- Ecologico: protege fe, saude, familia, descanso, emocoes, financas, trabalho, relacionamentos, servico e aprendizado quando houver contexto.

## Status

`draft`, `active`, `paused`, `completed`, `abandoned`, `needs_review`.

## IA e revisao

O Prompt 8 usa mock deterministico em `src/domain/goals/` e schema `smart_goal_output_v1`. Nenhuma chamada real a OpenAI e feita pela UI. Todo output de IA exige `user_review_required: true` antes de persistencia.

## Dados e seguranca

Analise ecologica e alinhamento com Chamado sao sensiveis, owner-only e nao compartilhados com Atalaia por padrao.
