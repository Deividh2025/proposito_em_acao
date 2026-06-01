---
name: schedule-overload-skill
description: Padronizar alertas de sobrecarga de calendario com linguagem de cuidado, sem culpa, sem vermelho punitivo e com ajustes concretos.
---

# Schedule Overload Skill

## Quando usar

Use ao criar ou revisar alerta de sobrecarga, conflito de agenda, excesso de blocos de alta energia, ausencia de descanso ou ajustes recomendados.

## Regras

1. A mensagem deve cuidar da energia, nao julgar disciplina.
2. Nunca usar tom de falha pessoal, atraso moral ou culpa espiritual.
3. Sinais iniciais: blocos demais de alta energia, tempo total alto, falta de descanso/familia/espiritualidade/buffer.
4. Sempre oferecer 2 ou 3 ajustes: mover, reduzir, quebrar ou proteger descanso.
5. Saida estruturada usa `schedule_overload_output_v1` e exige revisao humana.
6. Alerta nao deve autoalterar agenda.

## Arquivos relacionados

- `src/domain/calendar/`
- `src/ai/schemas/schedule-overload.ts`
- `docs/SCHEDULE_OVERLOAD.md`
- `docs/AI_GUARDRAILS.md`

## Saida esperada

Retorne nivel, motivos, mensagem segura, ajustes recomendados, testes e riscos.
