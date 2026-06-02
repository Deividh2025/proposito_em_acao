---
name: beta-operations-skill
description: Padronizar beta fechado, criterios de sucesso, usuarios beta, suporte, rotina de acompanhamento e handoff operacional do Proposito em Acao.
---

# Beta Operations Skill

## Quando usar

Use ao planejar, revisar ou executar beta fechado, coortes, criterios de sucesso, onboarding de usuarios beta, suporte inicial, rotina diaria ou handoff ao fundador.

## Instrucoes praticas

1. Confirmar se beta com usuarios reais esta liberado ou bloqueado por preview, Supabase/RLS/Auth, LGPD, secrets, smoke e rollback.
2. Definir objetivo do beta, publico, tamanho da coorte, duracao e perguntas de validacao.
3. Usar North Star: semanas com pelo menos 3 acoes concluidas alinhadas a um alvo vinculado ao Chamado.
4. Restringir primeiro beta a dados ficticios ou pouco sensiveis ate gates externos passarem.
5. Preparar rotina diaria: logs sanitizados, bugs P0/P1, feedback, limites de plataforma e incidentes.
6. Registrar decisoes pendentes do fundador e nao declarar usuarios reais liberados sem evidencia.

## Arquivos relacionados

- `docs/BETA_PLAN.md`
- `docs/BETA_CHECKLIST.md`
- `docs/BETA_USER_GUIDE.md`
- `docs/SUPPORT_RUNBOOK.md`
- `docs/INCIDENT_RESPONSE.md`
- `docs/POST_DEPLOY_MONITORING.md`

## Saida esperada

Retorne status do beta, gates pendentes, coorte, criterios, rotina operacional, riscos, decisoes do fundador e recomendacao clara: bloqueado, pronto para ensaio interno ou pronto para beta real.
