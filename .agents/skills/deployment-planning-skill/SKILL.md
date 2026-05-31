---
name: deployment-planning-skill
description: Use when planning environments, deploy, preview, production, Hostinger viability, alternatives, environment variables, rollback, or production readiness in Proposito em Acao.
---

# Deployment Planning Skill

## Quando usar

Use para planejar local, preview, producao, Hostinger, Vercel, VPS, variaveis, observabilidade, rollback e checklist de deploy.

## Quando nao usar

Nao use para executar deploy real sem autorizacao explicita, secrets prontos e checklist de seguranca.

## Instrucoes praticas

1. Separar local, preview e producao.
2. Nunca commitar secrets.
3. Validar suporte a Node/Next server-side antes de escolher Hostinger.
4. Garantir HTTPS, variaveis seguras, logs e rollback.
5. Nao prender arquitetura cedo demais a um provedor.
6. Atualizar `docs/DEPLOYMENT_PLAN.md` quando a decisao mudar.

## Arquivos relacionados

- `docs/DEPLOYMENT_PLAN.md`
- `docs/ENVIRONMENT_VARIABLES.md`
- `.env.example`
- `next.config.ts`
- `package.json`

## Formato de saida esperado

Retorne ambientes, provedor recomendado, riscos, variaveis por ambiente, checklist e pendencias antes de producao.
