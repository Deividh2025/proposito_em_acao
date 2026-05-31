---
name: agents-md-skill
description: Use when creating, updating, or reviewing AGENTS.md rules for Codex work, scope control, Definition of Done, security constraints, Supabase RLS, AI guardrails, or Atalaia privacy in Proposito em Acao.
---

# AGENTS.md Skill

## Quando usar

Use sempre que as regras operacionais do Codex ou agentes mudarem.

## Quando nao usar

Nao use como substituto de documentacao publica ou roadmap.

## Instrucoes praticas

1. Mantenha `AGENTS.md` como fonte operacional do projeto.
2. Preserve: V1 completa em largura, planejar antes de codar, nao fugir do PRD, nunca commitar secrets.
3. Inclua regras de RLS, dados sensiveis, Atalaia e IA segura.
4. Atualize Definition of Done quando verificacoes futuras forem definidas.
5. Registre decisoes relacionadas em `docs/DECISIONS.md`.

## Arquivos relacionados

- `AGENTS.md`
- `PLANS.md`
- `docs/CODEX_WORKFLOW.md`
- `docs/SECURITY_NOTES.md`
- `docs/DECISIONS.md`

## Formato de saida esperado

Retorne regras novas/alteradas, arquivos lidos, justificativa breve, riscos cobertos, lacunas restantes e verificacoes executadas.
