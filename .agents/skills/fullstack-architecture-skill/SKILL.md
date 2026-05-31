---
name: fullstack-architecture-skill
description: Use when defining or reviewing full-stack architecture, folder structure, domain boundaries, responsibility separation, technical decisions, or coupling risks in Proposito em Acao.
---

# Fullstack Architecture Skill

## Quando usar

Use ao definir stack, arquitetura base, estrutura de pastas, fronteiras entre UI, dominio, backend, IA, Supabase, testes e deploy.

## Quando nao usar

Nao use para implementar feature de produto sem plano proprio, criar banco real, criar deploy real ou escolher tecnologia fora do PRD sem decisao aprovada.

## Instrucoes praticas

1. Preserve Chamado antes de agenda.
2. Separe UI, dominio, infraestrutura, IA e banco.
3. Mantenha TypeScript strict e contratos claros.
4. Evite dependencias pesadas sem necessidade comprovada.
5. Centralize secrets e integracoes sensiveis em codigo server-side.
6. Registre alternativas, riscos e decisoes pendentes.
7. Atualize `docs/ARCHITECTURE.md` e `docs/STACK_DECISION.md` quando a arquitetura mudar.

## Arquivos relacionados

- `docs/ARCHITECTURE.md`
- `docs/STACK_DECISION.md`
- `docs/DECISIONS.md`
- `src/`
- `supabase/`

## Formato de saida esperado

Retorne stack, fronteiras, fluxo de dados, riscos, alternativas, decisoes pendentes, arquivos afetados e verificacoes exigidas.
