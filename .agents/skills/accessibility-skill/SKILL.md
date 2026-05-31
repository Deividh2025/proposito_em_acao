---
name: accessibility-skill
description: Use when creating or reviewing UI accessibility, contrast, keyboard navigation, semantic HTML, labels, focus states, reduced motion, modal/drawer behavior, or cognitive accessibility in Proposito em Acao.
---

# Accessibility Skill

## Quando usar

Use para qualquer componente, rota, layout, formulario, modal, drawer, feedback visual, estado de loading/erro/sucesso ou fluxo que tenha impacto em acessibilidade.

## Instrucoes praticas

1. Mire WCAG 2.2 AA como minimo.
2. Garanta contraste suficiente para texto, icones, bordas funcionais e estados.
3. Todo controle precisa de nome acessivel, semantica nativa ou ARIA justificado.
4. Foco visivel deve existir e nao depender apenas de cor.
5. Navegacao por teclado deve seguir ordem previsivel; modais/drawers precisam de estrategia de escape quando forem interativos.
6. Respeite `prefers-reduced-motion` e evite animacoes que gerem sobrecarga.
7. Acessibilidade cognitiva tambem importa: textos curtos, uma proxima acao, baixa estimulacao, modo baixa energia e retomada sem culpa.
8. Dados sensiveis devem ter avisos contextuais sem alarmismo.

## Arquivos relacionados

- `docs/ACCESSIBILITY.md`
- `docs/UX_UI_GUIDE.md`
- `docs/ACCEPTANCE_CRITERIA.md`
- `src/app/globals.css`
- `src/components/`

## Formato de saida esperado

Retorne achados por severidade, correcoes feitas, pendencias, comandos/testes executados e riscos residuais.
