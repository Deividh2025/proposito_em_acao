---
name: life-map-skill
description: Padronizar areas da vida, notas, perguntas, feedback visual e analise inicial no Proposito em Acao.
---

# Life Map Skill

## Quando usar

Use ao criar, revisar ou alterar Mapa da Vida, leitura por areas, historico de avaliacoes, feedback visual ou analise inicial.

## Regras

1. Use as 10 areas canonicas: fe, saude/energia, familia, trabalho/carreira, financas, emocoes, relacionamentos, aprendizado, descanso e servico/contribuicao.
2. Nota vai de 1 a 10; observacao e opcional.
3. Feedback deve ser imediato, claro e sem vergonha.
4. Nunca use linguagem de fracasso, culpa ou ranking publico.
5. Areas sensiveis podem ser puladas ou preenchidas com pouco detalhe.
6. Destaque areas fortes, frageis, negligenciadas, desequilibrios e areas que nao devem ser sacrificadas.
7. Persistencia relacional deve respeitar `life_areas`, `life_map_assessments` e `life_map_area_scores`.
8. Atalaia nao acessa Mapa da Vida por padrao.

## Arquivos relacionados

- `src/domain/life-map/`
- `src/components/onboarding/`
- `supabase/migrations/`
- `docs/LIFE_MAP_MODULE.md`
- `docs/DATA_SENSITIVITY_MATRIX.md`

## Saida esperada

Retorne areas, perguntas, criterios de analise, privacidade, RLS, testes e pendencias.
