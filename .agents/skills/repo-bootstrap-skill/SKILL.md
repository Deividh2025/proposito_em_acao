---
name: repo-bootstrap-skill
description: Use when initializing, auditing, or reorganizing the Proposito em Acao repository before product implementation, especially README, gitignore, env examples, governance docs, source records, or initial Git setup.
---

# Repo Bootstrap Skill

## Quando usar

Use para preparar ou revisar a fundacao do repositorio antes de implementar produto.

## Quando nao usar

Nao use para criar frontend, banco, autenticacao, Supabase, chamadas OpenAI, deploy ou funcionalidades do SaaS.

## Instrucoes praticas

1. Inspecione a pasta antes de alterar.
2. Preserve arquivos existentes.
3. Crie ou atualize apenas arquivos de fundacao: README, `.gitignore`, `.env.example`, `AGENTS.md`, `PLANS.md`, `docs/` e `.agents/skills/`.
4. Mantenha stack como "a definir" ate a etapa de arquitetura.
5. Confirme que nenhuma funcionalidade do SaaS foi implementada.

## Arquivos relacionados

- `README.md`
- `.gitignore`
- `.env.example`
- `AGENTS.md`
- `PLANS.md`
- `docs/`
- `.agents/skills/`

## Formato de saida esperado

Retorne estado atual, arquivos lidos, arquivos criados/alterados, riscos, verificacoes executadas, verificacoes nao executadas com motivo e proximos passos.
