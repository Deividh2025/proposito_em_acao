---
name: github-workflow-skill
description: Use when defining or reviewing branches, commits, pull requests, repository remotes, GitHub setup, CodeRabbit/Codex review flow, or collaboration rules for Proposito em Acao.
---

# GitHub Workflow Skill

## Quando usar

Use para Git, GitHub, branches, commits, PRs, revisoes e conexao de remoto.

## Quando nao usar

Nao use para decidir escopo de produto, banco, IA ou UX.

## Instrucoes praticas

1. Verifique `git status --short --branch`.
2. Use `main` como branch principal.
3. Prefira branches pequenas por etapa, por exemplo `docs/product-sources-of-truth`.
4. Use Conventional Commits.
5. Mantenha o repositorio GitHub privado por padrao no inicio.
6. Exija checklist de PR e revisao quando disponivel.
7. Nao criar remoto sem ferramenta autenticada e autorizacao clara.

## Arquivos relacionados

- `docs/PR_CHECKLIST.md`
- `docs/CODEX_WORKFLOW.md`
- `docs/DECISIONS.md`
- `README.md`

## Formato de saida esperado

Retorne status Git/GitHub, comandos executados, comandos recomendados, padrao de branch/commit/PR, evidencias do estado atual e pendencias manuais.
