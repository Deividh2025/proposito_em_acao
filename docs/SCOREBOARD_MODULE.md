# Scoreboard Module

## Objetivo

O Placar da Disciplina acompanha comportamentos-chave, habitos, tarefas, foco e retomadas sem transformar desempenho em valor pessoal.

## Itens

Tipos permitidos: habito, tarefa, foco, retomada, comportamento, compromisso e manual. Cada item tem frequencia alvo e minimo de sucesso.

## Marcacoes

- `done`: feito.
- `partial`: parcial.
- `not_done`: nao feito, sem vergonha.
- `restarted`: retomado.
- `paused_consciously`: pausa consciente.

## Indicadores

Exibir frequencia, constancia, retomadas, tendencia, pequenas vitorias, itens em risco de abandono e sugestao de ajuste. Indicadores devem usar linguagem de cuidado, sem vermelho agressivo, ranking publico ou streak punitivo.

## IA/mock

`scoreboard_plan_output_v1` sugere Placar revisavel, privado por padrao, com itens leves e `restart_tracking = true`.

## Persistencia e RLS

`discipline_scoreboards`, `scoreboard_items` e `scoreboard_entries` permanecem owner-only. Entries devem ser idempotentes por `user_id`, `scoreboard_item_id` e `entry_date`.

## Atalaia

Atalaia nao acessa Placar bruto nesta etapa. Futuro compartilhamento exige resumo limitado, alvo especifico, consentimento granular, previa humana e revogacao efetiva.

## Fora de escopo

Atalaia funcional, ranking publico, gamificacao punitiva, Revisao Semanal funcional, Jardim funcional e automacoes externas.
