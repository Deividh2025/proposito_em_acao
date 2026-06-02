---
name: rollback-skill
description: Padronizar plano de rollback para preview, producao, Supabase, PWA e secrets.
---

# Rollback Skill

## Quando usar

Use antes de deploy, mudanca de dominio, migrations, secrets, service worker, Auth ou ativacao de provider externo.

## Instrucoes praticas

1. Definir ponto de retorno antes de publicar.
2. Separar rollback de app, banco, Auth, secrets, dominio e service worker.
3. Fazer backup/export antes de migration com dados reais.
4. Preferir migrations aditivas e rollback aprovado, nunca improvisado em producao.
5. Registrar gatilhos de rollback e responsaveis.
6. Atualizar `docs/ROLLBACK_PLAN.md` e `docs/OPERATIONS_RUNBOOK.md`.

## Arquivos relacionados

- `docs/ROLLBACK_PLAN.md`
- `docs/OPERATIONS_RUNBOOK.md`
- `docs/PRODUCTION_DEPLOYMENT.md`
- `supabase/migrations/`
- `public/sw.js`

## Saida esperada

Retorne gatilhos, passos de rollback, dados afetados, backups, comunicacao e verificacao pos-rollback.
