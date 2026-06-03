---
name: production-deploy-skill
description: Padronizar deploy de producao, variaveis, dominio, SSL, build e smoke tests do Proposito em Acao.
---

# Production Deploy Skill

## Quando usar

Use em deploy, preview, producao, dominio, SSL, logs, variaveis, smoke tests ou decisao de provedor.

## Instrucoes praticas

1. Confirmar `docs/RELEASE_READINESS.md` e relatorios criticos antes de deploy.
2. Rodar `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build` e `npm run test:e2e`.
3. Bloquear producao se Supabase remoto, RLS dinamico, Auth real, secrets ou LGPD estiverem pendentes.
4. Preferir preview controlado antes de alias/dominio produtivo.
5. Validar HTTPS, headers, logs sem dados sensiveis e rollback.
6. Registrar URL, comandos, resultado, riscos e decisores em docs operacionais.

## Arquivos relacionados

- `docs/PRODUCTION_DEPLOYMENT.md`
- `docs/PRODUCTION_ENVIRONMENT.md`
- `docs/SMOKE_TEST_REPORT.md`
- `docs/ROLLBACK_PLAN.md`
- `docs/OPERATIONS_RUNBOOK.md`
- `docs/BETA_CHECKLIST.md`

## Saida esperada

Retorne plataforma, ambiente, variaveis sem valores reais, comandos, smoke tests, bloqueios, rollback e decisao de pronto/bloqueado.
