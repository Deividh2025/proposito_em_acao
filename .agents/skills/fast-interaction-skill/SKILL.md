---
name: fast-interaction-skill
description: Use when designing or reviewing few-tap mobile flows, low-friction actions, compact forms, quick marks, or open-tap-register-close interactions in Proposito em Acao.
---

# Fast Interaction Skill

## Quando usar

Use em fluxos mobile, PWA, baixa energia, captura, habitos, Placar, foco curto, energia, Desbloqueador ou Metacognicao rapida.

## Instrucoes praticas

1. Uma tela deve ter uma acao principal.
2. Preferir botoes grandes, labels curtos e feedback imediato.
3. O fluxo deve concluir em poucos toques antes de exigir configuracao.
4. Esconder historico, estatisticas e campos avancados no mobile.
5. Retomada e pausa consciente contam como progresso.
6. Se a acao pedir texto, uma frase deve bastar.
7. Nunca reduzir atrito violando seguranca, RLS ou guardrails.

## Arquivos relacionados

- `src/app/mobile/`
- `src/components/mobile/`
- `docs/MOBILE_UX_GUIDE.md`
- `docs/UX_UI_GUIDE.md`
- `docs/ACCEPTANCE_CRITERIA.md`

## Saida esperada

Retorne quantidade de passos, campos obrigatorios, acao primaria, feedback, caminho de baixa energia e riscos de sobrecarga.
