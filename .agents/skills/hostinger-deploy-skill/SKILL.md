---
name: hostinger-deploy-skill
description: Avaliar e executar deploy via Hostinger quando tecnicamente adequado ao Proposito em Acao.
---

# Hostinger Deploy Skill

## Quando usar

Use quando Hostinger for considerada para preview, producao, dominio, Node.js, Next.js, SSL, logs ou variaveis.

## Instrucoes praticas

1. Confirmar que o plano suporta Node.js server-side e Next.js, nao apenas static hosting.
2. Confirmar Node 20+, build `npm run build`, start `npm run start`, variaveis server-side, HTTPS, logs e rollback.
3. Nao usar Hostinger estatica para rotas server-side, Auth, Supabase admin, OpenAI ou validacoes sensiveis.
4. Separar decisao tecnica de preferencia comercial/custo.
5. Documentar plano, dominio, branch, variaveis, limites de recurso, logs e caminho de rollback.

## Arquivos relacionados

- `docs/PRODUCTION_DEPLOYMENT.md`
- `docs/DEPLOYMENT_PLAN.md`
- `docs/PRODUCTION_ENVIRONMENT.md`
- `.env.example`
- `package.json`
- `next.config.ts`

## Saida esperada

Retorne adequado, adequado com restricoes ou inadequado, com requisitos minimos, riscos e passos de deploy.
