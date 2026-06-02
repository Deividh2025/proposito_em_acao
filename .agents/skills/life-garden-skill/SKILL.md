---
name: life-garden-skill
description: Padronizar Jardim da Vida, areas, eventos de crescimento, cuidado e visual nao punitivo.
---

# Life Garden Skill

## Quando usar

Use ao criar, revisar ou alterar Jardim da Vida, `garden_states`, `garden_events`, areas do Mapa da Vida ou visual de cuidado/crescimento.

## Instrucoes praticas

1. Jardim e snapshot derivado, nao fonte primaria de dado intimo.
2. Areas seguem o Mapa da Vida.
3. Crescimento vem de eventos reais: tarefa, foco, habito, retomada, revisao, alvo, projeto, Metacognicao com proxima acao e descanso protegido.
4. Area negligenciada nao morre; usa `needs_care` como convite de cuidado.
5. Evitar vermelho agressivo, ranking, XP, punicao ou comparacao.
6. `garden_events.metadata_minimal` deve bloquear dados privados e prompts/respostas brutas.
7. Atalaia nao acessa Jardim direto nesta etapa.

## Arquivos relacionados

- `src/app/garden/`
- `src/components/garden/`
- `src/domain/garden/`
- `src/ai/schemas/garden-state.ts`
- `docs/LIFE_GARDEN_MODULE.md`

## Saida esperada

Retorne areas, estados visuais, eventos aceitos, persistencia, privacidade, testes e riscos.
