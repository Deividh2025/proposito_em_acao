---
name: recurring-work-skill
description: Padronizar trabalhos recorrentes simples no calendario do Proposito em Acao sem criar recorrencia avancada excessiva na V1.
---

# Recurring Work Skill

## Quando usar

Use ao criar ou revisar `recurring_work`, blocos repetidos simples, rotina de trabalho recorrente ou regras de repeticao do calendario.

## Regras

1. Na V1, recorrencia e simples e revisavel; nao implementar regra complexa de calendario externo.
2. Representar recorrencia com `recurrence_rule` simples e opcional.
3. Blocos recorrentes continuam privados e owner-only.
4. Usuario deve poder cancelar ou reagendar uma instancia sem linguagem de falha.
5. Recorrencia nao deve lotar automaticamente a agenda sem alerta de sobrecarga.
6. Integracoes Google/Outlook, convites e RRULE avancado ficam fora do Prompt 9.

## Arquivos relacionados

- `src/domain/calendar/`
- `src/components/calendar/`
- `supabase/migrations/`
- `docs/CALENDAR_MODULE.md`

## Saida esperada

Retorne regra de recorrencia, limites, risco de sobrecarga, persistencia e testes.
