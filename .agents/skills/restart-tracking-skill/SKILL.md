---
name: restart-tracking-skill
description: Padronizar medicao de retomadas como progresso real no Proposito em Acao.
---

# Restart Tracking Skill

## Quando usar

Use ao criar, revisar ou alterar retomadas em habitos, foco, Placar, tarefas, revisao semanal ou experiencias de baixa energia.

## Instrucoes praticas

1. Retomada e progresso real, nao compensacao punitiva.
2. Mensagens devem nomear retorno, ajuste e proxima acao.
3. Nao usar vergonha, culpa espiritual, ranking ou streak quebrado como derrota.
4. Marcar `restarted` no dominio quando o usuario volta apos falha, pausa ou abandono.
5. Exibir indicadores suaves: numero de retomadas, tendencia e pequena vitoria.
6. Permitir pausa consciente sem penalidade visual.

## Arquivos relacionados

- `src/domain/habits/`
- `src/domain/scoreboard/`
- `src/components/scoreboard/`
- `docs/SCOREBOARD_MODULE.md`
- `docs/HABITS_MODULE.md`

## Saida esperada

Retorne como a retomada e registrada, exibida, protegida de vergonha e testada.
