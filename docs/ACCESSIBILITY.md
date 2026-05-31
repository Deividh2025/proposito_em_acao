# Accessibility

Fonte de regras iniciais de acessibilidade para UI, design system e rotas do Proposito em Acao.

## Meta minima

- WCAG 2.2 AA como referencia minima.
- Acessibilidade cognitiva TDAH-first como requisito de produto.
- Evidencia visual/responsiva antes de aprovar telas significativas.

## Contraste

Regras:

- Texto normal deve passar AA.
- Texto pequeno em cor de marca deve ser usado com cuidado.
- Bordas funcionais, estados e icones precisam ser perceptiveis.
- Nunca depender apenas de cor para comunicar erro, sucesso, progresso ou risco.

Pares iniciais revisados:

| Par | Resultado |
|---|---|
| `ink-900` sobre `ink-50` | AA/AAA para texto comum |
| `ink-700` sobre `ink-50` | AA/AAA para texto comum |
| `purpose-700` sobre fundo claro | AA para texto pequeno |
| `purpose-900` sobre `purpose-50` | AA/AAA para texto comum |

## Teclado

- Ordem de tabulacao deve seguir a ordem visual.
- Todo elemento clicavel deve ser botao, link ou controle nativo.
- Nao usar `div` clicavel sem semantica e teclado.
- Modais/drawers interativos futuros devem prender foco, retornar foco e fechar por Escape.
- Skip link deve existir no shell.

## Foco visual

- `:focus-visible` global deve permanecer visivel.
- Foco nao pode ser removido sem substituto superior.
- Foco deve ser perceptivel em botao, link, input, tab, radio, switch, slider e navegacao.

## Labels e ARIA

- Preferir semantica nativa.
- Inputs precisam de label visivel ou nome acessivel claro.
- Erros devem usar texto e, quando necessario, `aria-describedby`.
- Loading usa `role="status"`.
- Erros relevantes usam `role="alert"`.
- Tooltips nao substituem label obrigatorio.

## Movimento

- Respeitar `prefers-reduced-motion`.
- Animacoes devem ser discretas, curtas e funcionais.
- Placar, Jardim e feedback dopaminergico nao devem usar motion excessivo.
- Timer/foco futuro deve evitar pulsos ou urgencia visual agressiva.

## Leitura clara

- Textos curtos por padrao.
- Paragrafos longos devem ser quebrados.
- Botao principal deve ter verbo claro.
- Explicacoes profundas devem ficar progressivas.

## Acessibilidade cognitiva

- Uma proxima acao clara.
- Poucas opcoes por tela.
- Modo baixa energia para reduzir campos e estimulos.
- Modo recomeço para retorno sem culpa.
- Estados vazios devem orientar, nao acusar.
- Metacognicao nao deve parecer interrogatorio.

## Checklist de componente

Antes de aprovar um componente:

- Tem nome acessivel?
- Funciona por teclado?
- Foco e visivel?
- Contraste passa AA?
- Estado disabled e compreensivel?
- Loading/erro/sucesso tem texto?
- Nao depende so de cor?
- Respeita reduced motion?
- Evita linguagem culpabilizante?
- Nao expõe dado sensivel por padrao?

## Pendencias futuras

- Validar contraste de todos os tokens em CI ou script.
- Adicionar testes de acessibilidade quando houver UI funcional.
- Revisar foco gerenciado para Modal/Drawer interativos.
- Validar leitor de tela em fluxos reais de onboarding, Metacognicao e Atalaia.
