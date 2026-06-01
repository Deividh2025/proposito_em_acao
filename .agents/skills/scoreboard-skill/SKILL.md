---
name: scoreboard-skill
description: Padronizar Placar da Disciplina, marcacao, retomadas, indicadores e linguagem sem culpa.
---

# Scoreboard Skill

## Quando usar

Use ao criar, revisar ou alterar Placar, itens rastreados, entradas, indicadores, resumos, retomadas ou integracao com habitos/tarefas/foco.

## Instrucoes praticas

1. Placar mede constancia, nao valor pessoal.
2. Tipos permitidos: habito, tarefa, foco, retomada, comportamento e compromisso.
3. Marcacoes: feito, parcial, nao feito, retomado e pausado conscientemente.
4. Retomada conta como progresso real.
5. Evite vermelho agressivo, ranking publico, streak punitivo e linguagem de vergonha.
6. Atalaia nao acessa Placar bruto; futuro compartilhamento exige resumo limitado, alvo, consentimento e previa.
7. Entries devem ser idempotentes por item/data quando possivel.
8. Campos polimorficos exigem validacao server-side de dono.

## Arquivos relacionados

- `src/app/scoreboard/`
- `src/components/scoreboard/`
- `src/domain/scoreboard/`
- `src/ai/schemas/scoreboard.ts`
- `docs/SCOREBOARD_MODULE.md`

## Saida esperada

Retorne itens, marcacoes, indicadores, privacidade, validacoes, testes e riscos.
