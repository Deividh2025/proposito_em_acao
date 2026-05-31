# Life Map Module

## Areas canonicas

1. Fe e espiritualidade.
2. Saude e energia.
3. Familia.
4. Trabalho e carreira.
5. Financas.
6. Emocoes.
7. Relacionamentos.
8. Aprendizado.
9. Descanso.
10. Servico e contribuicao.

## Coleta

Cada area recebe:

- nota de 1 a 10;
- pergunta curta;
- observacao opcional.

Observacoes sao opcionais porque podem conter dados sensiveis.

## Analise inicial

`src/domain/life-map/index.ts` gera leitura deterministica:

- media;
- areas fortes;
- areas frageis;
- areas negligenciadas;
- desequilibrios;
- alertas de cuidado;
- areas que nao devem ser sacrificadas.

A linguagem deve ser convite de cuidado, nao julgamento.

## Persistencia

Tabelas planejadas/usadas:

- `life_areas`
- `life_map_assessments`
- `life_map_area_scores`

RLS owner-only ja esta preparada em migration, mas precisa ser aplicada e testada antes de producao.

## Privacidade

Atalaia nao acessa Mapa da Vida por padrao. Compartilhamento futuro exige alvo, consentimento granular, previa e revogacao.
