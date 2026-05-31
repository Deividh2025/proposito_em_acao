---
name: design-system-skill
description: Use when creating, reviewing, or updating tokens, components, app shell, responsive rules, visual states, motion, design documentation, or UI consistency in Proposito em Acao.
---

# Design System Skill

## Quando usar

Use em qualquer tarefa que altere tokens, tema, componentes reutilizaveis, layout base, estados visuais, responsividade, documentacao de UI ou consistencia visual.

## Instrucoes praticas

1. Preserve o eixo: Chamado antes de agenda, proxima acao clara e retomada sem culpa.
2. Use `docs/DESIGN_SYSTEM.md` como fonte canonica do sistema visual.
3. Use Tailwind e `src/lib/design/tokens.ts` para materializar tokens.
4. Mantenha componentes pequenos, acessiveis e reutilizaveis.
5. Evite visual corporativo generico, cards aninhados, poluicao visual, vermelho agressivo e gamificacao punitiva.
6. Crie variantes para baixa energia, recomeço, estados vazios, loading, erro, sucesso, privacidade e sugestao de IA pendente de revisao.
7. Em mobile/PWA, priorize abrir, tocar, registrar e fechar.
8. Rode lint, typecheck, testes e build quando tocar frontend.

## Arquivos relacionados

- `docs/DESIGN_SYSTEM.md`
- `docs/UX_UI_GUIDE.md`
- `docs/FRONTEND_ARCHITECTURE.md`
- `src/lib/design/`
- `src/components/`
- `src/app/globals.css`
- `tailwind.config.ts`

## Formato de saida esperado

Retorne tokens/componentes afetados, regras UX aplicadas, acessibilidade revisada, comandos executados, riscos de inconsistencia e docs atualizadas.
