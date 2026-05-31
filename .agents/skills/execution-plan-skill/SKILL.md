---
name: execution-plan-skill
description: Use when a Proposito em Acao task is complex, multi-file, risky, security-sensitive, AI-related, Supabase-related, Atalaia-related, or changes product behavior.
---

# Execution Plan Skill

## Quando usar

Use antes de implementar qualquer tarefa complexa, sensivel ou multi-arquivo.

## Quando nao usar

Nao use para inspecoes simples somente leitura ou correcao pequena de texto sem impacto. Use para revisoes somente leitura quando elas forem complexas, multi-arquivo, sensiveis ou orientarem implementacao posterior.

## Instrucoes praticas

1. Siga o template em `PLANS.md`.
2. Declare objetivo, contexto, arquivos, subagentes, skills, riscos, estrategia, aceite, testes, rollback e docs.
3. Bloqueie implementacao se escopo de alto risco estiver ambiguo.
4. Nao avance se seguranca, privacidade ou IA dependerem de decisao ausente.

## Arquivos relacionados

- `PLANS.md`
- `AGENTS.md`
- `docs/ROADMAP_EXECUTION.md`
- `docs/CODEX_WORKFLOW.md`

## Formato de saida esperado

Retorne plano de execucao, arquivos lidos, criterios de aceite, testes exigidos, riscos, rollback, docs a atualizar e suposicoes assumidas.
