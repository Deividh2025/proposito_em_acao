# Schedule Overload

## Objetivo

Alertar quando a agenda parece pesada demais para a energia atual, sem culpar o usuario e sem alterar blocos automaticamente.

## Regra inicial

O alerta considera:

- muitos blocos de alta energia no mesmo dia;
- tempo total planejado alto;
- ausencia de descanso, familia, espiritualidade, saude ou buffer;
- risco de transformar a agenda em lista de produtividade sem ecologia.

## Tom

Usar:

> Esta agenda parece pesada para sua energia atual. Considere reduzir ou proteger um bloco de descanso.

Nao usar linguagem de falha, atraso moral, culpa espiritual ou vergonha.

## Schema

`schedule_overload_output_v1`:

- `overload_level`: `low`, `medium` ou `high`;
- `message`;
- `reasons`;
- `recommended_adjustments`;
- `user_review_required: true`.

## Limites

O alerta sugere ajustes; nao move, cancela ou cria blocos sozinho.
